# Query and Patch Language

TOON defines no query or patch language – no "TOON-path" and no TOON-native patch operations.

## Why this is out of scope

A decoded TOON document is a plain JSON value (§2), so every standard that operates on JSON applies unchanged, and a TOON-specific language would duplicate them:

> TOON does not define its own query or patch language. It is intentionally just a compact, line oriented concrete syntax for the JSON data model.
> – [spec#16](https://github.com/toon-format/spec/issues/16#issuecomment-3589490562)

Decode, then query with JSONPath, JMESPath, or jq and update with JSON Pointer or JSON Patch.

## Prior requests

- spec#16 – TOON-path
