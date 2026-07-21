# TOON Specification

## Token-Oriented Object Notation

**Version:** 4.0 (unreleased draft)

**Date:** Unreleased

**Status:** Working Draft

**Author:** Johann Schopplich ([@johannschopplich](https://github.com/johannschopplich))

**License:** MIT

---

## Abstract

Token-Oriented Object Notation (TOON) is a line-oriented, indentation-based text format that encodes the JSON data model with explicit structure and minimal quoting. Arrays declare their length and an optional field list once; rows use a single active delimiter (comma, tab, or pipe). Objects use indentation instead of braces; strings are quoted only when required. This specification defines TOON's concrete syntax, canonical number formatting, delimiter scoping, and strict-mode validation, and sets conformance requirements for encoders, decoders, and validators. TOON provides a deterministic representation of structured data, with tabular syntax for arrays of uniform objects.

## Status of This Document

This document is a Working Draft v4.0 and may be updated, replaced, or obsoleted. Implementers should monitor the canonical repository at https://github.com/toon-format/spec for changes.

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
- inline or trailing comments and annotations (full-line comment lines are decode-side syntax, §5.1),
- alternative number systems or locale-specific formatting,
- user-defined escape sequences or control directives.

### Relationship to JSON, CSV, and YAML (Informative)

- **JSON**: TOON preserves the JSON data model. It is more compact for uniform arrays of objects by declaring length and fields once. For non-uniform or deeply nested data, JSON may be more efficient.
- **CSV/TSV**: CSV is typically more compact for flat tables but lacks nesting and type awareness. TOON adds explicit lengths, per-array delimiter scoping, inline field lists (no separate header row), and deterministic quoting, while remaining lightweight.
- **YAML**: TOON uses indentation and hyphen markers but is more constrained and deterministic: full-line comments only (stripped by decoders, never emitted by encoders; §5.1), explicit array headers with lengths, fixed quoting rules, and a narrow escape set.

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
- Field list: Brace-enclosed, delimiter-separated list of field entries for tabular arrays: {f1<delim>f2}. A field entry MAY carry its own nested field group (§9.3).
- Nested field group: A field list attached to a field name inside a tabular header (e.g., customer{name,country}), declaring a nested-uniform column (§9.3).
- Leaf field: A field entry without a nested field group. Row cells map one-to-one to leaf fields in depth-first header order (§9.3).
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

## 2. Data Model

- TOON models data as:
  - `JsonPrimitive`: string | number | boolean | null
  - `JsonObject`: { [string]: `JsonValue` }
  - `JsonArray`: `JsonValue`[]
- Ordering:
  - Array order MUST be preserved.
  - Object key order MUST be preserved as encountered by the encoder.
- Numbers (canonical form for encoding):
  - Encoders MUST emit finite numbers in canonical decimal form when n = 0, or when 1e-6 ≤ |n| < 1e21:
    - No exponent notation (e.g., 1e6 MUST be rendered as 1000000; 1e-6 as 0.000001).
    - No leading zeros except for the single digit "0" (e.g., "05" is not canonical).
    - No trailing zeros in the fractional part (e.g., 1.5000 MUST be rendered as 1.5).
    - If the fractional part is zero after normalization, emit as an integer (e.g., 1.0 → 1).
    - -0 MUST be normalized to 0.
  - For finite numbers outside the canonical range above (non-zero |n| < 1e-6, or |n| ≥ 1e21), encoders MAY emit exponent notation conforming to the JSON number grammar [RFC8259] §6 (e.g., 1e-7, 1e+21). Encoders SHOULD use lowercase `e` and an explicit exponent sign for byte-for-byte determinism.
  - Encoders MUST emit sufficient precision so that, after any §3 host-type normalization, decode(encode(x)) equals x under JSON-model equality: null equals null; booleans compare by value; strings compare by Unicode scalar-value sequence after §7.1 unescaping, with no Unicode normalization; arrays compare by length and pairwise element equality in order; objects compare by the same ordered key sequence and pairwise value equality – except elements of arrays encoded in tabular form (§9.3), whose decoded key order is the header's field order, applied recursively to nested field groups (the first element's encounter order at each level), so their key sequences compare after that reordering; numbers compare by mathematical value after §2 numeric normalization, so -0 equals 0 and integer-valued numbers compare equal to their integer form.
  - If a source value is outside the implementation's documented numeric domain (e.g., arbitrary-precision decimals or integers exceeding that domain), the encoder MAY:
    - Emit a quoted string containing a lossless decimal representation (plain decimal or JSON exponent form); the chosen form MUST be documented.
    - Emit a number that round-trips to the host's numeric approximation (losing precision), provided it conforms to the rules above.
  - Encoders SHOULD expose an option for lossless stringification of out-of-domain numbers.
- Booleans: Encoders MUST emit the lowercase literals true and false.
- Null: Encoders MUST emit the lowercase literal null.

Decoder numeric rules are defined in §4.

## 3. Encoding Normalization (Reference Encoder)

Encoders MUST normalize non-JSON values to the JSON data model before encoding. The mapping from host-specific types to JSON model is implementation-defined and MUST be documented.

- Number:
  - Finite → number per §2 number form rules.
  - NaN, +Infinity, -Infinity → null.
- Implementations MAY honor host-language–specific serialization hooks (for example, JavaScript's `toJSON()`, Go's `json.Marshaler`, Python's `JSONEncoder.default`, Rust's `serde::Serialize`, or an equivalent mechanism) as part of host-type normalization. When supported, such hooks SHOULD take precedence over default host-type mappings for the same value, and their behavior MUST be documented by the implementation.
- Examples of host-type normalization (non-normative):
  - Date/time objects → ISO 8601 string representation [ISO8601].
  - Set-like collections → array.
  - Map-like collections → object (with string keys).
  - Sentinel, non-serializable, or unrecognized host values → null.

See Appendix F for non-normative language-specific examples.

## 4. Decoding Interpretation (Reference Decoder)

Decoders map text tokens to host values:

- Byte input: decoders that accept bytes MUST decode them as UTF-8. In strict mode, ill-formed UTF-8 (invalid or truncated sequences, or bytes encoding surrogate code points) MUST error; it MUST NOT be silently replaced with U+FFFD. Decoders that accept host strings (already decoded from bytes) are outside this rule.
- Quoted tokens (strings and keys):
  - MUST be unescaped per §7.1. Any other escape or an unterminated string MUST error.
  - Quoted primitives remain strings even if they look like numbers/booleans/null.
- Unquoted value tokens:
  - true, false, null → booleans/null.
  - Numeric parsing:
    - Number grammar (normative): an unquoted token decodes as a number if and only if it matches `/^-?[0-9]+(?:\.[0-9]+)?(?:e[+-]?[0-9]+)?$/i` (ASCII digits only) and does not carry forbidden leading zeros (below). Any other token – e.g. `.5`, `1.`, `+5`, `Infinity`, `NaN`, `0x10`, `1_000` – decodes as a string. Decoders MUST NOT delegate this decision to a host-language number parser with a wider grammar.
    - Decoders MUST accept decimal and exponent forms on input (e.g., `42`, `-3.14`, `1e-6`, `-1E+9`).
    - Decoders MUST treat tokens with forbidden leading zeros in the integer part (e.g., `"05"`, `"0001"`, `"-05"`, `"-0001"`) as strings, not numbers. This rule does **not** apply to a single zero integer part followed by a fractional or exponent part (e.g., `0.5`, `0e1`, `-0.5`, `-0e1`), which are valid numbers.
    - Only finite numbers are expected from conforming encoders.
    - If a decoded numeric token is not representable within the implementation's documented numeric domain, implementations MAY return a higher-precision numeric type, return a string, return an approximate numeric value, or reject the token (error; permitted in strict mode) if that is the documented policy. Implementations MUST document their out-of-range policy; lossless-first is RECOMMENDED for libraries intended for data interchange or validation.
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
- Root form discovery (applied to the comment-stripped line sequence, §5.1; line classes per §5.2):
  - If the first non-empty depth-0 line is a valid root array header per §6, decode a root array.
  - Else if the document has exactly one non-empty line and it is the literal token `[]`, decode an empty root array (§9.1).
  - Else if the document has exactly one non-empty line and it is neither a valid array header nor a key-value line (quoted or unquoted key), decode a single primitive (examples: `hello`, `42`, `true`).
  - Otherwise, decode an object.
  - An empty document (no non-empty lines after comment removal (§5.1) and after ignoring trailing newline(s) and ignorable blank lines) decodes to an empty object `{}`. A document consisting only of comment and blank lines is therefore `{}`.
  - In strict mode, if there are two or more non-empty depth-0 lines that are neither headers nor key-value lines, the document is invalid. Example of invalid input (strict mode):
    ```
    hello
    world
    ```
    This would be two primitives at root depth, which is not a valid TOON document structure.

### 5.1 Comment Lines

A comment line is a line whose first character after zero or more leading spaces (U+0020) is "#" (U+0023). Only spaces may precede the "#": a line whose leading whitespace contains a tab is not a comment line. Comments are full-line only: a "#" anywhere else on a line is ordinary content, and no inline or trailing comment form exists.

- Decoders MUST remove comment lines in a lexical pre-pass over the document's lines, in strict and non-strict mode alike. The text of a comment line is discarded without interpretation or unescaping. All subsequent processing – line classification (§5.2), root-form discovery, indentation validation (§12), and the count checks of §14.1 – operates on the comment-stripped line sequence.
- Removing a comment line MUST NOT create, terminate, or otherwise affect any scope: the surrounding lines are treated as adjacent. In particular, a comment between tabular rows does not end the rows, and a comment line is never counted as a row, list item, or blank line.
- A comment line MAY carry any number of leading spaces; the strict-mode indentation checks of §12 do not apply to comment lines.
- Encoders MUST NOT emit comment lines.

Note (informative): a document consisting only of comment lines (and blank lines) is empty after the pre-pass and decodes to `{}` (§5). Quoting keeps "#"-leading data out of this rule: string values that equal "#" or start with "#" are always quoted (§7.2), and unquoted keys cannot start with "#" (§7.3), so conforming encoder output never contains a line whose first non-space character is "#".

### 5.2 Line Classification

Decoders classify each line of the comment-stripped sequence (§5.1) by its content after the leading indentation. The first matching class applies. Classification is lexical; whether a class is admissible at a given depth and position is determined by the enclosing construct (root form above, §8–§10). Within a tabular array's scope, lines at row depth are divided between the row and key–value classes by the disambiguation rules of §9.3, which are authoritative for that position and take precedence over the order below.

1. Blank line – the content trims to empty. Handled per §12; blank lines never create or close structure.
2. List-item line – the content is the bare marker "-" or begins with "- " (hyphen, space). The remainder after the marker is parsed per §9.2, §9.4, and §10. Outside the scope of an expanded array, a leading hyphen has no structural meaning and the line is classified by the remaining classes.
3. Array-header line – the content matches the header grammar of §6. A line whose first unquoted colon precedes its first unquoted "[" is never a header; it is a key–value line. Only unquoted occurrences count: a quoted key containing a colon can still open a header (e.g., `"a:b"[2]: 1,2` is a header), while `a:b[2]: x` is a key–value line with key `a`.
4. Key–value line – the content contains an unquoted colon and no earlier class applies. The key token precedes the first unquoted colon and is decoded per §7.4; the remainder after the colon is the value (§8). A line that contains an unquoted colon but fails the §6 header grammar falls through to this class (e.g., `foo [2]: bar`); the strict-mode header errors enumerated in §6 and §14.2 are unaffected by this fall-through.
5. Row line – within a tabular array's scope, a delimiter-separated value line at row depth (§9.3).
6. Scalar line – none of the above; the content is a single primitive token (§4). A scalar line is valid only as a root primitive (root-form rules above); anywhere else it is a structural error (§14.2).

## 6. Header Syntax (Normative)

Array headers declare length and active delimiter, and optionally field names.

General forms:
- Root header (no key): [N<delim?>]:
- With key: key[N<delim?>]:
- Tabular fields: key[N<delim?>]{field1<delim>field2<delim>…}:
- Nested field groups: key[N<delim?>]{field1<delim>field2{sub1<delim>sub2}<delim>…}: – a field entry carrying its own field list (§9.3)

Where:
- N is the non-negative integer length.
- <delim?> is:
  - absent for comma (","),
  - HTAB (U+0009) for tab,
  - "|" for pipe.
- Field names in braces are separated by the same active delimiter and encoded as keys (§7.3). A field entry MAY be followed by a nested field group; the delimiter inside a nested group is the same active delimiter as the enclosing header.

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
; Field entries are keys (quoted/unquoted) separated by the active delimiter,
; each optionally carrying a nested field group (§9.3)
fields-seg    = "{" field-entry *( delim field-entry ) "}"
delim         = delimsym / ","
field-entry   = fieldname [ fields-seg ]
fieldname     = key

header        = [ key ] bracket-seg [ fields-seg ] ":"
key           = unquoted-key / quoted-key
unquoted-key  = ( ALPHA / "_" ) *( ALPHA / DIGIT / "_" / "." )
quoted-key    = DQUOTE *quoted-char DQUOTE
; quoted-char is defined in §7.1
```

Note: The ABNF does not express delimiter equality between the bracket and fields segments; implementations enforce the same-delimiter rule above. Mismatched delimiters MUST error in strict mode.

Note: The grammar above specifies header syntax only. Tabular row disambiguation is defined in §9.3.

Content MUST NOT appear between `]` and `{`/`:`. Invalid bracket lengths (e.g., `[bar]`, `[03]`, `[-1]`, or the absent length `[]`) or intervening content (e.g., `[1][bar]:`, `[2]extra:`, `[2] :`) are strict-mode errors; non-strict decoders MAY parse the line as a key-value line, with the key treated as a literal token (not constrained by §7.3's unquoted-key regex).

Decoding requirements:
- The bracket segment MUST parse as a non-negative integer length N with no leading zeros (the single digit `0` is the only canonical form for length zero). Tokens like `[03]` or `[-1]` MUST NOT be interpreted as bracket segments.
- A bracket segment without a length token (`key[]:`) is not a header: strict mode MUST error; non-strict decoders MAY fall through to key-value parsing. This does not affect the empty-array value form `key: []` (§9.1), where `[]` follows the colon.
- If a trailing tab or pipe appears inside the brackets, it selects the active delimiter; otherwise comma is active.
- If a fields segment occurs between the bracket and the colon, parse field entries recursively using the active delimiter at every nesting level; quoted names MUST be unescaped per §7.1. Brace matching MUST ignore `{` and `}` inside quoted names.
- A fields segment MUST contain at least one field entry at every nesting level: an empty brace group (`{}`, including a nested `field{}`) is a header syntax error in strict mode; non-strict decoders MAY fall through to key-value parsing (§14.2). Unmatched braces in a fields segment are likewise header syntax errors.
- A colon MUST follow the bracket and optional fields; missing colon MUST error.

Note: Dotted keys are ordinary literal keys in headers. Example: `data.meta.items[2]{id,name}:` is a valid header whose key is the single literal key `data.meta.items`, followed by a standard bracket segment, field list, and colon.

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
unescaped-char = %x09 / %x20-21 / %x23-5B / %x5D-D7FF / %xE000-FFFF / %x10000-10FFFF
escaped-char   = %x5C ( %x5C / DQUOTE / %x6E / %x72 / %x74 / unicode-escape )
unicode-escape = %x75 4HEXDIG
```

Tabs are allowed inside quoted strings and as a declared delimiter; they MUST NOT be used for indentation (§12). Within quoted strings, encoders MUST emit HTAB as `\t` per the escape table above; the literal HTAB in `unescaped-char` expresses decoder leniency only.

### 7.2 Quoting Rules for String Values

A string value MUST be quoted if any of the following is true:
- It is empty ("").
- It has leading or trailing whitespace (U+0020 or U+0009).
- It equals true, false, or null (case-sensitive).
- It is numeric-like: matches `/^[+-]?[0-9]+(?:\.[0-9]+)?(?:e[+-]?[0-9]+)?$/i` (ASCII digits only) (e.g., "42", "-3.14", "05", "+1", "1e-6"). The leading-plus forms are quoted for cross-version safety even though the §4 decoder grammar already types them as strings.
- It contains a colon (:), double quote ("), or backslash (\\).
- It contains brackets or braces ([, ], {, }).
- It contains control characters in U+0000 through U+001F.
- It contains the relevant delimiter (see §11 for complete delimiter rules):
  - For inline array values and tabular row cells: the active delimiter from the nearest array header.
  - For object field values (key: value): the document delimiter, even when the object is within an array's scope.
- It equals "-" or starts with "-" (any hyphen at position 0).
- It equals "#" or starts with "#" (any number sign at position 0).

Otherwise, the string MAY be emitted without quotes. Unicode, emoji, and strings with internal (non-leading/trailing) spaces are safe unquoted provided they do not violate the conditions.

### 7.3 Key Encoding

Object keys and tabular field names:
- MAY be unquoted only if they match: `^[A-Za-z_][A-Za-z0-9_.]*$`.
- Otherwise, they MUST be quoted and escaped per §7.1.

Keys requiring quoting per the above rules MUST be quoted in all contexts, including array headers (e.g., "my-key"[N]:).

### 7.4 Decoding Rules for Strings and Keys

Decoding of value tokens follows §4 (unquoted type inference, quoted strings, numeric rules). This section adds key-specific requirements:

- Quoted keys MUST be unescaped per §7.1; any other escape MUST error.
- Keys (quoted or unquoted) MUST be followed by ":"; missing colon MUST error (see also §14.2).
- Unquoted key token (normative): on a key–value line (§5.2), the unquoted key token is everything before the line's first unquoted colon, with surrounding spaces trimmed (§12). Decoders MUST accept any such token as a literal key, in strict and non-strict mode alike, even when it does not match §7.3's unquoted-key pattern (e.g., `foo-bar`, `2key`). §7.3 constrains what encoders may emit unquoted, not what decoders accept.
- Symmetrically for values: an unquoted value token that an encoder would have been required to quote (§7.2) is not an error. Decoders, strict mode included, MUST decode it per §4 – unless another rule of this specification assigns the token structural meaning (§5.2, §6, §9.1). Example: `key: -x` decodes to the string `-x`. §7.2 governs encoder output; it adds no decoder-side rejection.

## 8. Objects

- Encoding:
  - Primitive fields: key: value (single space after colon).
  - Nested or empty objects: key: on its own line. If non-empty, nested fields appear at depth +1.
  - Key order: Implementations MUST preserve encounter order when emitting fields.
  - An empty object at the root yields an empty document (no lines).
- Dotted keys (e.g., `user.name`) are valid literal keys in TOON. Decoders MUST treat them as single literal keys; the dot has no structural meaning.
- Decoding:
  - Lines in an object body are classified per §5.2; the rules below cover its key–value class.
  - A line "key:" with nothing after the colon at depth d opens an object; subsequent lines at depth > d belong to that object until the depth decreases to ≤ d.
  - In strict mode, the first line of a non-empty nested scope MUST be at exactly depth d+1; a depth increase of more than one level relative to the enclosing scope MUST error (§14.2). Conforming encoders never produce depth jumps (§12).
  - A bare `key:` (no value after the colon) MUST decode as an empty or nested object, NOT an empty array. Empty arrays use the explicit `key: []` form (§9.1).
  - Lines "key: value" at the same depth are sibling fields.
  - Duplicate sibling keys at the same depth: see §14.3 for strict/non-strict behavior.

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
    - The `key: []` field-level form (§9.1) does NOT apply to list-item inner arrays; encoders MUST NOT emit `- []`.
- Decoding:
  - Items appear at depth +1, each starting with "- " and an inner array header `[M<delim?>]: …`.
  - Decoders MUST also accept the bare item `- []` as an empty inner array, mirroring the §9.1 acceptance of both `key: []` and the legacy `key[0<delim?>]:`.
  - Inner arrays are split using their own active delimiter; in strict mode, counts MUST match M.
  - In strict mode, the number of list items MUST equal outer N.

### 9.3 Arrays of Objects – Tabular Form

Column classification (encoding): a column is the sequence of values at one key across all elements.
- A column is *uniform-primitive* when every value is a primitive.
- A column is *nested-uniform* when every value is a non-empty object, all these objects have the same set of keys (order per object MAY vary), and every sub-column is itself uniform-primitive or nested-uniform. Nesting depth is unbounded.

Tabular detection (encoding; MUST hold for all elements):
- Every element is an object.
- Each object has at least one key; arrays containing any empty object `{}` MUST NOT use tabular form (encode via §9.4 instead).
- All objects have the same set of keys (order per object MAY vary).
- Every column is uniform-primitive or nested-uniform. A column that is neither – e.g., one mixing `null` (a primitive) with objects, or containing any array value or empty object – disqualifies the whole array (encode via §9.4).

When satisfied (encoding):
- Header: `key[N<delim?>]{f1<delim>f2<delim>…}:` where field order is the first object's key encounter order. A uniform-primitive column is emitted as a bare fieldname; a nested-uniform column is emitted as a nested field group `fieldname{…}`, its subfields in the first object's sub-object encounter order, applied recursively.
- Field names at every nesting level encoded per §7.3.
- Rows: one line per object at depth +1 under the header; cells are encoded primitive leaf values (§7) joined by the active delimiter, ordered by a depth-first, pre-order walk of the field list (nested groups expanded in place). Each row's cell count equals the header's leaf-field count.
- Root tabular arrays omit the key: `[N<delim?>]{…}:` followed by rows.

Decoding:
- A tabular header declares the active delimiter and the ordered field list; nested field groups declare nested-object columns. The leaf-field sequence is the depth-first, pre-order walk of the field list.
- Rows appear at depth +1 as delimiter-separated value lines and contain only primitive cells.
- Each row decodes to an object by walking the field list in header order: a leaf field takes the next cell; a nested field group materializes an object from its subfields, applied recursively. Decoded key order at every level is the header's field order at that level.
- Duplicate field names within the same brace group produce duplicate sibling keys in every decoded element; §14.3 governs (strict error; non-strict LWW).
- Strict mode MUST enforce:
  - Each row's cell count equals the leaf-field count.
  - The number of rows equals N.
- Disambiguation at row depth (unquoted tokens; authoritative for the row/key–value choice, referenced from §5.2):
  - Compute the first unquoted occurrence of the active delimiter and the first unquoted colon.
  - If a same-depth line has no unquoted colon → row.
  - If both appear, compare first-unquoted positions:
    - Delimiter before colon → row.
    - Colon before delimiter → key-value line (end of rows).
  - If a line has an unquoted colon but no unquoted active delimiter → key-value line (end of rows).
- When a tabular array appears as the first field of a list-item object, indentation is governed by §10.

### 9.4 Mixed / Non-Uniform Arrays – Expanded List

When tabular requirements are not met (encoding; including any column that is neither uniform-primitive nor nested-uniform, §9.3):
- Header: `key[N<delim?>]:`
- Each element is rendered as a list item at depth +1 under the header:
  - Primitive: `- <primitive>`
  - Primitive array: `- [M<delim?>]: v1<delim>…`
  - Array of objects or non-uniform array: `- [M<delim?>]:` on the hyphen line, followed by the nested array's list items at depth +1 relative to the hyphen line (i.e. +2 from the outer array header). Items are encoded recursively per §9.1–§9.4 as each item's shape requires; tabular form (§9.3) is not available in this position (the field list has no place to appear) – encoders MUST use the expanded list form.
  - Object: formatted per §10 (objects as list items).

Decoding:
- Header declares list length N and the active delimiter for any nested inline arrays.
- Each list item is a list-item line (§5.2) starting with "- " at depth +1 (or the bare marker "-" for an empty object list item, §10) and is parsed as:
  - Primitive (no colon and no array header),
  - Inline primitive array (`- [M<delim?>]: …`) or the empty-array item `- []` (§9.2),
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
  - When a decoder encounters a list-item line (§5.2) of the form `- key[N<delim?>]{fields}:` at depth d, it MUST treat this as the start of a tabular array field named key in the list-item object.
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
  - Splitting MUST preserve empty tokens; surrounding spaces (U+0020 only, §12) are trimmed, and empty tokens decode to the empty string.
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
  - Token trimming: when a value token is extracted (after a key-value colon, after an array-header colon, and around each delimiter-separated token), decoders MUST trim surrounding spaces – exactly U+0020, no other characters. Any other whitespace (e.g., NBSP, or HTAB outside its delimiter role) is part of the token; internal semantics follow quoting rules.
  - Comment lines (§5.1) are removed before any check in this section applies; they are not blank lines, may carry any number of leading spaces, and never count as rows or items.
  - Blank lines:
    - A line whose content trims to empty MAY be treated as blank regardless of leading-space count.
    - Outside arrays/tabular rows: decoders SHOULD ignore completely blank lines (do not create/close structures).
    - Inside arrays/tabular rows: in strict mode, MUST error; in non-strict mode, MAY be ignored and not counted as a row/item.
  - Trailing newline at end-of-file: decoders SHOULD accept; validators MAY warn.

## 13. Conformance and Options

Encoders, decoders, and validators each have a per-class checklist below (§13.1–§13.3). Conforming implementations MUST satisfy every applicable item.

Option names throughout this specification are concept handles; implementations MAY use language-idiomatic spellings (e.g., `indent_size` in Python, `IndentSize` in Go) when the mapping is documented. Option value tokens (e.g., the delimiter modes comma, tab, and pipe) likewise denote modes; implementations MAY use enums, constants, or other host-idiomatic types.

Options:
- Encoder options:
  - indentSize (default: 2 spaces)
  - delimiter (document delimiter; default: comma; alternatives: tab, pipe)
- Decoder options:
  - indentSize (default: 2 spaces)
  - strict (default: `true`)

Strict-mode errors are enumerated in §14; validators MAY add informative diagnostics for style and encoding invariants.

Implementations SHOULD declare the specification version they target (e.g., `toon-spec: 4.0`) in their documentation; see [VERSIONING.md](./VERSIONING.md) for multi-version support guidance.

### 13.1 Encoder Conformance Checklist

Conforming encoders MUST:
- [ ] Produce UTF-8 output with LF (U+000A) line endings (§1.2)
- [ ] Use consistent indentation (default 2 spaces, no tabs) (§12)
- [ ] Escape per §7.1 in quoted strings; never emit other escapes
- [ ] Quote strings per §7.2 (the relevant delimiter is governed by §11.1: document delimiter for object-field values, active delimiter for inline array values and tabular row cells)
- [ ] Emit array lengths [N] matching actual item count (§6, §9)
- [ ] Preserve object key order as encountered (§2)
- [ ] Emit numbers per §2
- [ ] Convert -0 to 0 (§2)
- [ ] Emit booleans and null as lowercase literals (§2)
- [ ] Convert NaN/±Infinity to null (§3)
- [ ] Emit no trailing spaces or trailing newline (§12)
- [ ] Emit no comment lines (§5.1)

### 13.2 Decoder Conformance Checklist

Conforming decoders MUST:
- [ ] Remove comment lines in a lexical pre-pass before all structural interpretation (§5.1)
- [ ] Parse array headers per §6 (length, delimiter, optional fields including nested field groups)
- [ ] Accept empty arrays in both forms: `key: []` / `[]` and legacy `key[0]:` / `[0]:` (§9.1)
- [ ] Split inline arrays and tabular rows using active delimiter only (§11)
- [ ] Unescape per §7.1
- [ ] Type unquoted primitives: true/false/null → booleans/null, numeric → number, else → string (§4)
- [ ] Enforce strict-mode rules when `strict=true` (§14)
- [ ] Preserve array order and object key order (§2)

### 13.3 Validator Conformance Checklist

Validators SHOULD verify:
- [ ] Structural conformance (headers, indentation, list markers)
- [ ] Whitespace invariants (no trailing spaces/newlines)
- [ ] Delimiter consistency between headers and rows
- [ ] Array length counts match declared [N]
- [ ] All strict-mode requirements (§14)

## 14. Strict Mode Errors and Diagnostics (Authoritative Checklist)

When strict mode is enabled (default), decoders MUST error on the following conditions. Error type, code, and message text are implementation-defined.

### 14.1 Array Count and Width Mismatches

- Inline primitive arrays: decoded value count ≠ declared N.
- List arrays: number of list items ≠ declared N.
- Tabular arrays: number of rows ≠ declared N.
- Tabular row width mismatches: any row's cell count ≠ the header's leaf-field count (§9.3; equal to the field count when no nested field groups are present).
- The count checks above apply only when an explicit `[N]` length is declared. The `key: []` form has no declared length; the count check is N/A (§9.1).
- Counts are evaluated on the comment-stripped line sequence (§5.1); comment lines never count as rows or items.

### 14.2 Syntax and Structural Errors

- Missing colon in key context.
- Invalid escape sequences or unterminated strings in quoted tokens.
- Header delimiter mismatch (§6): MUST error as a header syntax error, independent of row width/count checks.
- Malformed bracket lengths in headers (e.g., `[03]`, `[-1]`, `[bar]`, or the absent length `[]`); see §6.
- Malformed fields segments in headers: an empty brace group (`{}`, including a nested `field{}`) or unmatched braces; see §6.
- Any content between a valid bracket segment and the colon (or fields segment) prevents array-header interpretation; decoders MUST NOT silently discard that content. In strict mode, decoders MUST error (see §6); in non-strict mode, decoders MAY fall through to key-value parsing.
- Indentation and blank-line invariants per §12, evaluated after comment removal (§5.1): leading-space multiple of indentSize; no tabs in indentation; no blank lines inside arrays/tabular rows. Comment lines are exempt and never count as blank lines, rows, or items.
- Indentation depth jumps (§8): a line more than one level deeper than its enclosing scope (e.g., a depth d+2 line directly under a depth-d parent).
- Ill-formed UTF-8 in byte input (§4).
- A scalar line (§5.2) anywhere other than root primitive position – e.g., a bare token line inside an array or object scope.
- Two or more non-empty depth-0 lines that are neither headers nor key-value lines (§5).

### 14.3 Duplicate Object Keys

When two or more sibling fields at the same depth share the same literal key:

- With `strict=true` (default): Decoders MUST error.
- With `strict=false`: Decoders MUST apply deterministic last-write-wins (LWW) resolution in document order, silently (no diagnostic).

## 15. Security Considerations

- Injection and ambiguity are mitigated by the quoting rules in §7.2; in particular, strings containing colons, the relevant delimiter (document or active), hyphen markers ("-" or strings starting with "-"), comment markers ("#" or strings starting with "#"), double quotes, backslashes, control characters, or brackets/braces MUST be quoted.
- Prototype-key safety: The keys `__proto__`, `constructor`, and `prototype` have no special meaning in TOON. Encoders MUST emit them as ordinary keys, and decoders MUST materialize them as ordinary own entries of the decoded object (in any key position: object fields, tabular field names, and quoted or unquoted forms). Decoding MUST NOT mutate prototype chains, class metadata, or any other shared state of the host object model (prototype pollution). Implementations whose default object type cannot hold such keys as ordinary own entries MUST use a representation that can (e.g., a map type) and MUST document the behavior.
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

Tabular arrays with nested field groups (uniform nested-object columns collapse into the header; rows stay flat):
```
orders[2]{id,customer{name,country},total}:
  1,Alice,DK,99
  2,Bob,UK,149
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

## Appendix B: Parsing Helpers (Informative)

These sketches illustrate structure and common decoding helpers. They are informative; normative behavior is defined in §1–§16 (per §1.1).

### B.1 Decoding Overview

- Split input into lines; strip comment lines (§5.1); compute depth from leading spaces and indent size (§12).
- Skip ignorable blank lines outside arrays/tabular rows (§12).
- Decide root form per §5.
- For objects at depth d: process lines at depth d; for arrays at depth d: read rows/list items at depth d+1.

### B.2 Array Header Parsing

- Identify the optional key prefix first (quoted: a `"…"` literal at line start; unquoted: characters up to the first `[`). The bracket segment `[ … ]` begins at the first `[` after the key; parse:
  - Length N as decimal integer.
  - Optional delimiter symbol at the end: HTAB or pipe (comma otherwise).
- If a "{ … }" fields segment occurs between the "]" and the ":", parse field entries recursively using the active delimiter: track brace depth, ignoring braces inside quoted names; a fieldname followed by "{" opens a nested field group. Unescape quoted names. The leaf-field list is the depth-first, pre-order walk of the resulting tree; rows assign cells to leaf fields in that order (§9.3).
- Require a colon ":" after the bracket/fields segment.
- Return the header (key?, length, delimiter, fields?) and any inline values after the colon.
- Absence of a delimiter symbol in the bracket segment ALWAYS means comma for that header (no inheritance).

### B.3 parseDelimitedValues

- Iterate characters left-to-right while maintaining a current token and an inQuotes flag.
- On a double quote, toggle inQuotes.
- While inQuotes, treat backslash + next char as a literal pair (string parser validates later).
- Only split on the active delimiter when not in quotes (unquoted occurrences).
- Trim surrounding spaces (U+0020 only, §12) around each token. Empty tokens decode to empty string.

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
    - If the remainder is exactly `[]` → empty inner array (§9.2).
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
- `big.Int`: If representable as a canonical decimal integer per §2, emit as number; otherwise convert to quoted decimal string per lossless policy.
- `math.Inf()`, `math.NaN()`: Convert to `null`.

Temporal Types:
- `time.Time`: Convert to ISO 8601 string via `.Format(time.RFC3339)` or `.Format(time.RFC3339Nano)`.

Collection Types:
- `map[K]V`: Convert to object. Keys must be strings or convertible to strings via `fmt.Sprint`.
- `[]T` (slices): Preserve as array.

Struct Types:
- Structs with exported fields: Convert to object using JSON struct tags if present.
- Types implementing `json.Marshaler`: Invoke `MarshalJSON()`, parse the returned bytes as JSON, and normalize the result recursively.

Non-Serializable Types:
- `nil`: Maps to `null`.
- Functions, channels, `unsafe.Pointer`: Not serializable; behavior is implementation-defined per §3.

### F.2 JavaScript

JavaScript implementations commonly normalize the following host types:

Numeric Types:
- `BigInt`: If the value is within `Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`, convert to `number`. Otherwise, convert to a quoted decimal string.
- `NaN`, `Infinity`, `-Infinity`: Convert to `null`.

Temporal Types:
- `Date`: Convert to ISO 8601 string via `.toISOString()` (e.g., `"2025-01-01T00:00:00.000Z"`).

Collection Types:
- `Set`: Convert to array by iterating entries and normalizing each element.
- `Map`: Convert to object using `String(key)` for keys and normalizing values recursively. Non-string keys are coerced to strings.

Object Types:
- Objects with a `toJSON()` method: Call `value.toJSON()` and normalize the returned value recursively before encoding.
- Plain objects: Enumerate own enumerable string keys in encounter order; normalize values recursively.

Non-Serializable Types:
- `undefined`, `function`, `Symbol`: Convert to `null`.

### F.3 Python

Python implementations commonly normalize the following host types:

Numeric Types:
- `decimal.Decimal`: Convert to `float` if representable without loss, OR convert to quoted decimal string for exact preservation (implementation policy).
- `float('inf')`, `float('-inf')`, `float('nan')`: Convert to `null`.
- Arbitrary-precision integers (large `int`): Emit as number if within the implementation's documented numeric domain, OR as quoted decimal string per lossless policy.

Temporal Types:
- `datetime.datetime`, `datetime.date`, `datetime.time`: Convert to ISO 8601 string representation via `.isoformat()`.

Collection Types:
- `set`, `frozenset`: Convert to list (array).
- `dict`: Preserve as object with string keys. Non-string keys must be coerced to strings.

Object Types:
- Custom objects: Extract attributes via `__dict__`, register a `JSONEncoder.default` callback, or use `dataclasses.asdict()` for dataclasses; convert to object (dict) with string keys.

Non-Serializable Types:
- `None`: Maps to `null`.
- Functions, lambdas, modules: Convert to `null`.

### F.4 Rust

Rust implementations commonly normalize the following host types (typically using serialization frameworks like `serde`):

Numeric Types:
- `i128`, `u128`: If representable as a canonical decimal integer per §2, emit as number; otherwise convert to quoted decimal string per lossless policy.
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

Struct Types:
- Types implementing `serde::Serialize`: invoke the trait via the implementation's serializer and normalize the produced JSON value.

Non-Serializable Types:
- `Option::None`: Convert to `null`.
- `Option::Some(T)`: Unwrap and normalize `T`.
- Function pointers, raw pointers: Not serializable; behavior is implementation-defined per §3.

### F.5 Java

Java implementations commonly normalize the following host types:

Numeric Types:
- `BigInteger`: If representable as a canonical decimal integer per §2, emit as number; otherwise convert to quoted decimal string per lossless policy.
- `BigDecimal`: Convert to `double` if representable without loss, OR convert to a quoted decimal string via `.toPlainString()` for exact preservation.
- `Double.NaN`, `Double.POSITIVE_INFINITY`, `Double.NEGATIVE_INFINITY`: Convert to `null`.

Temporal Types:
- `java.time.Instant`, `OffsetDateTime`: Convert to ISO 8601 string via `.toString()`.
- `ZonedDateTime`: Convert via `.toOffsetDateTime().toString()` to produce ISO 8601; `ZonedDateTime.toString()` appends a `[Zone/Id]` bracket that is not standard ISO 8601.
- `LocalDate`, `LocalTime`, `LocalDateTime`: Convert to ISO 8601 representations via `.toString()`.

Collection Types:
- `Map<K, V>`: Convert to object. Keys MUST be non-null strings; non-string keys MUST be converted via the implementation's documented policy.
- `Collection<T>` (List, Set): Convert to array.

Non-Serializable Types:
- `Optional.empty()`: Maps to `null`. `Optional.of(x)`: unwrap and normalize `x`.
- Functional interfaces (lambdas, method references), reflective types: Not serializable; behavior is implementation-defined per §3.

### F.6 General Guidance

Implementations in any language should:
1. Document their normalization policy clearly, especially for:
  - Large or arbitrary-precision numbers (lossless string vs. approximate number)
  - Date/time representations (ISO 8601 format details)
  - Collection type mappings (order preservation for sets)
2. Provide configuration options where multiple strategies are reasonable (e.g., lossless vs. approximate numeric encoding).
3. Ensure that normalization is deterministic: encoding the same host value twice produces identical TOON output.
