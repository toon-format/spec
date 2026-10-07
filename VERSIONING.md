# TOON Specification Versioning Policy

## Semantic Versioning

The TOON specification follows [Semantic Versioning](https://semver.org/) with a `MAJOR.MINOR` format.

### Version Format

**`MAJOR.MINOR`**

- **MAJOR version** - Incremented for breaking changes that are incompatible with previous versions
- **MINOR version** - Incremented for backward-compatible additions, clarifications, or non-breaking changes

**Example:** Moving from v3.1 to v3.2 is non-breaking – your implementation keeps working. Moving from v2.1 to v3.0 was a MAJOR transition that required encoder updates.

### Specification Version vs Published Package Version

The specification version (e.g., `3.2`) is `MAJOR.MINOR`. Published npm artifacts (`@toon-format/spec`) use full SemVer `MAJOR.MINOR.PATCH` (e.g., `3.2.0`, `3.2.1`); PATCH releases are packaging or editorial-only and do not change the specification version. Implementations targeting a spec version should pin to the `MAJOR.MINOR` line.

## What Constitutes a Breaking Change

Breaking changes (requiring a MAJOR version bump) include the following; changes confined to encoder-unreachable documents are MINOR (see Non-Breaking Changes).

### Syntax Changes

- Removing or changing existing syntax.
- Changing the meaning of existing constructs.
- Adding new reserved characters that could conflict with existing valid TOON documents.
- Changing encoding/decoding behavior in incompatible ways.

### Semantic Changes

- Changing how valid TOON should be interpreted.
- Modifying type conversion rules in incompatible ways.
- Changing quoting rules in ways that break existing documents.
- Altering delimiter behavior.

### Conformance Changes

- Making previously valid TOON invalid.
- Adding new MUST requirements that existing implementations don't meet, except encoder-side tightening (see Non-Breaking Changes).
- Changing error handling in ways that break round-trip compatibility.

## What Constitutes a Non-Breaking Change

Non-breaking changes (MINOR version bump) include:

### Backward-Compatible Additions

- Adding informative (non-normative) sections.
- Adding optional features that don't affect existing documents.
- Adding new SHOULD or MAY recommendations.
- Expanding the specification to cover previously undefined behavior (if done in a backward-compatible way).
- Adding new test cases that existing conformant implementations already pass.
- Adding a normative decoder requirement that broadens accepted input, compatible with existing encoder output.
- Encoder-side tightening: raising a SHOULD or MAY to MUST or MUST NOT for encoder output, or adding a new constraint on what encoders emit. This is MINOR only while every document an encoder of the current MAJOR version could emit keeps decoding as before.
- Changing the treatment of encoder-unreachable documents. A document is encoder-unreachable when no conforming encoder of the current MAJOR version could emit it, so it can only have been hand-authored or produced by other means and no round-trip yields it. Reinterpreting such a document, or rejecting it outright, is MINOR.

## Version Lifecycle

### Working Draft

- Current development version.
- Receives updates through MINOR version increments. Working Draft status means the specification is stable for implementation but not yet finalized; it does not mean the normative text may change silently under a fixed version number.
- Indicated by "Status: Working Draft" in the specification.

### Stable Release

- Released versions are immutable.
- Version number is assigned when changes are merged.
- Previous versions remain available for reference.

## Implementation Compatibility

When in doubt, we err on the side of caution and treat potentially breaking changes as MAJOR version bumps.

A new MINOR version keeps existing conformant implementations conformant on every document a conforming encoder of the current MAJOR version emits; on encoder-unreachable documents, its CHANGELOG.md entry names what changed. A new MAJOR version may require updates; previous-version implementations remain valid, and its CHANGELOG.md entry carries the migration guidance. A MINOR version that renames or retires a public concept handle (for example an option name) carries a migration note in CHANGELOG.md naming the old and new spelling.

## Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.
