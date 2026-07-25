# Changelog

All notable changes to the TOON specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). The project follows the MAJOR.MINOR versioning policy described in [VERSIONING.md](./VERSIONING.md).

## [4.1] - 2026-07-25

### Added

- §7.4: a token beginning with `"` MUST end at its closing quote, in strict and non-strict mode alike.
- §12: a leading U+FEFF is a byte-order mark and MUST be removed before processing; trailing spaces are stripped before line classification.
- §14.1: a declared `[N]` never terminates or truncates a scope – the non-strict counterpart to the count and width checks.
- §9.4: scope termination for arrays in list form, matching the rules §9.3 and §9.5 already carried.
- §3, §16: encoders MUST reject host strings containing unpaired surrogates; keys that differ only in Unicode normalization form are distinct.
- Conformance fixtures for every rule above.

### Changed

- Encoders lost their remaining latitude over form. Tabular form is mandatory wherever detection succeeds and the position permits a fields-bearing header (§9.3); keyed tabular form applies in object-field and root positions but not in a column (§9.5); empty arrays emit `key: []` and `[]`, never the legacy `key[0]:` (§9.1); a list-item object's first field sits on the hyphen line (§10); every header declares the document delimiter (§11.1). Decoders still accept everything a v4.0 encoder could emit.
- The decoder key-token rule now covers keyed entry rows, unquoted header keys, and unquoted field names, completing the v4.0 change recorded at §7.4. Token trimming covers key tokens as well as value tokens (§12).
- Errors that were unstated or strict-only are now settled: a scalar line outside root primitive position errors in both modes (§5.2); whitespace between a key and its bracket segment is a header syntax error, strict error and non-strict fall-through (§6); a repeated field name is diagnosed from the header line alone, independent of the declared count and of any rows (§9.3); and four §14 conditions are marked "(any mode)", having always been unqualified MUSTs.
- §9.5 heading renamed to "Objects of Uniform Objects – Keyed Tabular Form", moving its anchor to `#95-objects-of-uniform-objects--keyed-tabular-form`. Terminology: `keyed form` → `keyed tabular form`, `brace group` → `field list`, `array span` → `header span`.
- Duplicated normative text removed so each rule is stated once. Appendix D (Document Changelog) retired; the former Appendices E and F are now D and E.
- VERSIONING.md: encoder-side tightening and changes to encoder-unreachable documents are classified MINOR.

### Compatibility

Two changes alter decoder behavior: §6 rejects whitespace between a key and its bracket segment in strict mode, and §12 removes a leading U+FEFF. No conforming v4.0 encoder could emit either input – §7.3 quotes any key containing a space or bracket, and encoders never emit a byte-order mark – so no round-trip is affected. Both are MINOR under the encoder-unreachability rule in [VERSIONING.md](./VERSIONING.md).

The option renamed from `indent` to `indentSize` in spec 3.3 is now named `indentSize` throughout. Implementations that still read `indent` SHOULD accept `indentSize` and MAY keep `indent` as a deprecated alias.

## [4.0] - 2026-07-22

### Breaking Changes

- §5.1: a line whose first non-space character is `#` is a comment line, removed by decoders in a lexical pre-pass before every other rule. Comment lines never terminate scopes and MUST NOT be emitted by encoders. This is the only v4 change to the decoded meaning of conforming v3 output – an unquoted `#`-leading tabular first cell, a `#`-leading root scalar, or a `#`-leading key now reads as a comment. Scan stored v3 documents for `/^ *#/`; re-encoding under v4 quotes such strings (§7.2), which decodes identically under both versions.
- §8 / §14.2: an indentation depth jump is a strict-mode error. Conforming encoders never produced one, but a hand-authored v3 document that skips a level now fails; re-indent it, or decode once in non-strict mode and re-encode.

### Added

- §6 / §9.3: nested field groups in tabular headers – `orders[2]{id,customer{name,country},total}:` declares a nested-uniform column while rows stay flat delimiter-separated primitives, laid out by a depth-first walk with no depth cap. Output is byte-identical to v3 wherever no group applies, and strict v3 decoders fail closed on the new header. Per RFC [#46](https://github.com/toon-format/spec/issues/46) (thanks @Turtle-dev3).
- §6 / §9.5: keyed tabular form – an object with at least two entries whose values are uniform non-empty objects collapses into `users[2:]{age,city}:` with one `entrykey: cells` row per entry, and `[N:]{…}:` at the root. Strict v3 decoders fail closed; non-strict ones mis-decode it silently, so upgrade decoders before encoders. Per RFC [#57](https://github.com/toon-format/spec/issues/57), with prior proposals in [#32](https://github.com/toon-format/spec/issues/32) and [#45](https://github.com/toon-format/spec/issues/45) (thanks @cstroliadavis, @metafishTV).
- §4: a normative decoder number grammar – an unquoted token decodes as a number iff it matches `/^-?[0-9]+(?:\.[0-9]+)?(?:e[+-]?[0-9]+)?$/i` without forbidden leading zeros, so `.5`, `1.`, `+5`, `Infinity`, `NaN`, `0x10`, and `1_000` are strings and decoders MUST NOT delegate to wider host parsers. Rejecting out-of-range tokens joins the permitted documented policies. Includes the leading-plus cases from [#52](https://github.com/toon-format/spec/pull/52) (thanks @montanaflynn).
- §15: prototype-key safety – `__proto__`, `constructor`, and `prototype` are ordinary own entries in every key position, and decoding MUST NOT mutate the host object model.
- §5.2: normative line classification by precedence – blank, list item, array header, key-value, row, scalar. A line whose first unquoted colon precedes any unquoted `[` is a key-value line, never a header.
- §7.2 / §15: string values equal to or starting with `#` MUST be quoted, so encoder output never contains a line that reads as a comment.
- §13: implementations SHOULD declare the specification version they target (e.g., `toon-spec: 4.0`).

### Changed

- §12: token trimming is a MUST and is exactly U+0020, closing the divergence between ASCII trimming and host `trim()` (discussion [#56](https://github.com/toon-format/spec/discussions/56), thanks @liquidaty).
- §7.4: the unquoted key is everything before the first unquoted colon, so strict decoders accept keys outside §7.3's encoder pattern (`foo-bar`, `2key`); they likewise accept unquoted values that encoders were required to quote (`key: -x` → string `-x`).
- §2: tabular-encoded array elements compare after reordering to the header's field order, resolving a round-trip requirement that was unsatisfiable as written.
- §4 / §14.2: byte-input decoders MUST decode UTF-8 and, in strict mode, MUST error on ill-formed sequences instead of substituting U+FFFD. Host-string decoders are out of scope.
- §6 / §14.2: `key[]:` is a malformed bracket segment – strict error, non-strict key-value fall-through – and the `key: []` empty-array form is unaffected. §9.2 / §9.4: decoders accept `- []` as an empty inner-array list item, though encoders still emit `- [0]:`.
- §7.2: the numeric-like quoting trigger covers leading-plus forms, so `"+1"` is emitted quoted.

### Removed

- §1.9, §13.4, §14.3: key folding and path expansion, entirely – the `keyFolding` and `flattenDepth` encoder options, the `expandPaths` decoder option, and the related terms, checklist items, examples, and fixtures. Dotted keys remain single literal keys unconditionally (§8), which is what v3 did by default, so no document produced without folding is affected. Re-hydrate anything encoded with `keyFolding: "safe"` by decoding it once with a v3 decoder using `expandPaths: "safe"`, then re-encoding.

## [3.3] - 2026-05-21

### Added

- §2: explicit lowercase-literal MUST for booleans and null; §13.1 conformance checklist gains corresponding entries.
- §7.1 ABNF `unescaped-char`: supplementary scalars (`%x10000-10FFFF`) included explicitly.
- §13: option names and value tokens are concept handles; implementations MAY use language-idiomatic spellings or types.
- Appendix F.5: informative Java mapping section.

### Changed

- §2 number form: canonical-decimal MUST scoped to `n = 0 or 1e-6 ≤ |n| < 1e21`; outside this range, encoders MAY emit exponent notation per the JSON number grammar (lowercase `e`, explicit sign recommended).
- §2 round-trip: equality predicate spelled out as JSON-model equality with ordered key sequences, codepoint-sequence string comparison (no Unicode normalization), array order, and mathematical number equality.
- §2 lossless out-of-domain: quoted decimal string MAY use plain decimal or JSON exponent form; implementations MUST document the choice.
- §3: hook examples extended to Go (`json.Marshaler`), Python (`JSONEncoder.default`), Rust (`serde::Serialize`); host hooks take precedence over default mappings.
- §13: option name `indent` → `indentSize` for consistency with §1.3 / §12.

## [3.2] - 2026-05-20

### Added

- §8 / §14.4: duplicate sibling keys at the same depth – strict mode MUST error, non-strict mode MUST apply last-write-wins in document order, silently.
- §14.2: a header whose bracket-segment delimiter differs from its field-list delimiter is a strict-mode syntax error, independent of row width and count checks.
- §9.4: an explicit form for nested arrays of objects or non-uniform arrays as list items – `- [M<delim?>]:` with items at depth +1 relative to the hyphen line. Tabular form is unavailable in this position.

### Changed

- §6: strict header parsing rejects invalid bracket lengths, leading-zero lengths (`[03]`), and any content between the bracket segment, field list, and colon; non-strict mode MAY fall through to key-value parsing. Decoders split on the declared delimiter only – other delimiter characters appearing unquoted in row content are literal data. The one-space-after-colon rule is encoder-only; decoder tolerance is governed by §12.
- §9.3: an array containing any empty object MUST NOT use tabular form.
- §7.1: the escape table gains explicit first-match precedence; supplementary scalars are emitted and accepted as literal UTF-8, never combined into surrogate `\uXXXX` escapes; `unescaped-char` admits U+0009, expressing decoder leniency only.
- §6 / §7.1: defined the previously undefined `quoted-key`, `quoted-char`, and `unescaped-char` productions – literal code points in quoted keys were ungrammatical under the prior `*escaped-char` rule.
- §12: whitespace-only lines MAY be treated as blank regardless of leading-space count.

### Removed

- §16: the ISO 8601 date SHOULD – date encoding is application-level.

## [3.1] - 2026-05-18

### Added

- `\uXXXX` Unicode escape in quoted strings and keys; encoders MUST emit it for control characters U+0000–U+001F outside `\n`, `\r`, `\t` (§7.1).
- Encoders MUST NOT strip control characters from quoted strings during normalization (§15).

### Changed

- Empty arrays canonicalized: encoders SHOULD emit `key: []` for object-field position and `[]` for root position (§9.1, §5). Decoders MUST accept both canonical (`key: []`, `[]`) and legacy (`key[0]:`, `[0]:`) forms.

## [3.0] - 2025-11-24

### Breaking Changes

- Standardized encoding for list-item objects whose first field is a tabular array (§10):
  - Encoders MUST emit `- key[N]{fields}:` on the hyphen line.
  - Tabular rows MUST appear at depth +2 relative to the hyphen line.
  - All other fields of the same object MUST appear at depth +1.
  - Pre-v3.0 alternative layouts (rows and fields at the same depth; bare-hyphen form) are no longer normative and MUST NOT be emitted by conforming encoders.

### Changed

- §10 simplified to describe only the YAML-style pattern; legacy layouts are treated as generic nesting and are not covered by conformance tests.

### Migration from v2.1

- Update encoders to emit the YAML-style form for list-item objects whose first field is a tabular array.
- If you rely on v2.0/v2.1 layouts, keep decoder compatibility in non-strict or implementation-defined modes; the spec no longer requires or tests these patterns.

## [2.1] - 2025-11-23

### Changed

- Canonical encoding for objects as list items (§10):
  - Encoders SHOULD emit `- key[N]{fields}:` only when the list-item object has exactly one field and that field is a tabular array.
  - In all other cases, encoders SHOULD emit a bare `-` line and place all fields at depth +1; tabular array headers then appear at depth +1 and their rows at depth +2.

## [2.0] - 2025-11-10

### Breaking Changes

- Removed `[#N]` length-marker syntax in array headers; `[N]` is now the only valid format.
- Encoders MUST NOT emit `[#N]`; decoders MUST reject it.

### Removed

- The `lengthMarker` encoder option and any CLI flags exposing it.

### Migration from v1.5

- Update decoders to reject `[#N]` syntax.
- Convert existing `.toon` files using `[#N]` to `[N]`.
- Remove `lengthMarker` configuration and CLI options.

## [1.5] - 2025-11-08

### Added

- Optional key folding for encoders: `keyFolding="safe"` with `flattenDepth` to collapse single-key object chains into dotted paths (§13.4).
- Optional path expansion for decoders: `expandPaths="safe"` to split dotted keys into nested objects with deep-merge semantics and conflict handling tied to `strict` (§13.4, §14.3).
- IdentifierSegment terminology and fixed `"."` path separator for safe folding/expansion (§1.9).

### Changed

- Safe-mode folding requires IdentifierSegment-only segments, no path separator in segments, no quoting, and collision avoidance.
- Both features default to `off` and are backward-compatible.

## [1.4] - 2025-11-05

### Changed

- Generalized normalization rules and defined canonical number format for encoders (no exponent notation, no trailing zeros, no leading zeros except `"0"`), plus decoder handling of exponent forms and out-of-range numbers (§2–§3).
- Replaced `\w` with explicit `[A-Za-z0-9_]` in key regexes for cross-language clarity (§7.3).
- Clarified non-strict mode tab handling as implementation-defined (§12).

## [1.3] - 2025-10-31

### Added

- Numeric precision requirements: JavaScript implementations SHOULD use `Number.toString()` precision (15–17 digits); all implementations MUST preserve round-trip fidelity (§2).

## [1.2] - 2025-10-29

### Changed

- Tightened delimiter scoping, indentation, blank-line handling, and hyphen-based quoting rules (§11–§12).
- Clarified BigInt normalization (out-of-range values → quoted decimal strings) and row/key disambiguation (first unquoted delimiter vs colon) (§2, §9.3).

## [1.1] - 2025-10-29

### Added

- Strict-mode rules.
- Delimiter-aware parsing.
- Decoder options (`indent`, `strict`).

## [1.0] - 2025-10-28

### Added

- Initial specification release.
- Encoding normalization rules.
- Decoding interpretation guidelines.
- Conformance requirements.
