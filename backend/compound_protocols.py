"""
Structured protocol data for all 30 Triton SKUs.
PDF-sourced data from: LaValle et al., Peptide Handbook 2022.
Web-sourced data noted inline for newer compounds not in PDF.
"""

PROTOCOLS: dict[str, dict] = {

    "AOD 9604": {
        "indications": [
            "Weight management and body fat reduction",
            "Stimulates lipolysis, inhibits lipogenesis",
            "Regulates fat metabolism",
            "Joint pain and osteoarthritis support (AOD+HA formulation)",
            "Cartilage repair and regeneration",
            "Collagen support",
        ],
        "mechanism": (
            "C-terminal fragment of human growth hormone (residues 177–191). "
            "Mimics the fat-mobilizing domain of GH without systemic GH receptor binding. "
            "Activates β-3 adrenergic receptors to drive lipolysis and inhibits acetyl-CoA carboxylase to block lipogenesis."
        ),
        "dosage": (
            "SubQ: 0.3 mg (300 mcg) once daily for 20 days. "
            "Topical cream: apply 1.0 ml (4 clicks) to inner forearms nightly. "
            "AOD+HA (intra-articular): 0.5–0.75 ml once weekly for 4 weeks, then monthly for 5 months."
        ),
        "warnings": [
            "Reported safe in recommended dosages",
            "As with all injections: redness and pain at injection site may occur",
            "Rare: erythema, transient muscle atrophy, polyarthralgia, rash",
            "Safety in pediatrics not established",
        ],
        "source": "pdf",
    },

    "BPC-157": {
        "indications": [
            "Tissue and wound healing — skin, muscle, bone, ligament, tendon",
            "Sports and athletic injury recovery",
            "Gastric protection and anti-ulcer",
            "Inflammatory bowel disease (IBD) support",
            "Leaky gut syndrome — improves GI mucosal barrier",
            "Decreases NSAID and alcohol effects on gastric mucosa",
            "Burn healing, antioxidant, neuroprotection, cardioprotection",
            "Adjunct in cancer cachexia",
        ],
        "mechanism": (
            "Pentadecapeptide derived from human gastric juice BPC protein. "
            "Upregulates growth hormone receptor signaling and promotes angiogenesis via VEGF. "
            "Activates NO synthesis and FAK/paxillin pathway to accelerate tissue repair; acts systemically despite local administration."
        ),
        "dosage": (
            "SubQ general: 300–600 mcg daily for 30 days. "
            "Injury-specific: 300–500 mcg BID for 30 days. "
            "Oral: 500 mcg daily for 30 days. "
            "Can add KPV 500 mcg daily for synergistic GI support. "
            "Results can be spontaneous, typically improve over 2–4 weeks."
        ),
        "warnings": [
            "Reported safe in recommended dosages",
            "Use with caution where angiogenesis needs to be suppressed (active malignancy)",
            "Redness and pain at injection site may occur",
            "Rare: erythema, transient muscle atrophy, polyarthralgia, rash",
            "Safety in pediatrics not established",
        ],
        "source": "pdf",
    },

    "BPC157/TB500 Blend": {
        "indications": [
            "Combined tissue repair and immune support",
            "Soft tissue, tendon, ligament, and muscle injury",
            "GI healing combined with systemic repair",
            "Enhanced recovery over either compound alone",
        ],
        "mechanism": (
            "Combines BPC-157's local angiogenesis and GI mucosal healing with TB-500's systemic actin-binding cell migration. "
            "Complementary pathways: BPC-157 drives vascular repair and NO signaling; TB-500 promotes cell migration into damaged tissue via Tβ4 LKKTET motif."
        ),
        "dosage": (
            "SubQ: 300–500 mcg daily. "
            "Oral blend available: 1000 mcg daily. "
            "Cycle: 30 days on, assess, repeat as needed. "
            "Do not dose TB-500 component continuously for more than 3 months."
        ),
        "warnings": [
            "See individual BPC-157 and TB-500 warnings",
            "Use with caution in active cancer — angiogenesis consideration",
            "Redness and pain at injection site may occur",
            "Safety in pediatrics not established",
        ],
        "source": "pdf+blend",
    },

    "TB-500": {
        "indications": [
            "Sports and athletic injury — soft tissue, tendon, ligament, muscle",
            "Pressure ulcers and venous stasis ulcers",
            "Immune support (mono or with Thymosin Alpha-1)",
            "Cardioprotection — especially post-MI",
            "Neuroinflammation and microglial inflammation",
            "Multiple sclerosis support",
            "Ischemic stroke recovery support",
        ],
        "mechanism": (
            "Synthetic analogue of Thymosin Beta-4 (Tβ4). "
            "Binds G-actin to upregulate cell migration, differentiation, and survival. "
            "Promotes angiogenesis, reduces pro-inflammatory cytokines, and modulates immune response through LKKTET motif activity."
        ),
        "dosage": (
            "SubQ: 300 mcg–1 mg daily depending on clinical presentation. "
            "Less for immune support, more for tissue repair. "
            "Do not dose continuously for more than 3 months. "
            "Cycle: 3 months on / 6 weeks off, or 6 weeks on / 6 weeks off."
        ),
        "warnings": [
            "Reported safe in recommended dosages",
            "Do not use continuously for more than 3 months — cycle required",
            "Redness and pain at injection site may occur",
            "Safety in pediatrics not established",
        ],
        "source": "pdf",
    },

    "CJC-1295 w/DAC": {
        "indications": [
            "GHRH analogue — stimulates pituitary endogenous GH production",
            "Increases endogenous IGF-1",
            "Improved physical performance",
            "Increased muscle mass",
            "Weight loss support",
            "Extended half-life vs CJC without DAC — weekly dosing",
        ],
        "mechanism": (
            "GHRH analogue with Drug Affinity Complex (DAC) that binds albumin, extending half-life to 6–8 days. "
            "Stimulates pituitary somatotrophs to increase GH pulse amplitude and frequency. "
            "Downstream IGF-1 rise drives anabolic and lipolytic effects."
        ),
        "dosage": (
            "SubQ: 600 mcg once weekly. "
            "Best dosed on an empty stomach, at least 2–3 hours after last meal. "
            "CJC without DAC: 50–100 mcg QHS, 5 days per week."
        ),
        "warnings": [
            "Banned by WADA — not for use in competitive sports",
            "Phase II trial reported 1 death from MI (11th weekly dose) — caution in cardiovascular disease",
            "Common: flushing, injection site erythema, rash, edema, joint and muscle pain, fatigue",
            "Contraindicated in active malignancy",
            "Safety in pediatrics not established",
        ],
        "source": "pdf",
    },

    "Tesamorelin": {
        "indications": [
            "FDA-approved (2010) for reduction of excess abdominal fat in HIV-associated lipodystrophy",
            "GHRH analogue — stimulates endogenous GH and IGF-1",
            "Decreases visceral adipose tissue (VAT) by 15–20% over 6–12 months",
            "Visceral fat reduction in non-HIV populations (off-label)",
            "Metabolic support",
        ],
        "mechanism": (
            "Stabilized GHRH(1-44) analogue with trans-3-hexenoic acid modification that protects against DPP-IV cleavage. "
            "Binds pituitary GHRH receptor to stimulate endogenous GH secretion and increase IGF-1. "
            "Selectively reduces visceral adipose tissue without significantly impacting subcutaneous fat."
        ),
        "dosage": (
            "SubQ: 1–2 mg daily, approximately 90 minutes before bedtime or after last food intake. "
            "1 mg recommended by many experts for cost-effectiveness; 2 mg is manufacturer recommendation (Egrifta). "
            "Inject into abdomen, rotate sites. Do not inject into scar tissue or bruised areas."
        ),
        "warnings": [
            "Contraindicated in hypersensitivity to any component",
            "Contraindicated in pregnancy",
            "Contraindicated with pituitary conditions or HPA axis disruption",
            "Contraindicated with existing head trauma",
            "Contraindicated in active malignancy",
            "Use with caution with elevated IGF-1",
            "Use with caution with fluid retention conditions",
            "Safety in pediatrics not established",
        ],
        "source": "pdf",
    },

    "PT-141 10mg": {
        "indications": [
            "Male and female sexual dysfunction",
            "Hypoactive sexual desire disorder (HSDD) in premenopausal women",
            "Female sexual arousal disorder",
            "Erectile dysfunction in men",
            "FDA-approved as Vyleesi for premenopausal women with HSDD",
        ],
        "mechanism": (
            "Melanocortin receptor agonist — acts centrally on MC3R/MC4R in the hypothalamus. "
            "Central mechanism bypasses the vascular pathway of PDE5 inhibitors, activating dopaminergic pathways to drive sexual motivation and arousal. "
            "Effective regardless of vascular status."
        ),
        "dosage": (
            "SubQ (men and women): Start with 1 mg test dose, add 1 mg 30 minutes later if tolerated. "
            "Full dose: 2 mg (0.1–0.2 ml), 45 minutes to 1 hour before activity. "
            "Duration of effects: 24–72 hours. "
            "Do not use more than once per 72 hours. "
            "Titration may be needed to achieve desired response."
        ),
        "warnings": [
            "Contraindicated in uncontrolled hypertension or known cardiovascular disease",
            "GI distress including nausea is common — may be severe in sensitive individuals",
            "Antihistamine or 5-HT3 antagonist may reduce nausea risk",
            "Priapism risk in men — discontinue if erection lasts more than 4 hours",
            "Do not exceed recommended dose",
            "Redness and pain at injection site may occur",
        ],
        "source": "pdf",
    },

    "Kisspeptin-10": {
        "indications": [
            "Primary hypogonadism",
            "Endogenous testosterone support",
            "Fertility support",
            "Improving ovulation and egg implantation",
            "Prevention of ectopic pregnancy",
            "Physiologic hormone replacement therapy (HRT) support",
            "Diabetes and insulin resistance support",
        ],
        "mechanism": (
            "Endogenous ligand for GPR54 (KISS1R). "
            "Activates hypothalamic GnRH neurons → pulsatile LH/FSH release → gonadal steroidogenesis. "
            "Pulsatile stimulation preserves HPG axis sensitivity, unlike continuous GnRH agonists which desensitize the axis."
        ),
        "dosage": (
            "SubQ: 100 mcg (0.1 ml) once daily at bedtime, 5 days per week. "
            "Bedtime dosing not strictly required. "
            "Supplied as 1 mg/ml 3 ml vial."
        ),
        "warnings": [
            "Reported safe in recommended dosages",
            "Redness and pain at injection site may occur",
            "High-dose long-acting analogues may suppress HPG axis — use caution in hormone-dependent malignancies",
            "Safety in pediatrics not established",
        ],
        "source": "pdf",
    },

    "GHK-CU 100mg": {
        "indications": [
            "Anti-aging and skin regeneration",
            "Epigenetic modulation and stem cell production",
            "Wound healing and tissue repair",
            "Decreases skin thinning, improves elasticity and firmness",
            "UV protection",
            "Hair growth and re-growth",
            "Antioxidant and anti-inflammatory",
            "Neuroprotection and cognitive support",
            "Lung and liver protection",
            "COPD fibroblast restoration",
        ],
        "mechanism": (
            "Copper-binding tripeptide Gly-His-Lys naturally found in plasma, saliva, and urine. "
            "Activates over 4,000 genes including collagen synthesis, antioxidant enzymes, and DNA repair genes via epigenetic modulation. "
            "Acts as a master switch for wound healing through TGF-β and VEGF upregulation."
        ),
        "dosage": (
            "SubQ/IM: 1–2 mg once daily for 10–21 days. "
            "Scalp foam 0.5%: apply daily, massage into scalp. "
            "Facial cream 0.5%: apply sparingly to face daily. "
            "Discontinue topical use if irritation or redness develops."
        ),
        "warnings": [
            "Monitor for copper toxicity — sign: lunula of nail turns blue (corrects 4–6 weeks after stopping)",
            "Recommend zinc chelate 30 mg daily to prevent zinc/copper imbalance",
            "Redness and pain at injection site may occur",
            "Rare: erythema, transient muscle atrophy, polyarthralgia, rash",
        ],
        "source": "pdf",
    },

    "GLOW 70mg": {
        "indications": [
            "Skin rejuvenation and anti-aging blend",
            "Hormonal balance support for women",
            "Collagen and elasticity support",
            "Perimenopause and menopause symptom support",
        ],
        "mechanism": (
            "Proprietary blend — mechanism follows component peptides. "
            "GHK-Cu component drives epigenetic repair and collagen synthesis; hormonal support compounds modulate endocrine signaling. "
            "Confirm blend composition with supplier for complete mechanism picture."
        ),
        "dosage": (
            "SubQ: Confirm specific protocol with prescriber based on blend composition. "
            "Typical blend dosing: follow component peptide protocols for GHK-Cu and hormonal support compounds."
        ),
        "warnings": [
            "Follow individual component warnings",
            "Redness and pain at injection site may occur",
            "Confirm blend composition with supplier before dosing",
        ],
        "source": "supplier",
    },

    "NAD+ 500mg": {
        "indications": [
            "Cellular energy production and mitochondrial support",
            "Anti-aging and longevity",
            "Cognitive function and neuroprotection",
            "Metabolic support",
            "DNA repair",
            "Addiction recovery support",
            "Chronic fatigue",
        ],
        "mechanism": (
            "Nicotinamide adenine dinucleotide — central coenzyme in cellular redox reactions. "
            "Serves as substrate for sirtuins (SIRT1–7), PARP DNA repair enzymes, and CD38/CD157 signaling enzymes. "
            "NAD+ declines with age; restoration activates mitochondrial biogenesis, reduces oxidative stress, and supports circadian gene expression via sirtuin activity."
        ),
        "dosage": (
            "SubQ Loading: 100–500 mg, 2–3× per week for 4–8 weeks. Titrate up gradually. "
            "SubQ Maintenance: 100–500 mg once weekly after loading phase. "
            "IV: Slow infusion mandatory — rapid delivery causes chest tightness, flushing, nausea. "
            "Reconstitute with bacteriostatic water. Refrigerate 2–8°C."
        ),
        "warnings": [
            "IV rapid infusion — flushing, chest tightness, nausea, palpitations; always slow-drip",
            "SubQ generally better tolerated than IV at equivalent doses",
            "GI symptoms (nausea, cramping) common at higher doses — titrate gradually",
            "Use caution in patients with active malignancy — NAD+ supports cellular proliferation broadly",
        ],
        "source": "web",
    },

    "NAD+ 1000mg": {
        "indications": [
            "Higher-dose cellular energy and mitochondrial support",
            "Advanced anti-aging protocols",
            "Neuroprotection and cognitive support",
            "DNA repair support",
        ],
        "mechanism": (
            "Same mechanism as NAD+ 500mg at higher loading dose. "
            "Higher dose achieves greater sirtuin activation and more complete NAD pool restoration — relevant in severe depletion states. "
            "Titrate from 500 mg to assess tolerance before advancing to 1000 mg."
        ),
        "dosage": (
            "SubQ: 500–1000 mg, 2–3× per week during loading. "
            "Maintenance: 500–1000 mg weekly. "
            "Titrate up from lower doses to assess tolerance before reaching 1000 mg."
        ),
        "warnings": [
            "Higher dose — titrate up slowly from 500 mg",
            "IV: administer slowly to minimize flushing, nausea, chest tightness",
            "Monitor for GI side effects",
        ],
        "source": "web",
    },

    "Selank 10mg": {
        "indications": [
            "Anxiety and stress reduction (anxiolytic) — no addiction potential",
            "Cognitive function and nootropic support",
            "Immune modulation — antiviral, anticancer support",
            "Adaptogenic",
            "Inflammatory regulation",
            "Gastric ulcer healing acceleration",
            "GABAergic system modulation",
        ],
        "mechanism": (
            "Heptapeptide (Thr-Lys-Pro-Arg-Pro-Gly-Pro) analogue of tuftsin. "
            "Modulates GABA-A receptor sensitivity and upregulates BDNF expression. "
            "Regulates IL-6 cytokine system and enkephalin degradation — producing anxiolytic and cognitive effects without tolerance or dependency."
        ),
        "dosage": (
            "SubQ: 300–1000 mcg daily or 2× per week (alternate with Semax to prevent desensitization). "
            "Intranasal 0.15%: 2–3 drops (400–600 mcg) each nostril, 2–3 times daily. "
            "Intranasal route provides immediate relief for acute anxiety. "
            "Responses can be immediate."
        ),
        "warnings": [
            "Use with caution if concurrently using anti-anxiety or psychotropic drugs",
            "Safety in pediatrics not established",
            "Common: injection site erythema, rash, edema, joint and muscle pain",
        ],
        "source": "pdf",
    },

    "Semax 10mg": {
        "indications": [
            "Neuroprotection — promotes neuron survival",
            "Decreases glutamate neurotoxicity",
            "Cognitive enhancement and increased concentration",
            "Anxiolytic — no addiction potential",
            "Antidepressant support",
            "TBI, stroke, and acute MI recovery support",
            "Optic nerve protection",
            "Mitochondrial stability improvement",
        ],
        "mechanism": (
            "ACTH(4-7) proline-glycine-proline analogue. "
            "Upregulates BDNF (brain-derived neurotrophic factor) and VEGF, promoting neuroplasticity and neuron survival. "
            "Reduces glutamate-induced excitotoxicity and stabilizes mitochondrial membrane potential in neurons."
        ),
        "dosage": (
            "SubQ: 300–1000 mcg daily or 2× per week (alternate with Selank) to prevent desensitization. "
            "Intranasal 0.1%: for cognitive improvement and general neuroprotection, 2–3 drops each nostril 2× daily. "
            "Intranasal 1%: for strokes, TBI, migraines — 2–4 drops each nostril 3–4× daily. "
            "Chronic use more effective for anxiety and depression."
        ),
        "warnings": [
            "Semax has more sedative activity than Selank — use caution when driving",
            "Safety in pediatrics not established",
            "Common: injection site erythema, rash, edema, joint and muscle pain",
            "Store nasal product in refrigerator. Once opened: stable outside fridge 2 weeks.",
        ],
        "source": "pdf",
    },

    "Thymosin Alpha-1 5mg": {
        "indications": [
            "Immune modulation — viral infection, HIV, Hepatitis B/C",
            "Cancer support",
            "Complicated immune suppression or over-activation",
            "Chronic infections",
            "Sepsis support",
        ],
        "mechanism": (
            "28-amino acid peptide derived from prothymosin α. "
            "Activates dendritic cells and NK cells via TLR-7/TLR-9 signaling pathways. "
            "Upregulates Th1 cytokine response and MHC class I antigen presentation — shifting immune state toward pathogen and tumor clearance."
        ),
        "dosage": (
            "SubQ: 1.5 mg every 3rd day. "
            "Zadaxin brand: 1.6 mg SubQ 2× weekly for 6–12 months. "
            "Viral infection: minimum 2 weeks. "
            "HIV/cancer/Hepatitis or complex immune cases: 3 months or longer. "
            "Patients under 40 kg: adjust to 40 mcg/kg 2× weekly."
        ),
        "warnings": [
            "Reported safe in recommended dosages",
            "Redness and pain at injection site may occur",
            "Safety in pediatrics not established",
            "Duration of treatment varies significantly by indication — consult prescriber",
        ],
        "source": "pdf",
    },

    "Epithalon 10mg": {
        "indications": [
            "Anti-aging — promotes lymphocyte proliferation in thymus",
            "Telomere lengthening",
            "Neuroprotection and cognitive support",
            "Mood support",
            "Sleep regulation — restores melatonin levels",
            "Antioxidant — decreases lipid oxidation, improves glutathione",
            "Anti-tumor activity reported across mammary, colon, and prostate in studies",
        ],
        "mechanism": (
            "Synthetic tetrapeptide (Ala-Glu-Asp-Gly) derived from pineal gland epithalamin. "
            "Activates telomerase (hTERT) expression — the only peptide with direct telomere extension evidence in human somatic cells. "
            "Regulates pineal melatonin synthesis and circadian gene expression, restoring sleep architecture and antioxidant enzyme activity."
        ),
        "dosage": (
            "SubQ: 10 mg every 3 days for 15 days. Repeat twice annually. "
            "Oral: 10–20 mg BID, 30 minutes before meals for 1 month. "
            "Repeat oral cycle every 4–6 months. "
            "Evening administration preferred to align with circadian phase."
        ),
        "warnings": [
            "Reported safe in recommended dosages",
            "Redness and pain at injection site may occur",
            "Most studies conducted by St. Petersburg Institute of Bioregulation — limited Western RCT data",
            "Caution in hormone-sensitive conditions — pineal modulation may affect hormonal axes",
        ],
        "source": "pdf",
    },

    "Mots-c 10mg": {
        "indications": [
            "Obesity and weight management",
            "Type 2 diabetes and insulin resistance",
            "Anti-aging",
            "Mitochondrial dysfunction",
            "Metaflammation (metabolic inflammation)",
            "Cardioprotection",
            "Osteoporosis prevention and treatment",
        ],
        "mechanism": (
            "Mitochondrially-derived peptide encoded by 12S rRNA of mitochondrial DNA. "
            "Activates AMPK pathway, inhibits AICAR transformylase in the folate cycle, and increases glucose uptake in skeletal muscle. "
            "Acts as an exercise mimetic — activating metabolic pathways normally triggered by physical activity."
        ),
        "dosage": (
            "SubQ: 5 mg 2× per week. "
            "Can increase to 10 mg 2× per week based on clinical response."
        ),
        "warnings": [
            "MOTS-c targets folate cycle — possible depletion of 5-MTHF with use",
            "Recommend supplementing folate as folinic acid or 5-MTHF up to 1200 mcg daily between injections",
            "Especially important for patients prone to MTHFR mutations",
            "Redness and pain at injection site may occur",
        ],
        "source": "pdf",
    },

    "SS-31 10mg": {
        "indications": [
            "Mitochondrial dysfunction and oxidative stress",
            "Cardiovascular protection",
            "Barth syndrome (FDA-approved indication under brand Forzinity)",
            "Heart failure support",
            "Renal protection",
            "Aging-related mitochondrial decline",
            "Chronic fatigue and energy deficit",
        ],
        "mechanism": (
            "Mitochondria-targeting aromatic-cationic tetrapeptide (D-Arg-2'6'-DiMPhe-Lys-Phe-NH2). "
            "Selectively concentrates in the inner mitochondrial membrane, binds cardiolipin, and stabilizes electron transport chain complex activity. "
            "Reduces superoxide generation and prevents mitochondrial permeability transition pore opening — preserving ATP output under stress."
        ),
        "dosage": (
            "SubQ: Start 5–10 mg once daily. "
            "Advanced: 15–20 mg daily under supervision. "
            "FDA-approved Barth syndrome dose: 40 mg SubQ once daily. "
            "Do not exceed 40 mg daily — higher doses show no additional benefit."
        ),
        "warnings": [
            "FDA-approved only for Barth syndrome (Forzinity) — other uses investigational",
            "Redness and pain at injection site may occur",
            "Rapidly absorbed SubQ — ~92% bioavailability, peak at 30–60 min post-injection",
        ],
        "source": "web+pdf",
    },

    "Tirzepatide 5mg": {
        "indications": [
            "Type 2 diabetes management",
            "Weight management and obesity (FDA-approved as Mounjaro / Zepbound)",
            "Dual GLP-1 and GIP receptor agonist",
            "Cardiovascular risk reduction in obesity",
            "Metabolic syndrome support",
        ],
        "mechanism": (
            "Dual GIP and GLP-1 receptor agonist. "
            "GLP-1 agonism slows gastric emptying, reduces appetite, and increases glucose-dependent insulin secretion. "
            "GIP agonism adds fat cell lipid metabolism regulation and energy expenditure enhancement — combined activation produces superior weight loss vs mono-GLP-1 agonism."
        ),
        "dosage": (
            "SubQ: Start 2.5 mg once weekly for 4 weeks. "
            "Titrate by +2.5 mg every 4 weeks as tolerated. "
            "Maintenance: 5–15 mg weekly. Maximum: 15 mg weekly. "
            "Reconstitute with bacteriostatic water. Refrigerate 2–8°C. Use within 28 days."
        ),
        "warnings": [
            "GI side effects common during titration: nausea, vomiting, diarrhea — slow titration reduces incidence",
            "Contraindicated in personal or family history of medullary thyroid carcinoma",
            "Contraindicated in Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)",
            "Pancreatitis: discontinue if suspected",
            "Hypoglycemia risk when combined with insulin or sulfonylureas",
            "Compounded product — not FDA-approved; differs from branded Mounjaro/Zepbound",
        ],
        "source": "web",
    },

    "Retatrutide 5mg": {
        "indications": [
            "Weight management — triple GLP-1/GIP/glucagon receptor agonist",
            "Obesity and metabolic syndrome",
            "Type 2 diabetes support",
            "Visceral fat reduction",
            "Phase 3 trials showing superior weight loss vs tirzepatide in early data",
        ],
        "mechanism": (
            "Triple GLP-1/GIP/glucagon receptor agonist — adds glucagon receptor stimulation to tirzepatide's dual mechanism. "
            "Glucagon agonism increases hepatic glucose regulation and thermogenesis via brown adipose tissue activation. "
            "Triple receptor engagement drives superior visceral fat reduction and energy expenditure."
        ),
        "dosage": (
            "SubQ: Start 2 mg once weekly. "
            "Titration: 2 mg (weeks 1–4) → 4 mg (weeks 5–8) → 8 mg (weeks 9–12) → up to 12 mg weekly. "
            "Standard maintenance: 6–8 mg weekly. Advanced: up to 12 mg weekly."
        ),
        "warnings": [
            "GI side effects common — nausea, vomiting, diarrhea. Slow titration critical.",
            "Triple receptor agonism — more potent than tirzepatide; closer monitoring advised",
            "Not yet FDA-approved — investigational compound",
            "Thyroid C-cell tumor risk class warning (GLP-1 class effect)",
            "Pancreatitis: discontinue if suspected",
        ],
        "source": "web",
    },

    "Mazdutide 5mg": {
        "indications": [
            "Weight management — dual GLP-1/glucagon receptor agonist",
            "Obesity treatment",
            "Received initial approval in China for obesity",
            "Metabolic syndrome support",
        ],
        "mechanism": (
            "Dual GLP-1/glucagon receptor agonist. "
            "GLP-1 component drives insulin secretion and appetite suppression; glucagon component increases hepatic lipolysis and thermogenesis. "
            "More glucagon-weighted ratio than tirzepatide — favors energy expenditure over incretin effect."
        ),
        "dosage": (
            "SubQ: Start 2.5 mg once weekly for 4 weeks. "
            "Advance to 5 mg weekly at week 5. "
            "Dose range: 3–9 mg weekly. Maximum studied: 10 mg weekly."
        ),
        "warnings": [
            "GI side effects common during titration",
            "Not FDA-approved — investigational in the US",
            "Thyroid C-cell tumor risk (GLP-1 class effect)",
            "Pancreatitis: discontinue if suspected",
        ],
        "source": "web",
    },

    "Cargrilintide 5mg": {
        "indications": [
            "Weight management — long-acting amylin analogue",
            "Complements GLP-1 agonists via separate mechanism (amylin pathway)",
            "Satiety signaling",
            "Often combined with semaglutide in CagriSema protocol",
        ],
        "mechanism": (
            "Long-acting amylin analogue — amylin is co-secreted with insulin from pancreatic beta-cells. "
            "Acts on area postrema (brainstem) to delay gastric emptying, suppress glucagon, and enhance satiety via a pathway entirely separate from GLP-1. "
            "CagriSema combination targets 4+ distinct receptor pathways simultaneously."
        ),
        "dosage": (
            "SubQ: Start 0.6 mg once weekly. "
            "Titrate: +0.6 mg every 4 weeks as tolerated. "
            "Maintenance: 1.8–2.4 mg weekly. "
            "Combination with semaglutide: 0.25–2.4 mg each, weekly titration over 16+ weeks."
        ),
        "warnings": [
            "GI side effects common — nausea, vomiting; slower titration reduces incidence",
            "Not FDA-approved — investigational",
            "Rotate injection sites weekly",
            "Refrigerate reconstituted solution 2–8°C, discard after 30 days",
        ],
        "source": "web",
    },

    "KLOW 80mg": {
        "indications": [
            "Tissue regeneration and healing support blend",
            "Composition: GHK-Cu 50mg + BPC-157 10mg + TB-500 10mg + KPV 10mg",
            "Skin and connective tissue repair",
            "GI healing (KPV component)",
            "Anti-inflammatory",
        ],
        "mechanism": (
            "Multi-pathway repair blend: GHK-Cu drives epigenetic collagen synthesis; BPC-157 promotes angiogenesis; TB-500 activates cell migration via actin binding; KPV (α-MSH fragment) acts on MC1R to suppress NF-κB and reduce inflammation. "
            "Four complementary mechanisms targeting repair at vascular, extracellular matrix, and inflammatory levels simultaneously."
        ),
        "dosage": (
            "SubQ: Start 100–200 mcg daily. "
            "Increase by 50–100 mcg increments over 2–4 week periods. "
            "Typical maintenance: 200–400 mcg daily."
        ),
        "warnings": [
            "GHK-Cu component: monitor for copper toxicity (lunula of nail turns blue)",
            "Recommend zinc chelate 30 mg daily to offset copper/zinc imbalance",
            "TB-500 component: do not dose continuously more than 3 months",
            "BPC-157 component: use with caution in active cancer",
            "Redness and pain at injection site may occur",
        ],
        "source": "web",
    },

    "5-Amino-1MQ 50mg": {
        "indications": [
            "NNMT (nicotinamide N-methyltransferase) inhibitor",
            "Metabolic support — increases NAD+ levels",
            "Obesity and fat cell reduction",
            "Visceral fat targeting",
            "Insulin resistance support",
            "Cellular energy and mitochondrial function",
        ],
        "mechanism": (
            "Selective, membrane-permeable inhibitor of NNMT. "
            "NNMT consumes SAM (the methyl donor) and depletes NAD+ precursors in adipocytes — blocking it raises intracellular NAD+ levels and activates SIRT1. "
            "Shifts fat cells from storage toward oxidation; oral bioavailability distinguishes it from injectable peptides."
        ),
        "dosage": (
            "Oral: Start 50 mg daily for first 2 weeks. "
            "Maintenance: 100–150 mg daily. "
            "Take in the morning to align with peak metabolic activity. "
            "Same time daily for consistent NNMT inhibition."
        ),
        "warnings": [
            "Investigational compound — not FDA-approved",
            "Limited long-term safety data available",
            "Morning dosing recommended to avoid potential sleep disruption",
            "Monitor metabolic markers during use",
        ],
        "source": "web",
    },

    "BAC Water 30ml": {
        "indications": [
            "Reconstitution medium for lyophilized peptide vials",
            "Bacteriostatic water (0.9% benzyl alcohol) — multi-dose safe",
            "Laboratory-grade preparation",
        ],
        "mechanism": (
            "0.9% benzyl alcohol preservative inhibits microbial growth, allowing multi-dose vial use for 28–30 days. "
            "Isotonic formulation compatible with SubQ and IM injection after dilution with peptide."
        ),
        "dosage": (
            "Use per peptide reconstitution protocol. "
            "Typical: add 1–3 ml to lyophilized vial, swirl gently (do not shake). "
            "Refrigerate reconstituted solution. Most peptides stable 28–30 days refrigerated."
        ),
        "warnings": [
            "For reconstitution of injectable peptides only",
            "Do not use in patients with benzyl alcohol hypersensitivity",
            "Not for direct injection without dilution in a peptide",
            "Do not freeze reconstituted peptide solutions",
        ],
        "source": "standard",
    },
}


def get_protocol(compound_name: str) -> dict | None:
    """Fuzzy lookup — matches partial compound names."""
    if compound_name in PROTOCOLS:
        return PROTOCOLS[compound_name]
    for key, val in PROTOCOLS.items():
        if compound_name.lower() in key.lower() or key.lower() in compound_name.lower():
            return val
    return None
