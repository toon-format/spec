# Mixed Columnar Arrays

Tabular rows carry primitive cells only. Proposals that let a row continue with nested content – spill lines under a row, nested tabular blocks per row, or an encoder switch like `objectArrayLayout: "columnar"` that opts into such a layout – are out of scope.

## Why this is out of scope

The tabular form is useful because it is constrained: one line per element, one primitive cell per leaf field (§9.3). Row boundaries are trivial to find, and a strict decoder checks both row count and row width (§14.1). Hanging nested lines off a row turns rows into trees:

> This proposal removes that constraint and turns rows into tree-structured entities – effectively creating a second tree-encoding path alongside the existing list/object syntax.
> – [spec#21](https://github.com/toon-format/spec/issues/21#issuecomment-4163086929)

In 4.x the syntax is taken, too: a line deeper than a row is an over-indented line, which strict decoders MUST reject (§14.2). And an encoder option that picks the layout conflicts with §1.4 and §13.1 – the form follows from the value's shape and position, not from encoder preference – so one JSON value has one TOON rendering.

v4 covers the uniform part of this shape without a second tree syntax:

- **Nested field groups (§9.3)** put uniform nested objects into the header: `orders[2]{id,customer{name,country},total}:`.
- **Keyed tabular form (§9.5)** handles objects of uniform objects.

An array whose elements differ, or carry arrays or empty objects, stays in list form (§9.4). That is more verbose, but simple and unambiguous.

## Prior requests

- spec#21 – hybrid tabular arrays with nested row content
- spec#48 – mixed columnar arrays and `objectArrayLayout` (the `ignoreNullOrEmpty` and `excludeEmptyArrays` half is in `encoder-data-rewrites.md`)
- spec#47 – draft spec text for spec#48
