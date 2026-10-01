# Encoder-Side Data Rewrites

Encoders don't rewrite the data to make it fit a more compact form. That rules out filling missing fields with `null` so semi-uniform arrays qualify for tabular form (`fillna`), dropping `null`, empty-string, or empty-array fields (`ignoreNullOrEmpty`, `excludeEmptyArrays`), splitting semi-uniform arrays into base and extras tables (`normalizeForToon()`), and abbreviating, renaming, or reordering keys to save tokens.

## Why this is out of scope

Each of these changes the value being encoded. Under §2's JSON-model equality, objects compare by their key sequence, so a missing key and a key set to `null` are different values:

```ts
// in:  { sku: 'B2', qty: 2 }
// out: { sku: 'B2', price: null, qty: 2 }
```

Keys are part of the value too: "Object key order MUST be preserved as encountered by the encoder" (§2), and an encoder that turns `customer_name` into `cn` emits a document that no other decoder can map back.

A decoder can't tell a filled-in `null` from a real one, can't restore a field that was dropped, and can't undo a renamed key. `decode(encode(x))` stops returning `x`, which is the guarantee the whole format rests on. TOON saves tokens through its syntax – lengths and field lists declared once (§9.3, §9.5), minimal quoting (§7.2) – not by changing the data. Whether `null` and "absent" mean the same thing, or which short key names a prompt can live with, is a property of your data, not of the format:

> TOON is a **transport format**: it encodes the JSON data model as text, and that's where its responsibility ends. Splitting semi-uniform arrays into base + extras tables is a **data transformation step** that belongs in the application layer, not inside the encoder.
> – [toon#292](https://github.com/toon-format/toon/pull/292#issuecomment-4162837784)

The same ruling covered key abbreviation in the Python port: "These are great ideas but belong in separate packages or higher-level wrappers" ([toon-python#35](https://github.com/toon-format/toon-python/pull/35#issuecomment-4073056071)).

Normalize before encoding when your data allows it. Filling in `null` takes one line:

```ts
const fields = [...new Set(items.flatMap(Object.keys))]
encode({ items: items.map(item => Object.fromEntries(fields.map(f => [f, item[f] ?? null]))) })
```

Shorter keys work the same way, and the mapping stays in your code, where it can also go into the prompt. Dropping fields works through the `replacer` option of the TypeScript reference, which returns `undefined` to omit a value.

## Prior requests

- toon#344 – `fillna` option without an explicit replacer
- toon#292 – pre-encoding normalization for semi-uniform arrays
- spec#48 – `ignoreNullOrEmpty` and `excludeEmptyArrays` (the mixed columnar half is in `mixed-columnar-arrays.md`)
- toon-python#25, toon-python#35 – "semantic optimization": field abbreviation and semantic key ordering
