"""
PDF → chunk → embed → Pinecone upsert.
Run once to populate the vector index.

Usage:
    python parse_and_ingest.py --pdf "path/to/peptide_handbook.pdf"
"""

import argparse
import os
import time
from pathlib import Path
from dotenv import load_dotenv
import fitz  # PyMuPDF
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from tqdm import tqdm

load_dotenv(Path(__file__).parent.parent / ".env")

# Compounds to index — matches the 30 sold SKUs
COMPOUND_NAMES = [
    "Tirzepatide", "Retatrutide", "Mazdutide", "Cargrilintide", "KLOW",
    "5-Amino-1MQ", "BPC-157", "BPC157", "TB-500", "TB500", "AOD",
    "CJC-1295", "Tesamorelin", "PT-141", "Bremelanotide",
    "Kisspeptin", "GHK-Cu", "GHK-CU", "NAD+", "NAD ",
    "Selank", "Semax", "Thymosin Alpha", "Epithalon", "Mots-c",
    "SS-31", "Elamipretide", "GLOW",
]

CHUNK_SIZE = 900    # characters
CHUNK_OVERLAP = 150
INDEX_NAME = os.environ.get("PINECONE_INDEX", "triton-protocol")
EMBED_MODEL = "text-embedding-3-small"
EMBED_DIMS = 1536
BATCH_SIZE = 50


def page_has_compound(text: str) -> str | None:
    """Returns the first compound name found on this page, or None."""
    text_lower = text.lower()
    for name in COMPOUND_NAMES:
        if name.lower() in text_lower:
            return name
    return None


def chunk_text(text: str, size: int, overlap: int) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end].strip())
        start += size - overlap
    return [c for c in chunks if len(c) > 100]


def main(pdf_path: str):
    openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

    # Create index if it doesn't exist
    existing = [i.name for i in pc.list_indexes()]
    if INDEX_NAME not in existing:
        print(f"Creating Pinecone index '{INDEX_NAME}'...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=EMBED_DIMS,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        time.sleep(10)

    index = pc.Index(INDEX_NAME)

    print(f"Loading PDF: {pdf_path}")
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"Total pages: {total_pages}")

    all_chunks: list[dict] = []
    pages_indexed = 0

    for page_num in tqdm(range(total_pages), desc="Scanning pages"):
        page = doc[page_num]
        text = page.get_text()
        if not text.strip():
            continue
        compound = page_has_compound(text)
        if not compound:
            continue
        pages_indexed += 1
        for i, chunk in enumerate(chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)):
            all_chunks.append({
                "id": f"p{page_num}_c{i}",
                "text": chunk,
                "compound": compound,
                "page": page_num + 1,
            })

    print(f"Relevant pages: {pages_indexed} / {total_pages}")
    print(f"Chunks to embed: {len(all_chunks)}")

    vectors = []
    for i in tqdm(range(0, len(all_chunks), BATCH_SIZE), desc="Embedding"):
        batch = all_chunks[i : i + BATCH_SIZE]
        texts = [c["text"] for c in batch]
        resp = openai.embeddings.create(model=EMBED_MODEL, input=texts)
        for j, emb in enumerate(resp.data):
            chunk = batch[j]
            vectors.append({
                "id": chunk["id"],
                "values": emb.embedding,
                "metadata": {
                    "compound": chunk["compound"],
                    "page_number": chunk["page"],
                    "text": chunk["text"][:500],  # metadata size limit
                    "source": "peptide_handbook_2022",
                },
            })

    # Upsert in batches of 100
    print(f"Upserting {len(vectors)} vectors to Pinecone...")
    for i in tqdm(range(0, len(vectors), 100), desc="Upserting"):
        index.upsert(vectors=vectors[i : i + 100])

    stats = index.describe_index_stats()
    print(f"\nDone. Index now has {stats.total_vector_count} vectors.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--pdf",
        default=r"c:\Users\japgo\Downloads\904653287-James-B-LaValle-Gordon-Crozier-Joseph-P-Cleaver-Andrew-Heym-Peptide-Handbook-a-Professional-s-Guide-to-Peptide-Therapeutics-2022-Interactive.pdf",
        help="Path to the peptide handbook PDF",
    )
    args = parser.parse_args()
    main(args.pdf)
