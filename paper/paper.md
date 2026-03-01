---
title: 'TOON: Token-Oriented Object Notation'
tags:
  - large language models
  - token efficiency
  - data serialization
  - JSON alternative
  - prompt engineering
authors:
  - name: Johann Schopplich
    orcid: 0009-0002-1533-7864
    affiliation: 1
  - name: Sébastien Celles
    orcid: 0000-0001-9987-4338
    affiliation: 2
affiliations:
  - name: Independent Researcher
    index: 1
  - name: Université de Poitiers
    index: 2
date: 6 February 2026
bibliography: paper.bib
---

# Summary

TOON (Token-Oriented Object Notation) is a compact data serialization format
designed specifically for large language model applications. The format achieves
approximately 40% token reduction compared to JSON while maintaining complete
semantic equivalence through lossless bidirectional conversion.

TOON uses an indentation-based syntax that eliminates JSON's verbose punctuation
(braces, brackets, quotation marks) and introduces explicit structural markers
that guide LLM output generation. The format supports the complete JSON data
model including objects, arrays, strings, numbers, booleans, and null values.

The software targets AI researchers, prompt engineers, and developers building
LLM-powered applications who need to optimize context window utilization. TOON
is available as open-source libraries in six programming languages (TypeScript,
Python, Go, Rust, Julia, and .NET), with a command-line tool and interactive
playground at <https://toonformat.dev>.

# Statement of Need

Large language models process input through tokenization, where each token
consumes part of the finite context window. When applications include structured
data in prompts—configuration files, API responses, database records—the
verbosity of standard formats becomes a practical concern. JSON, while ubiquitous
and well-supported, was designed for human readability and parser simplicity,
not for tokenization efficiency.

The cost implications are significant. Token-based pricing means verbose formats
directly increase operational costs. More importantly, the context window
represents a hard constraint: exceeding it truncates information or requires
complex chunking strategies. For applications processing substantial structured
data, format inefficiency can consume 30-50% more context capacity than
necessary.

TOON addresses this gap by providing a format specifically optimized for how
modern LLM tokenizers process text. The format minimizes punctuation overhead
while adding explicit length markers and field headers that serve dual purposes:
reducing token count and providing structural cues that help models generate
valid output. Unlike binary formats (MessagePack, Protocol Buffers), TOON
remains human-readable and can be directly embedded in prompts.

# State of the Field

Several approaches address LLM efficiency challenges. Prompt compression
techniques like LLMLingua [@jiang_llmlingua_2023] reduce natural language
portions of prompts through token pruning while preserving semantic meaning.
These methods complement TOON, which focuses specifically on structured data
encoding rather than natural language compression.

Alternative serialization formats offer varying tradeoffs. YAML improves
readability over JSON but provides minimal token savings due to similar
punctuation patterns. Binary formats like MessagePack and Protocol Buffers
optimize for byte size and parsing speed but are unsuitable for direct LLM
prompt inclusion.

Work on constrained decoding [@willard_efficient_2023] ensures LLMs produce
syntactically valid structured output. TOON's explicit markers complement these
techniques by providing clearer schema signals within the prompt itself.

TOON fills a specific gap: a human-readable format optimized for tokenization
characteristics of modern language models, with structural features that
actively guide generation.

# Key Features

## Token Efficiency

TOON consistently reduces token counts by 35-45% across typical JSON structures
when measured using the cl100k_base tokenizer [@tiktoken_2023]. Tabular data
with repeated field names achieves up to 60% reduction through the compact
field header notation. Independent benchmarking [@masciari_toon_2025] confirms
these efficiency gains across eight different large language models, finding
26-49% token reduction compared to JSON, XML, and YAML.

## JSON Compatibility

TOON provides deterministic, lossless round-trips to and from JSON. Every valid
JSON document can be encoded as TOON and decoded back to identical JSON. This
compatibility ensures TOON integrates seamlessly with existing JSON-based
tooling and workflows.

## Multi-Language Implementations

Reference implementations pass a shared conformance test suite[^purl]:

| Language | Package (PURL) | License |
|----------|----------------|---------|
| TypeScript/JS | `pkg:npm/%40toon-format/toon` | MIT |
| Python | `pkg:pypi/toon-format` | MIT |
| Go | `pkg:golang/github.com/toon-format/toon-go` | MIT |
| Rust | `pkg:cargo/toon-format` | MIT |
| Julia | `pkg:github/toon-format/ToonFormat.jl` | MIT |
| .NET | `pkg:nuget/ToonFormat` | MIT |

[^purl]: Packages are identified using Package URLs (PURLs), a standardized scheme for reliably referencing software packages across programming languages and registries. See <https://github.com/package-url/purl-spec> and <https://ecma-international.org/publications-and-standards/standards/ecma-427/>. PURLs can be viewed using <https://s-celles.github.io/package-url-viewer/>

## LLM Generation Guardrails

TOON includes explicit structural markers that guide LLM output generation.
Array length markers (`[N]`) indicate exactly how many items to generate,
reducing premature termination or over-generation errors. Field headers for
tabular data (`{field1,field2,...}`) provide clear schema signals without
repeating field names for each record.

# Research Impact

Independent evaluation [@masciari_toon_2025] validates TOON's efficiency claims
across diverse model architectures. The study found that TOON requires
significantly fewer tokens than traditional formats while maintaining output
correctness for larger models (70B+ parameters). The research also documented
77-88% lower carbon emissions due to reduced computational requirements.

All token measurements use reproducible methodology: the tiktoken library with
cl100k_base encoding provides deterministic counts that researchers can
independently verify. The complete specification, test suite, and benchmarking
code are publicly available at <https://github.com/toon-format>.

# Acknowledgements

We thank the open-source community for feedback on early versions of the TOON
specification, and contributors who developed implementations in additional
programming languages.

**AI Disclosure**: This paper was prepared with assistance from Claude Opus 4.6 (Anthropic).
The authors reviewed all content for accuracy and take full responsibility for
the work.

# References
