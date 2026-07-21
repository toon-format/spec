# Changelog

All notable changes to the TOON specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). The project follows the MAJOR.MINOR versioning policy described in [VERSIONING.md](./VERSIONING.md).

## [Unreleased] - 4.0

### Breaking Changes

- §5.1: full-line comment lines – a line whose first non-space character is `#` is removed by decoders in a lexical pre-pass (strict and non-strict alike), before indentation validation, root-form discovery, line classification, and all `[N]`/row/item counting. Comment lines never terminate scopes, may carry any leading spaces, and MUST NOT be emitted by encoders. This is v4's only wire change for existing v3 documents: unquoted `#`-leading tabular first cells, `#`-leading root scalars, and `#`-leading keys (accepted only by permissive v3 decoders) now read as comments. See [MIGRATION.md](./MIGRATION.md).

### Added

- §15: prototype-key safety – encoders MUST emit and decoders MUST materialize `__proto__`, `constructor`, and `prototype` as ordinary own entries in every key position; decoding MUST NOT mutate the host object model. Conformance fixtures added for encode and decode.
- §5.2: normative line classification – each comment-stripped line is classified by precedence (blank / list-item / array-header / key-value / row / scalar); a line whose first unquoted colon precedes any unquoted `[` is a key-value line, never a header; §9.3 remains authoritative for row-depth disambiguation. §5, §8–§10 reference the new classes.
- §7.2 / §15: string values that equal `#` or start with `#` MUST be quoted (mirrors the leading-hyphen rule); the §15 quoting list gains comment markers.
- §13.1 / §13.2: conformance checklist items – encoders emit no comment lines; decoders strip comment lines in a pre-pass.
- Conformance fixtures for comment stripping (`tests/fixtures/decode/comments.json`) and `#` quoting in every value position.
- §4: normative decoder number grammar – an unquoted token decodes as a number iff it matches `/^-?[0-9]+(?:\.[0-9]+)?(?:e[+-]?[0-9]+)?$/i` (ASCII digits only) without forbidden leading zeros; `.5`, `1.`, `+5`, `Infinity`, `NaN`, `0x10`, `1_000` decode as strings, and decoders MUST NOT delegate to wider host parsers. Fixtures include the leading-plus cases from [#52](https://github.com/toon-format/spec/pull/52) (thanks @montanaflynn).

### Removed

- §1.9, §13.4, §14.3: key folding and path expansion removed entirely – encoder options `keyFolding`/`flattenDepth`, decoder option `expandPaths`, the IdentifierSegment and path-separator terms, the related conformance checklist items, the Appendix A examples, and the `key-folding`/`path-expansion` fixtures and examples. Dotted keys remain single literal keys unconditionally (§8). See [MIGRATION.md](./MIGRATION.md).
- §18: path-separator extensibility bullet (folding-specific).

### Changed

- §14.4 Duplicate Object Keys renumbered to §14.3; fixture `specSection` citations updated.
- Test fixtures: file baselines normalized to `4.0`; redundant per-test `minSpecVersion` markers dropped.
- Test fixtures: option `indent` renamed to `indentSize`, matching the §13 option name.
- Introduction: non-goals now exclude only inline/trailing comments and annotations; the YAML comparison reflects decode-side full-line comments.
- §5 root-form discovery, §12 indentation/blank-line rules, §14.1 counts, and §14.2 invariants operate on the comment-stripped line sequence; Appendix B.1 decoding sketch updated.
- §2 round-trip equality: tabular-encoded array elements compare after reordering to the header's field order – resolves the contradiction with §9.3's key-order tolerance (`[{a,b},{b,a}]` was unsatisfiable under the previous wording).

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

- §8 / §14.4: duplicate sibling keys at the same depth – strict mode MUST error; non-strict mode MUST apply last-write-wins (LWW) in document order silently.
- §14.2: header delimiter mismatch (bracket-segment delimiter ≠ field-list delimiter) is a strict-mode header syntax error, independent of row width/count checks.
- §14.2: enumerated malformed bracket lengths, intervening content, multiple root primitives, and the indentation/blank-line invariants previously split across the old Indentation Errors and Structural Errors subsections.
- §9.4: explicit form for nested arrays of objects or non-uniform arrays as list items (`- [M<delim?>]:` followed by items at depth +1 relative to the hyphen line; tabular form is unavailable in this position, encoders MUST use the expanded list form).

### Changed

- §14: collapsed the former Indentation Errors and Structural Errors subsections into §14.2; Path Expansion Conflicts moved to §14.3.
- Interoperability and Mappings content merged into the Introduction; IANA Considerations, Versioning and Extensibility, and Intellectual Property Considerations now occupy §17–§19.
- Versioning and Extensibility (§18) and Intellectual Property Considerations (§19) relocated above the appendices.
- §6: strict header parsing rejects invalid bracket lengths, leading-zero lengths (e.g., `[03]`), and any content between the bracket segment, optional fields segment, and colon. Non-strict mode MAY fall through to key-value parsing.
- §6: the "one space after colon" rule is encoder-only; decoder tolerance is governed by §12.
- §6: decoders split using the declared delimiter; non-active delimiter characters appearing unquoted in row content are literal data and MUST NOT be re-interpreted as structural delimiters.
- §9.3 tabular detection: arrays containing any empty object `{}` MUST NOT use tabular form (encoded via §9.4 expanded list instead).
- §7.1 ABNF: `unescaped-char` extended to include U+0009 (HTAB), expressing decoder leniency only; encoders MUST emit `\t` per the escape table.
- §7.1 escape table (Supplementary row): clarify that supplementary scalars are emitted/accepted as literal UTF-8 and that surrogate `\uXXXX` escapes are not combined.

### Fixed

- §12: clarified that whitespace-only lines MAY be treated as blank regardless of leading-space count.
- Appendix B.2: corrected array-header parsing sketch to identify the optional (possibly quoted) key before locating the bracket segment.
- §6 and §7.1 ABNF: defined the previously-undefined `quoted-key` (§6), `quoted-char`, and `unescaped-char` (§7.1) productions; literal codepoints in quoted keys were ungrammatical under the prior `*escaped-char` rule.
- §7.1 escape table: made first-match precedence explicit.
- §15: downstream-consumer informative note demoted from SHOULD to advisory language.
- Appendix A: `"x-items"[2]:` example reshaped to non-uniform objects (previous example violated §9.3).

### Removed

- §16 ISO 8601 date SHOULD (out of scope; date encoding is application-level).
- "TOON Core Profile" meta-section (cross-reference only; the full normative subset is §1–§16).

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
