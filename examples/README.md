# TOON Examples

This directory contains example TOON files demonstrating various features of the format. Examples are organized into three categories:

## Valid Examples

Complete, valid TOON files demonstrating core features:

### Objects

- [`valid/objects.toon`](valid/objects.toon) - Simple flat object with primitive values
  - Demonstrates basic key-value pairs
  - Shows multiple data types: string, number, boolean, null
  - Spec: §8

- [`valid/nested-objects.toon`](valid/nested-objects.toon) - Multi-level nested objects
  - Demonstrates indentation-based nesting (2 spaces per level)
  - Shows how objects can contain other objects
  - Spec: §8, §12

### Arrays

- [`valid/primitive-arrays.toon`](valid/primitive-arrays.toon) - Inline primitive arrays
  - Demonstrates compact inline format `[N]: item1,item2,item3`
  - Shows empty arrays `[]`
  - Multiple arrays in one document
  - Spec: §9.1

- [`valid/mixed-array.toon`](valid/mixed-array.toon) - Mixed-type array (list format)
  - Demonstrates list format with `-` prefix
  - Shows arrays containing different types (number, object, string)
  - Useful when items don't have uniform structure
  - Spec: §9.4

### Delimiters

- [`valid/pipe-delimiter.toon`](valid/pipe-delimiter.toon) - Pipe delimiter (`|`)
  - Shows alternative delimiter for tabular arrays
  - Delimiter marker appears in both header `[N|]` and field list `{field|...}`
  - Useful when data contains commas
  - Spec: §11

- [`valid/tab-delimiter.toon`](valid/tab-delimiter.toon) - Tab delimiter (`\t`)
  - Demonstrates tab-separated tabular format
  - Tab character appears in both header and between fields
  - Useful for TSV-like data
  - Spec: §11

- [`valid/delimiter-scoping.toon`](valid/delimiter-scoping.toon) - Document vs active delimiter
  - Shows that tabular row cells split only on the active delimiter
  - Shows that object field values still follow document delimiter quoting rules
  - Spec: §11

### Key Folding and Path Expansion

> Examples with a `.json` sidecar can be regenerated via a conforming encoder with `keyFolding="safe"`. Decode the `.toon` with `expandPaths="safe"` to reconstruct the paired JSON shape.

- [`valid/key-folding-basic.toon`](valid/key-folding-basic.toon) - Basic dotted-key notation
  - Demonstrates how `keyFolding="safe"` only folds chains of single-key objects (e.g. `server.host: localhost`)
  - Spec: §13.4

- [`valid/key-folding-with-array.toon`](valid/key-folding-with-array.toon) - Dotted keys with arrays
  - Shows folding combined with inline arrays: `data.meta.items[3]: widget,gadget,tool`
  - Adds folded scalar `stats.meta.count: 3` plus folded array `user.preferences.tags[2]: …`
  - Arrays terminate the folded chain as the leaf value; the parent chain still folds and the array stays inline
  - Spec: §13.4

- [`valid/key-folding-mixed.toon`](valid/key-folding-mixed.toon) - Mixed folding strategies
  - Combines standard nested objects (`app`, `server`) with folded keys (`database.connection.url`, `feature.flags.beta`)
  - Shows the encoder mixing folded and non-folded sections within the same document
  - Useful when only some branches meet the single-key-chain requirement
  - Spec: §13.4

- [`valid/key-folding-non-identifier.toon`](valid/key-folding-non-identifier.toon) - Non-identifier segments
  - Quoted dotted keys (quoting forced by hyphens per §7.3) remain literal under `expandPaths="safe"`
  - Spec: §13.4, §7.3

## Invalid Examples

Examples that intentionally violate TOON syntax rules:

- [`invalid/length-mismatch.toon`](invalid/length-mismatch.toon) - Array length mismatch
  - Declares `[3]` but provides only 2 items
  - Should fail validation in strict mode
  - Spec: §14.1

- [`invalid/multiple-root-primitives.toon`](invalid/multiple-root-primitives.toon) - Multiple depth-0 primitives
  - Two non-key-value lines at root depth in strict mode
  - Spec: §5, §14.2

- [`invalid/delimiter-mismatch.toon`](invalid/delimiter-mismatch.toon) - Header delimiter mismatch
  - Declares pipe delimiter in brackets (`[N|]`) but uses comma-separated fields (`{a,b}`)
  - MUST error in strict mode
  - Spec: §6

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
