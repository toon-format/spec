"""
Token count benchmark: JSON vs TOON using cl100k_base tokenizer.

Compares token counts for paired .json/.toon example files to demonstrate
TOON's token efficiency as described in the JOSS paper.

Requirements:
    pip install tiktoken

Usage:
    python benchmark_tokens.py
"""

from pathlib import Path

import tiktoken


def count_tokens(text: str, encoding: tiktoken.Encoding) -> int:
    """Count the number of tokens in a text string."""
    return len(encoding.encode(text))


def main():
    enc = tiktoken.get_encoding("cl100k_base")
    examples_dir = Path(__file__).parent

    # Find all paired .json/.toon files
    json_files = sorted(examples_dir.glob("*.json"))

    print("Token Count Benchmark: JSON vs TOON (cl100k_base)")
    print("=" * 70)
    print(f"{'Example':<25} {'JSON':>8} {'TOON':>8} {'Saved':>8} {'Reduction':>10}")
    print("-" * 70)

    total_json = 0
    total_toon = 0

    for json_path in json_files:
        toon_path = json_path.with_suffix(".toon")
        if not toon_path.exists():
            continue

        json_text = json_path.read_text()
        toon_text = toon_path.read_text()

        json_tokens = count_tokens(json_text, enc)
        toon_tokens = count_tokens(toon_text, enc)
        saved = json_tokens - toon_tokens
        reduction = (saved / json_tokens) * 100

        total_json += json_tokens
        total_toon += toon_tokens

        print(f"{json_path.stem:<25} {json_tokens:>8} {toon_tokens:>8} {saved:>8} {reduction:>9.1f}%")

    print("-" * 70)
    total_saved = total_json - total_toon
    total_reduction = (total_saved / total_json) * 100
    print(f"{'TOTAL':<25} {total_json:>8} {total_toon:>8} {total_saved:>8} {total_reduction:>9.1f}%")
    print("=" * 70)


if __name__ == "__main__":
    main()
