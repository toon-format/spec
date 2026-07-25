# TOON

Token-Oriented Object Notation – a line-oriented, indentation-based encoding of the JSON data model. This glossary is the ubiquitous language for the format itself: the spec, the reference implementation, the docs site, and every README. `SPEC.md` is ground truth; where this file and the spec disagree, the spec wins and this file is wrong.

## Forms

A **form** is one rendering of a value. The same data can be expressible in more than one form; which one an encoder emits follows from the value's shape and its position under SPEC §9, not from encoder preference. Four forms exist, and every one of them is named `<qualifier> form` – never `format`, which is reserved for the TOON format as a whole.

**Inline form**:
A primitive array rendered on its header line, values separated by the active delimiter.
_Avoid_: inline format, inline array format

**List form**:
An array rendered as one list item per line (`- value`, or a bare `-` for an empty-object item), used wherever neither inline nor tabular form is available.
_Avoid_: expanded list, expanded form, list format, hyphen form

**Tabular form**:
An array of uniform objects rendered as a header that declares the field list once, followed by one row per element.
_Avoid_: tabular format, tabular layout, tabular structure, table form

**Keyed tabular form**:
An object whose values are uniform objects rendered as a keyed header followed by one entry row per entry, each row carrying its own key.
_Avoid_: keyed form, keyed object format, map form

## Headers

**Header**:
The bracketed declaration that opens an array or keyed tabular object, ending in a colon. Its two kinds are the array header and the keyed header; a tabular header is an array header carrying a field list.

**Array header**:
A header introducing an array – `key[N]:`, with or without a field list.

**Tabular header**:
An array header carrying a field list, so its scope holds rows rather than list items.
_Avoid_: field header, fields header, `{fields}` header, column header

**Keyed header**:
A header whose bracket segment carries a colon after the length (`key[N:]{…}:`), marking keyed tabular form.

**Bracket segment**:
The `[N]` / `[N:]` part of a header, declaring the length (or entry count) and optionally the active delimiter.

**Field list**:
The brace-enclosed, delimiter-separated list of field entries in a header: `{id,name}`.
_Avoid_: brace group, column list, schema
_Note_: `fields segment` is the ABNF production name (`fields-seg`, §6). Use it only when referring to the grammar; prose and error messages say **field list**.

**Field entry**:
One member of a field list – a field name, optionally carrying its own nested field group.

**Nested field group**:
A field list attached to a field name inside a header (`customer{name,country}`), declaring a nested-uniform column while rows stay flat.
_Avoid_: nested fields, subfield group, folded object

**Leaf field**:
A field entry with no nested field group. Row and entry-row cells map one-to-one to leaf fields in depth-first header order.

## Depth

**Content depth**:
The depth at which a scope's immediate content appears – one level deeper than the line that opens the scope, except for first fields carried on a list-item hyphen line (SPEC §10).

**Row depth**:
The content depth of a tabular array's scope, at which its rows appear.

**Entry depth**:
The content depth of a keyed tabular object's scope, at which its entry rows appear.

**Header span**:
The lines from the first row, entry row, or list item in a header's scope through the last line of that scope's content. Blank lines inside a header span are a strict-mode error.
_Avoid_: array span

## Rows, entries, and items

**Row**:
One line of cells under a tabular header. Qualify as **tabular row** where ambiguity with entry rows is possible.
_Avoid_: record, data line

**Cell**:
One primitive value within a row or entry row.

**Entry row**:
A line `entrykey: cell,cell…` under a keyed header, carrying one entry's key and its leaf values.
_Avoid_: keyed row, keyed entry

**Entry key**:
The key token of an entry row, preceding the row's first unquoted colon. It becomes a key of the decoded object.

**List item**:
A line beginning with `- ` (or a bare `-` for an empty-object item) representing one element of an array in list form.

## Shape classification

**Column**:
The sequence of values at one key across all elements of an array (or all entry values of an object). Tabular detection (SPEC §9.3) is decided per column.

**Uniform-primitive**:
A column whose every value is a primitive.

**Nested-uniform**:
A column whose every value is a non-empty object, all sharing one key set, with every sub-column itself uniform-primitive or nested-uniform.

**Non-uniform**:
Any array or column that fails tabular detection. A non-uniform array falls back to list form; an object that fails keyed tabular detection stays in ordinary nested object form (SPEC §9.5).
_Avoid_: mixed (except in the compound "mixed and non-uniform arrays", which names §9.4's data shape)

## Delimiters

**Active delimiter**:
The delimiter declared by the closest header in scope. Governs splitting and quoting for inline values, tabular row cells, and entry row cells.

**Document delimiter**:
The encoder-selected delimiter governing quoting for object field values, everywhere in the document.

## Beyond the format

**Tabular eligibility**:
Benchmark-only measure – the percentage of a dataset's arrays that qualify for tabular form. Not a spec concept.

**Strict mode**:
Decoder mode enforcing declared counts, row widths, indentation, and delimiter consistency. Default on.

## Standing rules

- **Prefer *form* over *format* for the four renderings.** "Tabular format" wrongly implies a sibling of JSON or YAML rather than a shape inside TOON. `format` stays correct for TOON itself ("text format", "number formatting"). This is a preference for new prose, not a retroactive sweep: heading anchors, test-fixture `name`/`description`/`note` strings, and CHANGELOG entries are out of scope.
- **`field` is overloaded on purpose.** §8 uses it for object properties ("sibling fields"); §9.3 uses it for field-list members ("leaf field"). Disambiguate with a compound – *object field*, *leaf field*, *field entry* – never by inventing a new word.
- **`entry` likewise.** *Field entry* is a field-list member; *entry row* and *entry key* belong to keyed tabular form.
- **Prose beats grammar names.** Reader-facing text and error messages use the concept names above; ABNF production names appear only when discussing the grammar.
- **"form" also carries its ordinary English sense throughout SPEC.md** – root form (§5), canonical decimal and exponent form (§2), the empty-array value form `key: []` (§9.1), the legacy header form (§9.1), quoted and unquoted forms (§7.4). None of these are the four renderings above and none should be renamed; §5's heading anchor in particular is widely referenced.
