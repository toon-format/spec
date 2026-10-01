# Non-JSON Data Models

TOON encodes the JSON data model and nothing else (§2). Modes or extensions for XML (attributes, namespaces), HTML/CSS/JS markup, or GraphQL are out of scope.

## Why this is out of scope

A second data model inside the same syntax makes one document decode differently depending on a flag:

> **Ambiguity.** The same TOON document would decode differently depending on a `mode` flag. A key like `id: 123` is a plain key-value pair in JSON mode but an XML attribute in XML mode. That breaks TOON's promise of deterministic, unambiguous encoding.
> – [spec#29](https://github.com/toon-format/spec/pull/29#issuecomment-4163086242)

It would also change the grammar under existing parsers – namespace prefixes put a colon into the key, where §5.2 ends it – and add normative sections every implementation carries even if it never sees XML. Convert to JSON first and encode that; markup already has dedicated tools ([toon discussion #220](https://github.com/toon-format/toon/discussions/220#discussioncomment-15070508)). A format for another data model is a separate spec, not a TOON mode.

## Prior requests

- spec#29 – XML support
- toon discussion #220 – HTML, CSS, and JS as TOON
- toon#3 – GraphQL
