# Binary Encoding

TOON is a text format. A binary TOON wire format is out of scope, in the spec and in the reference library and CLI.

## Why this is out of scope

TOON exists to put structured data into LLM prompts with fewer tokens (Introduction, "Purpose and Scope"). Models read text, so a binary encoding would always be decoded back to text before use – it saves bytes on the wire, which is not the cost TOON targets. It would also need its own spec, its own conformance suite, and implementations in every language:

> Adding a second "Binary TOON" wire format would require a separate spec, cross‑language implementations, and long‑term maintenance, while not really helping the primary use case (LLMs still need text, so this would always be decoded before use). For general binary serialization there are already well‑established options like CBOR/MessagePack.
> – [toon#201](https://github.com/toon-format/toon/pull/201#issuecomment-3566643061)

Compression is the same story: gzip reduces bytes, but a model tokenizes the decompressed text, so token counts stay the same ([toon#125](https://github.com/toon-format/toon/issues/125#issuecomment-3528565342)). Binary serialization belongs to CBOR or MessagePack; a binary TOON variant can live as its own package.

## Prior requests

- toon#201 – Binary TOON
