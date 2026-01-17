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
  - Shows empty arrays `[0]:`
  - Multiple arrays in one document
  - Spec: §9.1 Primitive Arrays

- [`valid/tabular-array.toon`](valid/tabular-array.toon) - Tabular array format (comma delimiter)
  - Demonstrates the most token-efficient format for uniform data
  - Header declares fields once: `{field1,field2,...}`
  - Rows contain only data values
  - Spec: §9.3 Tabular Arrays

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

### Key Folding and Path Expansion (v1.5+)

> Regenerate any of these examples via the reference CLI, e.g. `npx @toon-format/cli --encode --keyFolding safe examples/valid/key-folding-basic.json --output examples/valid/key-folding-basic.toon`.

- [`valid/key-folding-basic.toon`](valid/key-folding-basic.toon) - Basic dotted-key notation
  - Demonstrates how `keyFolding="safe"` only folds chains of single-key objects (e.g. `server.host: localhost`)
  - Notes that siblings such as `database.connection.username` need their own wrapper objects in the JSON source
  - Generated directly from [`valid/key-folding-basic.json`](valid/key-folding-basic.json) using the CLI encoder
  - **Decode tip:** use `expandPaths="safe"` to reconstruct the nested JSON structure
  - Spec: §13.4 Key Folding and Path Expansion

- [`valid/key-folding-with-array.toon`](valid/key-folding-with-array.toon) - Dotted keys with arrays
  - Shows folding combined with inline arrays: `data.meta.items[3]: widget,gadget,tool`
  - Adds folded scalar `stats.meta.count: 3` plus folded array `user.preferences.tags[2]: …`
  - Shows that arrays stop the folding chain yet remain inline when the parent chain qualifies
  - **Decode tip:** use `expandPaths="safe"` to reconstruct the nested JSON structure
  - Spec: §13.4 Key Folding

- [`valid/key-folding-mixed.toon`](valid/key-folding-mixed.toon) - Mixed folding strategies
  - Combines standard nested objects (`app`, `server`) with folded keys (`database.connection.url`, `feature.flags.beta`)
  - Shows the encoder mixing folded and non-folded sections within the same document
  - Useful when only some branches meet the single-key-chain requirement
  - **Decode tip:** use `expandPaths="safe"` to reconstruct the nested JSON structure
  - Spec: §13.4 Key Folding

- [`valid/path-expansion-merge.toon`](valid/path-expansion-merge.toon) - Deep merge behavior
  - Demonstrates how overlapping dotted keys merge during expansion
  - Shows `user.profile.name: Ada` + `user.settings.theme: dark` → nested object with both branches
  - Decoder option `expandPaths="safe"` reconstructs nested structure
  - Spec: §13.4 Path Expansion

### XML Constructs (v4.0+)

- [`valid/xml-namespaces.toon`](valid/xml-namespaces.toon) - Namespaced document
  - Demonstrates `xmlns` and `xmlns:prefix` namespace declarations
  - Shows qualified names with namespace prefixes
  - Spec: §23 Namespaces

- [`valid/xml-attributes.toon`](valid/xml-attributes.toon) - XML attributes
  - Demonstrates attributes as nested key-value pairs
  - Shows attributes with and without namespace prefixes
  - Shows elements with attributes and text content using arrays
  - Spec: §24 Attributes

- [`valid/xml-repeated-elements.toon`](valid/xml-repeated-elements.toon) - Interleaved repeated elements
  - Demonstrates interleaved elements of different types (XML-specific feature)
  - Shows how order is preserved when elements are mixed (not representable in JSON)
  - Spec: §25.4 Preserving Order with Interleaved Elements

- [`valid/xml-mixed-content.toon`](valid/xml-mixed-content.toon) - Mixed content
  - Demonstrates mixed content with text nodes and elements
  - Shows arrays where strings are text nodes and objects are elements
  - Spec: §26 Mixed Content

- [`valid/xml-xhtml.toon`](valid/xml-xhtml.toon) - XHTML example
  - Complete XHTML document with namespaces and attributes
  - Demonstrates complex XML document structure
  - Spec: §22-28 XML Constructs

## Invalid Examples

Examples that intentionally violate TOON syntax rules:

- [`invalid/length-mismatch.toon`](invalid/length-mismatch.toon) - Array length mismatch
  - Declares `[3]` but provides only 2 items
  - Should fail validation in strict mode
  - Spec: §14.1 Strict Mode (Array Count & Width)

- [`invalid/missing-colon.toon`](invalid/missing-colon.toon) - Missing colon after key
  - Keys must be followed by `:`; when a value appears on the same line, the format MUST be `: ` (colon + single space)
  - Demonstrates common syntax error
  - Spec: §8 Objects, §14.2 Syntax Errors

- [`invalid/path-expansion-conflict-strict.toon`](invalid/path-expansion-conflict-strict.toon) - Path expansion conflict (v1.5+)
  - First line creates nested path `user.profile.name`, second line tries to assign primitive to `user.profile`
  - Fails when decoded with `expandPaths="safe"` and `strict=true` (default)
  - With `strict=false`, applies LWW conflict resolution (later value wins)
  - Spec: §13.4 Path Expansion, §14.5 Conflicts

- [`valid/key-folding-non-identifier.toon`](valid/key-folding-non-identifier.toon) - Non-identifier segments (v1.5+)
  - Contains dotted keys with segments like `first-name` with hyphens (not valid IdentifierSegments)
  - Keys are quoted (hyphens are not allowed in unquoted keys)
  - These remain as literal dotted keys when `expandPaths="safe"` is used
  - Spec: §13.4 Safe Mode Requirements, §1.9 IdentifierSegment, §7.3 Key Encoding

- [`invalid/delimiter-mismatch.toon`](invalid/delimiter-mismatch.toon) - Header delimiter mismatch
  - Declares pipe delimiter in brackets (`[N|]`) but uses comma-separated fields (`{a,b}`)
  - MUST error in strict mode
  - Spec: §6 Header Syntax (delimiter equality requirement)

- [`invalid/xml-undefined-namespace.toon`](invalid/xml-undefined-namespace.toon) - Undefined namespace prefix (v4.0+)
  - Uses prefix `ex` without corresponding `xmlns:ex` declaration
  - MUST error in strict mode
  - Spec: §14.6 Extended Syntax Errors, §23 Namespaces

## Conversions

Side-by-side JSON ↔ TOON examples showing equivalent representations:

- [`conversions/users.json`](conversions/users.json) + [`conversions/users.toon`](conversions/users.toon)
  - Same tabular data in both formats
  - Shows token reduction achieved by TOON (≈30-60% for tabular data)
  - Demonstrates the primary use case: uniform arrays of objects

- [`conversions/config.json`](conversions/config.json) + [`conversions/config.toon`](conversions/config.toon) (v1.5+)
  - Deeply nested configuration data (server, database, logging settings)
  - Regenerated with `keyFolding="safe"`; because most objects are multi-key, folding halts quickly and the output stays primarily nested (the stop condition)
  - Shows ≈40-50% token reduction versus the JSON source while remaining spec-compliant
  - Highlights how safe folding behaves when little or no folding is permitted

- [`conversions/api-response.json`](conversions/api-response.json) + [`conversions/api-response.toon`](conversions/api-response.toon) (v1.5+)
  - API response with nested data and metadata
  - Regenerated with `keyFolding="safe"`; multi-sibling branches like `data` and `meta` stay fully nested instead of becoming dotted keys (stop condition on display)
  - Shows practical use case for serializing API responses while preserving deterministic structure
  - `expandPaths="safe"` is not required for this file (no folded keys)

- [`conversions/xml-catalog.json`](conversions/xml-catalog.json) + [`conversions/xml-catalog.toon`](conversions/xml-catalog.toon) (v4.0+)
  - Library catalog with repeated book elements
  - Demonstrates tabular format for uniform repeated XML elements
  - Shows attributes and text content in XML structure
  - Spec: §25 Repeated Elements

- [`conversions/xml-rss.json`](conversions/xml-rss.json) + [`conversions/xml-rss.toon`](conversions/xml-rss.toon) (v4.0+)
  - RSS feed example with attributes and repeated items
  - Demonstrates tabular format for RSS item arrays
  - Spec: §25 Repeated Elements

- [`conversions/xml-interleaved.json`](conversions/xml-interleaved.json) + [`conversions/xml-interleaved.toon`](conversions/xml-interleaved.toon) (v4.0+)
  - Interleaved repeated elements of different types
  - Demonstrates list form for preserving element order
  - Spec: §25.4 Preserving Order with Interleaved Elements

## Using These Examples

These examples are useful for:

1. **Learning TOON syntax** - Study working examples to understand the format.
2. **Testing implementations** - Verify your parser/encoder handles these cases.
3. **Documentation** - Reference examples when explaining TOON features.
4. **Debugging** - Compare your output with these known-good examples.

For comprehensive test coverage, see the [`tests/`](../tests/) directory which contains language-agnostic JSON test fixtures covering all spec requirements.
