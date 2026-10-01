# Custom Delimiters

The delimiter set is comma, tab, and pipe (§11). Other delimiters – non-ASCII symbols like `✦`, semicolons, or user-defined separators – are out of scope.

## Why this is out of scope

The header declares the active delimiter in the bracket segment, and §6's grammar admits exactly two symbols there (`delimsym = HTAB / "|"`; absent means comma). Every decoder splits rows on that closed set, and encoders quote strings that contain the active delimiter (§7.2, §11.1). Opening the set means new grammar, new quoting rules, and a header symbol for each new delimiter:

> I want to keep the spec to comma/tab/pipe to stay ASCII-only for maximum interop, editor/terminal safety, and predictable tokenization. Non-ASCII delimiters like ✦ would add complexity and may be token-inefficient on some models.
> – [toon#133](https://github.com/toon-format/toon/issues/133#issuecomment-3532885149)

The existing set already covers readability: tab for tables (often token-cheaper too), pipe for a visible ASCII separator. Decoders trim spaces around cells (§12), so `1, Alice, admin` decodes fine when written by hand.

## Prior requests

- toon#133 – `✦` as delimiter
- toon discussion #139 – one-line rows with `|` and `;`
