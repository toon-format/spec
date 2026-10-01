# Custom Delimiters

The delimiter set is comma, tab, and pipe (§11). Other delimiters – non-ASCII symbols like `✦`, semicolons, or user-defined separators – are out of scope.

## Why this is out of scope

The header declares the delimiter from a closed set (§6: `delimsym = HTAB / "|"`, absent means comma), and every decoder splits and every encoder quotes against that set (§7.2, §11). Each new delimiter means new grammar and new quoting rules in every implementation:

> I want to keep the spec to comma/tab/pipe to stay ASCII-only for maximum interop, editor/terminal safety, and predictable tokenization. Non-ASCII delimiters like ✦ would add complexity and may be token-inefficient on some models.
> – [toon#133](https://github.com/toon-format/toon/issues/133#issuecomment-3532885149)

Tab and pipe already cover readability.

## Prior requests

- toon#133 – `✦` as delimiter
- toon discussion #139 – one-line rows with `|` and `;`
