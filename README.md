# TOON Format Specification

[![SPEC v3.2](https://img.shields.io/badge/spec-v3.2-lightgrey)](./SPEC.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This repository contains the official specification for **Token-Oriented Object Notation (TOON)**, a line-oriented, indentation-based encoding of the JSON data model. See [github.com/toon-format/toon](https://github.com/toon-format/toon) for an overview, rationale, and benchmarks.

## 📋 Specification

[→ Read the full specification (SPEC.md)](./SPEC.md)

- **Version:** 3.2 (2026-05-20)
- **Status:** Working Draft
- **License:** MIT

The specification includes ABNF snippets, encoding rules, validation requirements, and conformance criteria.

## Serialization Example

<table>
<tr><th>JSON</th><th>TOON</th></tr>
<tr><td>

```json
{
  "users": [
    { "id": 1, "name": "Ada" },
    { "id": 2, "name": "Linus" }
  ]
}
```

</td><td>

```toon
users[2]{id,name}:
  1,Ada
  2,Linus
```

</td></tr>
</table>

See [examples/](./examples/) and [SPEC.md Appendix A](./SPEC.md#appendix-a-examples-informative) for more shapes.

## Media Type & File Extension

Media type `text/toon` (provisional, UTF-8), file extension `.toon`. See [§17 of SPEC.md](SPEC.md#17-iana-considerations).

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
- **Validation Guide:** [github.com/apardawala/toon-validation-guide](https://github.com/apardawala/toon-validation-guide) - JSON Schema 2020-12 patterns for decoded TOON (community-maintained)

## License

[MIT](./LICENSE) License © 2025-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
