# Lenient Quoted Strings

A token that starts with `"` must end at its closing quote (§7.4, "Quoted-token boundary"). Relaxing that rule so that LLM output like `text: "hello" said Alice` decodes as a string is out of scope.

## Why this is out of scope

v4.1 made characters after the closing quote an error in strict and non-strict mode alike (§7.4, §14.2). Without the rule, a decoder has to guess whether a leading `"` opens a quoted string or is literal data, and two decoders can guess differently. A decoder that repairs input silently also can't tell a model's mistake from data.

Malformed model output is the application's to handle: show the escaped form in the prompt, re-prompt on the strict decode error, or repair before decoding.

## Prior requests

- spec discussion #41 – quoted string specification
