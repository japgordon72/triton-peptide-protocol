import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from anthropic import Anthropic

from compound_matcher import match_compounds
from rag import retrieve_context
from prompts import SYSTEM_PROMPT
from compound_protocols import get_protocol

app = FastAPI(title="Triton Protocol API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

_anthropic: Optional[Anthropic] = None


def get_anthropic() -> Anthropic:
    global _anthropic
    if _anthropic is None:
        _anthropic = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    return _anthropic


class QueryRequest(BaseModel):
    biomarkers: Optional[dict[str, float]] = None
    symptoms: Optional[list[str]] = None
    freetext: Optional[str] = None


class CompoundProtocol(BaseModel):
    indications: list[str]
    mechanism: str = ""
    dosage: str
    warnings: list[str]
    source: str


class CompoundResult(BaseModel):
    name: str
    sku: str
    url: str
    reasons: list[str]
    protocol: Optional[CompoundProtocol] = None


class QueryResponse(BaseModel):
    compounds: list[CompoundResult]
    response: str
    mode: str  # "rag" | "direct"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/query", response_model=QueryResponse)
def query(req: QueryRequest):
    if not req.biomarkers and not req.symptoms and not req.freetext:
        raise HTTPException(status_code=400, detail="Provide biomarkers, symptoms, or freetext.")

    # Step 1: deterministic match
    matched = match_compounds(req.biomarkers, req.symptoms)

    # Step 2: attach protocol data to each matched compound
    compound_results = []
    for c in matched:
        proto = get_protocol(c["name"])
        protocol_obj = CompoundProtocol(**proto) if proto else None
        compound_results.append(CompoundResult(
            name=c["name"],
            sku=c["sku"],
            url=c["url"],
            reasons=c["reasons"],
            protocol=protocol_obj,
        ))

    # Step 3: RAG retrieval (graceful fallback if index empty)
    compound_names = [c["name"] for c in matched]
    context = retrieve_context(compound_names) if compound_names else ""
    mode = "rag" if context else "direct"

    # Step 4: build user message for Claude
    parts = []
    if req.biomarkers:
        bm_lines = ", ".join(f"{k}={v}" for k, v in req.biomarkers.items())
        parts.append(f"Biomarker inputs: {bm_lines}")
    if req.symptoms:
        parts.append(f"Clinical focus areas: {', '.join(req.symptoms)}")
    if req.freetext:
        parts.append(f"Additional context: {req.freetext}")

    # Include structured protocol data for each matched compound
    if compound_results:
        protocol_lines = ["Matched compounds with protocol data:"]
        for cr in compound_results:
            protocol_lines.append(f"\n## {cr.name}")
            if cr.protocol:
                protocol_lines.append(f"Indications: {', '.join(cr.protocol.indications)}")
                protocol_lines.append(f"Suggested dosing: {cr.protocol.dosage}")
                if cr.protocol.warnings:
                    protocol_lines.append(f"Warnings: {'; '.join(cr.protocol.warnings[:3])}")
            else:
                protocol_lines.append("Protocol data: not available")
        parts.append("\n".join(protocol_lines))

    if context:
        parts.append(f"\nRelevant handbook excerpts:\n{context}")

    user_message = "\n".join(parts)

    # Step 5: Claude summary
    client = get_anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    return QueryResponse(
        compounds=compound_results,
        response=message.content[0].text,
        mode=mode,
    )
