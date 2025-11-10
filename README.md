# TOON Format Specification

[![SPEC v1.5](https://img.shields.io/badge/spec-v1.5-lightgrey)](./SPEC.md)
[![Tests](https://img.shields.io/badge/tests-348-green)](./tests/fixtures/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This repository contains the official specification for **Token-Oriented Object Notation (TOON)**, a compact, human-readable serialization format designed for passing structured data to Large Language Models with significantly reduced token usage.

## 📋 Specification

[→ Read the full specification (SPEC.md)](./SPEC.md)

- **Version:** 1.5 (2025-11-10)
- **Status:** Working Draft
- **License:** MIT

The specification includes complete grammar (ABNF), encoding rules, validation requirements, and conformance criteria.

### New in v1.5

- **Key Folding** (encode): Collapse nested single-key objects into compact dotted paths
  - `{"a": {"b": {"c": 1}}}` → `a.b.c: 1`
  - Opt-in via `keyFolding="safe"` with `flattenDepth` control
- **Path Expansion** (decode): Expand dotted keys back to nested objects
  - `a.b.c: 1` → `{"a": {"b": {"c": 1}}}`
  - Opt-in via `expandPaths="safe"` with deep-merge semantics

> [!NOTE]
> Both features are opt-in to maintain backward compatibility.

## What is TOON?

**Token-Oriented Object Notation** is a compact, human-readable serialization format designed for passing structured data to Large Language Models with significantly reduced token usage. It's intended for LLM input, not output.

TOON's sweet spot is **uniform arrays of objects** – multiple fields per row, same structure across items. It borrows YAML's indentation-based structure for nested objects and CSV's tabular format for uniform data rows, then optimizes both for token efficiency in LLM contexts. For deeply nested or non-uniform data, JSON may be more efficient.

**Key Features:**

- 💸 **Token-efficient:** typically 30–60% fewer tokens than JSON
- 🤿 **LLM-friendly guardrails:** explicit lengths and fields enable validation
- 🍱 **Minimal syntax:** removes redundant punctuation (braces, brackets, most quotes)
- 📐 **Indentation-based structure:** like YAML, uses whitespace instead of braces
- 🧺 **Tabular arrays:** declare keys once, stream data as rows

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
