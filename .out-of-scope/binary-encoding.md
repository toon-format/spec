# Binary Encoding

TOON is a text format. A binary TOON wire format is out of scope, in the spec and in the reference library and CLI.

## Why this is out of scope

TOON saves tokens, not bytes, and a model reads text, so a binary encoding would always be decoded back to text first. Compression fails for the same reason: the model tokenizes the decompressed text ([toon#125](https://github.com/toon-format/toon/issues/125#issuecomment-3528565342)).

> Adding a second "Binary TOON" wire format would require a separate spec, cross‑language implementations, and long‑term maintenance, while not really helping the primary use case (LLMs still need text, so this would always be decoded before use). For general binary serialization there are already well‑established options like CBOR/MessagePack.
> – [toon#201](https://github.com/toon-format/toon/pull/201#issuecomment-3566643061)

A binary variant can live as its own package.

## Prior requests

- toon#201 – Binary TOON
