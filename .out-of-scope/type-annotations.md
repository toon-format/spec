# Type Annotations

TOON has no type annotations – not on header fields (`{id:int,name:str}`), not on keys (`id<i>: 123`), and no reserved key that declares a document's type (`$type: HikePlan`).

## Why this is out of scope

A value's type already follows from its token shape (§4): `true`, `false`, and `null` are literals, a token matching the number grammar is a number, and everything else – including every quoted token – is a string. There is no ambiguity for an annotation to resolve, and TOON is "not an extended type system or schema language" (Introduction). What these requests want is an LLM that emits `42` instead of `"42"` for a numeric field:

> What you're really describing (constraining an LLM to emit `42` instead of `"42"` for a known-numeric field) is a **schema and grammar-constraint concern**, not a wire format concern. That belongs in tooling built on top of TOON (e.g. JSON Schema validation, constrained decoding grammars for LLM samplers), not in the core spec.
> – [spec#31](https://github.com/toon-format/spec/issues/31#issuecomment-3941517754)

Annotations would also cost tokens on every header. Validate after decoding or constrain generation with a sampler grammar; a document-level `type: HikePlan` already works as an ordinary key ([spec#28](https://github.com/toon-format/spec/issues/28#issuecomment-3941514580)).

## Prior requests

- spec#31 – type annotations on header fields
- spec#28 – explicitly declare the output type
- spec discussion #10 – column types in the header
- toon#6 – optional types on keys
