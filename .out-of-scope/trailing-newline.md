# Trailing Newline

Encoders don't end a document with a newline (§12, §13.1). Requests to make a trailing newline part of the encoder output are out of scope.

## Why this is out of scope

An encoder returns the serialized value, not a file:

> TOON follows the same convention as `JSON.stringify()`: the output is the serialized data structure itself, not a file format with specific storage requirements.
> – [toon#23](https://github.com/toon-format/toon/issues/23#issuecomment-3464114715)

A newline wouldn't make concatenated documents valid either. Decoders accept a trailing newline (§12), so add one when you write to disk.

## Prior requests

- toon#23 – trailing newline at end of output
