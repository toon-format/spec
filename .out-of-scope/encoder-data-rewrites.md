# Encoder-Side Data Rewrites

Encoders don't rewrite the data to fit a more compact form. That rules out filling missing fields with `null` so semi-uniform arrays qualify for tabular form, dropping `null`, empty-string, or empty-array fields, splitting semi-uniform arrays into base and extras tables, and abbreviating, renaming, or reordering keys.

## Why this is out of scope

Each of these changes the value, so `decode(encode(x))` stops returning `x` under §2's JSON-model equality: objects compare by their ordered key sequence, a missing key and a key set to `null` are different values, and no decoder can restore a dropped field or undo a renamed key. Whether `null` and "absent" mean the same thing, or which short names a prompt can live with, is a property of your data, not of the format:

> TOON is a **transport format**: it encodes the JSON data model as text, and that's where its responsibility ends. Splitting semi-uniform arrays into base + extras tables is a **data transformation step** that belongs in the application layer, not inside the encoder.
> – [toon#292](https://github.com/toon-format/toon/pull/292#issuecomment-4162837784)

[toon-python#35](https://github.com/toon-format/toon-python/pull/35#issuecomment-4073056071) sent key abbreviation to higher-level wrappers as well. Normalize before encoding where your data allows it.

## Prior requests

- toon#344 – `fillna` option without an explicit replacer
- toon#292 – pre-encoding normalization for semi-uniform arrays
- spec#48 – `ignoreNullOrEmpty` and `excludeEmptyArrays` (the mixed columnar half is in `mixed-columnar-arrays.md`)
- toon-python#25, toon-python#35 – "semantic optimization": field abbreviation and semantic key ordering
