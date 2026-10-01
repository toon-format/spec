# Query and Patch Language

TOON defines no query or patch language – no "TOON-path" and no TOON-native patch operations.

## Why this is out of scope

TOON is a concrete syntax for the JSON data model (§2). Once decoded, the value is plain JSON, and every standard that operates on JSON values applies unchanged:

> TOON does not define its own query or patch language. It is intentionally just a compact, line oriented concrete syntax for the JSON data model.
> – [spec#16](https://github.com/toon-format/spec/issues/16#issuecomment-3589490562)

A TOON-specific path or patch syntax would duplicate those standards and give every implementation a second language to maintain.

Decode, then use JSONPath, JMESPath, or jq for queries and JSON Pointer or JSON Patch (RFC 6901, RFC 6902) for updates.

## Prior requests

- spec#16 – TOON-path
