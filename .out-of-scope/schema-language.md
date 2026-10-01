# Schema Language

TOON does not define a schema language, embed JSON Schema, or require decoders to validate against a schema. `SPEC.md` describes how JSON values are written as text, nothing more.

## Why this is out of scope

TOON is already JSON Schema compatible at the data-model level: any schema that validates a JSON value also validates the decoded output of the same TOON document. A schema authoring syntax inside TOON, with normative `$ref` or `allOf` resolution in decoders, would couple the spec to every future JSON Schema draft:

> What the RFC is really asking for is a *schema authoring syntax* embedded in TOON, plus normative requirements on decoders to resolve `$ref`, evaluate `allOf`, etc. That's a much larger surface area, and it would couple the core spec to every future JSON Schema draft revision. I'd rather keep SPEC.md scoped to one job: *how JSON values are serialized as text*.
> – [spec#7](https://github.com/toon-format/spec/issues/7#issuecomment-3941530685)

The Introduction draws the same line: TOON is "not an extended type system or schema language". Header syntax like `@SchemaName` would also break every conforming parser (§6 has no such production).

What works today: decode, then validate with the tooling you already use. A JSON Schema document itself encodes as TOON like any other JSON value. A companion document or package that sits one layer above the format – never normative in `SPEC.md` – is welcome ([toon#126](https://github.com/toon-format/toon/pull/126#issuecomment-3571906444)).

## Prior requests

- spec#7 – make TOON JSON Schema compatible
- spec#17 – JSON Schema in TOON format
- toon#103, toon#109 – describe object schemas in TOON (closed as duplicates of spec#17)
- toon#126 – optional schema validation system with `@SchemaName` headers
- toon discussion #127 – schema validation for type-safe data handling
- toon discussion #140 – TOON Schema proof of concept
