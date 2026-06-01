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

## Features (Phase 1 — Shipped)

| Feature | Description |
|---|---|
| Deterministic compound matching | Python lookup — no LLM hallucination on compound selection |
| 30-SKU protocol data | Indications, mechanism, dosage, warnings per compound |
| RAG pipeline | 237 Pinecone vectors from LaValle Handbook 2022 |
| Claude clinical summaries | Practitioner-framed, structured per compound |
| Email-gated entry | Captures name, email, license type → localStorage (CRM-ready) |
| Biomarker range indicators | Color-coded low/optimal/high under each input field |
| Stack builder | Checkbox compounds to curate a patient stack |
| Compound interaction flags | Auto-detects GLP-1 stacking, IGF-1 elevation, WADA class conflicts |
| Print / PDF export | Print All or Print Stack — @media print formatted |
| Mobile responsive | Fluid grid at 600px and 420px breakpoints |

---

## Phase 2 — Planned Automations (Make.com / Zapier)

These automations are scoped and designed — implementation follows once Phase 1 is deployed to production. Each targets a specific revenue or efficiency outcome.

### 1. Lead Capture → CRM Pipeline
**Trigger:** Practitioner completes email gate
**Action:** POST name + email + license type to HubSpot (or Airtable) → create contact with tags
**Impact:** Every tool session becomes a tracked sales lead. Sales team sees who entered before calling.
**Time saved:** Eliminates manual lead logging — ~5 min per inquiry × estimated 40 inquiries/month = **3.3 hrs/month**

### 2. "Order →" Click → Owner Slack Alert
**Trigger:** Practitioner clicks Order button on a specific compound
**Action:** Log compound name + practitioner email → send Slack/email to owner within 60 seconds
**Impact:** Buying signal captured in real time. Call within the hour → significantly higher close rate.
**Time saved:** Replaces monitoring and follow-up guesswork — estimated **2 hrs/week** in missed follow-up recovered

### 3. Protocol PDF → Auto-Email
**Trigger:** Practitioner submits a query
**Action:** Generate branded PDF of matched protocol stack → email to practitioner within 60 seconds
**Impact:** Makes Triton look like a clinical platform, not just a supplier. Increases perceived value of the relationship.
**Time saved:** Replaces manual protocol sheet creation — **15–20 min per request** eliminated

### 4. Reorder Reminder Sequence
**Trigger:** Order placed for a compound with a known cycle length (BPC-157: 30 days, Epithalon: 20 days, etc.)
**Action:** Automated email at day 25 — "Your [compound] protocol is wrapping up — reorder for uninterrupted dosing"
**Impact:** Highest ROI automation for repeat revenue. Converts one-time orders into recurring accounts.
**Time saved:** Replaces manual follow-up calendar — **4–6 hrs/month** in manual outreach eliminated

### 5. New SKU Alert to Past Inquirers
**Trigger:** New compound added to the catalog
**Action:** Query past practitioners who looked up related compounds → send targeted email
**Impact:** Warm re-engagement with buyers who already showed intent. No cold outreach.
**Time saved:** Replaces manual list segmentation — **2–3 hrs per campaign** eliminated

---

## Impact

### Time Saved — Phase 1 (Tool Alone)

| Task replaced | Before | After | Saved per event |
|---|---|---|---|
| Compound recommendation inquiry | 20–30 min call/email | 90 sec self-serve | ~28 min |
| Protocol reference lookup | 10–15 min manual research | Instant | ~12 min |
| Interaction screening | 15–20 min manual cross-check | Auto-flagged | ~17 min |
| Protocol sheet creation | 20–30 min formatting | Print button | ~25 min |
| **Monthly total (est. 40 queries)** | **~26 hrs** | **~1 hr** | **~25 hrs/month** |

### Time Saved — Phase 2 (With Automations)

| Automation | Time saved/month |
|---|---|
| Lead capture → CRM (no manual logging) | 3.3 hrs |
| Order click alerts (recovered follow-up) | 8 hrs |
| Auto PDF emails (no manual protocol sheets) | 6 hrs |
| Reorder reminders (no manual follow-up calendar) | 5 hrs |
| New SKU campaigns (no manual segmentation) | 2.5 hrs |
| **Phase 2 additional savings** | **~25 hrs/month** |

### Combined Impact (Phase 1 + 2)

| Metric | Value |
|---|---|
| Total monthly time savings | ~50 hrs/month |
| At $150/hr practitioner billing rate | **$7,500/month in recovered time** |
| Estimated build cost (agency equivalent) | $4,475 (Phase 1) + ~$2,500 (Phase 2) = $6,975 |
| Payback period | **< 1 month** |
| Projected revenue impact (2 extra clinic accounts) | $6,000–12,000/year |
| API cost per query | ~$0.02–0.05 |

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
