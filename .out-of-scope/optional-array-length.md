# Optional Array Length

Every array header declares its length: `key[N]:`. Dropping `[N]`, making it optional for tabular arrays, allowing an unknown length (`[-]`), or writing `items[]{…}:` for one element is out of scope.

## Why this is out of scope

The length is load-bearing: §6 makes it mandatory, encoders MUST emit the actual count (§13.1), and strict decoders MUST error when rows, items, or entries don't add up (§14.1) – that check is how truncated or injected data gets noticed (§15).

> The `[N]` header is a fundamental invariant in TOON: every array declares its length explicitly. That property underpins strict‑mode validation (count checks, truncation detection), the "structure awareness / structural validation" behavior in the benchmarks, and a big part of TOON's differentiation from "CSV + indent." Making `[N]` optional for tabular arrays would weaken those guarantees and introduce a second, non‑canonical syntax for the same structure.
> – [spec#11](https://github.com/toon-format/spec/pull/11#issuecomment-3569473088)

It isn't backward compatible either: strict decoders reject `key[]:` (§6). A producer that can't know `N` up front counts first or chunks the data into several arrays ([spec#15](https://github.com/toon-format/spec/issues/15#issuecomment-3569512191)); hand-edited data is better edited as JSON and converted, so `[N]` is generated ([toon#145](https://github.com/toon-format/toon/issues/145#issuecomment-3536756237)).

## Prior requests

- spec#15 – arrays of unknown size
- spec#11 – optional implicit length for tabular arrays
- spec#19 – `items[]{…}` for length-1 arrays (the empty-array half was accepted as `key: []`)
- toon#135 – UTOON, an unbounded TOON variant
- toon#145 – why arrays need an item count
