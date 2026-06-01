"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { queryProtocol, QueryResponse } from "@/lib/api";
import ResponseCard from "@/components/ResponseCard";

const BIOMARKER_FIELDS = [
  { key: "igf1",        label: "IGF-1",        unit: "ng/mL",  placeholder: "e.g. 120" },
  { key: "testosterone",label: "Testosterone",  unit: "ng/dL",  placeholder: "e.g. 400" },
  { key: "bmi",         label: "BMI",           unit: "",       placeholder: "e.g. 27" },
  { key: "glucose",     label: "Fasting Glucose",unit: "mg/dL", placeholder: "e.g. 95" },
  { key: "hba1c",       label: "HbA1c",         unit: "%",      placeholder: "e.g. 5.4" },
  { key: "cortisol",    label: "Cortisol (AM)",  unit: "mcg/dL",placeholder: "e.g. 14" },
  { key: "crp",         label: "hsCRP",         unit: "mg/L",   placeholder: "e.g. 0.8" },
  { key: "estradiol",   label: "Estradiol",     unit: "pg/mL",  placeholder: "e.g. 80" },
  { key: "dhea",        label: "DHEA-S",        unit: "mcg/dL", placeholder: "e.g. 200" },
  { key: "thyroid_tsh", label: "TSH",           unit: "mIU/L",  placeholder: "e.g. 2.1" },
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

export default function ProtocolPage() {
  const router = useRouter();
  const [biomarkers, setBiomarkers] = useState<Record<string, string>>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [freetext, setFreetext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("ageVerified") !== "true") {
      router.replace("/");
    }
  }, [router]);

  function toggleSymptom(s: string) {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
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
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--navy)",
        padding: "0 0 60px",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(75,163,181,0.15)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ width: "36px", height: "36px", flexShrink: 0 }}>
          {!videoError ? (
            <video
              src="/logo.mp4"
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
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
        <div style={{ marginLeft: "auto" }}>
          <span
            style={{
              fontSize: "11px",
              background: "rgba(75,163,181,0.12)",
              border: "1px solid rgba(75,163,181,0.25)",
              borderRadius: "4px",
              padding: "3px 8px",
              color: "var(--teal)",
            }}
          >
            Research Use Only
          </span>
        </div>
      </header>

      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "32px 24px 0",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {!result ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Biomarkers */}
            <section>
              <SectionHeader
                label="Blood Work Markers"
                sub="Enter available values — leave blank if not tested"
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "12px",
                  marginTop: "14px",
                }}
              >
                {BIOMARKER_FIELDS.map((f) => (
                  <div key={f.key}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--gray-text)",
                        marginBottom: "5px",
                        fontWeight: 500,
                      }}
                    >
                      {f.label}
                      {f.unit && (
                        <span style={{ color: "rgba(160,174,192,0.5)", marginLeft: "4px" }}>
                          ({f.unit})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder={f.placeholder}
                      value={biomarkers[f.key] ?? ""}
                      onChange={(e) =>
                        setBiomarkers((prev) => ({ ...prev, [f.key]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Symptoms */}
            <section>
              <SectionHeader
                label="Research Focus / Symptoms"
                sub="Select all applicable areas of interest"
              />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "14px",
                }}
              >
                {SYMPTOM_OPTIONS.map((s) => {
                  const active = symptoms.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSymptom(s)}
                      style={{
                        background: active ? "rgba(75,163,181,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${active ? "var(--teal)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "20px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        color: active ? "var(--teal)" : "var(--gray-text)",
                        fontWeight: active ? 600 : 400,
                        transition: "all 0.12s ease",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Freetext */}
            <section>
              <SectionHeader
                label="Additional Research Context"
                sub="Optional — any other relevant details"
              />
              <textarea
                rows={3}
                placeholder="e.g. 42-year-old female, perimenopausal, history of inflammation markers..."
                value={freetext}
                onChange={(e) => setFreetext(e.target.value)}
                style={{ marginTop: "14px", resize: "vertical" }}
              />
            </section>

            {/* Submit */}
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
              {loading ? "Analyzing Research Data…" : "Generate Protocol Reference"}
            </button>

            {error && (
              <p style={{ color: "#fc8181", fontSize: "13px", margin: 0 }}>
                Error: {error}
              </p>
            )}
          </form>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--white)" }}>
                Protocol Reference
              </h2>
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
            <ResponseCard
              compounds={result.compounds}
              response={result.response}
              mode={result.mode}
              selectedStack={[]}
              onStackChange={() => {}}
              printMode={false}
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
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--white)",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </p>
      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--gray-text)" }}>
        {sub}
      </p>
    </div>
  );
}
