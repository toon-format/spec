# References, Aliases, and Dictionary Encoding

TOON has no references between values: no `$ID` aliases defined once and reused, no `@tables` foreign-key resolution, no per-column enumerations (`role(admin,user)` with cells `0`/`1`), and no key maps (`_map`) that shorten field names.

## Why this is out of scope

Each of these turns a cell into a pointer, and the JSON data model TOON encodes (§2) has none:

> JSON has no concept of references, foreign keys, or inter-document linking. Introducing `@tables` would make TOON a different kind of format: a relational data language with its own resolution semantics, hydration modes, and cycle-detection requirements.
> – [spec#27](https://github.com/toon-format/spec/issues/27#issuecomment-3941522699)

Resolving references means buffering the whole document, which breaks streaming decode; literal values that look like references (`$100`) would suddenly need quoting ([spec#36](https://github.com/toon-format/spec/issues/36#issuecomment-4163086597)); and one JSON value could encode with different aliases, where §1.4 lets only its shape and position pick the rendering. The gain is small, too: values like `admin` are already single tokens, and a model has to map `0` back to `admin` ([toon discussion #216](https://github.com/toon-format/toon/discussions/216#discussioncomment-15053977)).

Repetition is a data-modeling problem: normalize before encoding – encode the foreign key instead of the embedded object, or put the dictionary into the data as an ordinary array.

## Prior requests

- spec#27 – relational references (`@tables`)
- spec#36 – value aliasing with `$ID` references
- spec discussion #14 – `_map` key compression
- toon discussion #216 – per-column enumerations and base-62 indices
