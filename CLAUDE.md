# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

This is the **official TOON specification** — a formal document (`SPEC.md`) plus a suite of language-agnostic JSON test fixtures. There is no runtime code to build or test here. The fixtures exist for external TOON implementations to consume, not to be executed within this repo.

## Commands

```bash
pnpm install   # install dev dependencies (ESLint only)
pnpm lint      # lint SPEC.md, README.md, and fixture JSON files
pnpm release   # bump version with bumpp (maintainers only)
```

The only CI check is `pnpm lint`. There is no test runner in this repo — fixture validation is done by each implementation.

To validate fixtures against the JSON Schema manually:
```bash
npx ajv-cli validate -s tests/fixtures.schema.json -d "tests/fixtures/**/*.json"
```

## Repository Structure

- **`SPEC.md`** — The normative specification with ABNF grammar, encoding/decoding rules, validation requirements, and conformance criteria. This is the source of truth.
- **`tests/fixtures/`** — Language-agnostic JSON test cases. `encode/` tests JSON→TOON; `decode/` tests TOON→JSON. Each file maps to a specific feature area (see `tests/README.md` for the full mapping to spec sections).
- **`tests/fixtures.schema.json`** — JSON Schema that all fixture files must conform to.
- **`examples/`** — Illustrative `.toon` / `.json` pairs organized by feature; not normative.

## Fixture Format

Each fixture file is a JSON object with a `tests` array. Key fields per test case:
- `input` — JSON value (encode) or TOON string (decode)
- `expected` — TOON string (encode) or JSON value (decode); `null` when `shouldError: true`
- `shouldError` — set `true` for error cases; implementations must throw, message is not checked
- `options` — encoder/decoder options (`delimiter`, `indent`, `keyFolding`, `flattenDepth`, `strict`, `expandPaths`)
- `specSection` — reference to the relevant SPEC.md section (e.g. `"14.1"`)

## Contribution Rules

| Change | Process |
|---|---|
| Typos, grammar, broken links | Direct PR |
| New/updated test fixtures | Direct PR (validate against schema first) |
| Spec clarifications that may affect implementations | Issue first, then PR |
| New syntax, encoding rules, breaking changes | RFC process (see `CONTRIBUTING.md`) |

When editing `SPEC.md`: use RFC 2119 keywords (MUST/SHOULD/MAY) correctly, keep examples concrete with input/output pairs, cross-reference section numbers, and target 80–120 character line length.

When adding test fixtures: always add a `specSection` reference, verify expected output against the reference implementation at `github.com/toon-format/toon`, and ensure the fixture validates against `tests/fixtures.schema.json`.

## Versioning

The spec uses `MAJOR.MINOR` only (no patch). Breaking syntax/semantic changes → MAJOR bump. Clarifications and backward-compatible additions → MINOR bump. See `VERSIONING.md` for details.
