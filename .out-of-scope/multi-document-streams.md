# Multi-Document Streams

A TOON document holds one value. There is no multi-document syntax – no `---` separators, no "TOON Lines" counterpart to JSON Lines – and the reference library doesn't ship framing utilities for concatenated documents.

## Why this is out of scope

JSON Lines is a framing format around independent JSON values. TOON's root form spans the whole document (§5): once a root array or keyed tabular root is complete, strict decoders MUST reject any further content (§14.2). A separator line would need a new line class, new root-form rules, and new strict-mode errors in every implementation, for structure TOON can already express:

> JSON Lines is a *framing* format (a sequence of independent JSON values), while TOON is deliberately defined as "one JSON value per document", with no multi‑document syntax or directives.
> – [toon#120](https://github.com/toon-format/toon/issues/120#issuecomment-3558763808)

The only structure a JSONL stream carries is an ordered sequence. Encode it as one document with an array root, and uniform records get tabular form:

```toon
[3]{id,event}:
  1,signup
  2,login
  3,logout
```

On the library side, `@toon-format/toon` stays single-document. Streaming one large document is covered by `encodeLines` and `decodeStream`. Document separators, concatenated-JSON parsing, and batch encode/decode are framing utilities that fit a companion package built on top of `encode` and `decode` ([toon#163](https://github.com/toon-format/toon/issues/163#issuecomment-3559409605)).

## Prior requests

- toon#120 – JSON Lines support
- toon#121 – JSON Lines support (implementation PR)
- toon discussion #119 – what about JSON Lines?
- toon#163 – streaming API with document separators and batch processing
- toon#176 – streaming API for large datasets (implementation PR)
