# Changelog

All notable changes to the TOON specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). The project follows the MAJOR.MINOR versioning policy described in [VERSIONING.md](./VERSIONING.md).

## [3.2] - 2026-05-19

### Added

- §8 / §14.4: duplicate sibling keys at the same depth – strict mode MUST error; non-strict mode MUST apply last-write-wins (LWW) in document order silently.
- §14.2: header delimiter mismatch (bracket-segment delimiter ≠ field-list delimiter) is a strict-mode header syntax error, independent of row width/count checks.
- §14.2: enumerated malformed bracket lengths, intervening content, multiple root primitives, and the indentation/blank-line invariants previously split across §14.3 and §14.4.
- §9.4: explicit form for nested arrays of objects or non-uniform arrays as list items (`- [M<delim?>]:` followed by items at depth +2).

### Changed

- §14: collapsed §14.3 (Indentation Errors) and §14.4 (Structural Errors) into §14.2; renumbered §14.5/§14.6 to §14.3/§14.4.
- §17 (Interoperability and Mappings) merged into the Introduction; subsequent sections renumbered.
- §18 (Versioning and Extensibility) and §19 (Intellectual Property Considerations) relocated above the appendices.
- §13.1 encoder checklist: emit `key: []` for empty object-field arrays; legacy `key[0]:` MAY be emitted for backward compatibility (§9.1).
- §6: strict header parsing rejects invalid bracket lengths, leading-zero lengths (e.g., `[03]`), and any content between the bracket segment, optional fields segment, and colon. Non-strict mode MAY fall through to key-value parsing.
- §6: the "one space after colon" rule is encoder-only; decoder tolerance is governed by §12.
- §9.3 tabular detection: arrays containing any empty object `{}` MUST NOT use tabular form (encoded via §9.4 expanded list instead).
- §7.1 ABNF: `unescaped-char` extended to include U+0009 (HTAB), expressing decoder leniency only; encoders MUST emit `\t` per the escape table.
- §7.1 escape table (Supplementary row): clarify that supplementary scalars are emitted/accepted as literal UTF-8 and that surrogate `\uXXXX` escapes are not combined.

### Fixed

- §7.1 ABNF: defined the previously-undefined `quoted-key`, `quoted-char`, and `unescaped-char` productions; literal codepoints in quoted keys were ungrammatical under the prior `*escaped-char` rule.
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
- Optional path expansion for decoders: `expandPaths="safe"` to split dotted keys into nested objects with deep-merge semantics and conflict handling tied to `strict` (§13.4, §14.5).
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
