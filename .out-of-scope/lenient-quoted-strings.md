# Lenient Quoted Strings

A token that starts with `"` must end at its closing quote (§7.4, "Quoted-token boundary"). Relaxing that rule so that LLM output like `text: "hello" said Alice` decodes as a string is out of scope.

## Why this is out of scope

v4.1 made the boundary normative in strict and non-strict mode alike: any character after the closing quote MUST error (§7.4, §14.2). Without it, a decoder has to guess whether a leading `"` opens a quoted string or is a literal character – `"hello" said Alice` could decode to `hello said Alice` or to `"hello" said Alice`, and two decoders could pick differently. A decoder that silently repairs input also can't tell a model's mistake from data.

Model output that breaks the quoting rules is the application's problem to handle before or after decoding, not the format's. What works in practice:

- **Show the escape in the prompt.** An example like `text: "\"hello\" said Alice"` gets copied far more reliably than a description of the rule.
- **Retry on a strict decode error.** The decode fails at the offending line, so a re-prompt can point at it.
- **Repair before decoding** if your pipeline needs best-effort parsing – as an application step, not a decoder mode.

## Prior requests

- spec discussion #41 – quoted string specification
