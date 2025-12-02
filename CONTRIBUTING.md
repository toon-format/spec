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
  Example: Adding \u0000 escape sequences
  Example: Changing when colons require quotes

Modifying tabular detection logic
  Example: Allowing non-uniform objects in tabular format

New data type normalization rules
  Example: Handling Map or Set differently

Changing array header syntax
  Example: Making field lists mandatory for all arrays
```

### No – Direct PR or Issue First

```
Typo: "recieves" → "receives"                        → Direct PR
Adding example for nested arrays                     → Direct PR
Clarifying ambiguous wording                         → Issue → PR
Expanding test coverage                              → Direct PR
Documenting existing edge case behavior              → Issue → PR
```

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

TOON prioritizes (in order):

1. **Token Efficiency** – Changes should maintain or improve token usage for LLM input
2. **LLM-Friendly Structure** – Easy for LLMs to parse and generate (explicit markers are features)
3. **Simplicity** – Prefer consistent rules over special cases
4. **Backward Compatibility** – Breaking changes need strong justification
5. **Interoperability** – Implementations must produce identical output for identical input
6. **Human Readability** – Debuggable by humans despite machine optimization

These principles guide every decision. When in doubt, optimize for token efficiency first.

## Style Guidelines

Follow [SPEC.md](./SPEC.md) conventions:

- **RFC 2119 keywords**: Use MUST/SHOULD/MAY correctly (see SPEC.md §1)
- **Examples over prose**: Show concrete input/output for complex rules
- **Precision**: Zero ambiguity – multiple implementations must agree
- **Structure**: Number sections, cross-reference related rules
- **Line length**: 80-120 characters for readability

## Communication

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Requests**: For code reviews and implementation discussion
- **[Discord](https://discord.gg/ywXDMFdx)**: For real-time chat with the community

## Maintainers

This is a collaborative project. Current maintainers:

- [@johannschopplich](https://github.com/johannschopplich)

All maintainers have equal and consensual decision-making power. For major architectural decisions, please open a discussion issue first.

## License

By contributing, you agree your contributions will be licensed under the MIT License.
