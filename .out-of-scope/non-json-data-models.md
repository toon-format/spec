# Non-JSON Data Models

TOON encodes the JSON data model and nothing else. Modes or extensions for XML (attributes, namespaces), HTML/CSS/JS markup, or GraphQL are out of scope.

## Why this is out of scope

§2 defines the whole data model: strings, numbers, booleans, null, objects, and arrays. A second model inside the same syntax means the same document decodes differently depending on a flag:

> **Ambiguity.** The same TOON document would decode differently depending on a `mode` flag. A key like `id: 123` is a plain key-value pair in JSON mode but an XML attribute in XML mode. That breaks TOON's promise of deterministic, unambiguous encoding.
> – [spec#29](https://github.com/toon-format/spec/pull/29#issuecomment-4163086242)

It would also change the grammar under existing parsers – XML namespace prefixes need colons in unquoted keys, which §5.2 and §7.4 treat as the key-value separator – and add normative sections every implementation must carry even if it never sees XML.

Convert first, then encode: XML to a JSON representation with `xml2js` or `xmltodict`, and encode that. Markup languages already have dedicated tools – Pug, HAML, JSX ([toon discussion #220](https://github.com/toon-format/toon/discussions/220#discussioncomment-15070508)). A companion format for another data model would be a separate spec, not a TOON mode.

## Prior requests

- spec#29 – XML support
- toon discussion #220 – HTML, CSS, and JS as TOON
- toon#3 – GraphQL
