# Contributing to TOON Specification

Thanks for your interest in contributing! This guide shows how to propose changes to the specification.

## Quick Reference: What Process Do I Need?

| Change Type | Examples | Process |
| ----------- | -------- | ------- |
| **Fixes** | Typos, grammar, broken links, clarifying wording | Direct PR |
| **Test Fixtures** | New test cases, edge case tests, validation tests | Direct PR (see [tests/README.md](./tests/README.md)) |
| **Minor Changes** | Spec clarifications that may affect implementations | Issue first → PR |
| **Major Changes** | New syntax, encoding rules, breaking changes | RFC process (see below) |

## Does My Change Need an RFC?

### Yes – RFC Required

Changes that affect compatibility or core behavior need community discussion:

```
Adding new delimiter types (beyond comma/tab/pipe)
  Example: Supporting semicolon as delimiter

Changing quoting or escape rules
  Example: Adding new short-form escapes (e.g., \v, \f)
  Example: Changing when colons require quotes

Modifying tabular detection logic
  Example: Allowing non-uniform objects in tabular format

New data type normalization rules
  Example: Handling Map or Set differently

Changing array header syntax
  Example: Making field lists mandatory for all arrays
```

### No – Direct PR or Issue First

Typos, additional examples, clarifications of existing wording, extra test coverage, and documenting existing edge cases can be filed as a direct PR (or an issue if you want to discuss first).

## RFC Process

For major changes requiring RFC:

1. **Create RFC Issue** using the Feature Request/RFC template
2. **Discussion Period** (minimum 1-2 weeks for community feedback)
3. **Decision** (maintainers accept, reject, or request revisions)
4. **Implementation** (create PR referencing RFC issue)

## Contributing Test Fixtures

Test fixtures validate TOON implementations across languages. Add your test to `tests/fixtures/encode/` or `tests/fixtures/decode/`, validate against `tests/fixtures.schema.json`, and submit a PR.

See [tests/README.md](./tests/README.md) for fixture structure and guidelines.

## Pull Request Guidelines

1. Fork the repository and create a feature branch
2. Make changes following [SPEC.md](./SPEC.md) style (RFC 2119 keywords, examples, precision)
3. Update `CHANGELOG.md` with your changes
4. Submit PR using the template and link related issues

**Review process:**
- Maintainers review and may request changes
- Breaking changes held until next major version
- Approved changes merged with version number assigned

## Specification Principles

See the Introduction in [SPEC.md](./SPEC.md) for TOON's purpose, applicability, and non-goals. Proposals should align with the priorities stated there: token efficiency, deterministic JSON round-trip, unambiguous human-readable structure, and strict validation.

## Style Guidelines

Follow [SPEC.md](./SPEC.md) conventions:

- **RFC 2119 keywords**: Use MUST/SHOULD/MAY correctly (see SPEC.md §1.1)
- **Examples over prose**: Show concrete input/output for complex rules
- **Precision**: Zero ambiguity – multiple implementations must agree
- **Structure**: Number sections, cross-reference related rules
- **Line length**: 80-120 characters for readability

## Maintainer

[@johannschopplich](https://github.com/johannschopplich). For major architectural decisions, please open a discussion issue first.

## License

By contributing, you agree your contributions will be licensed under the MIT License.
