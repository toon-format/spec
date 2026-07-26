# TOON Test Fixtures

This directory contains **language-agnostic JSON test fixtures** for validating TOON implementations against the specification. These fixtures cover core specification requirements; conformance is defined by SPEC.md (§13 and Appendix C), not by this fixture suite.

## Directory Structure

```
tests/
├── fixtures.schema.json    # JSON Schema for fixture validation
├── fixtures/
│   ├── encode/             # Encoding tests (JSON → TOON)
│   └── decode/             # Decoding tests (TOON → JSON)
└── README.md               # This file
```

The [Test Coverage](#test-coverage) tables below index every fixture file.

## Fixture Format

All test fixtures follow a standard JSON structure defined in [`fixtures.schema.json`](./fixtures.schema.json):

```json
{
  "version": "<spec-version>",
  "category": "encode",
  "description": "Brief description of test category",
  "tests": [
    {
      "name": "descriptive test name",
      "input": "JSON value or TOON string",
      "expected": "TOON string or JSON value",
      "options": {},
      "specSection": "7.2",
      "note": "Optional explanation"
    }
  ]
}
```

### Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | Baseline TOON spec version for this file. Per-test `minSpecVersion` overrides this for individual tests that exercise newer behavior. Fixtures remain valid for all later versions. |
| `category` | Yes | Test category: `"encode"` or `"decode"` |
| `description` | Yes | Brief description of what this fixture tests |
| `tests` | Yes | Array of test cases |
| `tests[].name` | Yes | Descriptive name explaining what is validated |
| `tests[].input` | Yes | Input value (JSON for encode, TOON string for decode) |
| `tests[].expected` | Yes | Expected output (TOON string for encode, JSON for decode) |
| `tests[].shouldError` | No | If `true`, expects an error (default: `false`) |
| `tests[].options` | No | Encoder/decoder options (see below) |
| `tests[].specSection` | No | Reference to specification section (e.g., `"7.2"`, `"§6"`) |
| `tests[].note` | No | Optional explanation for special cases |
| `tests[].minSpecVersion` | No | Minimum spec version required (e.g., `"4.1"`) |

### Options

#### Encoding Options

```json
{
  "delimiter": ",",
  "indentSize": 2
}
```

- `delimiter`: `","` (comma, default), `"\t"` (tab), or `"|"` (pipe). Affects encoder output; decoders parse the delimiter declared in array headers
- `indentSize`: Number of spaces per indentation level (default: `2`)

#### Decoding Options

```json
{
  "indentSize": 2,
  "strict": true
}
```

- `indentSize`: Expected number of spaces per indentation level (default: `2`)
- `strict`: Enable strict validation (default: `true`)

### Error Tests

Error tests use `shouldError: true` to indicate that the test expects an error to be thrown:

```json
{
  "name": "throws on array length mismatch",
  "input": "tags[3]: a,b",
  "expected": null,
  "shouldError": true,
  "options": { "strict": true }
}
```

**Note:** Error tests do not specify expected error messages, as these are implementation-specific and vary across languages.

### Non-Strict Tests

Tests with `options.strict: false` fall into two classes:

- **Required non-strict behavior**: the spec mandates the outcome for every non-strict decoder (e.g., last-write-wins duplicate-key resolution, §14.3). These tests apply to all implementations.
- **Optional leniency**: the spec permits but does not require accepting the input (e.g., non-multiple indentation via §12's floor depth computation, or key-value fall-through for malformed headers, §6). These tests pin the outcome a decoder MUST produce *if* it implements the leniency; implementations that reject such input instead MAY skip them.

## Using These Tests

Load each fixture file, run every entry in its `tests` array through your encoder or decoder with `test.options` applied, and assert the `expected` output – or that an error is thrown when `shouldError` is `true`.

**Note:** `name`, `description`, and `note` are prose, not identifiers. Key your runner on file path and array index, never on these strings – they follow the spec's terminology and are rewritten whenever it changes.

## Test Coverage

### Encoding Tests (`fixtures/encode/`)

| File | Description | Spec Sections |
|------|-------------|---------------|
| `primitives.json` | String, number, boolean, null encoding and escaping | §7.1/§7.2, §2 |
| `objects.json` | Simple objects, nested objects, key encoding | §8 (keys: §7.3/§7.1) |
| `objects-keyed.json` | Keyed tabular form for objects of uniform objects | §9.5, §10 |
| `arrays-primitive.json` | Inline primitive arrays, empty arrays | §9.1 |
| `arrays-tabular.json` | Tabular form with header and rows | §9.3 |
| `arrays-nested.json` | Arrays of arrays, mixed arrays | §9.2/§9.4 |
| `arrays-objects.json` | Objects as list items, complex nesting | §9, §10 |
| `delimiters.json` | Tab and pipe delimiter options | §11 |
| `whitespace.json` | Formatting invariants and indentation | §12 |

### Decoding Tests (`fixtures/decode/`)

| File | Description | Spec Sections |
|------|-------------|---------------|
| `primitives.json` | Parsing primitives, unescaping, ambiguity | §4, §7.1/§7.4 |
| `numbers.json` | Number edge cases, exponent forms, leading zeros | §4 |
| `objects.json` | Parsing objects, keys, nesting | §8 (keys: §7.3/§7.1) |
| `objects-keyed.json` | Keyed header and entry-row parsing | §9.5, §10 |
| `arrays-primitive.json` | Inline array parsing | §9.1 |
| `arrays-tabular.json` | Tabular form parsing | §9.3 |
| `arrays-nested.json` | Nested and mixed array parsing | §9.2/§9.4 |
| `delimiters.json` | Delimiter detection and parsing | §11 |
| `whitespace.json` | Whitespace tolerance and token trimming | §12 |
| `root-form.json` | Root form detection (empty, single primitive) | §5 |
| `validation-errors.json` | Syntax errors, length mismatches, malformed input | §6, §14 |
| `indentation-errors.json` | Strict mode indentation validation | §14.2, §12 |
| `blank-lines.json` | Blank line handling in arrays | §14.2, §12 |
| `comments.json` | Comment-line stripping and full-line-only edge cases | §5.1, §7.2, §14.1 |

**Coverage note:** §3 host-type normalization (NaN/±Infinity → null, host Date/Set/Map/BigInt mappings) is intentionally outside these JSON fixtures, since the fixture format cannot express non-JSON encode inputs. Implementations should cover §3 in their language-local test suites.

## Validating Fixtures

All fixture files should validate against [`fixtures.schema.json`](./fixtures.schema.json). Run the commands below from the repository root:

```bash
# Using ajv-cli
npx ajv-cli validate -s tests/fixtures.schema.json -d "tests/fixtures/**/*.json"

# Using check-jsonschema (Python)
pip install check-jsonschema
check-jsonschema --schemafile tests/fixtures.schema.json tests/fixtures/**/*.json
```

## Contributing Test Cases

Add your test to the matching fixture file, reference the spec section it exercises, verify the expected output against SPEC.md, and validate the file against the schema before submitting a PR. See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
