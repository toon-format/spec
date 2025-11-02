# Contributing to TOON Specification

Thanks for your interest in contributing to the TOON specification! Whether you're fixing a typo, proposing a new feature, or clarifying ambiguous wording, your contributions help make TOON better for everyone.

This document outlines how to propose changes and improvements to the specification.

## Table of Contents

- [Types of Contributions](#types-of-contributions)
- [Before You Contribute](#before-you-contribute)
- [Proposing Changes](#proposing-changes)
- [RFC Process for Major Changes](#rfc-process-for-major-changes)
- [Specification Principles](#specification-principles)
- [Style Guidelines](#style-guidelines)

## Types of Contributions

### Clarifications and Fixes

Small improvements that don't change behavior:

- Typo corrections
- Grammar improvements
- Clarifying ambiguous language
- Adding examples
- Fixing broken links

**Process:** Open a pull request directly.

### Minor Changes

Backward-compatible additions or clarifications that may affect implementations:

- Adding test cases
- Clarifying edge case behavior
- Adding informative appendices
- Expanding examples

**Process:** Open an issue first to discuss, then submit a pull request.

### Contributing Test Fixtures

Test fixtures are language-agnostic JSON files that validate TOON implementations. Contributing test cases helps ensure spec compliance across all implementations.

**Types of test contributions:**

1. **New test cases** - Add tests for uncovered scenarios
2. **Edge case coverage** - Add tests for corner cases
3. **Error validation** - Add tests for error conditions
4. **Spec clarifications** - Add tests when spec behavior is clarified

**Test fixture structure:**

```json
{
  "version": "1.3",
  "category": "encode",
  "description": "Brief description of test category",
  "tests": [
    {
      "name": "descriptive test name",
      "input": "JSON value or TOON string",
      "expected": "TOON string or JSON value",
      "options": {},
      "specSection": "7.2"
    }
  ]
}
```

**Guidelines for test fixtures:**

- One assertion per test - keep tests focused
- Use descriptive names that explain what's being validated
- Link to spec sections using `specSection` field
- Include edge cases and boundary conditions
- Add error tests in separate files (e.g., `validation-errors.json`)
- Follow existing test organization patterns
- Validate your JSON against `tests/fixtures.schema.json`

**Process:**

1. Identify the appropriate fixture file in `tests/fixtures/encode/` or `tests/fixtures/decode/`.
2. Add your test case following the structure above.
3. Run validation to ensure your fixture is well-formed.
4. Submit a PR with clear description of what the test validates.

See [tests/README.md](./tests/README.md) for complete fixture documentation.

### Major Changes

Changes that affect compatibility or core behavior:
- New syntax features
- Changes to encoding/decoding rules
- Modifications to conformance requirements
- Breaking changes

**Process:** Follow the RFC process (see below).

## Before You Contribute

Quick checklist before opening an issue or PR:

1. **Check existing issues and PRs** – someone may have already proposed your idea
2. **Review the specification** ([SPEC.md](./SPEC.md)) to understand current behavior
3. **Check the reference implementation** to see how it handles the case
4. **Consider backward compatibility** – breaking changes require strong justification

## Proposing Changes

### Opening an Issue

When opening an issue, please include:

1. **Clear description** of the problem or proposed change.
2. **Current behavior** (with spec references if applicable).
3. **Proposed behavior** (what should change and why).
4. **Examples** demonstrating the issue or improvement.
5. **Impact assessment** on existing implementations.
6. **Alternatives considered** (if applicable).

### Submitting a Pull Request

1. **Fork the repository** and create a branch from `main`.
2. **Make your changes** following the style guidelines.
3. **Update examples** if your change affects them.
4. **Update CHANGELOG.md** with your changes.
5. **Write a clear PR description** explaining:
   - What changed and why.
   - How it affects implementations.
   - Whether it's backward-compatible.
6. **Link related issues** in your PR description.

### Review Process

- Spec maintainers will review your contribution.
- There may be discussion and requests for changes.
- Once approved, maintainers will merge and assign a version number.
- For breaking changes, the PR will be held until the next major version.

## RFC Process for Major Changes

Major changes require a Request for Comments (RFC) process. This ensures community input and helps us avoid breaking changes that haven't been thoroughly considered.

### 1. Create an RFC Issue

Open an issue with the `[RFC]` prefix and include:

```markdown
# [RFC] Title of Your Proposal

## Summary
Brief overview of the change

## Motivation
Why is this change needed? What problems does it solve?

## Detailed Design
Technical specification of the proposed change

## Examples
Code examples showing the change in action

## Drawbacks
What are the costs and downsides?

## Alternatives
What other designs were considered?

## Impact on Implementations
How will this affect existing implementations?

## Migration Strategy
How should implementations adopt this change?

## Unresolved Questions
What parts need more discussion?
```

### 2. Discussion Period

- Community members and implementers provide feedback.
- The RFC is iterated based on feedback.
- Discussion typically lasts 1-2 weeks minimum.

### 3. Decision

- Maintainers will accept, reject, or request revisions.
- Accepted RFCs move to implementation (PR phase).
- Rejected RFCs will be closed with explanation.

### 4. Implementation

- Create a PR implementing the RFC.
- PR must reference the RFC issue.
- Additional review occurs during PR phase.

## Specification Principles

When contributing, keep these core principles in mind. They guide every decision we make about TOON:

### 1. Token Efficiency
TOON's primary goal is reducing token usage for LLM input. Changes should maintain or improve token efficiency.

### 2. LLM-Friendly Structure
The format should be easy for LLMs to parse and generate. Explicit length markers and field declarations are features, not bugs.

### 3. Human Readability
While optimized for machines, TOON should remain reasonably readable by humans for debugging and validation.

### 4. Simplicity
Prefer simple, consistent rules over special cases. The spec should be implementable without extensive parsing libraries.

### 5. Backward Compatibility
Breaking changes require very strong justification. Prefer additive changes that maintain compatibility.

### 6. Interoperability
Multiple implementations should produce identical output for the same input. Ambiguity is not acceptable.

## Style Guidelines

### Writing Style

- Use RFC 2119 keywords (MUST, SHOULD, MAY) correctly
- Be precise and unambiguous
- Use examples to clarify complex rules
- Keep language concise but complete
- Use active voice where possible

### Formatting

- Use proper markdown formatting
- Include code blocks with language hints
- Use section numbering consistently
- Add cross-references to related sections
- Keep line length reasonable (80-120 characters)

### Examples

- Show both input and output
- Include edge cases
- Demonstrate both valid and invalid cases
- Add comments explaining non-obvious behavior

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions.
2. Open a new issue with the `question` label.
3. Reach out to maintainers.

## Code of Conduct

Be respectful and constructive in all interactions. We're building this specification together, and diverse perspectives make it better.

## License

By contributing to this specification, you agree that your contributions will be licensed under the MIT License.
