# Changelog

All notable changes to the TOON specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Each version lists what changed for encoders and decoders; patch releases that changed a rule appear under their minor version. The project follows the MAJOR.MINOR versioning policy described in [VERSIONING.md](./VERSIONING.md).

## [Unreleased]

### Encoders

- Blank lines are never emitted (§12).

### Decoders

- Non-strict mode keeps only the five recoveries of §14.4, each now a MUST; every other condition errors in both modes, such as malformed headers, over-indented lines, trailing content, row-width mismatches, and ill-formed UTF-8 (§14).
- Only SP and HTAB are whitespace, and characters are Unicode scalar values, so NBSP is content and a combining mark never hides a syntax character (§1.2).
- Blank lines outside header spans and a trailing newline are ignored in both modes (§12).
- Extra spaces may follow a list-item hyphen before any item, never joining a key (§5.2).

### Fixtures

- Non-strict cases for dropped recoveries now expect an error.

### Compatibility

Documents a conforming 4.x encoder emits decode as before, though non-strict decoders may now reject out-of-range numbers. Other Decoders changes alter results only on input no conforming encoder emits, where VERSIONING.md now lets a MINOR change non-strict behavior.

## [4.3] - 2026-10-06

### Decoders

- A line whose first unquoted `[` precedes its first unquoted colon must be a valid array header: strict mode errors instead of reading `a[2:]{x}` as `{"a[2": "]{x}"}`, and non-strict mode may still read it as a key-value line (§5.2, §14.2).

### Fixtures

- The key-value fall-through case now runs in non-strict mode, and its strict counterpart expects an error from `minSpecVersion` 4.3.

### Compatibility

Documents a conforming 4.x encoder emits decode as before; the Decoders change concerns input no conforming encoder emits.

## [4.2] - 2026-10-06

### Encoders

- Numbers use the shortest round-trip digits (§2).
- Characters needing no escape are emitted literally, and `\uXXXX` uses lowercase hex (§7.1).
- Strings and keys are quoted only where required, primitive list items against the document delimiter (§7.2, §7.3).

### Decoders

- A `"` opens a quoted span at any position, and a hyphen marks a list item only at item depth (§5.2).
- A line without an unquoted colon is never a header (§6).
- Strict mode rejects an indented first line, a tabs-only line, an empty field entry, and a nameless or space-preceded nested group (§6, §8).
- Non-strict mode recovers only as specified, newly with U+FFFD for ill-formed UTF-8 (§4, §14).
- Raw controls inside quotes decode as themselves, and an empty key token is the empty key (§7.1, §7.4).

### Compatibility

Documents a conforming 4.x encoder emits decode as before; the Decoders changes concern input no conforming encoder emits.

## [4.1] - 2026-07-26

### Encoders

- Tabular form where allowed, `key: []` and `[]`, and a list-item object's first field on the hyphen line become required (§9, §10).
- Headers declare the document delimiter, and encoders emit no byte-order mark and reject unpaired surrogates (§3, §11.1).

### Decoders

- Characters after a closing quote error; headers and field lists accept any unquoted key token (§7.4).
- A leading byte-order mark and trailing spaces are stripped (§12).
- In non-strict mode, a declared length never truncates a scope (§14.1).
- Strict mode rejects `foo [2]:` and field names repeated under zero rows; stray scalar lines always error (§6, §14.2).

### Compatibility

Documents a conforming 4.0 encoder emits decode as before, except a root string starting with U+FEFF, which loses its U+FEFF, and documents beyond a new optional depth limit. The other Decoders changes concern input no conforming encoder emits; VERSIONING.md now lets a MINOR tighten encoders and reinterpret such input.

### Patch releases

- `4.1.2` – A root string starting with U+FEFF is quoted (§7.2).
- `4.1.3` – A stray scalar line errors in non-strict mode even after a complete root form or below a line that opens no scope, and VERSIONING.md no longer promises a deprecation notice before a MAJOR (§5, §8).

## [4.0] - 2026-07-22

### Breaking

- A line whose first non-space character is `#` is a comment that decoders drop (§5.1). Stored 3.x output loses an unquoted `#`-leading root scalar or first tabular cell; find such documents with `/^ *#/`, decode them with a 3.x decoder, and re-encode.
- The `keyFolding`, `flattenDepth`, and `expandPaths` options are removed, and dotted keys are always literal (§8). Decode `keyFolding: "safe"` output with a 3.x decoder using `expandPaths: "safe"`, then re-encode.
- Encoders write columns of uniform objects as nested field groups (§9.3), which strict 3.x decoders reject; upgrade decoders first ([#46](https://github.com/toon-format/spec/issues/46), thanks @Turtle-dev3).
- Objects of two or more uniform objects encode in keyed tabular form, `users[2:]{age,city}:` (§9.5), which strict 3.x decoders reject and non-strict ones mis-decode; upgrade decoders first ([#57](https://github.com/toon-format/spec/issues/57), after [#32](https://github.com/toon-format/spec/issues/32) and [#45](https://github.com/toon-format/spec/issues/45), thanks @cstroliadavis, @metafishTV).

### Encoders

- Strings starting with `#` and number-like strings with a leading plus are quoted (§7.2).

### Decoders

- Only tokens matching the number grammar are numbers, so forms like `+1` or `NaN` are strings (§4, [#52](https://github.com/toon-format/spec/pull/52), thanks @montanaflynn).
- Tokens are trimmed of spaces only (§12, [#56](https://github.com/toon-format/spec/discussions/56), thanks @liquidaty).
- Any text before a line's first unquoted colon is a valid key, even in strict mode (§7.4).
- CRLF input is accepted, and `- []` is an empty array, not the string `[]` (§9.2, §12).
- `__proto__`, `constructor`, and `prototype` are ordinary keys that never touch the host object model (§15).
- Strict mode rejects over-indented lines, content after a complete root array, scalar lines outside the root, and ill-formed UTF-8 (§8, §14.2).

### Fixtures

- The option key `indent` is now `indentSize`.

### Compatibility

Documents a conforming 3.x encoder emits decode as before, except `#`-leading lines and number-like strings such as `+1`, which some 3.x decoders read as numbers. The other Decoders changes concern input no conforming encoder emits.

## [3.3] - 2026-05-21

### Encoders

- A number whose non-zero magnitude is below 1e-6 or at least 1e21 may be written in JSON exponent notation; all other numbers stay plain decimal (§2).
- A number outside the implementation's numeric domain, written as a quoted string, may use plain decimal or exponent form, as the implementation documents (§2).

### Compatibility

Documents a conforming 3.2 encoder emits decode as before, and decoder behavior is unchanged. The option `indent` is now `indentSize`, and implementations may spell option names and values idiomatically when they document the mapping.

## [3.2] - 2026-05-20

### Encoders

- An array containing an empty object uses list form (§9.3).
- An array of objects or a non-uniform array as a list item is written `- [M]:` with its items below (§9.4).

### Decoders

- Duplicate sibling keys error in strict mode, and non-strict mode silently keeps the last value (§14.4).
- Strict mode rejects malformed lengths such as `[03]` and anything between `]` and `{` or `:`, spaces included; non-strict mode may read the line as key-value (§6, §14.2).
- Settled edge cases: a whitespace-only line may count as blank at any indentation, and decoders tolerate spacing other than one space after a header colon (§6, §12).

### Fixtures

- Literal-key header cases now run with `strict: false`.

### Compatibility

Documents a conforming 3.1 encoder emits decode as before; the Decoders changes concern input no conforming encoder emits. VERSIONING.md now lets a MINOR add strict-mode errors and keeps patch releases editorial.

## [3.1] - 2026-05-18

### Encoders

- Strings containing any U+0000–U+001F character are quoted, with controls other than LF, CR, and HTAB written as `\uXXXX`, never stripped (§7.1, §7.2).
- Empty arrays are written `key: []` and root `[]`, with `key[0]:` and `[0]:` still allowed; an empty array as a list item stays `- [0]:` (§9.1, §9.2).

### Decoders

- `\uXXXX` escapes work in quoted strings and keys, and short or surrogate escapes error (§7.1).
- `key: []` and a root `[]` decode as empty arrays (§9.1).
- With `expandPaths: "safe"`, quoted dotted keys stay literal (§13.4).

### Fixtures

- Empty-array encode cases now expect `key: []` and `[]`.

### Compatibility

Documents a conforming 3.0 encoder emits decode as before, except quoted dotted keys under `expandPaths: "safe"`; the other Decoders changes concern input no conforming encoder emits. Upgrade decoders first: 3.0 decoders read `key: []` as a string and reject `\uXXXX`. VERSIONING.md now lets a MINOR broaden decoder input.

## [3.0] - 2025-11-24

### Breaking

- Under a hyphen-line `- key[N]{fields}:` or `- key[N]:`, rows and items now sit two levels below the hyphen instead of one, so 2.x documents using these forms, 2.1's single-field tabular output included, no longer decode as before; re-encode them from a 2.x decode and switch encoders and decoders together (§10).

### Encoders

- A non-empty list-item object puts its first field on the hyphen line – required when that field is a tabular array, recommended otherwise – and a bare `-` now marks only an empty object (§10).

### Fixtures

- List-item encode and decode cases now expect the 3.0 layout.

### Patch releases

- `3.0.1` – Leading-zero tokens such as `-05` decode as strings while `-0e1` stays a number, and encoders may honor host serialization hooks such as `toJSON()` (§2, §3).
- `3.0.3` – A line with non-whitespace between `]` and `{` or `:` is no array header; decoders should read it as a key-value line with a literal key (§6).

## [2.1] - 2025-11-23

### Encoders

- A list-item object is now a bare `-` line with all its fields at depth +1; only an object whose single field is a tabular array keeps `- key[N]{fields}:` on the hyphen line (§10).

### Decoders

- A bare `-` followed by fields at depth +1 decodes as an object holding those fields, and the first-field-on-hyphen form stays valid (§10).

### Fixtures

- Existing encode cases for list-item objects now expect the bare-hyphen form and carry `minSpecVersion` 2.1.

### Compatibility

Documents a conforming 2.0 encoder emits decode as before, and the Decoders change concerns input no 2.0 encoder emits. A 2.0 decoder knows a bare `-` only as an empty object, so upgrade decoders before encoders.

## [2.0] - 2025-11-10

### Breaking

- The `[#N]` length marker is removed: encoders never emit it and decoders reject it, which breaks documents encoded with `lengthMarker` enabled. Re-encode them without the option before upgrading decoders; 1.x decoders already read `[N]` (§6).
- The `lengthMarker` encoder option is removed, which affects callers that set it; drop it from the encoder configuration (§13).

## [1.5] - 2025-11-08

### Encoders

- New options `keyFolding` (`"off"` by default, or `"safe"`) and `flattenDepth` fold chains of single-key objects into one dotted key, such as `a.b.c: 1` (§13.4).

### Decoders

- New option `expandPaths` (`"off"` by default, or `"safe"`) splits dotted keys made of identifier segments into nested objects and deep-merges them; a conflict errors in strict mode and the last write wins otherwise (§13.4, §14.5).

### Compatibility

`keyFolding` and `expandPaths` default to `"off"`, so encoder output and decoder results stay unchanged unless a caller enables them.

## [1.4] - 2025-11-05

### Encoders

- Numbers drop trailing fractional zeros (§2).
- A number the host cannot hold exactly may become a quoted exact decimal string or a lossy number (§2).
- Unquoted keys allow only ASCII letters, digits, `_`, and `.`, so non-ASCII keys are quoted on every host (§7.3).

### Decoders

- An empty document decodes to `{}`, also in strict mode (§5).
- A number the host cannot hold exactly may decode to a wider type, a string, or an approximation, per a documented policy (§2).
- Settled edge cases: field-list and bracket delimiters must match in strict mode, an empty value between delimiters is `""`, and non-strict tab indentation is implementation-defined (§6, §12).

### Compatibility

Documents a conforming 1.3 encoder emits decode as before, except an empty root object's empty document and numbers the decoding host cannot hold exactly. The other Decoders changes concern input no conforming encoder emits.

## [1.3] - 2025-10-31

### Encoders

- An encoded number must decode to the original value; JavaScript encoders should use `Number.toString()`, and numbers above about 10^20 should become quoted decimal strings when exact precision is required (§2).

### Compatibility

Documents a conforming 1.2 encoder emits decode as before. The spec now commits to a MAJOR version bump for any breaking change.

## [1.2] - 2025-10-29

### Encoders

- Outside any array, a string is quoted when it contains the document delimiter, the encoder's `delimiter` option (§7.2, §11).

### Decoders

- Strict mode rejects indentation that is not a multiple of `indent`, tabs in indentation, blank lines inside an array, and two or more primitive lines at the root (§5, §12).
- Empty input must error in strict mode, formerly should (§14).
- Blank lines outside arrays and a trailing newline are ignored (§12).
- Rows and key-value lines are told apart by the first unquoted delimiter and colon, so a quoted colon in a row no longer ends a tabular array (§9.3).

### Compatibility

Documents a conforming 1.1 encoder emits decode as before, except a tabular row whose first cell is a quoted string with a colon, and an empty root object's empty document. The other Decoders changes concern input no conforming encoder emits.

## [1.1] - 2025-10-29

### Decoders

- Decoding is now normative: token typing, array headers with an ignored `#` length marker, splitting on the header's delimiter, and telling rows from key-value lines (§3A, §15).
- Invalid escapes, unterminated strings, and keys without a colon are errors (§3A).
- New option `strict` (default `true`): length and row-width mismatches error, and empty input should error (§15, §16).
- New option `indent` (default 2) sets the indentation unit (§15).

### Compatibility

Encoder rules are unchanged. The empty document a 1.0 encoder emits for an empty root object should now fail in strict mode.

## [1.0] - 2025-10-28

### Encoders

- First release, covering encoding only: data model, host-type normalization, syntax, and encoder conformance, with the options `indent`, `delimiter`, and `lengthMarker`; decoding is out of scope (§3, §15).
