# TOON Test Fixtures

This directory contains **comprehensive language-agnostic JSON test fixtures** for validating TOON implementations against the specification. These fixtures cover all specification requirements and provide a standardized conformance test suite.

## Purpose

The test fixtures serve multiple purposes:

- **Conformance validation:** Verify implementations follow the specification
- **Regression testing:** Catch behavioral changes across versions
- **Implementation guide:** Demonstrate expected encoding/decoding behavior
- **Cross-language consistency:** Ensure all implementations produce identical output

## Directory Structure

```
tests/
├── fixtures.schema.json    # JSON Schema for fixture validation
├── fixtures/
│   ├── encode/             # Encoding tests (JSON → TOON)
│   │   ├── primitives.json
│   │   ├── objects.json
│   │   ├── arrays-primitive.json
│   │   ├── arrays-tabular.json
│   │   ├── arrays-nested.json
│   │   ├── arrays-objects.json
│   │   ├── delimiters.json
│   │   ├── whitespace.json
│   │   ├── options.json
│   │   ├── key-folding.json
│   │   └── xml-constructs.json
│   └── decode/             # Decoding tests (TOON → JSON)
│       ├── primitives.json
│       ├── numbers.json
│       ├── objects.json
│       ├── arrays-primitive.json
│       ├── arrays-tabular.json
│       ├── arrays-nested.json
│       ├── delimiters.json
│       ├── whitespace.json
│       ├── root-form.json
│       ├── validation-errors.json
│       ├── indentation-errors.json
│       ├── blank-lines.json
│       ├── path-expansion.json
│       └── xml-constructs.json
└── README.md               # This file
```

## Fixture Format

All test fixtures follow a standard JSON structure defined in [`fixtures.schema.json`](./fixtures.schema.json):

```json
{
  "version": "1.4",
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
| `version` | Yes | TOON specification version (e.g., `"1.3"`) |
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
| `tests[].minSpecVersion` | No | Minimum spec version required (e.g., `"1.3"`) |

### Options

#### Encoding Options

```json
{
  "delimiter": ",",
  "indent": 2,
  "keyFolding": "safe",
  "flattenDepth": 3
}
```

- `delimiter`: `","` (comma, default), `"\t"` (tab), or `"|"` (pipe). Affects encoder output; decoders parse the delimiter declared in array headers
- `indent`: Number of spaces per indentation level (default: `2`)
- `keyFolding`: `"off"` (default) or `"safe"`. Enables key folding to collapse single-key object chains into dotted-path notation (v1.5+)
- `flattenDepth`: Integer. Maximum depth to fold key chains when `keyFolding` is `"safe"` (default: Infinity). Values less than 2 have no practical folding effect (v1.5+)

#### Decoding Options

```json
{
  "indent": 2,
  "strict": true,
  "expandPaths": "safe"
}
```

- `indent`: Expected number of spaces per indentation level (default: `2`)
- `strict`: Enable strict validation (default: `true`). When `expandPaths` is `"safe"`, strict mode controls conflict resolution: errors on conflicts when `true`, LWW when `false` (v1.5+)
- `expandPaths`: `"off"` (default) or `"safe"`. Enables path expansion to split dotted keys into nested object structures (v1.5+)

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

## Using These Tests

To validate your TOON implementation against these fixtures:

1. **Load a fixture file** from `fixtures/encode/` or `fixtures/decode/`.
2. **Iterate through the `tests` array** in the fixture.
3. **For each test case:**
   - If `shouldError` is `true`: verify your implementation throws an error.
   - Otherwise: assert that your encoder/decoder produces the `expected` output when given the `input`.
4. **Pass options** from `test.options` to your encoder/decoder (if present).

The fixture format is language-agnostic JSON, so you can load and iterate it using your language's standard JSON parser and test framework.

## Test Coverage

### Encoding Tests (`fixtures/encode/`)

| File | Description | Spec Sections |
|------|-------------|---------------|
| `primitives.json` | String, number, boolean, null encoding and escaping | §7.1/§7.2, §2 |
| `objects.json` | Simple objects, nested objects, key encoding | §8 (keys: §7.3/§7.1) |
| `arrays-primitive.json` | Inline primitive arrays, empty arrays | §9.1 |
| `arrays-tabular.json` | Tabular format with header and rows | §9.3 |
| `arrays-nested.json` | Arrays of arrays, mixed arrays | §9.2/§9.4 |
| `arrays-objects.json` | Objects as list items, complex nesting | §9, §10 |
| `delimiters.json` | Tab and pipe delimiter options | §11 |
| `whitespace.json` | Formatting invariants and indentation | §12 |
| `key-folding.json` | Key folding with safe mode, depth control, collision avoidance | §13.4 |
| `xml-constructs.json` | XML constructs: namespaces, attributes, repeated elements, mixed content | §22-28 |

### Decoding Tests (`fixtures/decode/`)

| File | Description | Spec Sections |
|------|-------------|---------------|
| `primitives.json` | Parsing primitives, unescaping, ambiguity | §4, §7.1/§7.4 |
| `numbers.json` | Number edge cases, exponent forms, leading zeros | §4 |
| `objects.json` | Parsing objects, keys, nesting | §8 (keys: §7.3/§7.1) |
| `arrays-primitive.json` | Inline array parsing | §9.1 |
| `arrays-tabular.json` | Tabular format parsing | §9.3 |
| `arrays-nested.json` | Nested and mixed array parsing | §9.2/§9.4 |
| `delimiters.json` | Delimiter detection and parsing | §11 |
| `whitespace.json` | Whitespace tolerance and token trimming | §12 |
| `root-form.json` | Root form detection (empty, single primitive) | §5 |
| `validation-errors.json` | Syntax errors, length mismatches, malformed input | §14 |
| `indentation-errors.json` | Strict mode indentation validation | §14.3, §12 |
| `blank-lines.json` | Blank line handling in arrays | §14.4, §12 |
| `path-expansion.json` | Path expansion with safe mode, deep merge, strict-mode conflicts | §13.4, §14.5 |
| `xml-constructs.json` | XML constructs: namespaces, attributes, repeated elements, mixed content, undefined prefix errors | §22-28, §14.6 |

## Validating Fixtures

All fixture files should validate against [`fixtures.schema.json`](./fixtures.schema.json). You can use standard JSON Schema validators:

```bash
# Using ajv-cli
npx ajv-cli validate -s fixtures.schema.json -d "fixtures/**/*.json"

# Using check-jsonschema (Python)
pip install check-jsonschema
check-jsonschema --schemafile fixtures.schema.json fixtures/**/*.json
```

## Contributing Test Cases

To contribute new test cases:

1. **Identify the category:** Which fixture file should contain the test?
2. **Follow the format:** Use the structure defined in `fixtures.schema.json`
3. **Add spec references:** Link to relevant specification sections
4. **Validate:** Ensure your fixture validates against the schema
5. **Test with reference implementation:** Verify expected output is correct
6. **Submit PR:** Include clear description of what the test validates

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

## Reference Implementation

The reference implementation in TypeScript/JavaScript is maintained at: [github.com/toon-format/toon](https://github.com/toon-format/toon)

## Questions or Issues?

If you find:

- Test cases that contradict the specification
- Missing coverage for edge cases
- Ambiguous expected outputs
- Schema validation issues

Please [open an issue](https://github.com/toon-format/spec/issues) with:

- Fixture file and test case name
- Description of the issue
- Proposed fix (if applicable)

## License

These test fixtures are released under the MIT License, the same as the specification.
