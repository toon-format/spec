# Migrating to TOON v4

Migration notes for the v3 → v4 transition. This document grows alongside the unreleased v4 draft; entries are final when v4 ships.

## Key folding and path expansion removed

v4 removes the optional key-folding and path-expansion machinery: the encoder options `keyFolding` and `flattenDepth`, the decoder option `expandPaths`, and the former §1.9, §13.4, and §14.3. Dotted keys remain valid literal keys (§7.3, §8), and decoders treat them as single literal keys unconditionally – exactly the default behavior in v3. Any document produced without folding decodes identically under v4; this removal changes no wire syntax.

If you have stored documents that were encoded with `keyFolding: "safe"`, re-hydrate them once: decode with a v3 decoder using `expandPaths: "safe"`, then re-encode with a v4 encoder (or any encoder with folding off).

Implementations that keep folding available as a vendor extension MUST guard path expansion against the keys `__proto__`, `constructor`, and `prototype`: expansion MUST NOT use these segments to construct or traverse object graphs. Unguarded expansion is a prototype-pollution vector; the core prototype-key rules live in §15.

## Full-line comment lines (decode-side)

v4 introduces comment lines: a decoder removes every line whose first non-space character is `#` in a lexical pre-pass, before anything else (§5.1). Comments are full-line only and decode-side only – encoders MUST NOT emit them, and §7.2 now requires quoting any string value that equals `#` or starts with `#`, so v4 encoder output never contains a line that reads as a comment.

This is v4's only wire break for existing v3 documents. v3 encoders had no `#` quoting rule, so conforming v3 output can contain lines that a v4 decoder strips. Three corruption paths exist:

- Tabular data whose first cell is an unquoted `#`-leading string: the row line now starts with `#` and is stripped. Strict mode catches the loss via the `[N]` row-count check; non-strict decoding drops the row silently.
- A root-scalar document such as `#hello`: the only line is stripped, leaving an empty document, which decodes to `{}` – even in strict mode, with no error.
- Keys starting with `#` were never valid unquoted keys (§7.3), but permissive v3 decoders accepted them; such key-value lines are now comments.

To migrate stored v3 documents, scan for lines matching `/^ *#/`. Affected documents should be decoded with a v3 decoder and re-encoded with a v4 encoder; the new §7.2 rule re-emits `#`-leading strings quoted (`"#…"`), which decodes identically under v3 and v4.
