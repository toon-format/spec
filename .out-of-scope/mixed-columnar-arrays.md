# Mixed Columnar Arrays

Tabular rows carry primitive cells only. Proposals that let a row continue with nested content – spill lines under a row, nested tabular blocks per row, or an encoder option like `objectArrayLayout: "columnar"` that opts into such a layout – are out of scope.

## Why this is out of scope

The tabular form is useful because it is constrained: one line per element and one primitive cell per leaf field, so row boundaries are trivial and a strict decoder checks row count and width (§9.3, §14.1). Nested lines under a row turn rows into trees:

> This proposal removes that constraint and turns rows into tree-structured entities – effectively creating a second tree-encoding path alongside the existing list/object syntax.
> – [spec#21](https://github.com/toon-format/spec/issues/21#issuecomment-4163086929)

A layout option also conflicts with §1.4: the form follows from the value's shape and position, not from encoder preference. Uniform nested objects already fit the header as nested field groups (§9.3); arrays whose elements differ stay in list form (§9.4).

## Prior requests

- spec#21 – hybrid tabular arrays with nested row content
- spec#48 – mixed columnar arrays and `objectArrayLayout` (the `ignoreNullOrEmpty` and `excludeEmptyArrays` half is in `encoder-data-rewrites.md`)
- spec#47 – draft spec text for spec#48
