# Triton Peptide Protocol Reference Tool

A B2B clinical decision-support tool for licensed practitioners purchasing from Triton Peptide Biologics Lab's FDA-registered 503B outsourcing facility. Practitioners enter patient blood work biomarkers and symptoms and receive structured compound recommendations — indications, mechanism of action, dosage protocols, and warnings — sourced from the LaValle Peptide Handbook (2022) and current clinical literature.

**Live client:** [Triton Peptide Biologics Lab](https://www.tritonpeptidebiologicslab.com)

---

## What It Does

1. Practitioner inputs blood work biomarkers (IGF-1, testosterone, glucose, HbA1c, etc.) and clinical symptoms
2. A deterministic Python lookup table matches compounds from the 30-SKU catalog — no LLM guessing
3. Pinecone retrieves relevant handbook excerpts (RAG pipeline) for the matched compounds
4. Claude generates a clinical summary in practitioner language — indication, mechanism, key contraindication
5. Each compound card expands to show structured protocol data: 🎯 Indications, ⚙️ Mechanism, 💉 Dosage Protocol, ⚠️ Warnings & Cautions

---

## Architecture

```
Blood work input
      │
      ▼
compound_matcher.py          ← deterministic Python lookup (no LLM)
      │
      ├── match_compounds(biomarkers, symptoms) → list of compounds
      │
      ▼
compound_protocols.py        ← structured protocol data for 30 SKUs
      │
      ▼
rag.py                       ← Pinecone retrieval (237 vectors, LaValle PDF)
      │
      ▼
prompts.py + Claude API      ← clinical summary generation only
      │
      ▼
ResponseCard.tsx             ← expandable compound cards
```

**Core rule:** Match logic lives entirely in deterministic code. The LLM generates language only — it never selects compounds.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript |
| Backend | FastAPI (Python) |
| LLM | Claude `claude-sonnet-4-6` (Anthropic) |
| Vector DB | Pinecone — 237 vectors indexed from LaValle PDF |
| Embeddings | OpenAI `text-embedding-3-small` |
| PDF parsing | PyMuPDF + LangChain `RecursiveCharacterTextSplitter` |
| Deployment | Vercel (frontend) + Vercel serverless (backend) |

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Age / practitioner gate (localStorage flag)
│   ├── protocol/page.tsx     # Main tool: biomarker inputs + symptom chips
│   ├── globals.css           # CSS variables: --navy, --teal, --white
│   └── layout.tsx
├── components/
│   └── ResponseCard.tsx      # Expandable compound cards (4 sections each)
├── lib/
│   └── api.ts                # TypeScript types + fetch wrapper
├── backend/
│   ├── main.py               # FastAPI app — orchestrates match → protocol → RAG → Claude
│   ├── compound_matcher.py   # Deterministic biomarker + symptom → compound lookup
│   ├── compound_protocols.py # Structured protocol data: 30 SKUs
│   ├── rag.py                # Pinecone retrieval with graceful fallback
│   ├── prompts.py            # Clinical system prompt (practitioner framing)
│   └── requirements.txt
├── scripts/
│   ├── parse_and_ingest.py   # One-time: PDF → chunk → embed → Pinecone
│   └── requirements_scripts.txt
├── .env.example
└── sample-output.html        # Static preview of compound card UI
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Pinecone account (free tier works)
- Anthropic API key
- OpenAI API key

### 1. Clone and set up environment

```bash
git clone https://github.com/your-username/triton-peptide-protocol.git
cd triton-peptide-protocol
cp .env.example .env
# Fill in your API keys in .env
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 3. Start the frontend

```bash
# From project root
npm install
npm run dev -- --port 3001
```

Visit `http://localhost:3001`

### 4. (One-time) Index the PDF

If setting up fresh with your own handbook PDF:

```bash
cd scripts
pip install -r requirements_scripts.txt
# Add PDF path to parse_and_ingest.py, then:
python parse_and_ingest.py
```

---

## API

### `POST /api/query`

```json
{
  "biomarkers": {
    "igf1": 110,
    "testosterone": 280,
    "glucose": 120,
    "hba1c": 5.6,
    "bmi": 28
  },
  "symptoms": ["fatigue", "poor recovery", "brain fog"],
  "freetext": "optional practitioner note"
}
```

**Response:**

```json
{
  "compounds": [
    {
      "name": "NAD+ 500mg",
      "sku": "nad500mg",
      "url": "https://www.tritonpeptidebiologicslab.com/nad500mg",
      "reasons": ["Fatigue", "Mitochondrial support", "Cognitive function"],
      "protocol": {
        "indications": ["Cellular energy production", "..."],
        "mechanism": "Nicotinamide adenine dinucleotide — central coenzyme...",
        "dosage": "SubQ Loading: 100–500 mg, 2–3× per week...",
        "warnings": ["IV rapid infusion causes flushing..."],
        "source": "web"
      }
    }
  ],
  "response": "Clinical summary from Claude...",
  "mode": "rag"
}
```

---

## Compound Protocol Data

`compound_protocols.py` contains structured clinical data for all 30 catalog SKUs across 5 categories:

| Category | Compounds |
|---|---|
| GLP Analogues / Weight Management | Tirzepatide, Retatrutide, Mazdutide, Cargrilintide, KLOW, 5-Amino-1MQ |
| Healing & Tissue Repair | BPC-157, TB-500, BPC/TB Blend, AOD 9604 |
| GH Secretagogues / Performance | CJC-1295 w/DAC, Tesamorelin |
| Vitality & Hormonal Signaling | PT-141, Kisspeptin-10, GHK-Cu, GLOW |
| Cognitive & Longevity | NAD+ (500mg/1000mg), Selank, Semax, Thymosin Alpha-1, Epithalon, Mots-c, SS-31 |

Each entry includes `indications`, `mechanism`, `dosage`, `warnings`, and `source` (PDF, web, or supplier).

---

## Compliance

This tool is for **licensed practitioners only** accessing a 503B FDA-registered outsourcing facility. It is not a public consumer tool.

- Compound matching is deterministic — the LLM cannot suggest compounds outside the catalog
- Clinical framing is practitioner-appropriate — dosing and mechanism data are standard of care references
- The public-facing Triton website uses separate research-only framing (per regulatory requirement)
- Compound data sourced from: LaValle et al., *Peptide Handbook: A Professional's Guide to Peptide Therapeutics* (2022) and published clinical literature

---

## Environment Variables

```env
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX=triton-protocol
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Impact

| Metric | Value |
|---|---|
| Build time | ~12 hours (2 sessions) |
| Compounds covered | 30 SKUs across 5 clinical categories |
| Protocol data entries | 30 × 4 sections (indications, mechanism, dosage, warnings) |
| PDF vectors indexed | 237 (LaValle Handbook 2022) |
| API cost per query | ~$0.01–0.05 (Claude + Pinecone retrieval) |
| Equivalent consultant time replaced per query | 15–30 min per practitioner inquiry |

---

## Built With

- [Next.js](https://nextjs.org/) — React framework
- [FastAPI](https://fastapi.tiangolo.com/) — Python API framework
- [Anthropic Claude](https://www.anthropic.com/) — LLM generation
- [Pinecone](https://www.pinecone.io/) — Vector database
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) — Text embeddings

---

## License

Built for Triton Peptide Biologics Lab. All rights reserved.
