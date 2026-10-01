# Multi-Document Streams

A TOON document holds one value. There is no multi-document syntax – no `---` separators, no "TOON Lines" counterpart to JSON Lines – and the reference library stays single-document.

## Why this is out of scope

TOON's root form spans the whole document: once a root array or keyed tabular root is complete, strict decoders MUST reject further content (§5, §14.2). A separator would need a new line class and new root-form rules in every implementation, for structure TOON already expresses:

> JSON Lines is a *framing* format (a sequence of independent JSON values), while TOON is deliberately defined as "one JSON value per document", with no multi‑document syntax or directives.
> – [toon#120](https://github.com/toon-format/toon/issues/120#issuecomment-3558763808)

The only structure a JSONL stream carries is an ordered sequence, so encode it as one document with an array root. Separators and batch encode/decode are framing utilities for a companion package built on `encode` and `decode` ([toon#163](https://github.com/toon-format/toon/issues/163#issuecomment-3559409605)).

## Prior requests

- toon#120 – JSON Lines support
- toon#121 – JSON Lines support (implementation PR)
- toon discussion #119 – what about JSON Lines?
- toon#163 – streaming API with document separators and batch processing
- toon#176 – streaming API for large datasets (implementation PR)
