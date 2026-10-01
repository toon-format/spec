# References, Aliases, and Dictionary Encoding

TOON has no references between values: no `$ID` aliases defined once and reused, no `@tables` foreign-key resolution, no per-column enumerations (`role(admin,user)` with cells `0`/`1`), and no key maps (`_map`) that shorten field names.

## Why this is out of scope

Every one of these turns a cell into a pointer, so the document stops being the JSON value it encodes. JSON has no references, and TOON encodes the JSON data model (§2):

> JSON has no concept of references, foreign keys, or inter-document linking. Introducing `@tables` would make TOON a different kind of format: a relational data language with its own resolution semantics, hydration modes, and cycle-detection requirements.
> – [spec#27](https://github.com/toon-format/spec/issues/27#issuecomment-3941522699)

The concrete costs:

- **Two-pass decoding.** A reference can only be resolved once its target is known, so decoders buffer the whole document – which breaks streaming decode.
- **New escaping.** Literal values that look like references (`$100`) would suddenly need quoting, which changes the meaning of documents that are valid today ([spec#36](https://github.com/toon-format/spec/issues/36#issuecomment-4163086597)).
- **No canonical form.** The same JSON could be encoded with different alias names, thresholds, and orderings, while §13.1 requires encoders to pick the form from the value's shape, not by preference.
- **Little gain for LLMs.** Short values like `admin` are already single tokens, and a model has to map `0` back to `admin` in its head ([toon discussion #216](https://github.com/toon-format/toon/discussions/216#discussioncomment-15053977)).

Repetition is a data-modeling problem: normalize before encoding. Encode the foreign key instead of the embedded object, or put the dictionary into the data itself, and TOON's tabular form compresses the result:

```toon
roles[2]: admin,user

users[3]{id,name,roleIndex}:
  1,Alice,0
  2,Bob,1
  3,Carol,1
```

## Prior requests

- spec#27 – relational references (`@tables`)
- spec#36 – value aliasing with `$ID` references
- spec discussion #14 – `_map` key compression and schema IDs
- toon discussion #216 – per-column enumerations and base-62 indices
