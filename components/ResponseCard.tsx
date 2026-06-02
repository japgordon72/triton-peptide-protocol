"use client";

import { useState } from "react";
import { CompoundResult } from "@/lib/api";

interface Props {
  compounds: CompoundResult[];
  response: string;
  mode: "rag" | "direct";
  selectedStack: string[];
  onStackChange: (stack: string[]) => void;
  printMode: boolean;
}

// Interaction flag groups — warn when 2+ compounds from same group are matched
const INTERACTION_GROUPS = [
  {
    id: "glp1",
    label: "GLP-1 Class — Do Not Combine",
    color: "rgba(252,100,100,0.85)",
    bg: "rgba(252,100,100,0.07)",
    border: "rgba(252,100,100,0.25)",
    flag: "Multiple GLP-1/GIP/glucagon receptor agonists matched. Combining these agents is not clinically indicated and significantly increases GI side effect risk. Select one agent for this patient.",
    compounds: ["Tirzepatide", "Retatrutide", "Mazdutide", "Cargrilintide"],
  },
  {
    id: "igf1",
    label: "Stacked IGF-1 Elevation",
    color: "rgba(252,160,100,0.85)",
    bg: "rgba(252,160,100,0.07)",
    border: "rgba(252,160,100,0.25)",
    flag: "CJC-1295 and Tesamorelin combined may elevate IGF-1 above optimal range. Monitor IGF-1 closely if used together; consider alternating rather than stacking.",
    compounds: ["CJC-1295", "Tesamorelin"],
  },
  {
    id: "wada",
    label: "WADA Prohibited Class",
    color: "rgba(160,140,240,0.85)",
    bg: "rgba(160,140,240,0.07)",
    border: "rgba(160,140,240,0.25)",
    flag: "One or more matched compounds are prohibited by WADA. Do not prescribe to competitive athletes subject to anti-doping testing without full disclosure.",
    compounds: ["CJC-1295", "Tesamorelin", "BPC-157", "TB-500"],
  },
];

function getInteractionFlags(names: string[]) {
  return INTERACTION_GROUPS.filter((g) => {
    const matches = g.compounds.filter((gc) =>
      names.some((n) => n.toLowerCase().includes(gc.toLowerCase()) || gc.toLowerCase().includes(n.toLowerCase().split(" ")[0]))
    );
    return matches.length >= 2;
  });
}

export default function ResponseCard({ compounds, response, mode, selectedStack, onStackChange, printMode }: Props) {
  const compoundNames = compounds.map((c) => c.name);
  const flags = getInteractionFlags(compoundNames);

  function toggleStack(name: string) {
    onStackChange(
      selectedStack.includes(name)
        ? selectedStack.filter((n) => n !== name)
        : [...selectedStack, name]
    );
  }

  // In print mode, only show selected stack (if any), otherwise show all
  const displayCompounds = printMode && selectedStack.length > 0
    ? compounds.filter((c) => selectedStack.includes(c.name))
    : compounds;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Interaction flags */}
      {flags.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {flags.map((f) => (
            <div key={f.id} style={{
              background: f.bg,
              border: `1px solid ${f.border}`,
              borderRadius: "8px",
              padding: "12px 16px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: f.color }}>{f.label}</p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{f.flag}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stack selector header */}
      {compounds.length > 0 && !printMode && (
        <div style={{
          background: "rgba(75,163,181,0.05)",
          border: "1px solid rgba(75,163,181,0.15)",
          borderRadius: "8px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "11px", color: "rgba(160,174,192,0.7)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Stack Builder
          </span>
          <span style={{ fontSize: "12px", color: "rgba(160,174,192,0.55)" }}>
            Checkbox compounds to build a printable stack protocol
          </span>
          {selectedStack.length > 0 && (
            <span style={{
              marginLeft: "auto",
              background: "rgba(75,163,181,0.2)",
              border: "1px solid var(--teal)",
              borderRadius: "12px",
              padding: "2px 10px",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--teal)",
            }}>
              {selectedStack.length} selected
            </span>
          )}
        </div>
      )}

      {/* AI Clinical Summary */}
      <div className="print-summary" style={{
        background: "rgba(75,163,181,0.07)",
        border: "1px solid rgba(75,163,181,0.3)",
        borderRadius: "10px",
        padding: "18px",
      }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--teal)", fontWeight: 600, margin: "0 0 14px" }}>
          Clinical Summary
          {mode === "rag" && (
            <span style={{ color: "rgba(75,163,181,0.5)", fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: "10px", marginLeft: "6px" }}>
              · PDF indexed
            </span>
          )}
        </p>
        <StructuredResponse text={response} />
      </div>

      {/* Compound cards */}
      {displayCompounds.length > 0 && (
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--teal)", fontWeight: 600, margin: "0 0 12px" }}>
            Matched Compounds — {displayCompounds.length} result{displayCompounds.length !== 1 ? "s" : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {displayCompounds.map((c) => (
              <CompoundCard
                key={c.name}
                compound={c}
                selected={selectedStack.includes(c.name)}
                onToggle={() => toggleStack(c.name)}
                forceOpen={printMode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Compliance footer */}
      <p style={{
        fontSize: "11px",
        color: "rgba(160,174,192,0.45)",
        margin: 0,
        lineHeight: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "14px",
      }}>
        For licensed practitioner use. Dosing sourced from LaValle et al., Peptide Handbook 2022 and published clinical literature.
        All compounds dispensed by FDA-registered 503B outsourcing facility.
        Individual patient protocols determined by prescribing provider.
      </p>
    </div>
  );
}

function CompoundCard({ compound: c, selected, onToggle, forceOpen }: {
  compound: CompoundResult;
  selected: boolean;
  onToggle: () => void;
  forceOpen: boolean;
}) {
  const [open, setOpen] = useState(false);
  const p = c.protocol;
  const isOpen = forceOpen || open;

  return (
    <div className="compound-card" style={{
      background: selected ? "rgba(75,163,181,0.08)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${selected ? "rgba(75,163,181,0.5)" : "rgba(75,163,181,0.2)"}`,
      borderRadius: "10px",
      overflow: "hidden",
      transition: "border-color 0.15s ease, background 0.15s ease",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "13px 16px", gap: "10px" }}>
        {/* Stack checkbox */}
        <div className="no-print" onClick={(e) => { e.stopPropagation(); onToggle(); }}
          style={{
            width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
            border: `2px solid ${selected ? "var(--teal)" : "rgba(75,163,181,0.35)"}`,
            background: selected ? "var(--teal)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.12s ease",
          }}>
          {selected && <span style={{ fontSize: "11px", color: "var(--navy)", fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>

        {/* Name + reasons */}
        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setOpen(!open)}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "15px", color: "var(--white)" }}>{c.name}</p>
          <p style={{ margin: "3px 0 0", fontSize: "11px", color: "rgba(160,174,192,0.6)" }}>
            {c.reasons.slice(0, 3).join(" · ")}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <a href={c.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="no-print"
            style={{
              backgroundColor: "var(--teal)", color: "var(--navy)",
              borderRadius: "6px", padding: "5px 14px",
              fontSize: "12px", fontWeight: 700, textDecoration: "none",
            }}>
            Order →
          </a>
          <span
            onClick={() => setOpen(!open)}
            style={{ fontSize: "20px", color: "var(--teal)", lineHeight: 1, width: "16px", textAlign: "center", cursor: "pointer" }}
            className="no-print"
          >
            {isOpen ? "−" : "+"}
          </span>
        </div>
      </div>

      {/* Expanded protocol */}
      {isOpen && (
        <div style={{ borderTop: "1px solid rgba(75,163,181,0.15)", padding: "18px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
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
                {p.source === "pdf" ? "Source: LaValle et al., Peptide Handbook 2022"
                  : p.source === "web" ? "Source: Published clinical literature"
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

const SECTION_STYLES: Record<string, { color: string; dotColor: string }> = {
  "🧬 Patient Profile":    { color: "rgba(75,163,181,0.9)",   dotColor: "rgba(75,163,181,0.7)" },
  "🎯 Priority Stack":     { color: "rgba(100,200,140,0.9)",  dotColor: "rgba(100,200,140,0.7)" },
  "⚠️ Key Considerations": { color: "rgba(252,160,100,0.9)",  dotColor: "rgba(252,160,100,0.7)" },
  "💊 Protocol Note":      { color: "rgba(200,180,255,0.9)",  dotColor: "rgba(200,180,255,0.7)" },
};
const DEFAULT_STYLE = { color: "rgba(75,163,181,0.9)", dotColor: "rgba(75,163,181,0.7)" };

function StructuredResponse({ text }: { text: string }) {
  if (!text) return null;

  const sections: { header: string; lines: string[] }[] = [];
  let current: { header: string; lines: string[] } | null = null;

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    // Match emoji section headers (e.g. "🧬 Patient Profile")
    const isHeader = Object.keys(SECTION_STYLES).some(h => line === h) ||
                     line.match(/^[\u{1F300}-\u{1FAFF}]/u);
    if (isHeader && line.length > 2) {
      if (current) sections.push(current);
      current = { header: line, lines: [] };
    } else if (current) {
      if (line && line !== "---") current.lines.push(line);
    } else if (line && line !== "---") {
      sections.push({ header: "", lines: [line] });
    }
  }
  if (current) sections.push(current);

  // Fallback: no structure detected
  if (sections.length === 0 || (sections.length === 1 && !sections[0].header)) {
    return (
      <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.85)", whiteSpace: "pre-wrap" }}>
        {text}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {sections.map((s, i) => {
        const style = SECTION_STYLES[s.header] ?? DEFAULT_STYLE;
        return (
          <div key={i}>
            {s.header && (
              <p style={{
                margin: "0 0 7px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: style.color,
              }}>
                {s.header}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {s.lines.map((line, j) => {
                const isBullet = line.startsWith("•") || line.startsWith("-");
                const content = isBullet ? line.replace(/^[•\-]\s*/, "") : line;
                return isBullet ? (
                  <div key={j} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: style.dotColor, flexShrink: 0, lineHeight: "1.65", fontSize: "13px" }}>•</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>{content}</span>
                  </div>
                ) : (
                  <p key={j} style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>{content}</p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
