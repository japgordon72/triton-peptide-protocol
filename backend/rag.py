"""
Pinecone retrieval — fetches relevant PDF chunks for matched compounds.
Falls back gracefully if index is empty or unavailable.
"""

import os
from typing import Optional
from pinecone import Pinecone
from openai import OpenAI

_pc: Optional[Pinecone] = None
_openai: Optional[OpenAI] = None
_index = None


def _get_clients():
    global _pc, _openai, _index
    if _pc is None:
        _pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
        _index = _pc.Index(os.environ.get("PINECONE_INDEX", "triton-protocol"))
    if _openai is None:
        _openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    return _openai, _index


def retrieve_context(compound_names: list[str], top_k: int = 4) -> str:
    """
    Embeds a query string from compound names, retrieves top_k chunks
    from Pinecone filtered to those compounds. Returns assembled context string.
    Returns empty string if index unavailable.
    """
    if not compound_names:
        return ""

    try:
        client, index = _get_clients()

        query_text = "research findings for: " + ", ".join(compound_names)
        embedding_resp = client.embeddings.create(
            model="text-embedding-3-small",
            input=query_text,
        )
        query_vector = embedding_resp.data[0].embedding

        # Filter to only chunks about matched compounds
        compound_filter = {"compound": {"$in": compound_names}}

        results = index.query(
            vector=query_vector,
            top_k=top_k,
            filter=compound_filter,
            include_metadata=True,
        )

        chunks = []
        for match in results.matches:
            meta = match.metadata or {}
            compound = meta.get("compound", "")
            text = meta.get("text", "")
            if text:
                chunks.append(f"[{compound}] {text}")

        return "\n\n".join(chunks)

    except Exception:
        # Index not yet populated or unavailable — degrade gracefully
        return ""
