# Type Annotations

TOON has no type annotations – not on header fields (`{id:int,name:str}`), not on keys (`id<i>: 123`), and no reserved key that declares a document's type (`$type: HikePlan`).

## Why this is out of scope

A value's type already follows from its token shape (§4): `true`/`false`/`null` decode to booleans and null, a token matching the number grammar decodes to a number, everything else – including every quoted token – decodes to a string. There is no ambiguity for an annotation to resolve. The Introduction says so directly: TOON "carries the JSON data model; it is a transport/authoring format with explicit structure, not an extended type system or schema language."

What these requests usually want is different: making an LLM emit `42` instead of `"42"` for a field that should be numeric. That's a constraint on expected values, and the spec only defines how tokens map to values. As the ruling on spec#31 put it:

> What you're really describing (constraining an LLM to emit `42` instead of `"42"` for a known-numeric field) is a **schema and grammar-constraint concern**, not a wire format concern. That belongs in tooling built on top of TOON (e.g. JSON Schema validation, constrained decoding grammars for LLM samplers), not in the core spec.
> – [spec#31](https://github.com/toon-format/spec/issues/31#issuecomment-3941517754)

Annotations would also cost tokens on every header and add a second syntax inside field lists (§6) that every decoder has to parse.

For typed output, validate after decoding – JSON Schema, Zod, Pydantic – or constrain generation with a sampler grammar. A document-level tag like `type: HikePlan` already works as an ordinary key the application reads ([spec#28](https://github.com/toon-format/spec/issues/28#issuecomment-3941514580)).

## Prior requests

- spec#31 – type annotations on header fields
- spec#28 – explicitly declare the output type
- spec discussion #10 – column types in the header
- toon#6 – optional types on keys
