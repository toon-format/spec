# TOON Format Specification

[![SPEC v2.0](https://img.shields.io/badge/spec-v2.0-lightgrey)](./SPEC.md)
[![Tests](https://img.shields.io/badge/tests-340-green)](./tests/fixtures/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This repository contains the official specification for **Token-Oriented Object Notation (TOON)**, a compact, human-readable encoding of the JSON data model for LLM prompts. It provides a lossless serialization of the same objects, arrays, and primitives as JSON, but in a syntax that minimizes tokens and makes structure easy for models to follow.

## 📋 Specification

[→ Read the full specification (SPEC.md)](./SPEC.md)

- **Version:** 2.0 (2025-11-10)
- **Status:** Working Draft
- **License:** MIT

The specification includes complete grammar (ABNF), encoding rules, validation requirements, and conformance criteria.

## What is TOON?

> [!IMPORTANT]
> For a high-level overview of TOON, its features and benefits, design goals, and comparisons to other formats, see the [`toon-format/toon` repository](https://github.com/toon-format/toon).

## Quick Example

**JSON:**

```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" }
  ]
}
```

**TOON:**

```
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

## Reference Implementation

The reference implementation in TypeScript/JavaScript is maintained at: [github.com/toon-format/toon](https://github.com/toon-format/toon)

The reference implementation includes:

- Complete encoder and decoder
- CLI tools for JSON ↔ TOON conversion
- Performance benchmarks

## Community Implementations

Official community-driven implementations are currently being developed at the [github.com/toon-format](https://github.com/toon-format) organization.

## Test Fixtures & Conformance

The [tests/fixtures/](./tests/fixtures/) directory contains **language-agnostic JSON test fixtures** for validating TOON implementations. Each fixture file contains test cases with input/output pairs covering all specification requirements.

**What's included:**

- **Encoding tests:** JSON → TOON conversion
- **Decoding tests:** TOON → JSON parsing
- **Error cases:** Validation and strict mode checks
- **Edge cases:** All corner cases from the specification

**For implementers:**

1. Load JSON fixtures from `tests/fixtures/encode/` and `tests/fixtures/decode/`.
2. Run each test case against your implementation.
3. Report results using the conformance badge system.

See [tests/README.md](./tests/README.md) for detailed fixture format and usage instructions.

## Contributing

We welcome contributions to improve the specification! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- How to propose spec changes
- The RFC process for major changes
- Guidelines for submitting issues and pull requests

For implementation-specific questions or bugs, please refer to the respective implementation repository.

## Versioning

The TOON specification follows semantic versioning. See [VERSIONING.md](./VERSIONING.md) for our versioning policy and compatibility guarantees.

## Resources

- **Specification:** [SPEC.md](./SPEC.md) - Complete formal specification with ABNF grammar
- **Examples:** [examples/](./examples/) - Working examples organized by feature
- **Test Fixtures:** [tests/fixtures/](./tests/fixtures/) - Comprehensive test suite
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Version history and changes
- **Reference Implementation:** [github.com/toon-format/toon](https://github.com/toon-format/toon) - TypeScript/JavaScript implementation
- **Benchmarks:** [Reference repo benchmarks/](https://github.com/toon-format/toon/tree/main/benchmarks) - Token efficiency measurements and accuracy retrieval tests

## License

[MIT](./LICENSE) License © 2025-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
