"""
Deterministic biomarker + symptom → compound lookup.
Match logic lives HERE, never in the LLM prompt.
"""

from typing import Optional

# Reference ranges used for classification
BIOMARKER_RANGES = {
    "igf1":         {"low": 100, "high": 250},   # ng/mL
    "testosterone": {"low": 300, "high": 900},   # ng/dL
    "bmi":          {"low": 18.5, "high": 25},
    "glucose":      {"low": 70, "high": 100},    # mg/dL fasting
    "hba1c":        {"low": 4.0, "high": 5.7},   # %
    "cortisol":     {"low": 6, "high": 23},      # mcg/dL morning
    "crp":          {"low": 0, "high": 1.0},     # mg/L (low = normal)
    "estradiol":    {"low": 15, "high": 350},    # pg/mL (women)
    "dhea":         {"low": 35, "high": 430},    # mcg/dL
    "thyroid_tsh":  {"low": 0.4, "high": 4.0},  # mIU/L
}

# Biomarker out-of-range → compound recommendations
# Key: "{marker}_{direction}" where direction = low | high
BIOMARKER_MAP: dict[str, list[str]] = {
    "igf1_low":         ["CJC-1295 w/DAC", "Tesamorelin"],
    "igf1_high":        [],  # no intervention needed

    "testosterone_low": ["PT-141", "Kisspeptin-10"],
    "bmi_high":         ["Tirzepatide", "Retatrutide", "KLOW", "5-Amino-1MQ"],
    "bmi_low":          [],

    "glucose_high":     ["Tirzepatide", "Retatrutide", "5-Amino-1MQ"],
    "hba1c_high":       ["Tirzepatide", "Retatrutide", "5-Amino-1MQ", "KLOW"],

    "cortisol_high":    ["Selank", "Semax", "Epithalon"],
    "cortisol_low":     ["Thymosin Alpha-1", "Mots-c"],

    "crp_high":         ["BPC-157", "TB-500", "SS-31", "Thymosin Alpha-1"],

    "estradiol_low":    ["PT-141", "Kisspeptin-10", "GLOW 70mg"],
    "estradiol_high":   ["5-Amino-1MQ"],

    "dhea_low":         ["NAD+ 500mg", "Epithalon", "Thymosin Alpha-1"],

    "thyroid_tsh_high": ["Selank", "NAD+ 500mg"],
    "thyroid_tsh_low":  ["Thymosin Alpha-1"],
}

# Symptom keyword → compound recommendations
SYMPTOM_MAP: dict[str, list[str]] = {
    "poor recovery":        ["BPC-157", "TB-500", "AOD 5mg"],
    "slow healing":         ["BPC-157", "TB-500", "GHK-CU 100mg"],
    "joint pain":           ["BPC-157", "TB-500"],
    "muscle loss":          ["CJC-1295 w/DAC", "Tesamorelin", "AOD 5mg"],
    "low energy":           ["NAD+ 500mg", "Mots-c", "Thymosin Alpha-1"],
    "fatigue":              ["NAD+ 500mg", "Mots-c", "SS-31"],
    "brain fog":            ["Selank", "Semax", "NAD+ 500mg"],
    "poor focus":           ["Semax", "Selank"],
    "anxiety":              ["Selank"],
    "poor sleep":           ["Epithalon", "Selank"],
    "insomnia":             ["Epithalon"],
    "low libido":           ["PT-141", "Kisspeptin-10"],
    "sexual dysfunction":   ["PT-141", "Kisspeptin-10"],
    "weight gain":          ["Tirzepatide", "Retatrutide", "KLOW", "5-Amino-1MQ"],
    "stubborn fat":         ["AOD 5mg", "5-Amino-1MQ", "Tesamorelin"],
    "visceral fat":         ["Tesamorelin", "5-Amino-1MQ"],
    "hormonal imbalance":   ["Kisspeptin-10", "GLOW 70mg", "PT-141"],
    "skin aging":           ["GHK-CU 100mg", "Epithalon", "NAD+ 500mg"],
    "hair thinning":        ["GHK-CU 100mg"],
    "immune support":       ["Thymosin Alpha-1", "Epithalon"],
    "longevity":            ["NAD+ 500mg", "Epithalon", "Mots-c", "SS-31"],
    "mitochondrial health": ["SS-31", "Mots-c", "NAD+ 1000mg"],
    "perimenopause":        ["GLOW 70mg", "Kisspeptin-10", "PT-141", "Epithalon"],
    "menopause":            ["GLOW 70mg", "Kisspeptin-10", "NAD+ 500mg", "Epithalon"],
    "performance":          ["CJC-1295 w/DAC", "Tesamorelin", "BPC-157", "TB-500"],
    "injury repair":        ["BPC-157", "BPC157/TB500 Blend", "AOD 5mg"],
}

# All 30 valid SKUs — nothing outside this list ever returned
VALID_SKUS = {
    "Tirzepatide 5mg", "Tirzepatide 10mg", "Tirzepatide 60mg",
    "Retatrutide 5mg", "Retatrutide 10mg", "Retatrutide 60mg",
    "Mazdutide 5mg", "Cargrilintide 5mg", "KLOW 80mg", "5-Amino-1MQ 50mg",
    "BPC-157 10mg", "BPC157/TB500 Blend", "BPC157/TB500 1000mcg Oral Capsules", "AOD 5mg",
    "CJC-1295 w/DAC 5mg", "Tesamorelin 10mg", "Tesamorelin 1000mcg Oral Capsules",
    "PT-141 10mg", "Kisspeptin-10 5mg", "GHK-CU 100mg", "GLOW 70mg",
    "NAD+ 500mg", "NAD+ 1000mg", "Selank 10mg", "Semax 10mg",
    "Thymosin Alpha-1 5mg", "Epithalon 10mg", "Mots-c 10mg", "SS-31 10mg",
    "BAC Water 30ml",
}

# Normalized name → canonical SKU name + site URL slug
COMPOUND_CATALOG: dict[str, dict] = {
    "Tirzepatide":              {"sku": "Tirzepatide 5mg",                    "url": "/tirzepatide"},
    "Retatrutide":              {"sku": "Retatrutide 5mg",                    "url": "/retatrutide-5mg"},
    "Mazdutide":                {"sku": "Mazdutide 5mg",                      "url": "/mazdutide"},
    "Cargrilintide":            {"sku": "Cargrilintide 5mg",                  "url": "/cargrillntide"},
    "KLOW":                     {"sku": "KLOW 80mg",                          "url": "/klow-80mg"},
    "5-Amino-1MQ":              {"sku": "5-Amino-1MQ 50mg",                   "url": "/5-amino-1mq-50mg"},
    "BPC-157":                  {"sku": "BPC-157 10mg",                       "url": "/bpc-157"},
    "BPC157/TB500 Blend":       {"sku": "BPC157/TB500 Blend",                 "url": "/bpc-tb500-blend"},
    "TB-500":                   {"sku": "BPC157/TB500 Blend",                 "url": "/bpc-tb500-blend"},
    "AOD 5mg":                  {"sku": "AOD 5mg",                            "url": "/aod"},
    "CJC-1295 w/DAC":           {"sku": "CJC-1295 w/DAC 5mg",                "url": "/cjc-1295-wdac"},
    "Tesamorelin":              {"sku": "Tesamorelin 10mg",                   "url": "/tesamorelin10mg"},
    "PT-141":                   {"sku": "PT-141 10mg",                        "url": "/pt-141-bremelanotide"},
    "Kisspeptin-10":            {"sku": "Kisspeptin-10 5mg",                  "url": "/kisspeptin-10"},
    "GHK-CU 100mg":             {"sku": "GHK-CU 100mg",                      "url": "/ghk-cu"},
    "GLOW 70mg":                {"sku": "GLOW 70mg",                          "url": "/glow-70mg"},
    "NAD+ 500mg":               {"sku": "NAD+ 500mg",                         "url": "/nad500mg"},
    "NAD+ 1000mg":              {"sku": "NAD+ 1000mg",                        "url": "/nad-1000mg"},
    "Selank":                   {"sku": "Selank 10mg",                        "url": "/selank-10mg"},
    "Semax":                    {"sku": "Semax 10mg",                         "url": "/semax-10mg"},
    "Thymosin Alpha-1":         {"sku": "Thymosin Alpha-1 5mg",               "url": "/thymosin-alpha-1-5mg"},
    "Epithalon":                {"sku": "Epithalon 10mg",                     "url": "/epithalon-10mg"},
    "Mots-c":                   {"sku": "Mots-c 10mg",                        "url": "/mots-c"},
    "SS-31":                    {"sku": "SS-31 10mg",                         "url": "/ss-31"},
    "BAC Water":                {"sku": "BAC Water 30ml",                     "url": "/bac-water-bacteriostatic-water"},
}

SITE_BASE = "https://www.tritonpeptidebiologicslab.com"


def classify_biomarkers(biomarkers: dict[str, float]) -> list[str]:
    """Returns list of 'marker_direction' keys for out-of-range values."""
    flags: list[str] = []
    for marker, value in biomarkers.items():
        key = marker.lower().replace(" ", "_")
        if key not in BIOMARKER_RANGES:
            continue
        ref = BIOMARKER_RANGES[key]
        if value < ref["low"]:
            flags.append(f"{key}_low")
        elif value > ref["high"]:
            flags.append(f"{key}_high")
    return flags


def match_compounds(
    biomarkers: Optional[dict[str, float]],
    symptoms: Optional[list[str]],
) -> list[dict]:
    """
    Deterministic match. Returns ranked list of compound dicts:
    [{"name": str, "sku": str, "url": str, "reasons": [str]}]
    """
    scores: dict[str, list[str]] = {}

    # Score from biomarkers
    if biomarkers:
        flags = classify_biomarkers(biomarkers)
        for flag in flags:
            for compound in BIOMARKER_MAP.get(flag, []):
                scores.setdefault(compound, [])
                marker_label = flag.replace("_", " ")
                scores[compound].append(f"biomarker: {marker_label}")

    # Score from symptoms
    if symptoms:
        for symptom in symptoms:
            sym_key = symptom.lower().strip()
            for compound in SYMPTOM_MAP.get(sym_key, []):
                scores.setdefault(compound, [])
                scores[compound].append(f"symptom: {symptom}")

    # Sort by number of matching signals (most relevant first), cap at 6
    ranked = sorted(scores.items(), key=lambda x: len(x[1]), reverse=True)[:6]

    results = []
    for compound_key, reasons in ranked:
        catalog_entry = COMPOUND_CATALOG.get(compound_key)
        if not catalog_entry:
            continue
        results.append({
            "name": compound_key,
            "sku": catalog_entry["sku"],
            "url": SITE_BASE + catalog_entry["url"],
            "reasons": reasons,
        })

    return results
