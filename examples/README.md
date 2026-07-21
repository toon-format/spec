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
