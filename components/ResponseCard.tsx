"use client";

import { useState } from "react";
import { CompoundResult } from "@/lib/api";

interface Props {
  compounds: CompoundResult[];
  response: string;
  mode: "rag" | "direct";
}

export default function ResponseCard({ compounds, response, mode }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* AI summary */}
      <div style={{
        background: "rgba(75,163,181,0.07)",
        border: "1px solid rgba(75,163,181,0.3)",
        borderRadius: "10px",
        padding: "18px",
      }}>
        <p style={{
          fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--teal)", fontWeight: 600, margin: "0 0 10px",
        }}>
          Clinical Summary
          {mode === "rag" && (
            <span style={{ color: "rgba(75,163,181,0.5)", fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: "10px", marginLeft: "6px" }}>
              · PDF indexed
            </span>
          )}
        </p>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.75, color: "rgba(255,255,255,0.88)", whiteSpace: "pre-wrap" }}>
          {response}
        </p>
      </div>

      {/* Compound cards */}
      {compounds.length > 0 && (
        <div>
          <p style={{
            fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--teal)", fontWeight: 600, margin: "0 0 14px",
          }}>
            Matched Compounds — {compounds.length} result{compounds.length !== 1 ? "s" : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {compounds.map((c) => (
              <CompoundCard key={c.name} compound={c} />
            ))}
          </div>
        </div>
      )}

      {/* Compliance footer */}
      <p style={{
        fontSize: "11px", color: "rgba(160,174,192,0.5)", margin: 0, lineHeight: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px",
      }}>
        For licensed practitioner use. Dosing sourced from LaValle et al., Peptide Handbook 2022 and published clinical literature.
        All compounds dispensed by FDA-registered 503B outsourcing facility.
        Individual patient protocols determined by prescribing provider.
      </p>
    </div>
  );
}

function CompoundCard({ compound: c }: { compound: CompoundResult }) {
  const [open, setOpen] = useState(false);
  const p = c.protocol;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(75,163,181,0.2)",
      borderRadius: "10px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", cursor: "pointer", gap: "12px" }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "15px", color: "var(--white)" }}>{c.name}</p>
          <p style={{ margin: "3px 0 0", fontSize: "11px", color: "rgba(160,174,192,0.6)" }}>
            {c.reasons.slice(0, 3).join(" · ")}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <a
            href={c.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--teal)", color: "var(--navy)",
              borderRadius: "6px", padding: "5px 14px",
              fontSize: "12px", fontWeight: 700, textDecoration: "none",
            }}
          >
            Order →
          </a>
          <span style={{ fontSize: "20px", color: "var(--teal)", lineHeight: 1, width: "16px", textAlign: "center" }}>
            {open ? "−" : "+"}
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ borderTop: "1px solid rgba(75,163,181,0.15)", padding: "18px 16px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {p ? (
            <>
              <ProtocolSection label="🎯 Indications / Uses">
                <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {p.indications.map((ind, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "rgba(255,255,255,0.82)", lineHeight: 1.55 }}>{ind}</li>
                  ))}
                </ul>
              </ProtocolSection>

              {p.mechanism && (
                <ProtocolSection label="⚙️ Mechanism" color="rgba(100,200,140,0.75)">
                  <p style={{ margin: 0, fontSize: "13px", color: "rgba(200,240,220,0.82)", lineHeight: 1.72 }}>
                    {p.mechanism}
                  </p>
                </ProtocolSection>
              )}

              <ProtocolSection label="💉 Dosage Protocol">
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.87)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                  {p.dosage}
                </p>
              </ProtocolSection>

              <ProtocolSection label="⚠️ Warnings & Cautions" color="rgba(252,160,100,0.8)">
                <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {p.warnings.map((w, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "rgba(255,220,180,0.82)", lineHeight: 1.55 }}>{w}</li>
                  ))}
                </ul>
              </ProtocolSection>

              <p style={{ margin: 0, fontSize: "10px", color: "rgba(160,174,192,0.35)" }}>
                {p.source === "pdf"
                  ? "Source: LaValle et al., Peptide Handbook 2022"
                  : p.source === "web"
                  ? "Source: Published clinical literature"
                  : "Source: Peptide Handbook 2022 + clinical literature"}
              </p>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(160,174,192,0.6)" }}>
              Protocol data not available — contact Triton for protocol sheet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ProtocolSection({ label, children, color = "rgba(75,163,181,0.7)" }: {
  label: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color }}>
        {label}
      </p>
      {children}
    </div>
  );
}
