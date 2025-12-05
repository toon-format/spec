# TOON Specification

## Token-Oriented Object Notation

**Version:** 3.0

**Date:** 2025-11-24

**Status:** Working Draft

**Author:** Johann Schopplich ([@johannschopplich](https://github.com/johannschopplich))

**License:** MIT

---

## Abstract

Token-Oriented Object Notation (TOON) is a line-oriented, indentation-based text format that encodes the JSON data model with explicit structure and minimal quoting. Arrays declare their length and an optional field list once; rows use a single active delimiter (comma, tab, or pipe). Objects use indentation instead of braces; strings are quoted only when required. This specification defines TOON’s concrete syntax, canonical number formatting, delimiter scoping, and strict‑mode validation, and sets conformance requirements for encoders, decoders, and validators. TOON provides a compact, deterministic representation of structured data and is particularly efficient for arrays of uniform objects.

## Status of This Document

This document is a Working Draft v3.0 and may be updated, replaced, or obsoleted. Implementers should monitor the canonical repository at https://github.com/toon-format/spec for changes.

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

- [Introduction](#introduction)
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
17. [Interoperability and Mappings (Informative)](#17-interoperability-and-mappings-informative)
18. [IANA Considerations](#18-iana-considerations)
19. [TOON Core Profile (Normative Subset)](#19-toon-core-profile-normative-subset)
20. [Versioning and Extensibility](#20-versioning-and-extensibility)
21. [Intellectual Property Considerations](#21-intellectual-property-considerations)

**Appendices:**
- [Appendix A: Examples (Informative)](#appendix-a-examples-informative)
- [Appendix B: Parsing Helpers (Informative)](#appendix-b-parsing-helpers-informative)
- [Appendix C: Test Suite and Compliance (Informative)](#appendix-c-test-suite-and-compliance-informative)
- [Appendix D: Document Changelog (Informative)](#appendix-d-document-changelog-informative)
- [Appendix E: Acknowledgments and License](#appendix-e-acknowledgments-and-license)
- [Appendix F: Cross-check With Reference Behavior (Informative)](#appendix-f-cross-check-with-reference-behavior-informative)
- [Appendix G: Host Type Normalization Examples (Informative)](#appendix-g-host-type-normalization-examples-informative)

## Introduction (Informative)

### Purpose and scope

TOON (Token-Oriented Object Notation) is a line-oriented, indentation-based text format that encodes the JSON data model with explicit structure and minimal quoting. It is designed as a compact, deterministic representation of structured data, particularly well-suited to arrays of uniform objects. TOON is often used as a translation layer: produce data as JSON in code, encode to TOON for downstream consumption (e.g., LLM prompts), and decode back to JSON if needed.

### Applicability and non‑goals

Use TOON when:
- arrays of objects share the same fields (uniform tabular data),
- deterministic, minimally quoted text is desirable,
- explicit lengths and fixed row widths help detect truncation or malformed data,
- you want unambiguous, human-readable structure without repeating keys.

TOON is not intended to replace:
- JSON for non-uniform or deeply nested structures where repeated keys are not dominant,
- CSV for flat, strictly tabular data where maximum compactness is required and nesting is not needed,
- general-purpose storage or public APIs. TOON carries the JSON data model; it is a transport/authoring format with explicit structure, not an extended type system or schema language.

Out of scope:
- comments and annotations,
- alternative number systems or locale-specific formatting,
- user-defined escape sequences or control directives.

### Relationship to JSON, CSV, and YAML (Informative)

- **JSON**: TOON preserves the JSON data model. It is more compact for uniform arrays of objects by declaring length and fields once. For non-uniform or deeply nested data, JSON may be more efficient.
- **CSV/TSV**: CSV is typically more compact for flat tables but lacks nesting and type awareness. TOON adds explicit lengths, per-array delimiter scoping, field lists, and deterministic quoting, while remaining lightweight.
- **YAML**: TOON uses indentation and hyphen markers but is more constrained and deterministic: no comments, explicit array headers with lengths, fixed quoting rules, and a narrow escape set.

### Example (Informative)

```
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

### Document roadmap

Normative rules are organized as follows:
- Data model and canonical number form (§2); normalization on encode (§3); decoding interpretation (§4).
- Concrete syntax, including root-form determination (§5) and header syntax (§6).
- Strings and keys (§7); objects (§8); arrays and their sub-forms (§9); objects as list items (§10); delimiter rules (§11).
- Indentation and whitespace (§12); conformance and options (§13).
- Strict-mode errors (authoritative checklist) (§14).

Appendices are informative unless stated otherwise and provide examples, parsing helpers, and implementation guidance.

## 1. Terminology and Conventions

### 1.1 Use of RFC2119 Keywords and Normativity

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119] and [RFC8174] when, and only when, they appear in all capitals, as shown here.

Audience: implementers of encoders/decoders/validators; tool authors; practitioners embedding TOON in LLM prompts.

All normative text in this specification is contained in Sections 1-16 and Section 19. All appendices are informative except where explicitly marked normative. Examples throughout this document are informative unless explicitly stated otherwise.

Implementations that fail to conform to any MUST or REQUIRED level requirement are non-conformant. Implementations that conform to all MUST and REQUIRED level requirements but fail to conform to SHOULD or RECOMMENDED level requirements are said to be "not fully conformant" but are still considered conformant.

### 1.2 Core Concepts

- TOON document: A sequence of UTF-8 text lines formatted according to this spec.
- Line: A sequence of non-newline characters terminated by LF (U+000A) in serialized form. Encoders MUST use LF.

### 1.3 Structural Terms

- Indentation level (depth): Leading indentation measured in fixed-size space units (indentSize). Depth 0 has no indentation.
- Indentation unit (indentSize): A fixed number of spaces per level (default 2). Tabs MUST NOT be used for indentation.

### 1.4 Array Terms

- Header: The bracketed declaration for arrays, optionally followed by a field list, and terminating with a colon; e.g., key[3]: or items[2]{a,b}:.
- Field list: Brace-enclosed, delimiter-separated list of field names for tabular arrays: {f1<delim>f2}.
- List item: A line beginning with "- " at a given depth representing an element in an expanded array.

### 1.5 Delimiter Terms

- Delimiter: The character used to separate array/tabular values: comma (default), tab (HTAB, U+0009), or pipe ("|").
- Document delimiter: The encoder-selected delimiter used for quoting decisions outside any array scope (default comma).
- Active delimiter: The delimiter declared by the closest array header in scope, used to split inline primitive arrays and tabular rows under that header; it also governs quoting decisions for values within that array's scope.

### 1.6 Type Terms

- Primitive: string, number, boolean, or null.
- Object: Mapping from string keys to `JsonValue`.
- Array: Ordered sequence of `JsonValue`.
- `JsonValue`: Primitive | Object | Array.

### 1.7 Conformance Terms

- Strict mode: Decoder mode that enforces counts, indentation, and delimiter consistency; also rejects invalid escapes and missing colons (default: true).

### 1.8 Notation

- Regular expressions appear in slash-delimited form.
- ABNF snippets follow RFC 5234; HTAB means the U+0009 character.

### 1.9 Key Folding and Path Expansion Terms

- IdentifierSegment: A key segment eligible for safe folding and expansion, matching the pattern `^[A-Za-z_][A-Za-z0-9_]*$` (contains only letters, digits, and underscores; does not start with a digit; does not contain dots).
- Path separator: The character used to join/split key segments during folding and expansion. Fixed to `"."` (U+002E, FULL STOP) in v1.5.
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
- Numbers (decoding):
  - Decoders MUST accept decimal and exponent forms on input (e.g., 42, -3.14, 1e-6, -1E+9).
  - Decoders MUST treat tokens with forbidden leading zeros in the integer part (e.g., `"05"`, `"0001"`, `"-05"`, `"-0001"`) as strings, not numbers. This rule does **not** apply to a single zero integer part followed by a fractional or exponent part (e.g., `0.5`, `0e1`, `-0.5`, `-0e1`), which are valid numbers.
  - If a decoded numeric token is not representable in the host's default numeric type without loss, implementations MAY:
    - Return a higher-precision numeric type (e.g., arbitrary-precision integer or decimal), OR
    - Return a string, OR
    - Return an approximate numeric value if that is the documented policy.
  - Implementations MUST document their policy for handling out-of-range or non-representable numbers. A lossless-first policy is RECOMMENDED for libraries intended for data interchange or validation.
- Null: Represented as the literal null.

## 3. Encoding Normalization (Reference Encoder)

Encoders MUST normalize non-JSON values to the JSON data model before encoding. The mapping from host-specific types to JSON model is implementation-defined and MUST be documented.

- Number:
  - Finite → number (canonical decimal form per Section 2). -0 → 0.
  - NaN, +Infinity, -Infinity → null.
- Implementations MAY honor host-language–specific serialization hooks (for example, a `toJSON()` method in JavaScript or an equivalent mechanism) as part of host-type normalization. When supported, such hooks SHOULD be applied before other host-type mappings and their behavior MUST be documented by the implementation.
- Examples of host-type normalization (non-normative):
  - Date/time objects → ISO 8601 string representation.
  - Set-like collections → array.
  - Map-like collections → object (with string keys).
  - Undefined, function, symbol, or unrecognized types → null.

See Appendix G for non-normative language-specific examples (Go, JavaScript, Python, Rust).

## 4. Decoding Interpretation (Reference Decoder)

Decoders map text tokens to host values:

- Quoted tokens (strings and keys):
  - MUST be unescaped per Section 7.1 (only \\, \", \n, \r, \t are valid). Any other escape or an unterminated string MUST error.
  - Quoted primitives remain strings even if they look like numbers/booleans/null.
- Unquoted value tokens:
  - true, false, null → booleans/null.
  - Numeric parsing:
    - MUST accept standard decimal and exponent forms (e.g., 42, -3.14, 1e-6, -1E+9).
    - MUST treat tokens with forbidden leading zeros (e.g., "05", "0001") as strings (not numbers).
    - Only finite numbers are expected from conforming encoders.
    - Decoding examples:
      - `"1.5000"` → numeric value `1.5` (trailing zeros in fractional part are accepted)
      - `"-1E+03"` → numeric value `-1000` (exponent forms are accepted)
      - `"-0"` → numeric value `0` (negative zero decodes to zero; most host environments do not distinguish -0 from 0)
  - Otherwise → string.
- Keys:
  - Decoded as strings (quoted keys MUST be unescaped per Section 7.1).
  - A colon MUST follow a key; missing colon MUST error.

## 5. Concrete Syntax and Root Form

TOON is a deterministic, line-oriented, indentation-based notation.

- Objects:
  - key: value for primitives.
  - key: alone for nested or empty objects; nested fields appear at depth +1.
- Arrays:
  - Primitive arrays are inline: key[N<delim?>]: v1<delim>v2….
  - Arrays of arrays (primitives): expanded list items under a header: key[N<delim?>]: then "- [M<delim?>]: …".
  - Arrays of objects:
    - Tabular form when uniform and primitive-only: key[N<delim?>]{f1<delim>f2}: then one row per line.
    - Otherwise: expanded list items: key[N<delim?>]: with "- …" items (see Sections 9.4 and 10).
- Root form discovery:
  - If the first non-empty depth-0 line is a valid root array header per Section 6 (must include a colon), decode a root array.
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
- Field names in braces are separated by the same active delimiter and encoded as keys (Section 7.3).

Spacing and delimiters:
- Every header line MUST end with a colon.
- When inline values follow a header on the same line (non-empty primitive arrays), there MUST be exactly one space after the colon before the first value.
- The active delimiter declared by the bracket segment applies to:
  - splitting inline primitive arrays on that header line,
  - splitting tabular field names in "{…}",
  - splitting all rows/items within the header's scope,
  - unless a nested header changes it.
- The same delimiter symbol declared in the bracket MUST be used in the fields segment and in all row/value splits in that scope.
- Absence of a delimiter symbol in a bracket segment ALWAYS means comma, regardless of any parent header.

Normative header grammar (ABNF):
```
; Core rules from RFC 5234
ALPHA  = %x41-5A / %x61-7A   ; A-Z / a-z
DIGIT  = %x30-39             ; 0-9
DQUOTE = %x22                ; "
HTAB   = %x09                ; horizontal tab
LF     = %x0A                ; line feed
SP     = %x20                ; space

; Header syntax
bracket-seg   = "[" 1*DIGIT [ delimsym ] "]"
delimsym      = HTAB / "|"
; Field names are keys (quoted/unquoted) separated by the active delimiter
fields-seg    = "{" fieldname *( delim fieldname ) "}"
delim         = delimsym / ","
fieldname     = key

header        = [ key ] bracket-seg [ fields-seg ] ":"
key           = unquoted-key / quoted-key

; Unquoted keys must match identifier pattern
unquoted-key  = ( ALPHA / "_" ) *( ALPHA / DIGIT / "_" / "." )

; Quoted keys use only escapes from Section 7.1
; (Exact escaped-char repertoire is defined in Section 7.1)
; quoted-key   = DQUOTE *(escaped-char / safe-char) DQUOTE
```

Note: The ABNF grammar above cannot enforce that the delimiter used in the fields segment (braces) matches the delimiter declared in the bracket segment. This equality requirement is normative per the prose in lines 311-312 above and MUST be enforced by implementations. Mismatched delimiters between bracket and brace segments MUST error in strict mode.

Note: The grammar above specifies header syntax. TOON's grammar is deliberately designed to prioritize human readability and token efficiency over strict LR(1) parseability. This requires some context-sensitive parsing (particularly for tabular row disambiguation in Section 9.3), which is a deliberate design tradeoff. Reference implementations demonstrate that deterministic parsing is achievable with modest lookahead.

Decoding requirements:
- The bracket segment MUST parse as a non-negative integer length N.
- If a trailing tab or pipe appears inside the brackets, it selects the active delimiter; otherwise comma is active.
- If a fields segment occurs between the bracket and the colon, parse field names using the active delimiter; quoted names MUST be unescaped per Section 7.1.
- A colon MUST follow the bracket and optional fields; missing colon MUST error.

Note: Key folding (§13.4) affects only the key prefix in headers. The header grammar remains unchanged. Example: `data.meta.items[2]{id,name}:` is a valid header with a folded key prefix `data.meta.items`, followed by a standard bracket segment, field list, and colon. Parsing treats folded keys as literal keys; see §13.4 for optional path expansion.

## 7. Strings and Keys

### 7.1 Escaping (Encoding and Decoding)

In quoted strings and keys, the following characters MUST be escaped:
- "\\" → "\\\\"
- "\"" → "\\\""
- U+000A newline → "\\n"
- U+000D carriage return → "\\r"
- U+0009 tab → "\\t"

Decoders MUST reject any other escape sequence and unterminated strings.

Tabs are allowed inside quoted strings and as a declared delimiter; they MUST NOT be used for indentation (Section 12).

### 7.2 Quoting Rules for String Values (Encoding)

A string value MUST be quoted if any of the following is true:
- It is empty ("").
- It has leading or trailing whitespace.
- It equals true, false, or null (case-sensitive).
- It is numeric-like:
  - Matches /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i (e.g., "42", "-3.14", "1e-6").
  - Or matches /^0\d+$/ (leading-zero decimals such as "05").
- It contains a colon (:), double quote ("), or backslash (\).
- It contains brackets or braces ([, ], {, }).
- It contains control characters: newline, carriage return, or tab.
- It contains the relevant delimiter (see §11 for complete delimiter rules):
  - For inline array values and tabular row cells: the active delimiter from the nearest array header.
  - For object field values (key: value): the document delimiter, even when the object is within an array's scope.
- It equals "-" or starts with "-" (any hyphen at position 0).

Otherwise, the string MAY be emitted without quotes. Unicode, emoji, and strings with internal (non-leading/trailing) spaces are safe unquoted provided they do not violate the conditions.

### 7.3 Key Encoding (Encoding)

Object keys and tabular field names:
- MAY be unquoted only if they match: ^[A-Za-z_][A-Za-z0-9_.]*$.
- Otherwise, they MUST be quoted and escaped per Section 7.1.

Keys requiring quoting per the above rules MUST be quoted in all contexts, including array headers (e.g., "my-key"[N]:).

Encoders MAY perform key folding when enabled (see §13.4 for complete folding rules and requirements).

### 7.4 Decoding Rules for Strings and Keys (Decoding)

Decoding of value tokens follows §4 (unquoted type inference, quoted strings, numeric rules). This section adds key-specific requirements:

- Quoted keys MUST be unescaped per Section 7.1; any other escape MUST error.
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
  - Lines "key: value" at the same depth are sibling fields.

## 9. Arrays

### 9.1 Primitive Arrays (Inline)

- Encoding:
  - Non-empty arrays: key[N<delim?>]: v1<delim>v2<delim>… where each vi is encoded as a primitive (Section 7) with delimiter-aware quoting.
  - Empty arrays: key[0<delim?>]: (no values following).
  - Root arrays: [N<delim?>]: v1<delim>…
- Decoding:
  - Split using the active delimiter declared by the header; non-active delimiters MUST NOT split values.
  - When splitting inline arrays, empty tokens (including those surrounded by whitespace) decode to the empty string.
  - In strict mode, the number of decoded values MUST equal N; otherwise MUST error.

### 9.2 Arrays of Arrays (Primitives Only) — Expanded List

- Encoding:
  - Parent header: key[N<delim?>]: on its own line.
  - Each inner primitive array is a list item:
    - - [M<delim?>]: v1<delim>v2<delim>…
    - Empty inner arrays: - [0<delim?>]:
- Decoding:
  - Items appear at depth +1, each starting with "- " and an inner array header "[M<delim?>]: …".
  - Inner arrays are split using their own active delimiter; in strict mode, counts MUST match M.
  - In strict mode, the number of list items MUST equal outer N.

### 9.3 Arrays of Objects — Tabular Form

Tabular detection (encoding; MUST hold for all elements):
- Every element is an object.
- All objects have the same set of keys (order per object MAY vary).
- All values across these keys are primitives (no nested arrays/objects).

When satisfied (encoding):
- Header: key[N<delim?>]{f1<delim>f2<delim>…}: where field order is the first object's key encounter order.
- Field names encoded per Section 7.3.
- Rows: one line per object at depth +1 under the header; values are encoded primitives (Section 7) and joined by the active delimiter.
- Root tabular arrays omit the key: [N<delim?>]{…}: followed by rows.

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
- When a tabular array appears as the first field of a list-item object, indentation is governed by Section 10.

### 9.4 Mixed / Non-Uniform Arrays — Expanded List

When tabular requirements are not met (encoding):
- Header: key[N<delim?>]:
- Each element is rendered as a list item at depth +1 under the header:
  - Primitive: - <primitive>
  - Primitive array: - [M<delim?>]: v1<delim>…
  - Object: formatted per Section 10 (objects as list items).
  - Complex arrays: - key'[M<delim?>]: followed by nested items as appropriate.

Decoding:
- Header declares list length N and the active delimiter for any nested inline arrays.
- Each list item starts with "- " at depth +1 and is parsed as:
  - Primitive (no colon and no array header),
  - Inline primitive array (- [M<delim?>]: …),
  - Object with first field on the hyphen line (- key: … or - key[N…]{…}: …),
  - Or nested arrays via nested headers.
- In strict mode, the number of list items MUST equal N.

## 10. Objects as List Items

For an object appearing as a list item:

- Empty object list item: a single "-" at the list-item indentation level.
- Encoding (normative):
  - When a list-item object has a tabular array (Section 9.3) as its first field in encounter order, encoders MUST emit the tabular header on the hyphen line:
    - The hyphen and tabular header appear on the same line at the list-item depth: - key[N<delim?>]{fields}:
    - Tabular rows MUST appear at depth +2 (relative to the hyphen line).
    - All other fields of the same object MUST appear at depth +1 under the hyphen line, in encounter order, using normal object field rules (Section 8).
    - Encoders MUST NOT emit tabular rows at depth +1 or sibling fields at the same depth as rows when the first field is a tabular array.
  - For all other cases (first field is not a tabular array), encoders SHOULD place the first field on the hyphen line. A bare hyphen on its own line is used only for empty list-item objects.
- Decoding (normative):
  - When a decoder encounters a list-item line of the form - key[N<delim?>]{fields}: at depth d, it MUST treat this as the start of a tabular array field named key in the list-item object.
  - Lines at depth d+2 that conform to tabular row syntax (Section 9.3) are rows of that tabular array.
  - Lines at depth d+1 are additional fields of the same list-item object; the presence of a line at depth d+1 after rows terminates the rows.
  - All other object-as-list-item patterns (bare hyphen, first field on hyphen line for non-tabular values) are decoded according to the general rules in Section 8 and Section 9.

## 11. Delimiters

- Supported delimiters:
  - Comma (default): header omits the delimiter symbol.
  - Tab: header includes HTAB inside brackets and braces (e.g., [N<TAB>], {a<TAB>b}); rows/inline arrays use tabs.
  - Pipe: header includes "|" inside brackets and braces; rows/inline arrays use "|".

### 11.1 Encoding Rules (Normative for Encoders)

- Document delimiter: Encoders select a document delimiter (option: comma, tab, pipe; default comma) that influences quoting for all object field values (key: value) throughout the document.
- Active delimiter: Inside an array header's scope, the active delimiter governs quoting only for inline array values and tabular row cells.
- Delimiter-aware quoting:
  - Inline array values and tabular row cells: strings containing the active delimiter MUST be quoted.
  - Object field values (key: value): encoders use the document delimiter to decide delimiter-aware quoting, regardless of whether the object appears within an array's scope.
  - Strings containing non-active delimiters do not require quoting unless another condition applies (§7.2).

### 11.2 Decoding Rules (Normative for Decoders)

- Active delimiter: Decoders use only the active delimiter declared by the nearest array header to split inline arrays and tabular rows.
- Delimiter-aware parsing:
  - Inline arrays and tabular rows MUST be split only on the active delimiter.
  - Splitting MUST preserve empty tokens; surrounding spaces are trimmed, and empty tokens decode to the empty string.
  - Nested headers may change the active delimiter; decoding MUST use the delimiter declared by the nearest header.
  - If the bracket declares tab or pipe, the same symbol MUST be used in the fields segment and for splitting all rows/values in that scope (§6).
- Object field values (key: value): Decoders parse the entire post-colon token as a single value; document delimiter is not a decoder concept.

## 12. Indentation and Whitespace

- Encoding:
  - Encoders MUST use a consistent number of spaces per level (default 2; configurable).
  - Tabs MUST NOT be used for indentation.
  - Exactly one space after ": " in key: value lines.
  - Exactly one space after array headers when followed by inline values.
  - No trailing spaces at the end of any line.
  - No trailing newline at the end of the document.
- Decoding:
  - Strict mode:
    - The number of leading spaces on a line MUST be an exact multiple of indentSize; otherwise MUST error.
    - Tabs used as indentation MUST error. Tabs are allowed in quoted strings and as the HTAB delimiter.
  - Non-strict mode:
    - Depth MAY be computed as floor(indentSpaces / indentSize).
    - Implementations MAY accept tab characters in indentation. Depth computation for tabs is implementation-defined. Implementations MUST document their tab policy.
  - Surrounding whitespace around tokens SHOULD be tolerated; internal semantics follow quoting rules.
  - Blank lines:
    - Outside arrays/tabular rows: decoders SHOULD ignore completely blank lines (do not create/close structures).
    - Inside arrays/tabular rows: in strict mode, MUST error; in non-strict mode, MAY be ignored and not counted as a row/item.
  - Trailing newline at end-of-file: decoders SHOULD accept; validators MAY warn.

Recommended blank-line handling (normative where stated):
- Before decoding, or during scanning:
  - Track blank lines with depth.
  - For strict mode: if a blank line occurs between the first and last row/item line in an array/tabular block, this MUST error.
  - Otherwise (outside arrays/tabular rows), blank lines SHOULD be skipped and not contribute to root-form detection.
- Empty input means: after ignoring trailing newlines and ignorable blank lines outside arrays/tabular rows, there are no non-empty lines.

## 13. Conformance and Options

Conformance classes:

- Encoder:
  - MUST produce output adhering to all normative rules in Sections 2–12 and 15.
  - MUST be deterministic regarding:
    - Object field order (encounter order).
    - Tabular detection (uniform vs non-uniform).
    - Quoting decisions given values and delimiter context (document delimiter or active delimiter in array scope).

- Decoder:
  - MUST implement tokenization, escaping, and type interpretation per Sections 4 and 7.4.
  - MUST parse array headers per Section 6 and apply the declared active delimiter to inline arrays and tabular rows.
  - MUST implement structure and depth rules per Sections 8–11, including objects-as-list-items placement.
  - MUST enforce strict-mode rules in Section 14 when strict = true.

- Validator:
  - SHOULD verify structural conformance (headers, indentation, list markers).
  - SHOULD verify whitespace invariants.
  - SHOULD verify delimiter consistency between headers and rows.
  - SHOULD verify length counts vs declared [N].

Options:
- Encoder options:
  - indent (default: 2 spaces)
  - delimiter (document delimiter; default: comma; alternatives: tab, pipe)
  - keyFolding (default: `"off"`; alternatives: `"safe"`)
  - flattenDepth (default: Infinity when keyFolding is `"safe"`; non-negative integer ≥ 0; values 0 or 1 have no practical folding effect)
- Decoder options:
  - indent (default: 2 spaces)
  - strict (default: `true`)
  - expandPaths (default: `"off"`; alternatives: `"safe"`)

Strict-mode errors are enumerated in §14; validators MAY add informative diagnostics for style and encoding invariants.

### 13.4 Key Folding and Path Expansion

Key folding and path expansion are optional transformations for compact dotted-path notation. Both default to `"off"`.

#### Encoder: Key Folding

Key folding allows encoders to collapse chains of single-key objects into dotted-path notation, reducing verbosity for deeply nested structures.

Mode: `"off"` | `"safe"` (default: `"off"`)
- `"off"`: No folding is performed. All objects are encoded with standard nesting.
- `"safe"`: Fold eligible chains according to the rules below.

flattenDepth: The maximum number of segments from K0 to include in the folded path (default: Infinity when keyFolding is `"safe"`; values less than 2 have no practical effect).
- A value of 2 folds only two-segment chains: `{a: {b: val}}` → `a.b: val`.
- A value of Infinity folds entire eligible chains: `{a: {b: {c: val}}}` → `a.b.c: val`.

Foldable chain: A chain K0 → K1 → ... → Kn is foldable when:
- Each Ki (where i = 0 to n−1) is an object with exactly one key Ki+1.
- The chain stops at the first non-single-key object or when encountering a leaf value.
- Arrays are not considered single-key objects; a chain stops at arrays.
- The leaf value at Kn is either a primitive, an array, or an empty object.

Safe mode requirements (all MUST hold for a chain to be folded):
1. All folded segments K0 through K(d−1) (where d = min(chain length, flattenDepth)) MUST be IdentifierSegments (§1.9): matching `^[A-Za-z_][A-Za-z0-9_]*$`.
2. No segment may contain the path separator (`.` in v1.5).
3. The resulting folded key string MUST NOT equal any existing sibling literal key at the same object depth (collision avoidance).
4. If any segment would require quoting per §7.3, the chain MUST NOT be folded.

Folding process:
- For a foldable chain of length n, determine d = min(n, flattenDepth).
- Fold segments K0 through K(d−1) into a single key: `K0.K1.....K(d−1)`.
- If d < n, emit the remaining structure (Kd through Kn) as normal nested objects.
- The leaf value at Kn is encoded normally (primitive, array, or empty object).

Examples:
- `{a: {b: {c: 1}}}` with safe mode, depth=Infinity → `a.b.c: 1`
- `{a: {b: {c: {d: 1}}}}` with safe mode, depth=2 → produces `a.b:` followed by nested `c:` and `d: 1` at appropriate depths
- `{data: {"full-name": {x: 1}}}` → safe mode skips (segment `"full-name"` requires quoting); emits standard nested structure

#### Decoder: Path Expansion

Path expansion allows decoders to split dotted keys into nested object structures, enabling round-trip compatibility with folded encodings.

Mode: `"off"` | `"safe"` (default: `"off"`)
- `"off"`: Dotted keys are treated as literal keys. No expansion is performed.
- `"safe"`: Expand eligible dotted keys according to the rules below.

Safe mode behavior:
- Any key containing the path separator (`.`) is considered for expansion.
- Split the key into segments at each occurrence of `.`.
- Only expand when ALL resulting segments are IdentifierSegments (§1.9) and none contain `.` after splitting.
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

### 13.1 Encoder Conformance Checklist

Conforming encoders MUST:
- [ ] Produce UTF-8 output with LF (U+000A) line endings (§5)
- [ ] Use consistent indentation (default 2 spaces, no tabs) (§12)
- [ ] Escape \\, ", \n, \r, \t in quoted strings; reject other escapes (§7.1)
- [ ] Quote strings containing active delimiter, colon, or structural characters (§7.2)
- [ ] Emit array lengths [N] matching actual item count (§6, §9)
- [ ] Preserve object key order as encountered (§2)
- [ ] Normalize numbers to non-exponential decimal form (§2)
- [ ] Convert -0 to 0 (§2)
- [ ] Convert NaN/±Infinity to null (§3)
- [ ] Emit no trailing spaces or trailing newline (§12)
- [ ] When `keyFolding="safe"`, folding MUST comply with §13.4 (IdentifierSegment validation, no separator in segments, collision avoidance, no quoting required)
- [ ] When `flattenDepth` is set, folding MUST stop at the configured segment count (§13.4)

### 13.2 Decoder Conformance Checklist

Conforming decoders MUST:
- [ ] Parse array headers per §6 (length, delimiter, optional fields)
- [ ] Split inline arrays and tabular rows using active delimiter only (§11)
- [ ] Unescape quoted strings with only valid escapes (§7.1)
- [ ] Type unquoted primitives: true/false/null → booleans/null, numeric → number, else → string (§4)
- [ ] Enforce strict-mode rules when `strict=true` (§14)
- [ ] Preserve array order and object key order (§2)
- [ ] When `expandPaths="safe"`, expansion MUST follow §13.4 (IdentifierSegment-only segments, deep merge, conflict rules)
- [ ] When `expandPaths="safe"` with `strict=true`, MUST error on expansion conflicts per §14.5
- [ ] When `expandPaths="safe"` with `strict=false`, apply LWW conflict resolution (§13.4)

### 13.3 Validator Conformance Checklist

Validators SHOULD verify:
- [ ] Structural conformance (headers, indentation, list markers)
- [ ] Whitespace invariants (no trailing spaces/newlines)
- [ ] Delimiter consistency between headers and rows
- [ ] Array length counts match declared [N]
- [ ] All strict-mode requirements (§14)

## 14. Strict Mode Errors and Diagnostics (Authoritative Checklist)

When strict mode is enabled (default), decoders MUST error on the following conditions.

### 14.1 Array Count and Width Mismatches

- Inline primitive arrays: decoded value count ≠ declared N.
- List arrays: number of list items ≠ declared N.
- Tabular arrays: number of rows ≠ declared N.
- Tabular row width mismatches: any row's value count ≠ field count.

### 14.2 Syntax Errors

- Missing colon in key context.
- Invalid escape sequences or unterminated strings in quoted tokens.
- Delimiter mismatch (detected via width/count checks and header scope).

### 14.3 Indentation Errors

See §12 for indentation semantics. In strict mode, decoders MUST error on:
- Leading spaces not a multiple of indentSize.
- Any tab used in indentation (tabs allowed in quoted strings and as HTAB delimiter).

### 14.4 Structural Errors

See §12 for blank line semantics. In strict mode, decoders MUST error on:
- Blank lines inside arrays/tabular rows (between the first and last item/row).

For root-form rules, including handling of empty documents, see §5.

### 14.5 Path Expansion Conflicts

When `expandPaths="safe"` is enabled:
- With `strict=true` (default): Decoders MUST error on any expansion conflict.
- With `strict=false`: Decoders MUST apply deterministic last-write-wins (LWW) resolution in document order. Implementations MUST resolve conflicts silently and MUST NOT emit diagnostics during normal decode operations.

See §13.4 for complete conflict definitions, deep-merge semantics, and examples.

Note (informative): Implementations MAY expose conflict diagnostics via out-of-band mechanisms (e.g., debug hooks, verbose CLI flags, or separate validation APIs), but such facilities are non-normative and MUST NOT affect default decode behavior or output.

### 14.6 Recommended Error Messages and Validator Diagnostics (Informative)

Validators SHOULD additionally report:
- Trailing spaces, trailing newlines (encoding invariants).
- Headers missing delimiter marks when non-comma delimiter is in use.
- Values violating delimiter-aware quoting rules.

Recommended error messages:
- "Missing colon after key"
- "Unterminated string: missing closing quote"
- "Invalid escape sequence: \x"
- "Indentation must be an exact multiple of N spaces"
- "Tabs are not allowed in indentation"
- "Expected N tabular rows, but got M"
- "Expected N list array items, but got M"
- "Expected K values in row, but got L"

## 15. Security Considerations

- Injection and ambiguity are mitigated by quoting rules:
  - Strings with colon, the relevant delimiter (document or active), hyphen marker cases ("-" or strings starting with "-"), control characters, or brackets/braces MUST be quoted.
- Strict-mode checks (Section 14) detect malformed strings, truncation, or injected rows/items via length and width mismatches.
- Encoders SHOULD avoid excessive memory on large inputs; implement streaming/tabular row emission where feasible.
- Unicode:
  - Encoders SHOULD avoid altering Unicode beyond required escaping; decoders SHOULD accept valid UTF-8 in quoted strings/keys (with only the five escapes).

## 16. Internationalization

- Full Unicode is supported in keys and values, subject to quoting and escaping rules.
- Encoders MUST NOT apply locale-dependent formatting for numbers or booleans (e.g., no thousands separators).
- ISO 8601 strings SHOULD be used for Date normalization.

## 17. Interoperability and Mappings (Informative)

This section describes TOON's relationship with other serialization formats and provides guidance on conversion and interoperability.

### 17.1 JSON Interoperability

TOON models the same data types as JSON [RFC8259]: objects, arrays, strings, numbers, booleans, and null. After normalization (Section 3), TOON can deterministically encode any JSON-compatible data structure.

Round-trip Compatibility:

JSON → TOON → JSON round-trips preserve all JSON values, with these normalization behaviors:
- JavaScript-specific types (Date, Set, Map, BigInt) normalize per Section 3
- NaN and ±Infinity normalize to null
- -0 normalizes to 0
- Object key order is preserved (as encountered)

Example: JSON to TOON Conversion

JSON input:
```json
{
  "users": [
    { "id": 1, "name": "Alice", "active": true },
    { "id": 2, "name": "Bob", "active": false }
  ],
  "count": 2
}
```

TOON output (tabular format):
```
users[2]{id,name,active}:
  1,Alice,true
  2,Bob,false
count: 2
```

### 17.2 CSV Interoperability

TOON's tabular format generalizes CSV [RFC4180] with several enhancements:

Advantages over CSV:
- Explicit array length declarations enable validation
- Field names declared in header (no separate header row)
- Supports nested structures (CSV is flat-only)
- Three delimiter options (comma/tab/pipe) vs CSV's comma-only
- Type-aware encoding (primitives, not just strings)

Example: CSV to TOON Conversion

CSV input:
```csv
id,name,price
A1,Widget,9.99
B2,Gadget,14.50
```

TOON equivalent:
```
items[2]{id,name,price}:
  A1,Widget,9.99
  B2,Gadget,14.5
```

Conversion Guidelines:
- CSV headers map to TOON field names
- CSV data rows map to TOON tabular rows
- CSV string escaping (double-quotes) maps to TOON quoting rules
- CSV row count can be added as array length declaration

### 17.3 YAML Interoperability

TOON shares YAML's indentation-based structure but differs significantly in syntax:

Similarities:
- Indentation for nesting
- List items with hyphen markers (- )
- Minimal quoting for simple values

Differences:
- TOON requires explicit array headers with lengths
- TOON uses colon-space for key-value (no other separators)
- TOON has no comment syntax (YAML has #)
- TOON is deterministic (YAML allows multiple representations)

Example: YAML to TOON Conversion

YAML input:
```yaml
server:
  host: localhost
  port: 8080
  tags:
    - web
    - api
```

TOON equivalent:
```
server:
  host: localhost
  port: 8080
  tags[2]: web,api
```

## 18. IANA Considerations

### 18.1 Media Type Registration

This specification does not request IANA registration at this time, as the format is still in Working Draft status. When this specification reaches Candidate Standard status (per the criteria in "Status of This Document"), formal media type registration will be requested following the procedures defined in [RFC6838].

### 18.2 Provisional Media Type

Until IANA registration is completed, implementations SHOULD use:
- Media type: `text/toon`
- File extension: `.toon`

Full designation details:

Type name: text

Subtype name: toon (provisional, not IANA-registered)

Required parameters: None

Optional parameters:
- charset: Although TOON is always UTF-8, the charset parameter MAY be specified as "charset=utf-8". If absent, UTF-8 MUST be assumed.

Encoding considerations: 8-bit. TOON documents are UTF-8 encoded text with LF (U+000A) line endings.

Security considerations: See Section 15.

Interoperability considerations: See Section 17.

Published specification: This document.

Applications: LLM-based applications, prompt engineering tools, data serialization for AI contexts, configuration management systems.

Fragment identifier considerations: None defined.

Additional information:
- File extension: .toon
- Macintosh file type code: TEXT
- Contact: See Appendix E (Author section)

Intended usage: COMMON (upon standardization)

Restrictions on usage: None

Change controller: Community-maintained. See repository at https://github.com/toon-format/spec

### 18.3 Implementation Status

Implementers SHOULD be aware that the media type designation `text/toon` is provisional and MAY be subject to change before formal IANA registration. Early implementers are encouraged to monitor the specification repository for updates.

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

name: "bad\xescapse"

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

tags[0]:

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

Quoted keys with arrays (keys requiring quoting per Section 7.3):
```
"my-key"[3]: 1,2,3

"x-items"[2]{id,name}:
  1,Ada
  2,Bob

"x-items"[2]:
  - id: 1
  - id: 2
```

Key folding and path expansion (v1.5+):

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

These sketches illustrate structure and common decoding helpers. They are informative; normative behavior is defined in Sections 4–12 and 14.

### B.1 Decoding Overview

- Split input into lines; compute depth from leading spaces and indent size (Section 12).
- Skip ignorable blank lines outside arrays/tabular rows (Section 12).
- Decide root form per Section 5.
- For objects at depth d: process lines at depth d; for arrays at depth d: read rows/list items at depth d+1.

### B.2 Array Header Parsing

- Locate the first "[ … ]" segment on the line; parse:
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

- If token starts with a quote, it MUST be a properly quoted string (no trailing characters after the closing quote). Unescape using only the five escapes; otherwise MUST error.
- Else if token is true/false/null → boolean/null.
- Else if token is numeric without forbidden leading zeros and finite → number.
  - Examples: `"1.5000"` → `1.5`, `"-1E+03"` → `-1000`, `"-0"` → `0` (host normalization applies)
- Else → string.

### B.5 Object and List Item Parsing

- Key-value line: parse a key up to the first colon; missing colon → MUST error. The remainder of the line is the primitive value (if present).
- Nested object: "key:" with nothing after colon opens a nested object. If this is:
  - A field inside a regular object: nested fields are at depth +1 relative to that line.
  - The first field on a list-item hyphen line: nested fields at depth +2 relative to the hyphen line; subsequent fields at +1.
- List items:
  - Lines start with "- " at one deeper depth than the parent array header.
  - After "- ":
    - If "[ … ]:" appears → inline array item; decode with its own header and active delimiter.
    - Else if a colon appears → object with first field on hyphen line.
    - Else → primitive token.

### B.6 Blank-Line Handling

- Track blank lines during scanning with line numbers and depth.
- For arrays/tabular rows:
  - In strict mode, any blank line between the first and last item/row line MUST error.
  - In non-strict mode, blank lines MAY be ignored and not counted as items/rows.
- Outside arrays/tabular rows:
  - Blank lines SHOULD be ignored (do not affect root-form detection or object boundaries).

## Appendix C: Test Suite and Compliance (Informative)

### Reference Test Suite

A language-agnostic reference test suite is maintained at:
https://github.com/toon-format/spec/tree/main/tests

The test suite is versioned alongside this specification. Implementations are encouraged to validate against this test suite, but conformance is determined solely by adherence to the normative requirements in Sections 1-16 and Section 19 of this specification. Test coverage does not define the specification; the specification defines conformance.

The reference test suite provides validation for implementations but is not exhaustive. Implementers remain responsible for ensuring their implementations conform to all normative requirements.

### Test Coverage

The reference test suite covers:
- Primitive encoding/decoding, quoting, control-character escaping.
- Object key encoding/decoding and order preservation.
- Primitive arrays (inline), empty arrays.
- Arrays of arrays (expanded), mixed-length and empty inner arrays.
- Tabular detection and formatting, including delimiter variations.
- Mixed arrays and objects-as-list-items behavior, including nested arrays and objects.
- Whitespace invariants (no trailing spaces/newline).
- Canonical number formatting (no exponent, no trailing zeros, no leading zeros).
- Decoder strict-mode errors: count mismatches, invalid escapes, missing colon, delimiter mismatches, indentation errors, blank-line handling.

Note: Host-type normalization tests (e.g., BigInt, Date, Set, Map) are language-specific and maintained in implementation repositories. See Appendix G for normalization guidance.

## Appendix D: Document Changelog (Informative)

This appendix summarizes major changes between spec versions. For the complete changelog, see [`CHANGELOG.md`](./CHANGELOG.md) in the specification repository.

### v3.0 (2025-11-24)

- Standardized encoding for list-item objects whose first field is a tabular array (§10).

### v2.1 (2025-11-23)

- Tightened canonical encoding for objects as list items (§10): bare `-` for multi-field objects, compact `- key[N]{fields}:` only for single-field tabular arrays, to improve visual consistency and LLM readability.

### v2.0 (2025-11-10)

- Removed `[#N]` length-marker syntax from array headers; `[N]` is now the only valid form.

### v1.5 (2025-11-08)

- Added optional key folding (`keyFolding="safe"`) and path expansion (`expandPaths="safe"`) with deep-merge semantics and strict-mode conflict handling (§13.4, §14.5).

### v1.4 (2025-11-05)

- Generalized normalization and numeric canonicalization rules, and added host-type normalization guidance (Appendix G).

### v1.3 (2025-10-31)

- Added numeric precision guidance and ABNF core rules for headers and keys (§2, §6).

### v1.2 (2025-10-29)

- Tightened delimiter scoping, indentation, blank-line handling, hyphen-based quoting, BigInt normalization, and row/key disambiguation rules (§2, §9, §11-§12).

### v1.1 (2025-10-29)

- Introduced strict-mode validation, delimiter-aware parsing, and decoder options (indent, strict).

### v1.0 (2025-10-28)

- Initial specification: encoding normalization, decoding interpretation, and conformance requirements.

## Appendix E: Acknowledgments and License

### Author

This specification was created and is maintained by Johann Schopplich, who also maintains the reference TypeScript/JavaScript implementation.

### Community Implementations

Implementations of TOON in other languages have been created by community members. For a complete list with repository links and maintainer information, see the [Other Implementations](https://github.com/toon-format/toon#other-implementations) section of the README.

### License

This specification and reference implementation are released under the MIT License (see repository for details).

---

## Appendix F: Cross-check With Reference Behavior (Informative)

- The reference encoder/decoder test suites implement:
  - Safe-unquoted string rules and delimiter-aware quoting (document vs active delimiter).
  - Header formation and delimiter-aware parsing with active delimiter scoping.
  - Tabular detection requiring uniform keys and primitive-only values.
  - Objects-as-list-items parsing (+2 nested object rule; +1 siblings).
  - Whitespace invariants for encoding and strict-mode indentation enforcement for decoding.
  - Blank-line handling and trailing-newline acceptance.

## Appendix G: Host Type Normalization Examples (Informative)

This appendix provides non-normative guidance on how implementations in different programming languages MAY normalize host-specific types to the JSON data model before encoding. The normative requirement is in Section 3: implementations MUST normalize non-JSON types to the JSON data model and MUST document their normalization policy.

### G.1 Go

Go implementations commonly normalize the following host types:

Numeric Types:
- `big.Int`: If within `int64` range, convert to number. Otherwise, convert to quoted decimal string per lossless policy.
- `math.Inf()`, `math.NaN()`: Convert to `null`.

Temporal Types:
- `time.Time`: Convert to ISO 8601 string via `.Format(time.RFC3339)` or `.Format(time.RFC3339Nano)`.

Collection Types:
- `map[K]V`: Convert to object. Keys MUST be strings or convertible to strings via `fmt.Sprint`.
- `[]T` (slices): Preserve as array.

Struct Types:
- Structs with exported fields: Convert to object using JSON struct tags if present.

Non-Serializable Types:
- `nil`: Maps to `null`.
- Functions, channels, `unsafe.Pointer`: Not serializable; implementations MUST error or skip these fields.

### G.2 JavaScript

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
- Objects with a `toJSON()` method: Call `value.toJSON()` and then normalize the returned value recursively before encoding. This allows domain objects to override default normalization behavior in a controlled, deterministic way (similar to `JSON.stringify`). Implementations SHOULD guard against `toJSON()` returning the same object (to avoid infinite recursion) and MAY fall back to default normalization in that case.
- Plain objects: Enumerate own enumerable string keys in encounter order; normalize values recursively.

Non-Serializable Types:
- `undefined`, `function`, `Symbol`: Convert to `null`.

### G.3 Python

Python implementations commonly normalize the following host types:

Numeric Types:
- `decimal.Decimal`: Convert to `float` if representable without loss, OR convert to quoted decimal string for exact preservation (implementation policy).
- `float('inf')`, `float('-inf')`, `float('nan')`: Convert to `null`.
- Arbitrary-precision integers (large `int`): Emit as number if within host numeric range, OR as quoted decimal string per lossless policy.

Temporal Types:
- `datetime.datetime`, `datetime.date`, `datetime.time`: Convert to ISO 8601 string representation via `.isoformat()`.

Collection Types:
- `set`, `frozenset`: Convert to list (array).
- `dict`: Preserve as object with string keys. Non-string keys MUST be coerced to strings.

Object Types:
- Custom objects: Extract attributes via `__dict__` or implement custom serialization; convert to object (dict) with string keys.

Non-Serializable Types:
- `None`: Maps to `null`.
- Functions, lambdas, modules: Convert to `null`.

### G.4 Rust

Rust implementations commonly normalize the following host types (typically using serialization frameworks like `serde`):

Numeric Types:
- `i128`, `u128`: If within `i64`/`u64` range, emit as number. Otherwise, convert to quoted decimal string per lossless policy.
- `f64::INFINITY`, `f64::NEG_INFINITY`, `f64::NAN`: Convert to `null`.

Temporal Types:
- `chrono::DateTime<T>`: Convert to ISO 8601 string via `.to_rfc3339()`.
- `chrono::NaiveDate`, `chrono::NaiveTime`: Convert to ISO 8601 partial representations.

Collection Types:
- `HashSet<T>`, `BTreeSet<T>`: Convert to `Vec<T>` (array).
- `HashMap<K, V>`, `BTreeMap<K, V>`: Convert to object. Keys MUST be strings or convertible to strings via `Display` or `ToString`.

Enum Types:
- Unit variants: Convert to string of variant name (e.g., `Color::Red` → `"Red"`).
- Tuple/struct variants: Typically convert to object with `"type"` field and data fields per `serde` conventions.

Non-Serializable Types:
- `Option::None`: Convert to `null`.
- `Option::Some(T)`: Unwrap and normalize `T`.
- Function pointers, raw pointers: Not serializable; implementations MUST error or skip these fields.

### G.5 General Guidance

Implementations in any language SHOULD:
1. Document their normalization policy clearly, especially for:
   - Large or arbitrary-precision numbers (lossless string vs. approximate number)
   - Date/time representations (ISO 8601 format details)
   - Collection type mappings (order preservation for sets)
2. Provide configuration options where multiple strategies are reasonable (e.g., lossless vs. approximate numeric encoding).
3. Ensure that normalization is deterministic: encoding the same host value twice MUST produce identical TOON output.

## 19. TOON Core Profile (Normative Subset)

This profile captures the most common, memory-friendly rules by reference to normative sections.

- Character set and line endings: As defined in §1 (Core Concepts) and §12.
- Indentation: MUST conform to §12 (2 spaces per level by default; strict mode enforces indentSize multiples).
- Keys and colon syntax: MUST conform to §7.2 (unquoted keys match ^[A-Za-z_][A-Za-z0-9_.]*$; quoted otherwise; colon required after keys).
- Strings and quoting: MUST be quoted as defined in §7.2 (deterministic quoting rules for empty strings, whitespace, reserved literals, control characters, delimiters, leading hyphens, and structural tokens).
- Escape sequences: MUST conform to §7.1 (only \\, \", \n, \r, \t are valid).
- Numbers: Encoders MUST emit canonical form per §2; decoders MUST accept input per §4.
- Arrays and headers: Header syntax MUST conform to §6; array encoding as defined in §9.
- Delimiters: Delimiter scoping and quoting rules as defined in §11.
- Objects as list items: Indentation rules as defined in §10.
- Root form determination: As defined in §5.
- Strict mode validation: All checks enumerated in §14.

## 20. Versioning and Extensibility

This specification uses semantic versioning (major.minor format). Breaking changes (incompatible with previous versions) will increment the major version number (e.g., v2.0). Minor version increments represent clarifications, additional conformance requirements, or backward-compatible additions that do not break existing conformant implementations.

For a detailed version history, see Appendix D.

### Extensibility

- Backward-compatible evolutions SHOULD preserve current headers, quoting rules, and indentation semantics.
- Reserved/structural characters (colon, brackets, braces, hyphen) MUST retain current meanings.
- The path separator (see §1.9) is fixed to `"."` in v1.5; future versions MAY make this configurable.
- Future work (non-normative): schemas, comments/annotations, additional delimiter profiles, optional \uXXXX escapes (if added, must be precisely defined).

## 21. Intellectual Property Considerations

This specification is released under the MIT License (see repository and Appendix E for details). No patent disclosures are known at the time of publication. The authors intend this specification to be freely implementable without royalty requirements.

Implementers should be aware that this is a community specification and not a formal standards-track document from a recognized standards body (such as IETF, W3C, or ISO). No formal patent review process has been conducted. Implementers are responsible for conducting their own intellectual property due diligence as appropriate for their use case.

The MIT License permits free use, modification, and distribution of both this specification and conforming implementations, subject to the license terms.
