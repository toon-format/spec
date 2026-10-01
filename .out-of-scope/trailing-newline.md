# Trailing Newline

Encoders don't end a document with a newline (§12, §13.1). Requests to make a trailing newline the encoder output are out of scope.

## Why this is out of scope

An encoder returns the serialized value, not a file. `JSON.stringify()` doesn't append a newline either:

> TOON follows the same convention as `JSON.stringify()`: the output is the serialized data structure itself, not a file format with specific storage requirements.
> – [toon#23](https://github.com/toon-format/toon/issues/23#issuecomment-3464114715)

Concatenating two documents doesn't produce a valid document with or without the newline, for TOON as for JSON.

Decoders SHOULD accept a trailing newline at end of file (§12), so files written by editors or by `echo` decode fine. Add the newline when you write to disk.

## Prior requests

- toon#23 – trailing newline at end of output
