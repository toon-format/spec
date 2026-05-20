# TOON Specification

## Token-Oriented Object Notation

**Version:** 3.2

**Date:** 2026-05-20

**Status:** Working Draft

**Author:** Johann Schopplich ([@johannschopplich](https://github.com/johannschopplich))

**License:** MIT

---

## Abstract

Token-Oriented Object Notation (TOON) is a line-oriented, indentation-based text format that encodes the JSON data model with explicit structure and minimal quoting. Arrays declare their length and an optional field list once; rows use a single active delimiter (comma, tab, or pipe). Objects use indentation instead of braces; strings are quoted only when required. This specification defines TOON's concrete syntax, canonical number formatting, delimiter scoping, and strict-mode validation, and sets conformance requirements for encoders, decoders, and validators. TOON provides a deterministic representation of structured data, with tabular syntax for arrays of uniform objects.

## Status of This Document

This document is a Working Draft v3.2 and may be updated, replaced, or obsoleted. Implementers should monitor the canonical repository at https://github.com/toon-format/spec for changes.

This specification is stable for implementation but not yet finalized. Breaking changes may occur in future major versions.

## Normative References

**[RFC2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997.
https://www.rfc-editor.org/rfc/rfc2119

**[RFC8174]** Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, May 2017.
https://www.rfc-editor.org/rfc/rfc8174

## Informative References

**[RFC8259]** Bray, T., Ed., "The JavaScript Object Notation (JSON) Data Interchange Format", STD 90, RFC 8259, December 2017.
https://www.rfc-editor.org/rfc/rfc8259

**[RFC4180]** Shafranovich, Y., "Common Format and MIME Type for Comma-Separated Values (CSV) Files", RFC 4180, October 2005.
https://www.rfc-editor.org/rfc/rfc4180

**[RFC5234]** Crocker, D., Ed., and P. Overell, "Augmented BNF for Syntax Specifications: ABNF", STD 68, RFC 5234, January 2008.
https://www.rfc-editor.org/rfc/rfc5234

**[RFC6838]** Freed, N., Klensin, J., and T. Hansen, "Media Type Specifications and Registration Procedures", BCP 13, RFC 6838, January 2013.
https://www.rfc-editor.org/rfc/rfc6838

**[YAML]** Ben-Kiki, O., Evans, C., and I. döt Net, "YAML Ain't Markup Language (YAML™) Version 1.2", 3rd Edition, October 2021.
https://yaml.org/spec/1.2.2/

**[UNICODE]** The Unicode Consortium, "The Unicode Standard", Version 15.1, September 2023.
https://www.unicode.org/versions/Unicode15.1.0/

**[ISO8601]** ISO 8601:2019, "Date and time — Representations for information interchange".
https://www.iso.org/standard/70907.html

## Table of Contents

- [Introduction](#introduction-informative)
1. [Terminology and Conventions](#1-terminology-and-conventions)
2. [Data Model](#2-data-model)
3. [Encoding Normalization (Reference Encoder)](#3-encoding-normalization-reference-encoder)
4. [Decoding Interpretation (Reference Decoder)](#4-decoding-interpretation-reference-decoder)
5. [Concrete Syntax and Root Form](#5-concrete-syntax-and-root-form)
6. [Header Syntax (Normative)](#6-header-syntax-normative)
7. [Strings and Keys](#7-strings-and-keys)
8. [Objects](#8-objects)
9. [Arrays](#9-arrays)
10. [Objects as List Items](#10-objects-as-list-items)
11. [Delimiters](#11-delimiters)
12. [Indentation and Whitespace](#12-indentation-and-whitespace)
13. [Conformance and Options](#13-conformance-and-options)
14. [Strict Mode Errors and Diagnostics (Authoritative Checklist)](#14-strict-mode-errors-and-diagnostics-authoritative-checklist)
15. [Security Considerations](#15-security-considerations)
16. [Internationalization](#16-internationalization)
17. [IANA Considerations](#17-iana-considerations)
18. [Versioning and Extensibility](#18-versioning-and-extensibility)
19. [Intellectual Property Considerations](#19-intellectual-property-considerations)

**Appendices:**
- [Appendix A: Examples (Informative)](#appendix-a-examples-informative)
- [Appendix B: Parsing Helpers (Informative)](#appendix-b-parsing-helpers-informative)
- [Appendix C: Test Suite and Compliance (Informative)](#appendix-c-test-suite-and-compliance-informative)
- [Appendix D: Document Changelog (Informative)](#appendix-d-document-changelog-informative)
- [Appendix E: Acknowledgments and License](#appendix-e-acknowledgments-and-license)
- [Appendix F: Host Type Normalization Examples (Informative)](#appendix-f-host-type-normalization-examples-informative)

## Introduction (Informative)

### Purpose and scope

TOON is a token-efficient text format for JSON-shaped data, designed primarily for LLM prompts and contexts where every token costs. It saves tokens vs JSON by declaring array shapes once (length and optional field list) and using indentation in place of braces. TOON is typically used as a translation layer: produce data as JSON in code, encode to TOON for downstream consumption, and decode back to JSON if needed.

### Applicability and non-goals

Use TOON when:
- arrays of objects share the same fields (uniform tabular data),
- deterministic, minimally quoted text is desirable,
- explicit lengths and fixed row widths help detect truncation or malformed data,
- you want unambiguous, human-readable structure without repeating keys.

TOON is not intended to replace:
- JSON for non-uniform or deeply nested structures where repeated keys are not dominant,
- CSV for flat, strictly tabular data without nesting,
- general-purpose storage or public APIs. TOON carries the JSON data model; it is a transport/authoring format with explicit structure, not an extended type system or schema language.

Out of scope:
- comments and annotations,
- alternative number systems or locale-specific formatting,
- user-defined escape sequences or control directives.

### Relationship to JSON, CSV, and YAML (Informative)

- **JSON**: TOON preserves the JSON data model. It is more compact for uniform arrays of objects by declaring length and fields once. For non-uniform or deeply nested data, JSON may be more efficient.
- **CSV/TSV**: CSV is typically more compact for flat tables but lacks nesting and type awareness. TOON adds explicit lengths, per-array delimiter scoping, inline field lists (no separate header row), and deterministic quoting, while remaining lightweight.
- **YAML**: TOON uses indentation and hyphen markers but is more constrained and deterministic: no comments, explicit array headers with lengths, fixed quoting rules, and a narrow escape set.

### Example (Informative)

```
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

## 1. Terminology and Conventions

### 1.1 Use of RFC2119 Keywords and Normativity

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119] and [RFC8174] when, and only when, they appear in all capitals, as shown here.

All normative text in this specification is contained in Sections 1–16. All appendices are informative except where explicitly marked normative. Examples throughout this document are informative unless explicitly stated otherwise.

### 1.2 Core Concepts

- TOON document: A sequence of UTF-8 text lines formatted according to this spec.
- Line: A sequence of non-newline characters. Serialized documents use LF (U+000A) as the line separator between lines; encoders MUST use LF, not CRLF.

### 1.3 Structural Terms

- Indentation level (depth): Leading indentation measured in fixed-size space units (indentSize). Depth 0 has no indentation.
- Indentation unit (indentSize): A fixed number of spaces per level (default 2). Tabs MUST NOT be used for indentation.

### 1.4 Array Terms

- Header: The bracketed declaration for arrays, optionally followed by a field list, and terminating with a colon; e.g., key[3]: or items[2]{a,b}:.
- Field list: Brace-enclosed, delimiter-separated list of field names for tabular arrays: {f1<delim>f2}.
- List item: A line beginning with "- " (or a bare "-" for an empty-object list item, §10) at a given depth representing an element in an expanded array.

### 1.5 Delimiter Terms

- Delimiter: The character used to separate array/tabular values: comma (default), tab (HTAB, U+0009), or pipe ("|").
- Document delimiter: The encoder-selected delimiter used for quoting decisions outside any array scope (default comma).
- Active delimiter: The delimiter declared by the closest array header in scope, used to split inline primitive arrays and tabular rows under that header. It governs quoting decisions for those inline values and row cells; object field values within the same scope use the document delimiter (see §11.1).

### 1.6 Type Terms

- Primitive: string, number, boolean, or null.
- Object: Mapping from string keys to `JsonValue`.
- Array: Ordered sequence of `JsonValue`.
- `JsonValue`: Primitive | Object | Array.

### 1.7 Conformance Terms

- Strict mode: Decoder mode that enforces counts, indentation, and delimiter consistency; also rejects invalid escapes and missing colons (default: true). See §14 for the authoritative list of strict-mode errors.

### 1.8 Notation

- Regular expressions appear in slash-delimited form.
- ABNF snippets follow RFC 5234; HTAB means the U+0009 character.

### 1.9 Key Folding and Path Expansion Terms

- IdentifierSegment: A key segment eligible for safe folding and expansion, matching the pattern `^[A-Za-z_][A-Za-z0-9_]*$` (contains only letters, digits, and underscores; does not start with a digit; does not contain dots).
- Path separator: The character used to join/split key segments during folding and expansion. Fixed to `"."` (U+002E, FULL STOP).
- Note: Unquoted keys in TOON remain permissive per §7.3 (`^[A-Za-z_][A-Za-z0-9_.]*$`, allowing dots). IdentifierSegment is a stricter pattern used only for safe folding and expansion eligibility checks.

## 2. Data Model

- TOON models data as:
  - `JsonPrimitive`: string | number | boolean | null
  - `JsonObject`: { [string]: `JsonValue` }
  - `JsonArray`: `JsonValue`[]
- Ordering:
  - Array order MUST be preserved.
  - Object key order MUST be preserved as encountered by the encoder.
- Numbers (canonical form for encoding):
  - Encoders MUST emit numbers in canonical decimal form:
    - No exponent notation (e.g., 1e6 MUST be rendered as 1000000; 1e-6 as 0.000001).
    - No leading zeros except for the single digit "0" (e.g., "05" is not canonical).
    - No trailing zeros in the fractional part (e.g., 1.5000 MUST be rendered as 1.5).
    - If the fractional part is zero after normalization, emit as an integer (e.g., 1.0 → 1).
    - -0 MUST be normalized to 0.
  - Encoders MUST emit sufficient precision to ensure round-trip fidelity within the encoder's host environment: decode(encode(x)) MUST equal x.
  - If the encoder's host environment cannot represent a numeric value without loss (e.g., arbitrary-precision decimals or integers exceeding the host's numeric range), the encoder MAY:
    - Emit a quoted string containing the exact decimal representation to preserve value fidelity, OR
    - Emit a canonical number that round-trips to the host's numeric approximation (losing precision), provided it conforms to the canonical formatting rules above.
  - Encoders SHOULD provide an option to choose lossless stringification for out-of-range numbers.
- Null: Represented as the literal null.

Decoder numeric rules are defined in §4.

## 3. Encoding Normalization (Reference Encoder)

Encoders MUST normalize non-JSON values to the JSON data model before encoding. The mapping from host-specific types to JSON model is implementation-defined and MUST be documented.

- Number:
  - Finite → number (canonical decimal form per §2). -0 → 0.
  - NaN, +Infinity, -Infinity → null.
- Implementations MAY honor host-language–specific serialization hooks (for example, a `toJSON()` method in JavaScript or an equivalent mechanism) as part of host-type normalization. When supported, such hooks SHOULD be applied before other host-type mappings and their behavior MUST be documented by the implementation.
- Examples of host-type normalization (non-normative):
  - Date/time objects → ISO 8601 string representation [ISO8601].
  - Set-like collections → array.
  - Map-like collections → object (with string keys).
  - Undefined, function, symbol, or unrecognized types → null.

See Appendix F for non-normative language-specific examples (Go, JavaScript, Python, Rust).

## 4. Decoding Interpretation (Reference Decoder)

Decoders map text tokens to host values:

- Quoted tokens (strings and keys):
  - MUST be unescaped per §7.1. Any other escape or an unterminated string MUST error.
  - Quoted primitives remain strings even if they look like numbers/booleans/null.
- Unquoted value tokens:
  - true, false, null → booleans/null.
  - Numeric parsing:
    - Decoders MUST accept decimal and exponent forms on input (e.g., `42`, `-3.14`, `1e-6`, `-1E+9`).
    - Decoders MUST treat tokens with forbidden leading zeros in the integer part (e.g., `"05"`, `"0001"`, `"-05"`, `"-0001"`) as strings, not numbers. This rule does **not** apply to a single zero integer part followed by a fractional or exponent part (e.g., `0.5`, `0e1`, `-0.5`, `-0e1`), which are valid numbers.
    - Only finite numbers are expected from conforming encoders.
    - If a decoded numeric token is not representable in the host's default numeric type without loss, implementations MAY return a higher-precision numeric type, return a string, or return an approximate numeric value if that is the documented policy. Implementations MUST document their out-of-range policy; lossless-first is RECOMMENDED for libraries intended for data interchange or validation.
    - Decoding examples:
      - `1.5000` → `1.5` (trailing zeros in fractional part accepted)
      - `-1E+03` → `-1000` (exponent forms accepted)
      - `-0` → `0` (negative zero decodes to zero; most host environments do not distinguish -0 from 0)
  - The literal token `[]` in object field position (`key: []`) and root position (`[]`) decodes as an empty array (§9.1).
  - Otherwise → string.
- Keys:
  - Decoded as strings (quoted keys MUST be unescaped per §7.1).
  - A colon MUST follow a key; missing colon MUST error.

## 5. Concrete Syntax and Root Form

TOON is a deterministic, line-oriented, indentation-based notation.

- Objects:
  - key: value for primitives.
  - key: alone for nested or empty objects (see §8).
- Arrays:
  - Primitive arrays are inline: key[N<delim?>]: v1<delim>v2….
  - Arrays of arrays (primitives): expanded list items under a header: key[N<delim?>]: then "- [M<delim?>]: …".
  - Arrays of objects:
    - Tabular form when uniform and primitive-only: key[N<delim?>]{f1<delim>f2}: then one row per line.
    - Otherwise: expanded list items: key[N<delim?>]: with "- …" items (see §9.4 and §10).
- Root form discovery:
  - If the first non-empty depth-0 line is a valid root array header per §6, decode a root array.
  - Else if the document has exactly one non-empty line and it is the literal token `[]`, decode an empty root array (§9.1).
  - Else if the document has exactly one non-empty line and it is neither a valid array header nor a key-value line (quoted or unquoted key), decode a single primitive (examples: `hello`, `42`, `true`).
  - Otherwise, decode an object.
  - An empty document (no non-empty lines after ignoring trailing newline(s) and ignorable blank lines) decodes to an empty object `{}`.
  - In strict mode, if there are two or more non-empty depth-0 lines that are neither headers nor key-value lines, the document is invalid. Example of invalid input (strict mode):
    ```
    hello
    world
    ```
    This would be two primitives at root depth, which is not a valid TOON document structure.

## 6. Header Syntax (Normative)

Array headers declare length and active delimiter, and optionally field names.

General forms:
- Root header (no key): [N<delim?>]:
- With key: key[N<delim?>]:
- Tabular fields: key[N<delim?>]{field1<delim>field2<delim>…}:

Where:
- N is the non-negative integer length.
- <delim?> is:
  - absent for comma (","),
  - HTAB (U+0009) for tab,
  - "|" for pipe.
- Field names in braces are separated by the same active delimiter and encoded as keys (§7.3).

Spacing and delimiters:
- Every header MUST include a colon after the bracket segment and optional fields segment.
- Encoder whitespace after the colon and decoder tolerance are governed by §12.
- The active delimiter declared by the bracket segment applies to:
  - splitting inline primitive arrays on that header line,
  - splitting tabular field names in "{…}",
  - splitting all rows/items within the header's scope,
  - unless a nested header changes it.
- Decoders MUST split the fields segment and all rows/items in the header's scope using the declared delimiter; other delimiter characters appearing unquoted in row content are literal data and MUST NOT be re-interpreted as structural delimiters.
- Absence of a delimiter symbol in a bracket segment ALWAYS means comma, regardless of any parent header.

Normative header grammar (ABNF):
```
; Core rules per RFC 5234 §B.1 (ALPHA, DIGIT, DQUOTE, HTAB)

bracket-seg   = "[" length [ delimsym ] "]"
length        = "0" / ( %x31-39 *DIGIT )   ; non-negative integer, no leading zeros
delimsym      = HTAB / "|"
; Field names are keys (quoted/unquoted) separated by the active delimiter
fields-seg    = "{" fieldname *( delim fieldname ) "}"
delim         = delimsym / ","
fieldname     = key

header        = [ key ] bracket-seg [ fields-seg ] ":"
key           = unquoted-key / quoted-key
unquoted-key  = ( ALPHA / "_" ) *( ALPHA / DIGIT / "_" / "." )
quoted-key    = DQUOTE *quoted-char DQUOTE
; quoted-char is defined in §7.1
```

Note: The ABNF does not express delimiter equality between the bracket and fields segments; implementations enforce the same-delimiter rule above. Mismatched delimiters MUST error in strict mode.

Note: The grammar above specifies header syntax only. Tabular row disambiguation is defined in §9.3.

Content MUST NOT appear between `]` and `{`/`:`. Invalid bracket lengths (e.g., `[bar]`, `[03]`, `[-1]`) or intervening content (e.g., `[1][bar]:`, `[2]extra:`, `[2] :`) are strict-mode errors; non-strict decoders MAY parse the line as a key-value line, with the key treated as a literal token (not constrained by §7.3's unquoted-key regex).

Decoding requirements:
- The bracket segment MUST parse as a non-negative integer length N with no leading zeros (the single digit `0` is the only canonical form for length zero). Tokens like `[03]` or `[-1]` MUST NOT be interpreted as bracket segments.
- If a trailing tab or pipe appears inside the brackets, it selects the active delimiter; otherwise comma is active.
- If a fields segment occurs between the bracket and the colon, parse field names using the active delimiter; quoted names MUST be unescaped per §7.1.
- A colon MUST follow the bracket and optional fields; missing colon MUST error.

Note: Key folding (§13.4) affects only the key prefix in headers. The header grammar remains unchanged. Example: `data.meta.items[2]{id,name}:` is a valid header with a folded key prefix `data.meta.items`, followed by a standard bracket segment, field list, and colon. Parsing treats folded keys as literal keys; see §13.4 for optional path expansion.

## 7. Strings and Keys

### 7.1 Escaping

In quoted strings and keys, codepoints are encoded according to the following table; rows are matched top-to-bottom, and the first matching row applies. Encoders MUST follow the **Encoder** column; decoders MUST follow the **Decoder** column.

| Codepoint set                                          | Encoder                                       | Decoder                                                         |
|--------------------------------------------------------|-----------------------------------------------|-----------------------------------------------------------------|
| `\` (U+005C)                                           | MUST emit `\\`                                | MUST decode `\\` → `\`                                          |
| `"` (U+0022)                                           | MUST emit `\"`                                | MUST decode `\"` → `"`                                          |
| LF (U+000A)                                            | MUST emit `\n`                                | MUST decode `\n` → LF                                           |
| CR (U+000D)                                            | MUST emit `\r`                                | MUST decode `\r` → CR                                           |
| HTAB (U+0009)                                          | MUST emit `\t`                                | MUST decode `\t` → HTAB                                         |
| Other U+0000–U+001F controls                           | MUST emit `\uXXXX` (lowercase hex SHOULD)     | MUST decode `\uXXXX` (case-insensitive hex)                     |
| U+D800–U+DFFF lone surrogates                          | (not produced by valid encoders)              | MUST reject when decoded from `\uXXXX`                          |
| Other BMP codepoints (U+0020–U+D7FF, U+E000–U+FFFF)    | SHOULD emit literal UTF-8; MAY emit `\uXXXX`  | MUST accept either form                                         |
| Supplementary scalar values (U+10000–U+10FFFF)         | MUST emit as literal UTF-8                    | MUST accept literal UTF-8; surrogate `\uXXXX` escapes MUST be rejected (see row above) |

Decoders MUST reject any escape sequence not listed above, MUST reject `\u` followed by fewer than four hex digits, and MUST reject unterminated strings.

Normative escape grammar:

```abnf
HEXDIG         = DIGIT / %x41-46 / %x61-66
quoted-char    = escaped-char / unescaped-char
unescaped-char = %x09 / %x20-21 / %x23-5B / %x5D-D7FF / %xE000-FFFF
escaped-char   = %x5C ( %x5C / DQUOTE / %x6E / %x72 / %x74 / unicode-escape )
unicode-escape = %x75 4HEXDIG
```

Note: the ABNF lists BMP ranges (≤ U+FFFF) for readability. Supplementary scalars are also valid `unescaped-char` values and are handled per the Supplementary row of the escape table.

Tabs are allowed inside quoted strings and as a declared delimiter; they MUST NOT be used for indentation (§12). Within quoted strings, encoders MUST emit HTAB as `\t` per the escape table above; the literal HTAB in `unescaped-char` expresses decoder leniency only.

### 7.2 Quoting Rules for String Values

A string value MUST be quoted if any of the following is true:
- It is empty ("").
- It has leading or trailing whitespace.
- It equals true, false, or null (case-sensitive).
- It is numeric-like: matches /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i (e.g., "42", "-3.14", "05", "1e-6").
- It contains a colon (:), double quote ("), or backslash (\\).
- It contains brackets or braces ([, ], {, }).
- It contains control characters in U+0000 through U+001F.
- It contains the relevant delimiter (see §11 for complete delimiter rules):
  - For inline array values and tabular row cells: the active delimiter from the nearest array header.
  - For object field values (key: value): the document delimiter, even when the object is within an array's scope.
- It equals "-" or starts with "-" (any hyphen at position 0).

Otherwise, the string MAY be emitted without quotes. Unicode, emoji, and strings with internal (non-leading/trailing) spaces are safe unquoted provided they do not violate the conditions.

### 7.3 Key Encoding

Object keys and tabular field names:
- MAY be unquoted only if they match: ^[A-Za-z_][A-Za-z0-9_.]*$.
- Otherwise, they MUST be quoted and escaped per §7.1.

Keys requiring quoting per the above rules MUST be quoted in all contexts, including array headers (e.g., "my-key"[N]:).

Encoders MAY perform key folding when enabled (see §13.4 for complete folding rules and requirements).

### 7.4 Decoding Rules for Strings and Keys

Decoding of value tokens follows §4 (unquoted type inference, quoted strings, numeric rules). This section adds key-specific requirements:

- Quoted keys MUST be unescaped per §7.1; any other escape MUST error.
- Keys (quoted or unquoted) MUST be followed by ":"; missing colon MUST error (see also §14.2).

## 8. Objects

- Encoding:
  - Primitive fields: key: value (single space after colon).
  - Nested or empty objects: key: on its own line. If non-empty, nested fields appear at depth +1.
  - Key order: Implementations MUST preserve encounter order when emitting fields.
  - An empty object at the root yields an empty document (no lines).
- Dotted keys (e.g., `user.name`) are valid literal keys in TOON. Decoders MUST treat them as single literal keys unless path expansion is explicitly enabled (see §13.4). This preserves backward compatibility and allows safe opt-in expansion behavior.
- Decoding:
  - A line "key:" with nothing after the colon at depth d opens an object; subsequent lines at depth > d belong to that object until the depth decreases to ≤ d.
  - A bare `key:` (no value after the colon) MUST decode as an empty or nested object, NOT an empty array. Empty arrays use the explicit `key: []` form (§9.1).
  - Lines "key: value" at the same depth are sibling fields.
  - Duplicate sibling keys at the same depth: see §14.4 for strict/non-strict behavior.

## 9. Arrays

### 9.1 Primitive Arrays (Inline)

- Encoding:
  - Non-empty arrays: `key[N<delim?>]: v1<delim>v2<delim>…` where each vi is encoded as a primitive (§7) with delimiter-aware quoting.
  - Empty arrays (object field position): encoders SHOULD emit `key: []`. Encoders MAY emit the legacy header form `key[0<delim?>]:` for backward compatibility.
  - Empty arrays (root position): encoders SHOULD emit `[]` on its own line. Encoders MAY emit the legacy `[0<delim?>]:` form.
  - Root arrays: `[N<delim?>]: v1<delim>…`
- Decoding:
  - Split using the active delimiter declared by the header (§11.2).
  - When splitting inline arrays, empty tokens (including those surrounded by whitespace) decode to the empty string.
  - In strict mode, the number of decoded values MUST equal N; otherwise MUST error.
  - Empty arrays: decoders MUST accept `key: []`, `[]`, and the legacy forms `key[0<delim?>]:` and `[0<delim?>]:` as empty arrays.

### 9.2 Arrays of Arrays (Primitives Only) – Expanded List

- Encoding:
  - Parent header: `key[N<delim?>]:` on its own line.
  - Each inner primitive array is a list item:
    - `- [M<delim?>]: v1<delim>v2<delim>…`
    - Empty inner arrays: `- [0<delim?>]:`
    - The `key: []` field-level form (§9.1) does NOT apply to list-item inner arrays.
- Decoding:
  - Items appear at depth +1, each starting with "- " and an inner array header `[M<delim?>]: …`.
  - Inner arrays are split using their own active delimiter; in strict mode, counts MUST match M.
  - In strict mode, the number of list items MUST equal outer N.

### 9.3 Arrays of Objects – Tabular Form

Tabular detection (encoding; MUST hold for all elements):
- Every element is an object.
- Each object has at least one key; arrays containing any empty object `{}` MUST NOT use tabular form (encode via §9.4 instead).
- All objects have the same set of keys (order per object MAY vary).
- All values across these keys are primitives (no nested arrays/objects).

When satisfied (encoding):
- Header: `key[N<delim?>]{f1<delim>f2<delim>…}:` where field order is the first object's key encounter order.
- Field names encoded per §7.3.
- Rows: one line per object at depth +1 under the header; values are encoded primitives (§7) and joined by the active delimiter.
- Root tabular arrays omit the key: `[N<delim?>]{…}:` followed by rows.

Decoding:
- A tabular header declares the active delimiter and ordered field list.
- Rows appear at depth +1 as delimiter-separated value lines.
- Strict mode MUST enforce:
  - Each row's value count equals the field count.
  - The number of rows equals N.
- Disambiguation at row depth (unquoted tokens):
  - Compute the first unquoted occurrence of the active delimiter and the first unquoted colon.
  - If a same-depth line has no unquoted colon → row.
  - If both appear, compare first-unquoted positions:
    - Delimiter before colon → row.
    - Colon before delimiter → key-value line (end of rows).
  - If a line has an unquoted colon but no unquoted active delimiter → key-value line (end of rows).
- When a tabular array appears as the first field of a list-item object, indentation is governed by §10.

### 9.4 Mixed / Non-Uniform Arrays – Expanded List

When tabular requirements are not met (encoding):
- Header: `key[N<delim?>]:`
- Each element is rendered as a list item at depth +1 under the header:
  - Primitive: `- <primitive>`
  - Primitive array: `- [M<delim?>]: v1<delim>…`
  - Array of objects or non-uniform array: `- [M<delim?>]:` on the hyphen line, followed by the nested array's list items at depth +1 relative to the hyphen line (i.e. +2 from the outer array header). Items are encoded recursively per §9.1–§9.4 as each item's shape requires; tabular form (§9.3) is not available in this position (the field list has no place to appear) – encoders MUST use the expanded list form.
  - Object: formatted per §10 (objects as list items).

Decoding:
- Header declares list length N and the active delimiter for any nested inline arrays.
- Each list item starts with "- " at depth +1 (or the bare marker "-" for an empty object list item, §10) and is parsed as:
  - Primitive (no colon and no array header),
  - Inline primitive array (`- [M<delim?>]: …`),
  - Object with first field on the hyphen line (`- key: …` or `- key[N…]{…}: …`),
  - Or nested arrays via nested headers.
- In strict mode, the number of list items MUST equal N.

## 10. Objects as List Items

For an object appearing as a list item:

- Empty object list item: a single "-" at the list-item indentation level.
- Encoding (normative):
  - When a list-item object has a tabular array (§9.3) as its first field in encounter order, encoders MUST emit the tabular header on the hyphen line:
    - The hyphen and tabular header appear on the same line at the list-item depth: `- key[N<delim?>]{fields}:`
    - Tabular rows MUST appear at depth +2 (relative to the hyphen line).
    - All other fields of the same object MUST appear at depth +1 under the hyphen line, in encounter order, using normal object field rules (§8).
    - Encoders MUST NOT emit tabular rows at depth +1 or sibling fields at the same depth as rows when the first field is a tabular array.
  - For all other cases (first field is not a tabular array), encoders SHOULD place the first field on the hyphen line. A bare hyphen on its own line is used only for empty list-item objects.
- Decoding (normative):
  - When a decoder encounters a list-item line of the form `- key[N<delim?>]{fields}:` at depth d, it MUST treat this as the start of a tabular array field named key in the list-item object.
  - Lines at depth d+2 that conform to tabular row syntax (§9.3) are rows of that tabular array.
  - Lines at depth d+1 are additional fields of the same list-item object; the presence of a line at depth d+1 after rows terminates the rows.
  - All other object-as-list-item patterns (bare hyphen, first field on hyphen line for non-tabular values) are decoded according to the general rules in §8 and §9.

## 11. Delimiters

- Supported delimiters:
  - Comma (default): header omits the delimiter symbol.
  - Tab: header includes HTAB inside brackets and braces (e.g., `[N<TAB>]`, `{a<TAB>b}`); rows/inline arrays use tabs.
  - Pipe: header includes "|" inside brackets and braces; rows/inline arrays use "|".

### 11.1 Encoding Rules

- Document delimiter: Encoders select a document delimiter (option: comma, tab, pipe; default comma) that influences quoting for all object field values (key: value) throughout the document.
- Active delimiter: Inside an array header's scope, the active delimiter governs quoting only for inline array values and tabular row cells.
- Delimiter-aware quoting:
  - Inline array values and tabular row cells: strings containing the active delimiter MUST be quoted.
  - Object field values (key: value): encoders use the document delimiter to decide delimiter-aware quoting, regardless of whether the object appears within an array's scope.
  - Strings containing non-active delimiters do not require quoting unless another condition applies (§7.2).

### 11.2 Decoding Rules

- Delimiter-aware parsing:
  - Inline arrays and tabular rows MUST be split only on the active delimiter declared by the nearest array header.
  - Splitting MUST preserve empty tokens; surrounding spaces are trimmed, and empty tokens decode to the empty string.
  - Nested headers may change the active delimiter; decoding MUST use the delimiter declared by the nearest header.
- Object field values (key: value): Decoders parse the entire post-colon token as a single value; document delimiter is not a decoder concept.

## 12. Indentation and Whitespace

- Encoding:
  - Encoders MUST use a consistent number of spaces per level (default 2; configurable).
  - Tabs MUST NOT be used for indentation.
  - Encoders MUST emit exactly one ASCII space (U+0020) after the colon in key: value lines.
  - Encoders MUST emit exactly one ASCII space (U+0020) after array headers when followed by inline values.
  - Encoders MUST NOT emit trailing spaces at the end of any line.
  - Encoders MUST NOT emit a trailing newline at the end of the document.
- Decoding:
  - Strict mode:
    - The number of leading spaces on a line MUST be an exact multiple of indentSize; otherwise MUST error.
    - Tabs used as indentation MUST error (see §7.1 for tabs in quoted strings and as the HTAB delimiter).
  - Non-strict mode:
    - Depth MAY be computed as floor(indentSpaces / indentSize).
    - Implementations MAY accept tab characters in indentation. Depth computation for tabs is implementation-defined. Implementations MUST document their tab policy.
  - Surrounding whitespace around tokens SHOULD be tolerated; internal semantics follow quoting rules.
  - Blank lines:
    - A line whose content trims to empty MAY be treated as blank regardless of leading-space count.
    - Outside arrays/tabular rows: decoders SHOULD ignore completely blank lines (do not create/close structures).
    - Inside arrays/tabular rows: in strict mode, MUST error; in non-strict mode, MAY be ignored and not counted as a row/item.
  - Trailing newline at end-of-file: decoders SHOULD accept; validators MAY warn.

## 13. Conformance and Options

Encoders, decoders, and validators each have a per-class checklist below (§13.1–§13.3). Conforming implementations MUST satisfy every applicable item.

Options:
- Encoder options:
  - indent (default: 2 spaces)
  - delimiter (document delimiter; default: comma; alternatives: tab, pipe)
  - keyFolding (default: `"off"`; alternatives: `"safe"`)
  - flattenDepth (default: Infinity when keyFolding is `"safe"`; non-negative integer; values less than 2 have no practical effect)
- Decoder options:
  - indent (default: 2 spaces)
  - strict (default: `true`)
  - expandPaths (default: `"off"`; alternatives: `"safe"`)

Strict-mode errors are enumerated in §14; validators MAY add informative diagnostics for style and encoding invariants.

### 13.1 Encoder Conformance Checklist

Conforming encoders MUST:
- [ ] Produce UTF-8 output with LF (U+000A) line endings (§1.2)
- [ ] Use consistent indentation (default 2 spaces, no tabs) (§12)
- [ ] Escape per §7.1 in quoted strings; never emit other escapes
- [ ] Quote strings per §7.2 (the relevant delimiter is governed by §11.1: document delimiter for object-field values, active delimiter for inline array values and tabular row cells)
- [ ] Emit array lengths [N] matching actual item count (§6, §9)
- [ ] Preserve object key order as encountered (§2)
- [ ] Normalize numbers to non-exponential decimal form (§2)
- [ ] Convert -0 to 0 (§2)
- [ ] Convert NaN/±Infinity to null (§3)
- [ ] Emit no trailing spaces or trailing newline (§12)
- [ ] When `keyFolding="safe"`, folding MUST comply with §13.4 (IdentifierSegment validation, collision avoidance)
- [ ] When `flattenDepth` is set, folding MUST stop at the configured segment count (§13.4)

### 13.2 Decoder Conformance Checklist

Conforming decoders MUST:
- [ ] Parse array headers per §6 (length, delimiter, optional fields)
- [ ] Accept empty arrays in both forms: `key: []` / `[]` and legacy `key[0]:` / `[0]:` (§9.1)
- [ ] Split inline arrays and tabular rows using active delimiter only (§11)
- [ ] Unescape per §7.1
- [ ] Type unquoted primitives: true/false/null → booleans/null, numeric → number, else → string (§4)
- [ ] Enforce strict-mode rules when `strict=true` (§14)
- [ ] Preserve array order and object key order (§2)
- [ ] When `expandPaths="safe"`, expansion MUST follow §13.4 (IdentifierSegment-only segments, deep merge, conflict rules)
- [ ] When `expandPaths="safe"` with `strict=true`, MUST error on expansion conflicts per §14.3
- [ ] When `expandPaths="safe"` with `strict=false`, apply LWW conflict resolution (§13.4)

### 13.3 Validator Conformance Checklist

Validators SHOULD verify:
- [ ] Structural conformance (headers, indentation, list markers)
- [ ] Whitespace invariants (no trailing spaces/newlines)
- [ ] Delimiter consistency between headers and rows
- [ ] Array length counts match declared [N]
- [ ] All strict-mode requirements (§14)

### 13.4 Key Folding and Path Expansion

Key folding and path expansion are optional transformations for compact dotted-path notation. Both default to `"off"`.

#### Encoder: Key Folding

Key folding allows encoders to collapse chains of single-key objects into dotted-path notation, reducing verbosity for deeply nested structures.

Mode: `"off"` | `"safe"` (default: `"off"`)
- `"off"`: No folding is performed. All objects are encoded with standard nesting.
- `"safe"`: Fold eligible chains according to the rules below.

flattenDepth: The maximum number of segments from K1 to include in the folded path (default: Infinity when keyFolding is `"safe"`; values less than 2 have no practical effect).
- A value of 2 folds the first two segments of an eligible chain: `{a: {b: val}}` → `a.b: val`; longer chains continue nested below the folded key.
- A value of Infinity folds entire eligible chains: `{a: {b: {c: val}}}` → `a.b.c: val`.

Foldable chain: A chain of L segments K1 → K2 → ... → KL is foldable when:
- Each Ki (where 1 ≤ i < L) is an object with exactly one key Ki+1.
- The chain stops at the first non-single-key object or when encountering a leaf value.
- Arrays are not considered single-key objects; a chain stops at arrays.
- The leaf value at KL is either a primitive, an array, or an empty object.

Safe mode requirements (all MUST hold for a chain to be folded):
1. All folded segments K1 through Kd (where d = min(L, flattenDepth)) MUST be IdentifierSegments (§1.9): matching `^[A-Za-z_][A-Za-z0-9_]*$`.
2. The resulting folded key string MUST NOT equal any existing sibling literal key at the same object depth (collision avoidance).

Folding process:
- For a foldable chain of L segments, determine d = min(L, flattenDepth).
- Fold segments K1 through Kd into a single key: `K1.K2.....Kd`.
- If d < L, emit the remaining structure (Kd+1 through KL) as normal nested objects.
- The leaf value at KL is encoded normally (primitive, array, or empty object).

Examples:
- `{a: {b: {c: 1}}}` with safe mode, depth=Infinity → `a.b.c: 1`
- `{a: {b: {c: {d: 1}}}}` with safe mode, depth=2 → produces `a.b:` followed by nested `c:` and `d: 1` at appropriate depths
- `{data: {"full-name": {x: 1}}}` → safe mode skips (segment `"full-name"` is not an IdentifierSegment); emits standard nested structure

#### Decoder: Path Expansion

Path expansion allows decoders to split dotted keys into nested object structures, enabling round-trip compatibility with folded encodings.

Mode: `"off"` | `"safe"` (default: `"off"`)
- `"off"`: Dotted keys are treated as literal keys. No expansion is performed.
- `"safe"`: Expand eligible dotted keys according to the rules below.

Safe mode behavior:
- Any unquoted key containing the path separator (`.`) is considered for expansion; quoted keys remain literal after unescaping.
- Split the key into segments at each occurrence of `.`.
- Only expand when ALL resulting segments are IdentifierSegments (§1.9).
- Keys that do not meet the expansion criteria remain as literal keys.

Deep merge semantics:
When multiple expanded keys construct overlapping object paths, the decoder MUST merge them recursively:
- Object + Object: Deep merge recursively (recurse into nested keys and apply these rules).
- Object + Non-object (array or primitive): This is a conflict. Apply conflict resolution policy.
- Array + Array or Primitive + Primitive: This is a conflict. Apply conflict resolution policy. Arrays are never merged element-wise.
- Key ordering: During expansion, newly created keys are inserted in encounter order (the order they appear in the document). When merging creates nested keys, keys from later lines are appended after existing keys at the same depth. This ensures deterministic, predictable key order in the resulting object.

Conflict resolution:
- Conflict definition: A conflict occurs when expansion requires an object at a given path but finds a non-object value (array or primitive), or vice versa. A conflict also occurs when a final leaf key already exists with a non-object value that must be overwritten.
- `strict=true` (default): Decoders MUST error on any conflict. This ensures data integrity and catches structural inconsistencies.
- `strict=false`: Last-write-wins (LWW) conflict resolution: keys appearing later in document order (encounter order during parsing) overwrite earlier values. This provides deterministic behavior for lenient parsing.

Application order: Path expansion is applied AFTER all base parsing rules (§4–12) have been applied and BEFORE the final decoded value is returned to the caller. Structural validations enumerated in §14 (strict-mode errors for array counts, indentation, etc.) operate on the pre-expanded structure and remain unaffected by expansion.

Examples:
- Input: `data.meta.items[2]: a,b` with `expandPaths="safe"` → Output: `{"data": {"meta": {"items": ["a", "b"]}}}`
- Input: `user.name: Ada` with `expandPaths="off"` → Output: `{"user.name": "Ada"}`
- Input: `a.b.c: 1` and `a.b.d: 2` and `a.e: 3` with `expandPaths="safe"` → Output: `{"a": {"b": {"c": 1, "d": 2}, "e": 3}}` (deep merge)
- Input: `a.b: 1` then `a: 2` with `expandPaths="safe"` and `strict=true` → Error: "Expansion conflict at path 'a' (object vs primitive)"
- Input: `a.b: 1` then `a: 2` with `expandPaths="safe"` and `strict=false` → Output: `{"a": 2}` (LWW)

## 14. Strict Mode Errors and Diagnostics (Authoritative Checklist)

When strict mode is enabled (default), decoders MUST error on the following conditions.

### 14.1 Array Count and Width Mismatches

- Inline primitive arrays: decoded value count ≠ declared N.
- List arrays: number of list items ≠ declared N.
- Tabular arrays: number of rows ≠ declared N.
- Tabular row width mismatches: any row's value count ≠ field count.
- The count checks above apply only when an explicit `[N]` length is declared. The `key: []` form has no declared length; the count check is N/A (§9.1).

### 14.2 Syntax and Structural Errors

- Missing colon in key context.
- Invalid escape sequences or unterminated strings in quoted tokens.
- Header delimiter mismatch (§6): MUST error as a header syntax error, independent of row width/count checks.
- Malformed bracket lengths in headers (e.g., `[03]`, `[-1]`, `[bar]`); see §6.
- Any content between a valid bracket segment and the colon (or fields segment) prevents array-header interpretation; decoders MUST NOT silently discard that content. In strict mode, decoders MUST error (see §6); in non-strict mode, decoders MAY fall through to key-value parsing.
- Indentation and blank-line invariants per §12 (leading-space multiple of indentSize; no tabs in indentation; no blank lines inside arrays/tabular rows).
- Two or more non-empty depth-0 lines that are neither headers nor key-value lines (§5).

### 14.3 Path Expansion Conflicts

When `expandPaths="safe"` is enabled:
- With `strict=true` (default): Decoders MUST error on any expansion conflict.
- With `strict=false`: Decoders MUST apply deterministic last-write-wins (LWW) resolution in document order. Implementations MUST resolve conflicts silently and MUST NOT emit diagnostics during normal decode operations.

See §13.4 for complete conflict definitions, deep-merge semantics, and examples.

Note (informative): Implementations MAY expose conflict diagnostics via out-of-band mechanisms (e.g., debug hooks, verbose CLI flags, or separate validation APIs), but such facilities are non-normative and MUST NOT affect default decode behavior or output.

### 14.4 Duplicate Object Keys

When two or more sibling fields at the same depth share the same literal key (independent of `expandPaths`):

- With `strict=true` (default): Decoders MUST error.
- With `strict=false`: Decoders MUST apply deterministic last-write-wins (LWW) resolution in document order, silently (no diagnostic).

This mirrors §14.3.

## 15. Security Considerations

- Injection and ambiguity are mitigated by the quoting rules in §7.2; in particular, strings containing colons, the relevant delimiter (document or active), hyphen markers ("-" or strings starting with "-"), double quotes, backslashes, control characters, or brackets/braces MUST be quoted.
- Strict-mode checks (§14) detect malformed strings, truncation, or injected rows/items via length and width mismatches.
- Encoders SHOULD avoid excessive memory on large inputs; implement streaming/tabular row emission where feasible.
- Control characters in quoted strings (`\uXXXX`, §7.1) are preserved as data values; encoders MUST NOT strip them during normalization. Note (informative): downstream consumers that render decoded values into terminals, logs, or markup contexts are advised to sanitize or escape control characters at that boundary, since TOON preserves them faithfully as data.
- Unicode:
  - Encoders SHOULD avoid altering Unicode beyond required escaping; decoders SHOULD accept valid UTF-8 in quoted strings/keys (with the escape repertoire defined in §7.1).

## 16. Internationalization

- Full Unicode is supported in keys and values, subject to quoting and escaping rules.
- Encoders MUST NOT apply locale-dependent formatting for numbers or booleans (e.g., no thousands separators).

## 17. IANA Considerations

This specification does not request IANA registration at this time.

- Provisional media type: `text/toon`
- File extension: `.toon`
- Charset: always UTF-8; the `charset=utf-8` parameter may be specified and is assumed if absent.

When this specification reaches Candidate Standard status, formal registration will be requested following the procedures defined in [RFC6838]. The full RFC6838 template will be added at that time. The `text/toon` designation is provisional and may change before formal registration.

## 18. Versioning and Extensibility

For versioning policy and version history, see [VERSIONING.md](./VERSIONING.md) and [CHANGELOG.md](./CHANGELOG.md).

### Extensibility

- Backward-compatible evolutions should preserve current headers, quoting rules, and indentation semantics.
- Reserved/structural characters (colon, brackets, braces, hyphen) retain their current meanings across versions.
- The path separator is fixed to `"."` (see §1.9).

## 19. Intellectual Property Considerations

This specification is released under the MIT License (see repository and Appendix E for details). No patent disclosures are known at the time of publication. The authors intend this specification to be freely implementable without royalty requirements.

Implementers should be aware that this is a community specification and not a formal standards-track document from a recognized standards body (such as IETF, W3C, or ISO). No formal patent review process has been conducted. Implementers are responsible for conducting their own intellectual property due diligence as appropriate for their use case.

## Appendix A: Examples (Informative)

Objects:
```
id: 123
name: Ada
active: true
```

Nested objects:
```
user:
  id: 123
  name: Ada
```

Primitive arrays:
```
tags[3]: admin,ops,dev
```

Arrays of arrays (primitives):
```
pairs[2]:
  - [2]: 1,2
  - [2]: 3,4
```

Tabular arrays:
```
items[2]{sku,qty,price}:
  A1,2,9.99
  B2,1,14.5
```

Mixed arrays:
```
items[3]:
  - 1
  - a: 1
  - text
```

Objects as list items (first field on hyphen line):
```
items[2]:
  - id: 1
    name: First
  - id: 2
    name: Second
    extra: true
```

Nested tabular inside a list item:
```
items[1]:
  - users[2]{id,name}:
      1,Ada
      2,Bob
    status: active
```

Note: When a list-item object has a tabular array as its first field, encoders emit the tabular header on the hyphen line with rows at depth +2 and other fields at depth +1. This is the canonical encoding for list-item objects whose first field is a tabular array.

Delimiter variations:
```
items[2	]{sku	name	qty	price}:
  A1	Widget	2	9.99
  B2	Gadget	1	14.5

tags[3|]: reading|gaming|coding
```

Quoted colons and disambiguation (rows continue; colon is inside quotes):
```
links[2]{id,url}:
  1,"http://a:b"
  2,"https://example.com?q=a:b"
```

Error cases (invalid TOON):
```
key value

name: "bad\xescape"

items[1]:
   - value

items[3]{id,name}:
  1,Alice
  2,Bob

tags[5]: a,b,c
```

Edge cases:
```
name: ""

tags: []

version: "123"
enabled: "true"

root:
  level1:
    level2:
      level3:
        items[2]{id,val}:
          1,a
          2,b

message: Hello 世界 👋
tags[3]: 🎉,🎊,🎈

bignum: 9007199254740992
decimal: 0.3333333333333333
```

Quoted keys with arrays (keys requiring quoting per §7.3):
```
"my-key"[3]: 1,2,3

"x-items"[2]{id,name}:
  1,Ada
  2,Bob

"x-items"[2]:
  - id: 1
  - id: 2
    label: archived
```

Key folding and path expansion:

Encoding - basic folding (safe mode, depth=Infinity):

Input: `{"a": {"b": {"c": 1}}}`
```
a.b.c: 1
```

Encoding - folding with inline array:

Input: `{"data": {"meta": {"items": ["x", "y"]}}}`
```
data.meta.items[2]: x,y
```

Encoding - folding with tabular array:

Input: `{"a": {"b": {"items": [{"id": 1, "name": "A"}, {"id": 2, "name": "B"}]}}}`
```
a.b.items[2]{id,name}:
  1,A
  2,B
```

Encoding - partial folding (flattenDepth=2):

Input: `{"a": {"b": {"c": {"d": 1}}}}`
```
a.b:
  c:
    d: 1
```

Decoding - basic expansion (safe mode round-trip):

Input: `data.meta.items[2]: a,b` with options `{expandPaths: "safe"}`

Output: `{"data": {"meta": {"items": ["a", "b"]}}}`

Decoding - deep merge (multiple expanded keys):

Input with options `{expandPaths: "safe"}`:
```
a.b.c: 1
a.b.d: 2
a.e: 3
```
Output: `{"a": {"b": {"c": 1, "d": 2}, "e": 3}}`

Decoding - conflict error (strict=true, default):

Input with options `{expandPaths: "safe", strict: true}`:
```
a.b: 1
a: 2
```
Result: Error - "Expansion conflict at path 'a' (object vs primitive)"

Decoding - conflict LWW (strict=false):

Input with options `{expandPaths: "safe", strict: false}`:
```
a.b: 1
a: 2
```
Output: `{"a": 2}`

## Appendix B: Parsing Helpers (Informative)

These sketches illustrate structure and common decoding helpers. They are informative; normative behavior is defined in §1–§16 (per §1.1).

### B.1 Decoding Overview

- Split input into lines; compute depth from leading spaces and indent size (§12).
- Skip ignorable blank lines outside arrays/tabular rows (§12).
- Decide root form per §5.
- For objects at depth d: process lines at depth d; for arrays at depth d: read rows/list items at depth d+1.

### B.2 Array Header Parsing

- Identify the optional key prefix first (quoted: a `"…"` literal at line start; unquoted: characters up to the first `[`). The bracket segment `[ … ]` begins at the first `[` after the key; parse:
  - Length N as decimal integer.
  - Optional delimiter symbol at the end: HTAB or pipe (comma otherwise).
- If a "{ … }" fields segment occurs between the "]" and the ":", parse field names using the active delimiter; unescape quoted names.
- Require a colon ":" after the bracket/fields segment.
- Return the header (key?, length, delimiter, fields?) and any inline values after the colon.
- Absence of a delimiter symbol in the bracket segment ALWAYS means comma for that header (no inheritance).

### B.3 parseDelimitedValues

- Iterate characters left-to-right while maintaining a current token and an inQuotes flag.
- On a double quote, toggle inQuotes.
- While inQuotes, treat backslash + next char as a literal pair (string parser validates later).
- Only split on the active delimiter when not in quotes (unquoted occurrences).
- Trim surrounding spaces around each token. Empty tokens decode to empty string.

### B.4 Primitive Token Parsing

- If token starts with a quote, it must be a properly quoted string (no trailing characters after the closing quote). Unescape per §7.1; otherwise error.
- Else if token is true/false/null → boolean/null.
- Else if token is numeric without forbidden leading zeros and finite → number.
  - Examples: `1.5000` → `1.5`, `-1E+03` → `-1000`, `-0` → `0` (host normalization applies)
- Else → string.

### B.5 Object and List Item Parsing

- Key-value line: parse a key up to the first colon; missing colon → error. The remainder of the line is the primitive value (if present).
  - If the remainder is exactly `[]` → empty array (§9.1).
- Nested object: "key:" with nothing after colon opens a nested object. If this is:
  - A field inside a regular object: nested fields are at depth +1 relative to that line.
  - The first field on a list-item hyphen line: nested fields at depth +2 relative to the hyphen line; subsequent fields at +1.
- List items:
  - Lines start with "- " at one deeper depth than the parent array header (or the bare marker "-" for an empty object list item, §10).
  - After "- ":
    - If "[ … ]:" appears → inline array item; decode with its own header and active delimiter.
    - Else if a colon appears → object with first field on hyphen line.
    - Else → primitive token.

### B.6 Blank-Line Handling

- Track blank lines during scanning with line numbers and depth.
- For arrays/tabular rows:
  - In strict mode, any blank line between the first and last item/row line errors.
  - In non-strict mode, blank lines may be ignored and not counted as items/rows.
- Outside arrays/tabular rows:
  - Blank lines should be ignored (do not affect root-form detection or object boundaries).

## Appendix C: Test Suite and Compliance (Informative)

A language-agnostic reference test suite is maintained at [tests/](./tests/); see [tests/README.md](./tests/README.md) for the per-fixture index. The suite is versioned alongside this specification. Implementations are encouraged to validate against it, but conformance is determined solely by adherence to the normative requirements in Sections 1–16; test coverage does not define the specification.

Host-type normalization tests (e.g., BigInt, Date, Set, Map) are language-specific and maintained in implementation repositories. See Appendix F for normalization guidance.

## Appendix D: Document Changelog (Informative)

See [`CHANGELOG.md`](./CHANGELOG.md) for the version history.

## Appendix E: Acknowledgments and License

### Author

This specification was created and is maintained by Johann Schopplich, who also maintains the reference TypeScript/JavaScript implementation.

### Community Implementations

Implementations of TOON in other languages have been created by community members. For a complete list with repository links and maintainer information, see the [Other Implementations](https://github.com/toon-format/toon#other-implementations) section of the README.

### License

This specification and reference implementation are released under the MIT License (see repository for details).

---

## Appendix F: Host Type Normalization Examples (Informative)

This appendix provides non-normative guidance on how implementations in different programming languages may normalize host-specific types to the JSON data model before encoding. Normative behavior is defined in §3.

### F.1 Go

Go implementations commonly normalize the following host types:

Numeric Types:
- `big.Int`: If within `int64` range, convert to number. Otherwise, convert to quoted decimal string per lossless policy.
- `math.Inf()`, `math.NaN()`: Convert to `null`.

Temporal Types:
- `time.Time`: Convert to ISO 8601 string via `.Format(time.RFC3339)` or `.Format(time.RFC3339Nano)`.

Collection Types:
- `map[K]V`: Convert to object. Keys must be strings or convertible to strings via `fmt.Sprint`.
- `[]T` (slices): Preserve as array.

Struct Types:
- Structs with exported fields: Convert to object using JSON struct tags if present.

Non-Serializable Types:
- `nil`: Maps to `null`.
- Functions, channels, `unsafe.Pointer`: Not serializable; implementations should error or skip these fields.

### F.2 JavaScript

JavaScript implementations commonly normalize the following host types:

Numeric Types:
- `BigInt`: If the value is within `Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`, convert to `number`. Otherwise, convert to a quoted decimal string (e.g., `BigInt(9007199254740993)` → `"9007199254740993"`).
- `NaN`, `Infinity`, `-Infinity`: Convert to `null`.
- `-0`: Normalize to `0`.

Temporal Types:
- `Date`: Convert to ISO 8601 string via `.toISOString()` (e.g., `"2025-01-01T00:00:00.000Z"`).

Collection Types:
- `Set`: Convert to array by iterating entries and normalizing each element.
- `Map`: Convert to object using `String(key)` for keys and normalizing values recursively. Non-string keys are coerced to strings.

Object Types:
- Objects with a `toJSON()` method: Call `value.toJSON()` and then normalize the returned value recursively before encoding. This allows domain objects to override default normalization behavior in a controlled, deterministic way (similar to `JSON.stringify`). Implementations should guard against `toJSON()` returning the same object (to avoid infinite recursion) and may fall back to default normalization in that case.
- Plain objects: Enumerate own enumerable string keys in encounter order; normalize values recursively.

Non-Serializable Types:
- `undefined`, `function`, `Symbol`: Convert to `null`.

### F.3 Python

Python implementations commonly normalize the following host types:

Numeric Types:
- `decimal.Decimal`: Convert to `float` if representable without loss, OR convert to quoted decimal string for exact preservation (implementation policy).
- `float('inf')`, `float('-inf')`, `float('nan')`: Convert to `null`.
- Arbitrary-precision integers (large `int`): Emit as number if within host numeric range, OR as quoted decimal string per lossless policy.

Temporal Types:
- `datetime.datetime`, `datetime.date`, `datetime.time`: Convert to ISO 8601 string representation via `.isoformat()`.

Collection Types:
- `set`, `frozenset`: Convert to list (array).
- `dict`: Preserve as object with string keys. Non-string keys must be coerced to strings.

Object Types:
- Custom objects: Extract attributes via `__dict__` or implement custom serialization; convert to object (dict) with string keys.

Non-Serializable Types:
- `None`: Maps to `null`.
- Functions, lambdas, modules: Convert to `null`.

### F.4 Rust

Rust implementations commonly normalize the following host types (typically using serialization frameworks like `serde`):

Numeric Types:
- `i128`, `u128`: If within `i64`/`u64` range, emit as number. Otherwise, convert to quoted decimal string per lossless policy.
- `f64::INFINITY`, `f64::NEG_INFINITY`, `f64::NAN`: Convert to `null`.

Temporal Types:
- `chrono::DateTime<T>`: Convert to ISO 8601 string via `.to_rfc3339()`.
- `chrono::NaiveDate`, `chrono::NaiveTime`: Convert to ISO 8601 partial representations.

Collection Types:
- `HashSet<T>`, `BTreeSet<T>`: Convert to `Vec<T>` (array).
- `HashMap<K, V>`, `BTreeMap<K, V>`: Convert to object. Keys must be strings or convertible to strings via `Display` or `ToString`.

Enum Types:
- Unit variants: Convert to string of variant name (e.g., `Color::Red` → `"Red"`).
- Tuple/struct variants: Typically convert to object with `"type"` field and data fields per `serde` conventions.

Non-Serializable Types:
- `Option::None`: Convert to `null`.
- `Option::Some(T)`: Unwrap and normalize `T`.
- Function pointers, raw pointers: Not serializable; implementations should error or skip these fields.

### F.5 General Guidance

Implementations in any language should:
1. Document their normalization policy clearly, especially for:
  - Large or arbitrary-precision numbers (lossless string vs. approximate number)
  - Date/time representations (ISO 8601 format details)
  - Collection type mappings (order preservation for sets)
2. Provide configuration options where multiple strategies are reasonable (e.g., lossless vs. approximate numeric encoding).
3. Ensure that normalization is deterministic: encoding the same host value twice produces identical TOON output.

