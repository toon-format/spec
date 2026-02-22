# TOON Format Specification

[![SPEC v3.0](https://img.shields.io/badge/spec-v3.0-lightgrey)](./SPEC.md)
[![Tests](https://img.shields.io/badge/tests-355-green)](./tests/fixtures/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This repository contains the official specification for **Token-Oriented Object Notation (TOON)**, a compact, human-readable encoding of the JSON data model for LLM prompts. It provides a lossless serialization of the same objects, arrays, and primitives as JSON, but in a syntax that minimizes tokens and makes structure easy for models to follow.

## 📋 Specification

[→ Read the full specification (SPEC.md)](./SPEC.md)

- **Version:** 3.0 (2025-11-24)
- **Status:** Working Draft
- **License:** MIT

The specification includes complete grammar (ABNF), encoding rules, validation requirements, and conformance criteria.

## What is TOON?

> [!IMPORTANT]
> For a high-level overview of TOON, its features and benefits, design goals, and comparisons to other formats, see the [`toon-format/toon` repository](https://github.com/toon-format/toon).

## Serialization Example

<table>
<tr>
<th>JSON</th>
<th>TOON</th>
</tr>
<tr>
<td>

```json
{
  "context": {
    "task": "Our favorite hikes together",
    "location": "Boulder",
    "season": "spring_2025"
  },
  "friends": ["ana", "luis", "sam"],
  "hikes": [
    {
      "id": 1,
      "name": "Blue Lake Trail",
      "distanceKm": 7.5,
      "elevationGain": 320,
      "companion": "ana",
      "wasSunny": true
    },
    {
      "id": 2,
      "name": "Ridge Overlook",
      "distanceKm": 9.2,
      "elevationGain": 540,
      "companion": "luis",
      "wasSunny": false
    },
    {
      "id": 3,
      "name": "Wildflower Loop",
      "distanceKm": 5.1,
      "elevationGain": 180,
      "companion": "sam",
      "wasSunny": true
    }
  ]
}
```

</td>
<td>

```toon
context:
  task: Our favorite hikes together
  location: Boulder
  season: spring_2025

friends[3]: ana,luis,sam

hikes[3]{id,name,distanceKm,elevationGain,companion,wasSunny}:
  1,Blue Lake Trail,7.5,320,ana,true
  2,Ridge Overlook,9.2,540,luis,false
  3,Wildflower Loop,5.1,180,sam,true
```

</td>
</tr>
</table>

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

## Media Type & File Extension

TOON defines a provisional media type (see §18.2 of the specification):

- **Media type:** `text/toon` (provisional, pending IANA registration)
- **File extension:** `.toon`
- **Charset:** Always UTF-8

For HTTP usage:

```http
Content-Type: text/toon
```

See the full [IANA Considerations section](SPEC.md#18-iana-considerations) for details.

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
