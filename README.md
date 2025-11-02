# TOON Format Specification

[![SPEC v1.3](https://img.shields.io/badge/spec-v1.3-lightgrey)](./SPEC.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This repository contains the official specification for **Token-Oriented Object Notation (TOON)**, a compact, human-readable serialization format designed for passing structured data to Large Language Models with significantly reduced token usage.

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

## Specification

📋 [Read the full specification →](./SPEC.md)

**Version:** 1.3 (2025-10-31)

**Status:** Working Draft

**License:** MIT

## Reference Implementation

The reference implementation in TypeScript/JavaScript is maintained at: [github.com/johannschopplich/toon](https://github.com/johannschopplich/toon)

The reference implementation includes:
- Complete encoder and decoder
- Comprehensive test suite
- CLI tools for JSON ↔ TOON conversion
- Performance benchmarks

## Community Implementations

The following implementations follow the TOON specification:

- **.NET:** [ToonSharp](https://github.com/0xZunia/ToonSharp)
- **Crystal:** [toon-crystal](https://github.com/mamantoha/toon-crystal)
- **Dart:** [toon](https://github.com/wisamidris77/toon)
- **Elixir:** [toon_ex](https://github.com/kentaro/toon_ex)
- **Gleam:** [toon_codec](https://github.com/axelbellec/toon_codec)
- **Go:** [gotoon](https://github.com/alpkeskin/gotoon)
- **Java:** [JToon](https://github.com/felipestanzani/JToon)
- **OCaml:** [ocaml-toon](https://github.com/davesnx/ocaml-toon)
- **PHP:** [toon-php](https://github.com/HelgeSverre/toon-php)
- **Python:** [python-toon](https://github.com/xaviviro/python-toon), [pytoon](https://github.com/bpradana/pytoon)
- **Ruby:** [toon-ruby](https://github.com/andrepcg/toon-ruby)
- **Rust:** [rtoon](https://github.com/shreyasbhat0/rtoon)
- **Swift:** [TOONEncoder](https://github.com/mattt/TOONEncoder)

Want to add your implementation? [Open an issue](https://github.com/toon-format/spec/issues) or submit a pull request.

## Test Fixtures & Conformance

The [tests/fixtures/](./tests/fixtures/) directory contains **language-agnostic JSON test fixtures** for validating TOON implementations. Each fixture file contains test cases with input/output pairs covering all specification requirements.

**What's included:**

- **Encoding tests:** JSON → TOON conversion (~150 tests)
- **Decoding tests:** TOON → JSON parsing (~120 tests)
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
- **Reference Implementation:** [github.com/johannschopplich/toon](https://github.com/johannschopplich/toon) - TypeScript/JavaScript implementation
- **Benchmarks:** [Reference repo benchmarks/](https://github.com/johannschopplich/toon/tree/main/benchmarks) - Token efficiency measurements

## License

[MIT](./LICENSE) License © 2025-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
