# Key Folding / Path Expansion

Key folding (encoder collapses single-key object chains to dotted paths, `a.b.c: 1`) and path expansion (decoder re-nests them) were part of the spec through v3.x (§1.9, §13.4, §14.3) and are removed in v4. Requests to re-add them are out of scope.

## Why this is out of scope

Measured and verified against the reference implementation before removal:

- **Zero benefit on real data.** 0.00% token savings on all six of the project's own benchmark datasets – folding only fires on single-key chains, which realistic tabular/nested data lacks. The published benchmark numbers never enabled it.
- **Wire ambiguity by construction.** `encode({'a.b.c': 1})` and `encode({a:{b:{c:1}}}, {keyFolding:'safe'})` produce the byte-identical document, so `expandPaths` cannot distinguish a folded chain from a genuine dotted literal key – it silently corrupts the latter. Two distinct JSON values collapsing to one wire document breaks TOON's determinism and round-trip guarantees.
- **Streaming-incompatible by design.** Expansion requires the fully materialized tree (§13.4 applied it after all parsing); the reference streaming decoder throws on it. It was the only feature in the spec that prevented streaming decode.
- **Security surface.** The `IdentifierSegment` pattern admitted `__proto__`, enabling prototype pollution through path expansion (fixed in the v2.x line; the v4 spec makes prototype-key handling normative in §15 independent of folding).
- **Round-trip asymmetry.** Both options defaulted to `off`, so correctness depended on out-of-band option agreement between producer and consumer.

Folded documents remain valid TOON forever: dotted keys decode as literal keys (a MUST since v3.x). Users who need dotted-path notation can expand in userland after decode – with the caveat that userland expansion must guard `__proto__`/`constructor`/`prototype`.

## Prior requests

- spec#5 – original RFC (merged, later removed)
- spec#4, spec#20 – flattening requests
- toon#75, toon#86, toon#208, toon#211 – library-side requests
- spec#34 – streaming compliance levels (motivated by these features; resolved by their removal)
