# TOON Specification Versioning Policy

This document outlines the versioning policy for the TOON specification.

## Semantic Versioning

The TOON specification follows [Semantic Versioning](https://semver.org/) with a `MAJOR.MINOR` format (specifications don't need PATCH versions).

### Version Format

**`MAJOR.MINOR`**

- **MAJOR version** - Incremented for breaking changes that are incompatible with previous versions
- **MINOR version** - Incremented for backward-compatible additions, clarifications, or non-breaking changes

**Example:** Moving from v1.3 to v1.4 means your implementation keeps working. Moving from v1.3 to v2.0 means you'll likely need to update your code.

## What Constitutes a Breaking Change

Breaking changes (requiring a MAJOR version bump) include:

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
- Adding new MUST requirements that existing implementations don't meet.
- Changing error handling in ways that break round-trip compatibility.

## What Constitutes a Non-Breaking Change

Non-breaking changes (MINOR version bump) include:

### Clarifications

- Clarifying ambiguous language without changing behavior.
- Adding examples to illustrate existing rules.
- Improving specification wording for clarity.
- Adding informative (non-normative) sections.

### Backward-Compatible Additions

- Adding optional features that don't affect existing documents.
- Adding new SHOULD or MAY recommendations.
- Expanding the specification to cover previously undefined behavior (if done in a backward-compatible way).
- Adding new test cases that existing conformant implementations already pass.

### Documentation Improvements

- Grammar and typo fixes.
- Reorganizing content for better readability.
- Adding cross-references.
- Improving examples.

## Version Lifecycle

### Working Draft

- Current development version.
- May receive updates without version changes.
- Indicated by "Status: Working Draft" in the specification.

### Stable Release

- Released versions are immutable.
- Version number is assigned when changes are merged.
- Previous versions remain available for reference.

### Deprecation

If we need to make a breaking change (MAJOR version bump):

1. **Announcement:** We add a deprecation notice to the current spec
2. **Migration Period:** The next MINOR version includes migration guidance
3. **New Major Version:** Breaking changes are released in the next MAJOR version
4. **Support:** Previous MAJOR versions remain available – we don't break old links

## Implementation Compatibility

### Specification Version Support

If you're implementing TOON, clearly document which spec version you support:

```json
{
  "toon-spec": "1.3"
}
```

This helps users know what behavior to expect.

### Forward Compatibility

Your implementation can support multiple spec versions. If you do:

1. Default to the latest supported version
2. Let users specify which version to target
3. Document version-specific behavior clearly

### Backward Compatibility

**When a new MINOR version is released:**

- Your implementation stays conformant – no code changes needed
- Updates may be recommended but aren't required

**When a new MAJOR version is released:**

- You may need updates to support the new version
- Previous version implementations remain valid
- We'll provide a migration guide

## Version Numbering Examples

### Current: v1.3

**Next minor update (clarifications, additions):**
- v1.4

**Next major update (breaking changes):**
- v2.0

**After v2.0, next minor update:**
- v2.1

## Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## Questions

Not sure if your proposed change is breaking or non-breaking?

1. Open an issue with the `[RFC]` tag
2. Describe the proposed change
3. Ask for feedback from maintainers and community

When in doubt, we err on the side of caution and treat potentially breaking changes as MAJOR version bumps.
