# Inline Annotations / Trailing Comments

TOON does not support inline or trailing annotations (`field: value # note`), and will not.

## Why this is out of scope

Inline comments intersect every quoting rule in the spec at once: §7.2 (string quoting conditions), §11.1 (encoder quoting), §13.1 (encoder checklist), and §15 (security). Every scalar position – values, tabular cells, list items – would need a rule for when a `#` starts a comment versus when it is data, and every one of those rules is a new way for two implementations to disagree. That is the opposite of TOON's design goal: a small deterministic grammar with one way to write a thing.

The underlying need is real but is served without grammar changes:

- **Hand-authored documents** (config files, prompt schemas): v4 adopts *full-line* `#` comments – a line whose first non-whitespace character is `#` is stripped before parsing. In a hand-authored prompt the model reads those lines, so field-adjacent guidance works by placing a comment line above the field.
- **Programmatic per-field annotations that must survive encode**: use a `_note:` key convention – annotations as data – or the `rawString` replacer primitive (toon#308/toon#321) for controlled raw output.

The distinction matters: decode-side comments are never *emitted* by encoders (JSON has no comments to encode), so anything that must flow through `encode()` has to be data, not comment syntax.

## Prior requests

- spec#3 – "Inline labels/comments/annotations" (the inline half; the full-line half was accepted for v4)
- spec#1 – comments discussion, original out-of-scope ruling
- spec#31 – annotation syntax via `@` (author deliberately reserved `#` for comments)
