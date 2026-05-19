# TOON Examples

This directory contains example TOON files demonstrating various features of the format. Examples are organized into three categories:

## Valid Examples

Complete, valid TOON files demonstrating core features:

### Objects

- [`valid/objects.toon`](valid/objects.toon) - Simple flat object with primitive values
  - Demonstrates basic key-value pairs
  - Shows multiple data types: string, number, boolean, null
  - Spec: §8 Objects

- [`valid/nested-objects.toon`](valid/nested-objects.toon) - Multi-level nested objects
  - Demonstrates indentation-based nesting (2 spaces per level)
  - Shows how objects can contain other objects
  - Spec: §8 Objects, §12 Indentation

### Arrays

- [`valid/primitive-arrays.toon`](valid/primitive-arrays.toon) - Inline primitive arrays
  - Demonstrates compact inline format `[N]: item1,item2,item3`
  - Shows empty arrays `[]`
  - Multiple arrays in one document
  - Spec: §9.1 Primitive Arrays

- [`valid/mixed-array.toon`](valid/mixed-array.toon) - Mixed-type array (list format)
  - Demonstrates list format with `-` prefix
  - Shows arrays containing different types (number, object, string)
  - Useful when items don't have uniform structure
  - Spec: §9.4 Mixed Arrays

### Delimiters

- [`valid/pipe-delimiter.toon`](valid/pipe-delimiter.toon) - Pipe delimiter (`|`)
  - Shows alternative delimiter for tabular arrays
  - Delimiter marker appears in both header `[N|]` and field list `{field|...}`
  - Useful when data contains commas
  - Spec: §11 Delimiters

- [`valid/tab-delimiter.toon`](valid/tab-delimiter.toon) - Tab delimiter (`\t`)
  - Demonstrates tab-separated tabular format
  - Tab character appears in both header and between fields
  - Useful for TSV-like data
  - Spec: §11 Delimiters

- [`valid/delimiter-scoping.toon`](valid/delimiter-scoping.toon) - Document vs active delimiter
  - Shows that tabular row cells split only on the active delimiter
  - Shows that object field values still follow document delimiter quoting rules
  - Spec: §11.1 Delimiters (Encoding Rules)

### Key Folding and Path Expansion

> Regenerate any of these examples via a conforming encoder with `keyFolding="safe"`.
>
> Decode folded examples with `expandPaths="safe"` to reconstruct nested JSON.

- [`valid/key-folding-basic.toon`](valid/key-folding-basic.toon) - Basic dotted-key notation
  - Demonstrates how `keyFolding="safe"` only folds chains of single-key objects (e.g. `server.host: localhost`)
  - Notes that siblings such as `database.connection.username` need their own wrapper objects in the JSON source
  - Generated from [`valid/key-folding-basic.json`](valid/key-folding-basic.json) with `keyFolding="safe"`
  - Spec: §13.4 Key Folding and Path Expansion

- [`valid/key-folding-with-array.toon`](valid/key-folding-with-array.toon) - Dotted keys with arrays
  - Shows folding combined with inline arrays: `data.meta.items[3]: widget,gadget,tool`
  - Adds folded scalar `stats.meta.count: 3` plus folded array `user.preferences.tags[2]: …`
  - Shows that arrays stop the folding chain yet remain inline when the parent chain qualifies
  - Spec: §13.4 Key Folding

- [`valid/key-folding-mixed.toon`](valid/key-folding-mixed.toon) - Mixed folding strategies
  - Combines standard nested objects (`app`, `server`) with folded keys (`database.connection.url`, `feature.flags.beta`)
  - Shows the encoder mixing folded and non-folded sections within the same document
  - Useful when only some branches meet the single-key-chain requirement
  - Spec: §13.4 Key Folding

- [`valid/path-expansion-merge.toon`](valid/path-expansion-merge.toon) - Deep merge behavior
  - Demonstrates how overlapping dotted keys merge during expansion
  - Shows `user.profile.name: Ada` + `user.settings.theme: dark` → nested object with both branches
  - Spec: §13.4 Path Expansion

- [`valid/key-folding-non-identifier.toon`](valid/key-folding-non-identifier.toon) - Non-identifier segments
  - Paired with [`valid/key-folding-non-identifier.json`](valid/key-folding-non-identifier.json); quoted dotted keys with non-IdentifierSegment parts remain literal under `expandPaths="safe"`
  - Spec: §13.4 Safe Mode Requirements, §1.9 IdentifierSegment, §7.3 Key Encoding

## Invalid Examples

Examples that intentionally violate TOON syntax rules:

- [`invalid/length-mismatch.toon`](invalid/length-mismatch.toon) - Array length mismatch
  - Declares `[3]` but provides only 2 items
  - Should fail validation in strict mode
  - Spec: §14.1 Strict Mode (Array Count & Width)

- [`invalid/missing-colon.toon`](invalid/missing-colon.toon) - Missing colon after key
  - Keys require `:`; this file omits it
  - Spec: §5 Concrete Syntax (root form)

- [`invalid/path-expansion-conflict-strict.toon`](invalid/path-expansion-conflict-strict.toon) - Path expansion conflict
  - First line creates nested path `user.profile.name`, second line tries to assign primitive to `user.profile`
  - Fails when decoded with `expandPaths="safe"` and `strict=true` (default)
  - With `strict=false`, applies LWW conflict resolution (later value wins)
  - Spec: §13.4 Path Expansion, §14.5 Conflicts

- [`invalid/delimiter-mismatch.toon`](invalid/delimiter-mismatch.toon) - Header delimiter mismatch
  - Declares pipe delimiter in brackets (`[N|]`) but uses comma-separated fields (`{a,b}`)
  - MUST error in strict mode
  - Spec: §6 Header Syntax (delimiter equality requirement)

## Conversions

Side-by-side JSON ↔ TOON examples showing equivalent representations:

- [`conversions/users.json`](conversions/users.json) + [`conversions/users.toon`](conversions/users.toon)
  - Same tabular data in both formats
  - Shows the tabular form for uniform arrays of objects; see the [benchmarks](https://github.com/toon-format/toon/tree/main/benchmarks) for measured token reductions
  - Demonstrates the primary use case: uniform arrays of objects

- [`conversions/config.json`](conversions/config.json) + [`conversions/config.toon`](conversions/config.toon)
  - Deeply nested configuration data (server, database, logging settings)
  - Demonstrates standard indentation-based nesting for multi-key objects

- [`conversions/api-response.json`](conversions/api-response.json) + [`conversions/api-response.toon`](conversions/api-response.toon)
  - API response with nested data and metadata
  - Demonstrates standard nesting for serializing API responses while preserving deterministic structure

For reference test fixtures, see the [`tests/`](../tests/) directory.
