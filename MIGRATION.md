# Migrating to TOON v4

Migration notes for the v3 → v4 transition. This document grows alongside the unreleased v4 draft; entries are final when v4 ships.

## Key folding and path expansion removed

v4 removes the optional key-folding and path-expansion machinery: the encoder options `keyFolding` and `flattenDepth`, the decoder option `expandPaths`, and the former §1.9, §13.4, and §14.3. Dotted keys remain valid literal keys (§7.3, §8), and decoders treat them as single literal keys unconditionally – exactly the default behavior in v3. Any document produced without folding decodes identically under v4; this removal changes no wire syntax.

If you have stored documents that were encoded with `keyFolding: "safe"`, re-hydrate them once: decode with a v3 decoder using `expandPaths: "safe"`, then re-encode with a v4 encoder (or any encoder with folding off).

Implementations that keep folding available as a vendor extension MUST guard path expansion against the keys `__proto__`, `constructor`, and `prototype`: expansion MUST NOT use these segments to construct or traverse object graphs. Unguarded expansion is a prototype-pollution vector.
