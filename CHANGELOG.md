# Changelog

All notable changes to the TOON specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0] - 2025-11-24

### Breaking Changes

- Standardized encoding for list-item objects whose first field is a tabular array (§10):
  - Encoders MUST emit `- key[N]{fields}:` on the hyphen line.
  - Tabular rows MUST appear at depth +2 relative to the hyphen line.
  - All other fields of the same object MUST appear at depth +1.
  - The v2.0 shallow form (rows and fields at the same depth) and the v2.1 bare-hyphen form are no longer normative and MUST NOT be emitted by conforming encoders.

### Changed

- Encoding/decoding rules (§10) simplified to describe only the YAML-style pattern; legacy layouts are treated as generic nesting and are not covered by conformance tests.
- Nested tabular list-item example in Appendix A updated to the canonical v3.0 form.

### Migration from v2.1

- Update encoders to emit the YAML-style form for list-item objects whose first field is a tabular array.
- If you rely on v2.0/v2.1 layouts, keep decoder compatibility in non-strict or implementation-defined modes; the spec no longer requires or tests these patterns.
- Optionally regenerate existing `.toon` files for consistent v3 formatting.

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

- Generalized normalization rules and defined canonical number format for encoders (no exponent notation, no trailing zeros, no leading zeros except `"0"`), plus decoder handling of exponent forms and out-of-range numbers (§2-§3).
- Replaced `\w` with explicit `[A-Za-z0-9_]` in key regexes for cross-language clarity (§7.3).
- Clarified non-strict mode tab handling as implementation-defined (§12).

### Added

- Appendix G with host-type normalization examples for Go, JavaScript, Python, and Rust.

## [1.3] - 2025-10-31

### Added

- Numeric precision requirements: JavaScript implementations SHOULD use `Number.toString()` precision (15–17 digits); all implementations MUST preserve round-trip fidelity (§2).
- RFC 5234 core rules (ALPHA, DIGIT, DQUOTE, HTAB, LF, SP) to ABNF grammar definitions (§6).

## [1.2] - 2025-10-29

### Changed

- Tightened delimiter scoping, indentation, blank-line handling, and hyphen-based quoting rules (§11-§12).
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
