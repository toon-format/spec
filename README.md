# TOON Format Specification

[![SPEC v4.1](https://img.shields.io/badge/spec-v4.1-lightgrey)](./SPEC.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This repository contains the official specification for **Token-Oriented Object Notation (TOON)**, a line-oriented, indentation-based encoding of the JSON data model. See [github.com/toon-format/toon](https://github.com/toon-format/toon) for an overview, rationale, and benchmarks.

## 📋 Specification

[→ Read the full specification (SPEC.md)](./SPEC.md)

- **Version:** 4.1 (2026-07-25)
- **Status:** Working Draft
- **License:** MIT

The specification includes ABNF snippets, encoding rules, validation requirements, and conformance criteria.

## Serialization Example

Uniform arrays of objects collapse into a tabular form that declares the field list once ([§9.3](./SPEC.md#93-arrays-of-objects--tabular-form)):

<table>
<tr><th>JSON</th><th>TOON</th></tr>
<tr><td>

```json
{
  "users": [
    { "id": 1, "name": "Ada" },
    { "id": 2, "name": "Bob" }
  ]
}
```

</td><td>

```toon
users[2]{id,name}:
  1,Ada
  2,Bob
```

</td></tr>
</table>

That is one of TOON's four forms. The other three, with worked examples in [`examples/`](./examples/):

| Form | What it renders | Example |
| ---- | --------------- | ------- |
| Inline ([§9.1](./SPEC.md#91-primitive-arrays--inline-form)) | Primitive arrays, on the header line itself | [`primitive-arrays.toon`](./examples/valid/primitive-arrays.toon) |
| List ([§9.2](./SPEC.md#92-arrays-of-primitive-arrays--list-form), [§9.4](./SPEC.md#94-mixed-and-non-uniform-arrays--list-form)) | Arrays that fit neither inline nor tabular form, one `-` item per element | [`mixed-arrays.toon`](./examples/valid/mixed-arrays.toon) |
| Tabular ([§9.3](./SPEC.md#93-arrays-of-objects--tabular-form)) | Arrays of uniform objects, as shown above | [`tabular-arrays.toon`](./examples/conversions/tabular-arrays.toon) |
| Keyed tabular ([§9.5](./SPEC.md#95-objects-of-uniform-objects--keyed-tabular-form)) | Objects whose values are uniform objects, as rows that carry their own key | [`keyed-tabular-objects.toon`](./examples/conversions/keyed-tabular-objects.toon) |

Within tabular form, a uniform nested-object column folds into the header as a **nested field group** (`customer{name,country}`) while rows stay flat – see [`nested-field-groups.toon`](./examples/conversions/nested-field-groups.toon).

See [examples/README.md](./examples/README.md) for the annotated index and [SPEC.md Appendix A](./SPEC.md#appendix-a-examples-informative) for more shapes.

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
- **Glossary:** [CONTEXT.md](./CONTEXT.md) - Canonical name for every concept, and the wordings to avoid
- **Examples:** [examples/](./examples/) - Working examples organized by feature
- **Test Fixtures:** [tests/fixtures/](./tests/fixtures/) - Reference test fixtures
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Version history and changes
- **Reference Implementation:** [github.com/toon-format/toon](https://github.com/toon-format/toon) - TypeScript/JavaScript implementation
- **Benchmarks:** [Reference repo benchmarks/](https://github.com/toon-format/toon/tree/main/benchmarks) - Token efficiency measurements and accuracy retrieval tests

## License

[MIT](./LICENSE) License © 2025-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
