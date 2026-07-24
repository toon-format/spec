# TOON Format Specification

[![SPEC v4.0](https://img.shields.io/badge/spec-v4.0-lightgrey)](./SPEC.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This repository contains the official specification for **Token-Oriented Object Notation (TOON)**, a line-oriented, indentation-based encoding of the JSON data model. See [github.com/toon-format/toon](https://github.com/toon-format/toon) for an overview, rationale, and benchmarks.

## 📋 Specification

[→ Read the full specification (SPEC.md)](./SPEC.md)

- **Version:** 4.0 (2026-07-22)
- **Status:** Working Draft
- **License:** MIT

The specification includes ABNF snippets, encoding rules, validation requirements, and conformance criteria.

## Serialization Examples

Uniform arrays of objects collapse into a tabular form that declares the fields once ([§9.3](./SPEC.md#93-arrays-of-objects--tabular-form)):

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

Uniform nested-object columns fold into the header as nested field groups; rows stay flat ([§9.3](./SPEC.md#93-arrays-of-objects--tabular-form)):

<table>
<tr><th>JSON</th><th>TOON</th></tr>
<tr><td>

```json
{
  "orders": [
    { "id": 1, "customer": { "name": "Ada", "country": "DK" }, "total": 99 },
    { "id": 2, "customer": { "name": "Bob", "country": "UK" }, "total": 149 }
  ]
}
```

</td><td>

```toon
orders[2]{id,customer{name,country},total}:
  1,Ada,DK,99
  2,Bob,UK,149
```

</td></tr>
</table>

Objects whose values are uniform objects collapse into the keyed tabular form – the colon after the length marks the keyed header, and each entry row carries its own key ([§9.5](./SPEC.md#95-keyed-objects--tabular-form)):

<table>
<tr><th>JSON</th><th>TOON</th></tr>
<tr><td>

```json
{
  "environments": {
    "production": { "region": "eu-central-1", "replicas": 6, "debug": false },
    "staging": { "region": "eu-central-1", "replicas": 2, "debug": true }
  }
}
```

</td><td>

```toon
environments[2:]{region,replicas,debug}:
  production: eu-central-1,6,false
  staging: eu-central-1,2,true
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

## License

[MIT](./LICENSE) License © 2025-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
