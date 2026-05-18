# TOON Format Specification

[![SPEC v3.1](https://img.shields.io/badge/spec-v3.1-lightgrey)](./SPEC.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This repository contains the official specification for **Token-Oriented Object Notation (TOON)**, a line-oriented, indentation-based encoding of the JSON data model. See [github.com/toon-format/toon](https://github.com/toon-format/toon) for an overview, rationale, and benchmarks.

## 📋 Specification

[→ Read the full specification (SPEC.md)](./SPEC.md)

- **Version:** 3.1 (2026-05-18)
- **Status:** Working Draft
- **License:** MIT

The specification includes ABNF snippets, encoding rules, validation requirements, and conformance criteria.

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

## Test Fixtures & Conformance

Language-agnostic conformance fixtures live in [tests/fixtures/](./tests/fixtures/); see [tests/README.md](./tests/README.md) for format and usage.

## Media Type & File Extension

Media type `text/toon` (provisional, UTF-8), file extension `.toon`. See [§18 of SPEC.md](SPEC.md#18-iana-considerations).

## Contributing

We welcome contributions to improve the specification! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- How to propose spec changes
- The RFC process for major changes
- Guidelines for submitting issues and pull requests

For implementation-specific questions or bugs, please refer to the respective implementation repository.

## Versioning

The TOON specification uses MAJOR.MINOR versioning. See [VERSIONING.md](./VERSIONING.md) for the policy and compatibility guarantees.

## Resources

- **Specification:** [SPEC.md](./SPEC.md) - Formal specification with ABNF grammar snippets
- **Examples:** [examples/](./examples/) - Working examples organized by feature
- **Test Fixtures:** [tests/fixtures/](./tests/fixtures/) - Reference test fixtures
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Version history and changes
- **Reference Implementation:** [github.com/toon-format/toon](https://github.com/toon-format/toon) - TypeScript/JavaScript implementation
- **Benchmarks:** [Reference repo benchmarks/](https://github.com/toon-format/toon/tree/main/benchmarks) - Token efficiency measurements and accuracy retrieval tests

## License

[MIT](./LICENSE) License © 2025-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
