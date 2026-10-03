# Contributing to TOON Specification

## Quick Reference: What Process Do I Need?

| Change Type | Examples | Process |
| ----------- | -------- | ------- |
| **Fixes** | Typos, grammar, broken links, clarifying wording | Direct PR |
| **Test Fixtures** | New test cases, edge case tests, validation tests | Direct PR (see [tests/README.md](./tests/README.md)) |
| **Minor Changes** | Spec clarifications that may affect implementations | Issue first → PR |
| **Major Changes** | New syntax, encoding rules, breaking changes | RFC process (see below) |

## RFC Process

New syntax, quoting or escaping changes, and changes to tabular detection need an RFC – check [`.out-of-scope/`](./.out-of-scope/) first.

1. **Create RFC Issue** using the Feature Request/RFC template
2. **Discussion Period** (minimum 1-2 weeks for community feedback)
3. **Decision** (maintainers accept, reject, or request revisions)
4. **Implementation** (create PR referencing RFC issue)

## Pull Request Guidelines

1. Fork the repository and create a feature branch
2. Make changes following [SPEC.md](./SPEC.md) style (RFC 2119 keywords, examples, precision)
3. Submit PR using the template and link related issues

## Style Guidelines

Follow [SPEC.md](./SPEC.md) conventions:

- **RFC 2119 keywords**: Use MUST/SHOULD/MAY correctly (see SPEC.md §1.1)
- **Terminology**: Use the canonical names in [CONTEXT.md](./CONTEXT.md)
- **Examples over prose**: Show concrete input/output for complex rules
- **Precision**: Zero ambiguity – multiple implementations must agree
- **Structure**: Number sections, cross-reference related rules
- **Line length**: 80-120 characters for readability

## License

By contributing, you agree your contributions will be licensed under the MIT License.
