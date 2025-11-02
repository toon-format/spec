# Changelog

All notable changes to the TOON specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
