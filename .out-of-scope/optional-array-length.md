# Optional Array Length

Every array header declares its length: `key[N]:`. Requests to drop `[N]`, make it optional for tabular arrays (`users{id,name}:`), allow an unknown length (`[-]`), or write `items[]{…}:` for one element are out of scope.

## Why this is out of scope

The length is load-bearing. §6 makes `length` mandatory in the bracket segment, encoders MUST emit lengths that match the actual count (§13.1), and strict decoders MUST error when rows, items, or entries don't add up (§14.1). That count check is how a decoder notices truncated or injected data (§15) – and the Introduction lists it among the reasons to use TOON at all:

> The `[N]` header is a fundamental invariant in TOON: every array declares its length explicitly. That property underpins strict‑mode validation (count checks, truncation detection), the "structure awareness / structural validation" behavior in the benchmarks, and a big part of TOON's differentiation from "CSV + indent." Making `[N]` optional for tabular arrays would weaken those guarantees and introduce a second, non‑canonical syntax for the same structure.
> – [spec#11](https://github.com/toon-format/spec/pull/11#issuecomment-3569473088)

An optional length is also not backward compatible: `key[]:` is not a header under §6, so every existing strict decoder rejects it.

For producers that can't know `N` up front: TOON is a translation layer over a value whose lengths are known. Count first and write the header after, or chunk the data into several arrays ([spec#15](https://github.com/toon-format/spec/issues/15#issuecomment-3569512191)). Streaming decode already works with declared lengths. For hand-edited files, edit JSON and convert, so `[N]` is generated rather than maintained ([toon#145](https://github.com/toon-format/toon/issues/145#issuecomment-3536756237)).

Empty arrays are the one place without a count: `key: []` (§9.1).

## Prior requests

- spec#15 – arrays of unknown size
- spec#11 – optional implicit length for tabular arrays
- spec#19 – `items[]{…}` for length-1 arrays (the empty-array half was accepted as `key: []`)
- toon#135 – UTOON, an unbounded TOON variant
- toon#145 – why arrays need an item count
