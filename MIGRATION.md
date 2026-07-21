# Migrating to TOON v4

Migration notes for the v3 → v4 transition. This document grows alongside the unreleased v4 draft; entries are final when v4 ships.

## Key folding and path expansion removed

v4 removes the optional key-folding and path-expansion machinery: the encoder options `keyFolding` and `flattenDepth`, the decoder option `expandPaths`, and the former §1.9, §13.4, and §14.3. Dotted keys remain valid literal keys (§7.3, §8), and decoders treat them as single literal keys unconditionally – exactly the default behavior in v3. Any document produced without folding decodes identically under v4; this removal changes no wire syntax.

If you have stored documents that were encoded with `keyFolding: "safe"`, re-hydrate them once: decode with a v3 decoder using `expandPaths: "safe"`, then re-encode with a v4 encoder (or any encoder with folding off).

Implementations that keep folding available as a vendor extension MUST guard path expansion against the keys `__proto__`, `constructor`, and `prototype`: expansion MUST NOT use these segments to construct or traverse object graphs. Unguarded expansion is a prototype-pollution vector; the core prototype-key rules live in §15.

## Full-line comment lines (decode-side)

v4 introduces comment lines: a decoder removes every line whose first non-space character is `#` in a lexical pre-pass, before anything else (§5.1). Comments are full-line only and decode-side only – encoders MUST NOT emit them, and §7.2 now requires quoting any string value that equals `#` or starts with `#`, so v4 encoder output never contains a line that reads as a comment.

This is the only v4 change that alters the decoded meaning of conforming v3 encoder output. v3 encoders had no `#` quoting rule, so conforming v3 output can contain lines that a v4 decoder strips. Three corruption paths exist:

- Tabular data whose first cell is an unquoted `#`-leading string: the row line now starts with `#` and is stripped. Strict mode catches the loss via the `[N]` row-count check; non-strict decoding drops the row silently.
- A root-scalar document such as `#hello`: the only line is stripped, leaving an empty document, which decodes to `{}` – even in strict mode, with no error.
- Keys starting with `#` were never valid unquoted keys (§7.3), but permissive v3 decoders accepted them; such key-value lines are now comments.

To migrate stored v3 documents, scan for lines matching `/^ *#/`. Affected documents should be decoded with a v3 decoder and re-encoded with a v4 encoder; the new §7.2 rule re-emits `#`-leading strings quoted (`"#…"`), which decodes identically under v3 and v4.

## Nested field groups in tabular headers

v4 tabular headers may declare nested field groups (§6, §9.3): `orders[2]{id,customer{name,country},total}:` encodes an array of records whose `customer` values are uniform sub-objects, while rows remain flat delimiter-separated primitive lines. This is a pure addition: every v3 document decodes identically under v4, and v4 encoder output is byte-identical to v3 whenever no column is a uniform nested object.

The new header form does not parse under v3 – strict v3 decoders reject it at the header (fail closed). Pipelines that feed v4 encoder output into v3 decoders must upgrade the decoders first; implementations MAY ship decoder support ahead of encoder support for exactly this rollout.

## Strict-mode depth jumps

v4 makes indentation depth jumps a strict-mode error (§8, §14.2): the first line of a non-empty nested scope must sit exactly one level deeper than its parent. Conforming encoders have never produced jumps, but v3 had no rule rejecting them, so a hand-authored document such as `a:` followed by `b: 1` indented two levels decoded to `{"a":{"b":1}}` under v3 strict mode and now errors. The rule is strict-only; non-strict decoders may still accept the jump. To migrate hand-authored documents, re-indent the over-indented scope – or decode once in non-strict mode and re-encode.
