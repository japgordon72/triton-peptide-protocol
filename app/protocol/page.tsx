"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { queryProtocol, QueryResponse } from "@/lib/api";
import ResponseCard from "@/components/ResponseCard";

const BIOMARKER_FIELDS = [
  { key: "igf1",        label: "IGF-1",         unit: "ng/mL",   placeholder: "e.g. 120",  low: 100,  optLow: 150, optHigh: 300, high: 400,  hint: "Optimal: 150–300" },
  { key: "testosterone",label: "Testosterone",   unit: "ng/dL",   placeholder: "e.g. 400",  low: 200,  optLow: 400, optHigh: 800, high: 1100, hint: "Optimal: 400–800 (men)" },
  { key: "bmi",         label: "BMI",            unit: "",        placeholder: "e.g. 27",   low: 16,   optLow: 18.5,optHigh: 24.9,high: 40,   hint: "Optimal: 18.5–24.9" },
  { key: "glucose",     label: "Fasting Glucose",unit: "mg/dL",   placeholder: "e.g. 95",   low: 50,   optLow: 70,  optHigh: 99,  high: 180,  hint: "Optimal: 70–99" },
  { key: "hba1c",       label: "HbA1c",          unit: "%",       placeholder: "e.g. 5.4",  low: 3.5,  optLow: 4.0, optHigh: 5.6, high: 10,   hint: "Optimal: <5.7%" },
  { key: "cortisol",    label: "Cortisol (AM)",  unit: "mcg/dL",  placeholder: "e.g. 14",   low: 5,    optLow: 10,  optHigh: 20,  high: 35,   hint: "Optimal: 10–20 AM" },
  { key: "crp",         label: "hsCRP",          unit: "mg/L",    placeholder: "e.g. 0.8",  low: 0,    optLow: 0,   optHigh: 1.0, high: 10,   hint: "Optimal: <1.0" },
  { key: "estradiol",   label: "Estradiol",      unit: "pg/mL",   placeholder: "e.g. 80",   low: 10,   optLow: 50,  optHigh: 200, high: 500,  hint: "Optimal: 50–200 (women)" },
  { key: "dhea",        label: "DHEA-S",         unit: "mcg/dL",  placeholder: "e.g. 200",  low: 30,   optLow: 100, optHigh: 400, high: 600,  hint: "Optimal: 100–400" },
  { key: "thyroid_tsh", label: "TSH",            unit: "mIU/L",   placeholder: "e.g. 2.1",  low: 0,    optLow: 0.5, optHigh: 2.5, high: 10,   hint: "Optimal: 0.5–2.5" },
];

const SYMPTOM_OPTIONS = [
  "poor recovery", "slow healing", "joint pain", "muscle loss",
  "low energy", "fatigue", "brain fog", "poor focus", "anxiety",
  "poor sleep", "insomnia", "low libido", "sexual dysfunction",
  "weight gain", "stubborn fat", "visceral fat",
  "hormonal imbalance", "skin aging", "hair thinning",
  "immune support", "longevity", "mitochondrial health",
  "perimenopause", "menopause", "performance", "injury repair",
];

function getRangeStatus(val: string, field: typeof BIOMARKER_FIELDS[0]): "empty" | "low" | "optimal" | "high" {
  const n = parseFloat(val);
  if (isNaN(n) || val === "") return "empty";
  if (n < field.optLow) return "low";
  if (n > field.optHigh) return "high";
  return "optimal";
}

function RangeIndicator({ val, field }: { val: string; field: typeof BIOMARKER_FIELDS[0] }) {
  const status = getRangeStatus(val, field);
  if (status === "empty") return null;
  const color = status === "optimal" ? "#68d391" : status === "low" ? "#63b3ed" : "#fc8181";
  const label = status === "optimal" ? "In range" : status === "low" ? "Below optimal" : "Above optimal";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: "10px", color, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: "10px", color: "rgba(160,174,192,0.45)", marginLeft: "2px" }}>{field.hint}</span>
    </div>
  );
}

export default function ProtocolPage() {
  const router = useRouter();
  const [biomarkers, setBiomarkers] = useState<Record<string, string>>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [freetext, setFreetext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [printMode, setPrintMode] = useState(false);
  const [practitioner, setPractitioner] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("ageVerified") !== "true") {
        router.replace("/");
      } else {
        const name = localStorage.getItem("practitionerName") || "";
        const license = localStorage.getItem("practitionerLicense") || "";
        if (name) setPractitioner(`${name}${license ? ` · ${license}` : ""}`);
      }
    }
  }, [router]);

  function toggleSymptom(s: string) {
    setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSelectedStack([]);
    setLoading(true);

    const parsedBiomarkers: Record<string, number> = {};
    for (const [k, v] of Object.entries(biomarkers)) {
      const n = parseFloat(v);
      if (!isNaN(n)) parsedBiomarkers[k] = n;
    }

    try {
      const res = await queryProtocol({
        biomarkers: Object.keys(parsedBiomarkers).length > 0 ? parsedBiomarkers : undefined,
        symptoms: symptoms.length > 0 ? symptoms : undefined,
        freetext: freetext.trim() || undefined,
      });
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setBiomarkers({});
    setSymptoms([]);
    setFreetext("");
    setResult(null);
    setError(null);
    setSelectedStack([]);
  }

  function handlePrint() {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--navy)", padding: "0 0 60px" }}>
      {/* Header */}
      <header className="no-print" style={{
        borderBottom: "1px solid rgba(75,163,181,0.15)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{ width: "36px", height: "36px", flexShrink: 0 }}>
          {!videoError ? (
            <video src="/logo.mp4" autoPlay muted loop playsInline
              onError={() => setVideoError(true)}
              style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/logo.svg" alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          )}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--teal)", fontWeight: 600 }}>
            Triton Peptide Biologics Lab
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--white)", fontWeight: 600 }}>
            Protocol Reference Tool
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
          {practitioner && (
            <span style={{ fontSize: "11px", color: "rgba(160,174,192,0.55)" }}>{practitioner}</span>
          )}
          <span style={{
            fontSize: "11px",
            background: "rgba(75,163,181,0.12)",
            border: "1px solid rgba(75,163,181,0.25)",
            borderRadius: "4px",
            padding: "3px 8px",
            color: "var(--teal)",
          }}>503B · Licensed Practitioner</span>
        </div>
      </header>

      {/* Print header (only shows when printing) */}
      <div className="print-only" style={{ display: "none", padding: "20px 40px 10px", borderBottom: "2px solid #0d1b4b" }}>
        <p style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Triton Peptide Biologics Lab</p>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#666" }}>Protocol Reference — FDA-Registered 503B Outsourcing Facility</p>
        {practitioner && <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#666" }}>Practitioner: {practitioner}</p>}
        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#888" }}>Generated: {new Date().toLocaleDateString()}</p>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px 0", display: "flex", flexDirection: "column", gap: "28px" }}>
        {!result ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Biomarkers */}
            <section>
              <SectionHeader label="Blood Work Markers" sub="Enter available values — leave blank if not tested" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px", marginTop: "14px" }}>
                {BIOMARKER_FIELDS.map((f) => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--gray-text)", marginBottom: "5px", fontWeight: 500 }}>
                      {f.label}
                      {f.unit && <span style={{ color: "rgba(160,174,192,0.5)", marginLeft: "4px" }}>({f.unit})</span>}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder={f.placeholder}
                      value={biomarkers[f.key] ?? ""}
                      onChange={(e) => setBiomarkers((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    />
                    <RangeIndicator val={biomarkers[f.key] ?? ""} field={f} />
                  </div>
                ))}
              </div>
            </section>

            {/* Symptoms */}
            <section>
              <SectionHeader label="Clinical Focus / Symptoms" sub="Select all applicable areas" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
                {SYMPTOM_OPTIONS.map((s) => {
                  const active = symptoms.includes(s);
                  return (
                    <button key={s} type="button" onClick={() => toggleSymptom(s)} style={{
                      background: active ? "rgba(75,163,181,0.2)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "var(--teal)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "20px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      color: active ? "var(--teal)" : "var(--gray-text)",
                      fontWeight: active ? 600 : 400,
                      transition: "all 0.12s ease",
                    }}>{s}</button>
                  );
                })}
              </div>
            </section>

            {/* Freetext */}
            <section>
              <SectionHeader label="Additional Clinical Context" sub="Optional — patient history, current meds, specific goals" />
              <textarea
                rows={3}
                placeholder="e.g. 42F perimenopausal, elevated hsCRP, history of GI issues, no current GLP-1 use..."
                value={freetext}
                onChange={(e) => setFreetext(e.target.value)}
                style={{ marginTop: "14px", resize: "vertical" }}
              />
            </section>

            <button
              type="submit"
              disabled={loading || (!Object.values(biomarkers).some(Boolean) && symptoms.length === 0 && !freetext.trim())}
              style={{
                backgroundColor: "var(--teal)",
                color: "var(--navy)",
                border: "none",
                borderRadius: "8px",
                padding: "14px 28px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.15s ease",
              }}
            >
              {loading ? "Analyzing…" : "Generate Protocol Reference"}
            </button>

            {error && <p style={{ color: "#fc8181", fontSize: "13px", margin: 0 }}>Error: {error}</p>}
          </form>
        ) : (
          <div>
            {/* Results toolbar */}
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--white)" }}>
                Protocol Reference
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {selectedStack.length > 0 && (
                  <button
                    onClick={handlePrint}
                    style={{
                      background: "var(--teal)",
                      color: "var(--navy)",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 16px",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    🖨 Print Stack ({selectedStack.length})
                  </button>
                )}
                <button
                  onClick={handlePrint}
                  style={{
                    background: "rgba(75,163,181,0.12)",
                    border: "1px solid rgba(75,163,181,0.3)",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    fontSize: "12px",
                    color: "var(--teal)",
                    fontWeight: 600,
                  }}
                >
                  🖨 Print All
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    color: "var(--gray-text)",
                  }}
                >
                  ← New Query
                </button>
              </div>
            </div>

            <ResponseCard
              compounds={result.compounds}
              response={result.response}
              mode={result.mode}
              selectedStack={selectedStack}
              onStackChange={setSelectedStack}
              printMode={printMode}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function SectionHeader({ label, sub }: { label: string; sub: string }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--white)", letterSpacing: "0.02em" }}>{label}</p>
      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--gray-text)" }}>{sub}</p>
    </div>
  );
}
