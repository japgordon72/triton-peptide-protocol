# Triton Peptide Protocol Reference Tool

A B2B clinical decision-support tool for licensed practitioners purchasing from Triton Peptide Biologics Lab's FDA-registered 503B outsourcing facility. Practitioners enter patient blood work biomarkers and symptoms and receive deterministically matched compound recommendations with full clinical protocol data — indications, mechanism, dosage, and warnings.

**Live:** [protocol-app-gamma-ruddy.vercel.app](https://protocol-app-gamma-ruddy.vercel.app)
**Client:** [Triton Peptide Biologics Lab](https://www.tritonpeptidebiologicslab.com)

---

## What It Does

1. Practitioner enters blood work biomarkers (IGF-1, testosterone, glucose, HbA1c, BMI, etc.) with color-coded optimal range indicators
2. Selects clinical focus areas from 26 symptom chips
3. Deterministic Python lookup matches compounds from the 30-SKU catalog — zero LLM involvement in selection
4. Pinecone RAG pipeline retrieves relevant excerpts from the LaValle Peptide Handbook (2022)
5. Claude generates a structured 4-section clinical summary: 🧬 Patient Profile → 🎯 Priority Stack → ⚠️ Key Considerations → 💊 Protocol Note
6. Compound cards expand to show 🎯 Indications, ⚙️ Mechanism, 💉 Dosage Protocol, ⚠️ Warnings & Cautions
7. Stack builder lets practitioner select compounds → print a curated patient protocol sheet

---

## Architecture

```
Practitioner inputs biomarkers + symptoms
              │
              ▼
compound_matcher.py       ← deterministic Python lookup — no LLM
              │
              ▼
compound_protocols.py     ← structured data: 30 SKUs × 4 protocol fields
              │
              ▼
rag.py                    ← Pinecone query (237 vectors, LaValle PDF)
              │
              ▼
prompts.py → Claude API   ← generates clinical language only, never selects compounds
              │
              ▼
ResponseCard.tsx          ← structured emoji sections + expandable compound cards
```

**Core rule:** Match logic is entirely deterministic. The LLM generates language only — it cannot hallucinate compounds outside the 30-SKU catalog.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript |
| Backend | FastAPI (Python 3.11) |
| LLM | Claude `claude-sonnet-4-6` (Anthropic) |
| Vector DB | Pinecone — 237 vectors from LaValle Peptide Handbook 2022 |
| Embeddings | OpenAI `text-embedding-3-small` |
| PDF parsing | PyMuPDF + LangChain `RecursiveCharacterTextSplitter` |
| Frontend hosting | Vercel |
| Backend hosting | Railway (persistent server — no serverless timeout) |

---

## Features

| Feature | Description | Key Skill |
|---|---|---|
| Deterministic compound matching | Python lookup table — LLM cannot hallucinate or suggest outside catalog | Safety-critical AI design |
| 30-SKU protocol data | 4 fields per compound: indications, mechanism, dosage, warnings | Clinical data architecture |
| RAG pipeline | PDF → chunks → embeddings → Pinecone → context injection | RAG system design |
| Structured LLM output | Prompt forces 4-section emoji output; React parser renders it | Prompt engineering + frontend |
| Biomarker range indicators | Color-coded low/optimal/high under each input field | UX + clinical reference data |
| Compound interaction flags | Auto-detects GLP-1 stacking, IGF-1 elevation, WADA class conflicts | Rule-based safety system |
| Stack builder | Checkbox compounds → print curated patient protocol | Product thinking |
| Print / PDF export | @media print styles, full card expansion, Triton branding | CSS print layout |
| Practitioner gate | Name + email + license type capture → localStorage (CRM-ready hook) | Lead capture architecture |
| Sign out / reset | Clears localStorage, returns to gate — full demo flow | UX |
| Mobile responsive | Fluid grid breakpoints at 600px and 420px | Responsive CSS |

---

## Project Structure

```
protocol-app/                         ← Next.js frontend (deploys to Vercel)
├── app/
│   ├── page.tsx                      # Practitioner gate: name, email, license type
│   ├── protocol/page.tsx             # Main tool: biomarkers, symptoms, results, print
│   ├── globals.css                   # Brand vars + print styles + mobile breakpoints
│   └── layout.tsx
├── components/
│   └── ResponseCard.tsx              # Structured summary + expandable compound cards
├── lib/
│   └── api.ts                        # TypeScript types + fetch wrapper
├── scripts/
│   └── parse_and_ingest.py           # One-time: PDF → chunks → Pinecone (237 vectors)
├── .env.example
└── vercel.json

triton-protocol-backend/              ← FastAPI backend (deploys to Railway)
├── main.py                           # FastAPI: match → protocol → RAG → Claude
├── compound_matcher.py               # Deterministic biomarker + symptom lookup
├── compound_protocols.py             # 30-SKU protocol data (indications/mechanism/dosage/warnings)
├── rag.py                            # Pinecone retrieval with graceful fallback
├── prompts.py                        # Clinical system prompt (practitioner framing)
├── requirements.txt
├── Procfile                          # Railway start command
└── nixpacks.toml                     # Railway build config
```

---

## Getting Started

### Prerequisites
- Python 3.11+ · Node.js 18+ · Pinecone account · Anthropic API key · OpenAI API key

### 1. Clone and configure

```bash
git clone https://github.com/japgordon72/triton-peptide-protocol.git
cd triton-peptide-protocol
cp .env.example .env
# Fill in API keys
```

### 2. Start the backend

```bash
# Clone backend repo separately
git clone https://github.com/japgordon72/triton-protocol-backend.git
cd triton-protocol-backend
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

### 3. Start the frontend

```bash
cd triton-peptide-protocol
npm install
npm run dev -- --port 3001
```

Visit `http://localhost:3001`

### 4. (One-time) Index the handbook PDF

```bash
cd scripts
pip install -r requirements_scripts.txt
python parse_and_ingest.py  # add your PDF path first
```

---

## API

### `POST /api/query`

```json
{
  "biomarkers": { "igf1": 110, "glucose": 120, "bmi": 28 },
  "symptoms": ["fatigue", "brain fog", "poor sleep"],
  "freetext": "optional clinical note"
}
```

**Response includes:**
- `compounds[]` — matched compounds with full protocol data
- `response` — structured Claude clinical summary (4 emoji sections)
- `mode` — `"rag"` (Pinecone context used) or `"direct"` (fallback)

---

## Skills Demonstrated

| Skill | Where in the codebase | Notes |
|---|---|---|
| RAG pipeline design | `rag.py` + `scripts/parse_and_ingest.py` | PDF → PyMuPDF → chunks → embeddings → Pinecone |
| Deterministic AI safety | `compound_matcher.py` | LLM never touches match logic |
| FastAPI + Pydantic | `main.py` | Typed request/response models |
| Prompt engineering | `prompts.py` | Structured 4-section output format enforced |
| React component design | `ResponseCard.tsx` | Stateful expandable cards, stack selection, print mode |
| TypeScript strict typing | `lib/api.ts` | Full type coverage on API contract |
| Clinical data architecture | `compound_protocols.py` | 30 × 4 fields, fuzzy matching, source attribution |
| Fullstack deployment | Vercel (Next.js) + Railway (FastAPI) | Separate services, env var wiring |
| Compliance-aware design | `prompts.py`, `app/page.tsx` | 503B practitioner framing, gated access |
| CSS print layout | `globals.css` | `@media print` with forced card expansion |

---

## Impact

### Phase 1 — Tool Alone

| Task replaced | Before | After | Time saved |
|---|---|---|---|
| Compound recommendation inquiry | 20–30 min call/email | 90 sec self-serve | ~28 min/query |
| Protocol reference lookup | 10–15 min manual research | Instant | ~12 min/query |
| Interaction screening | 15–20 min manual cross-check | Auto-flagged | ~17 min/query |
| Protocol sheet creation | 20–30 min formatting | Print button | ~25 min/query |
| **Monthly total (40 queries/mo)** | **~26 hrs** | **~1 hr** | **~25 hrs/month** |

### Phase 2 — With Automations (scoped, not yet built)

| Automation | Time saved/month |
|---|---|
| Lead capture → HubSpot CRM | 3.3 hrs |
| Order click → Slack alert (buying signal) | 8 hrs |
| Protocol PDF → auto-email to practitioner | 6 hrs |
| Reorder reminders (cycle-length based) | 5 hrs |
| New SKU alerts to past inquirers | 2.5 hrs |
| **Phase 2 total** | **~25 hrs/month** |

### Combined

| Metric | Value |
|---|---|
| Total monthly time savings (Phase 1 + 2) | ~50 hrs/month |
| Equivalent value at $150/hr billing rate | **$7,500/month** |
| Agency equivalent build cost | **$4,475** (Phase 1) |
| Payback period | **< 1 month** |
| API cost per query | ~$0.02–0.05 |
| Projected revenue impact | $6,000–12,000/year (2 extra clinic accounts) |

---

## Phase 2 Automations

### Lead Capture → CRM
**Trigger:** Practitioner completes the entry gate
**Action:** POST name + email + license type → HubSpot contact with compound interest tags
**Time saved:** ~3.3 hrs/month in manual lead logging

### Order Click → Slack Alert
**Trigger:** Practitioner clicks "Order →" on a compound
**Action:** Instant Slack/email to owner with compound name + practitioner email
**Time saved:** ~8 hrs/month in missed follow-up recovered

### Protocol PDF → Auto-Email
**Trigger:** Query submitted
**Action:** Branded PDF of matched protocol stack emailed to practitioner in 60 seconds
**Time saved:** ~6 hrs/month in manual protocol sheet creation

### Reorder Reminder Sequence
**Trigger:** Order confirmed for a compound with known cycle length (BPC-157: 30 days, Epithalon: 20 days)
**Action:** Email at day 25 — "Your protocol is wrapping up — reorder now"
**Time saved:** ~5 hrs/month in manual follow-up calendar

### New SKU Alert
**Trigger:** New compound added to catalog
**Action:** Email past practitioners who queried related compounds
**Time saved:** ~2.5 hrs per campaign in manual list segmentation

---

## Related Repos

| Repo | Description |
|---|---|
| [triton-peptide-protocol](https://github.com/japgordon72/triton-peptide-protocol) | This repo — Next.js frontend |
| [triton-protocol-backend](https://github.com/japgordon72/triton-protocol-backend) | FastAPI backend (Railway) |
| [triton-peptide-website](https://github.com/japgordon72/triton-peptide-website) | Client marketing site (private) |

---

## Compliance

- Compound matching is deterministic — LLM cannot suggest outside the 30-SKU catalog
- Practitioner gate captures license type before access
- Clinical framing is 503B practitioner-appropriate — dosing is standard of care reference
- Public-facing Triton website uses separate research-only framing (regulatory requirement)
- Source attribution per compound: LaValle et al., *Peptide Handbook* 2022 or published clinical literature

---

## Environment Variables

```env
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX=triton-protocol
NEXT_PUBLIC_API_URL=http://localhost:8000   # → Railway URL in production
```

---

## Contact

**Japheth Gordon** — AI Automation · Full-Stack Development
- Email: japgordon@gmail.com
- LinkedIn: [linkedin.com/in/japgordon](https://linkedin.com/in/japgordon)
- GitHub: [github.com/japgordon72](https://github.com/japgordon72)

---

## License

Built for Triton Peptide Biologics Lab. All rights reserved.
