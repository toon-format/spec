# TOON Examples

This directory contains example TOON files demonstrating various features of the format. Examples are organized into three categories:

## Valid Examples

Complete, valid TOON files demonstrating core features:

### Objects

- [`valid/objects.toon`](valid/objects.toon) - Simple flat object with primitive values
  - Demonstrates basic key-value pairs
  - Shows multiple data types: string, number, boolean, null
  - Spec: §6 Objects

- [`valid/nested-objects.toon`](valid/nested-objects.toon) - Multi-level nested objects
  - Demonstrates indentation-based nesting (2 spaces per level)
  - Shows how objects can contain other objects
  - Spec: §6 Objects, §4 Indentation

### Arrays

- [`valid/primitive-arrays.toon`](valid/primitive-arrays.toon) - Inline primitive arrays
  - Demonstrates compact inline format `[N]: item1,item2,item3`
  - Shows empty arrays `[0]:`
  - Multiple arrays in one document
  - Spec: §7.1 Primitive Arrays

- [`valid/tabular-array.toon`](valid/tabular-array.toon) - Tabular array format (comma delimiter)
  - Demonstrates the most token-efficient format for uniform data
  - Header declares fields once: `{field1,field2,...}`
  - Rows contain only data values
  - Spec: §7.2 Tabular Arrays

- [`valid/mixed-array.toon`](valid/mixed-array.toon) - Mixed-type array (list format)
  - Demonstrates list format with `-` prefix
  - Shows arrays containing different types (number, object, string)
  - Useful when items don't have uniform structure
  - Spec: §7.3 Mixed Arrays

### Delimiters

- [`valid/pipe-delimiter.toon`](valid/pipe-delimiter.toon) - Pipe delimiter (`|`)
  - Shows alternative delimiter for tabular arrays
  - Delimiter marker appears in both header `[N|]` and field list `{field|...}`
  - Useful when data contains commas
  - Spec: §8 Delimiters

- [`valid/tab-delimiter.toon`](valid/tab-delimiter.toon) - Tab delimiter (`\t`)
  - Demonstrates tab-separated tabular format
  - Tab character appears in both header and between fields
  - Useful for TSV-like data
  - Spec: §8 Delimiters

## Invalid Examples

Examples that intentionally violate TOON syntax rules:

- **[`invalid/length-mismatch.toon`](invalid/length-mismatch.toon)** - Array length mismatch
  - Declares `[3]` but provides only 2 items
  - Should fail validation in strict mode
  - Spec: §9 Validation

- **[`invalid/missing-colon.toon`](invalid/missing-colon.toon)** - Missing colon after key
  - Keys must be followed by `: ` (colon + space)
  - Demonstrates common syntax error
  - Spec: §6 Objects

## Conversions

Side-by-side JSON ↔ TOON examples showing equivalent representations:

- **[`conversions/users.json`](conversions/users.json)** + **[`conversions/users.toon`](conversions/users.toon)**
  - Same data in both formats
  - Shows token reduction achieved by TOON (≈30-60% for tabular data)
  - Demonstrates the primary use case: uniform arrays of objects

## Using These Examples

These examples are useful for:

1. **Learning TOON syntax** - Study working examples to understand the format.
2. **Testing implementations** - Verify your parser/encoder handles these cases.
3. **Documentation** - Reference examples when explaining TOON features.
4. **Debugging** - Compare your output with these known-good examples.

For comprehensive test coverage, see the [`tests/`](../tests/) directory which contains language-agnostic JSON test fixtures covering all spec requirements.
