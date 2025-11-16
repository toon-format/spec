# Changelog

All notable changes to the TOON specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Tools & Utilities section** in README with reference to [TOON Token Savings Visualizer](https://github.com/scmclimited/toon-token-savings), an interactive tool for benchmarking TOON's token efficiency against JSON

## [2.0] - 2025-11-10

### Breaking Changes

- **Removed:** Length marker (`#`) prefix in array headers has been completely removed from the specification
- The `[#N]` format is no longer valid syntax. All array headers MUST use `[N]` format only
- Encoders MUST NOT emit `[#N]` format
- Decoders MUST NOT accept `[#N]` format (breaking change from v1.5)

### Removed

- All references to length marker from terminology (§1.4), header syntax (§6), ABNF grammar, conformance requirements (§13.2), and parsing helpers (Appendix B)
- `lengthMarker` encoder option removed from all implementations
- Length marker test fixtures removed

### Migration from v1.5

- Update decoder implementations to reject `[#N]` syntax
- Convert any existing `.toon` files using `[#N]` format to `[N]` format
- Remove `lengthMarker` option from encoder configurations
- Remove `--length-marker` CLI flags if present

## [1.5] - 2025-11-08

### Added

- Optional key folding for encoders: `keyFolding="safe"` mode with `flattenDepth` control to collapse single-key object chains into dotted-path notation (§13.4)
- Optional path expansion for decoders: `expandPaths="safe"` mode to split dotted keys into nested objects, with conflict resolution tied to `strict` option (§13.4, §14.5)
- IdentifierSegment terminology and path separator definition (fixed to `"."` in v1.5) (§1.9)
- Deep-merge semantics for path expansion: recursive merge for objects, error on conflict when `strict=true`, last-write-wins (LWW) when `strict=false` (§13.4)

### Changed

- Both new features default to OFF and are fully backward-compatible
- Safe-mode folding requires IdentifierSegment validation, collision avoidance, and no quoting

## [1.4] - 2025-11-05

### Changed

- Removed JavaScript-specific normalization details from specification; replaced with language-agnostic requirements (Section 3)
- Defined canonical number format for encoders: no exponent notation, no trailing zeros, no leading zeros except "0" (Section 2)
- Clarified decoder handling of exponent notation and out-of-range numbers (Section 2)
- Expanded `\w` regex notation to explicit character class `[A-Za-z0-9_]` for cross-language clarity (Section 7.3)
- Clarified non-strict mode tab handling as implementation-defined (Section 12)

### Added

- Appendix G: Host Type Normalization Examples with guidance for Go, JavaScript, Python, and Rust implementations

## [1.3] - 2025-10-31

### Added

- Numeric precision requirements: JavaScript implementations SHOULD use `Number.toString()` precision (15-17 digits), all implementations MUST preserve round-trip fidelity (Section 2)
- RFC 5234 core rules (ALPHA, DIGIT, DQUOTE, HTAB, LF, SP) to ABNF grammar definitions (Section 6)

## [1.2] - 2025-10-29

### Changed

- Clarified delimiter scoping behavior between array headers
- Tightened strict-mode indentation requirements: leading spaces MUST be exact multiples of indentSize; tabs in indentation MUST error
- Defined blank-line and trailing-newline decoding behavior with explicit skipping rules outside arrays
- Clarified hyphen-based quoting: "-" or any string starting with "-" MUST be quoted
- Clarified BigInt normalization: values outside safe integer range are converted to quoted decimal strings
- Clarified row/key disambiguation: uses first unquoted delimiter vs colon position

## [1.1] - 2025-10-29

### Added

- Strict-mode rules
- Delimiter-aware parsing
- Decoder options (indent, strict)

## [1.0] - 2025-10-28

### Added

- Initial specification release
- Encoding normalization rules
- Decoding interpretation guidelines
- Conformance requirements
