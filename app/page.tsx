"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LICENSE_TYPES = [
  "MD / DO",
  "NP / PA",
  "RN / BSN",
  "Pharmacist (PharmD / RPh)",
  "Naturopathic Doctor (ND)",
  "Chiropractor (DC)",
  "Clinic / Wellness Center",
  "Compounding Pharmacist",
  "Researcher / Lab Professional",
];

export default function AgeGatePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [license, setLicense] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("ageVerified") === "true") {
      router.replace("/protocol");
    }
  }, [router]);

  function validate() {
    const e: string[] = [];
    if (!name.trim()) e.push("Full name is required.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.push("Valid email is required.");
    if (!license) e.push("License / role type is required.");
    if (!checked) e.push("You must confirm the practitioner agreement.");
    return e;
  }

  function handleConfirm() {
    const e = validate();
    if (e.length > 0) { setErrors(e); return; }
    localStorage.setItem("ageVerified", "true");
    localStorage.setItem("practitionerName", name.trim());
    localStorage.setItem("practitionerEmail", email.trim());
    localStorage.setItem("practitionerLicense", license);
    router.push("/protocol");
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--navy)",
      padding: "24px",
    }}>
      <div style={{
        maxWidth: "460px",
        width: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}>
        {/* Logo */}
        <div style={{ width: "120px", height: "120px" }}>
          {!videoError ? (
            <video src="/logo.mp4" autoPlay muted loop playsInline
              onError={() => setVideoError(true)}
              style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/logo.svg" alt="Triton Peptide Biologics Lab"
              style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          )}
        </div>

        {/* Wordmark */}
        <div>
          <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--teal)", margin: 0, fontWeight: 600 }}>
            Triton Peptide Biologics Lab
          </p>
          <h1 style={{ fontSize: "20px", fontWeight: 600, margin: "8px 0 0", lineHeight: 1.3, color: "var(--white)" }}>
            Practitioner Protocol Reference
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "12px", color: "rgba(160,174,192,0.6)" }}>
            FDA-registered 503B outsourcing facility · Licensed practitioners only
          </p>
        </div>

        {/* Gate card */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "28px 24px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          textAlign: "left",
        }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--teal)", margin: 0 }}>
            Practitioner Access
          </p>

          {/* Name */}
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--gray-text)", marginBottom: "5px", fontWeight: 500 }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--gray-text)", marginBottom: "5px", fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="text"
              placeholder="jane@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* License type */}
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--gray-text)", marginBottom: "5px", fontWeight: 500 }}>
              License / Role
            </label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: license ? "var(--white)" : "rgba(160,174,192,0.5)",
                padding: "8px 12px",
                width: "100%",
                fontSize: "14px",
                outline: "none",
              }}
            >
              <option value="" disabled>Select credential type</option>
              {LICENSE_TYPES.map((l) => (
                <option key={l} value={l} style={{ background: "#0d1b4b" }}>{l}</option>
              ))}
            </select>
          </div>

          {/* Agreement checkbox */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{ marginTop: "2px", flexShrink: 0 }}
            />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
              I confirm I am a licensed healthcare practitioner or qualified researcher (21+). I understand this tool is for practitioner reference only and does not constitute medical advice. Individual patient protocols are determined by the prescribing provider.
            </span>
          </label>

          {/* Errors */}
          {errors.length > 0 && (
            <div style={{ background: "rgba(252,100,100,0.08)", border: "1px solid rgba(252,100,100,0.25)", borderRadius: "6px", padding: "10px 14px" }}>
              {errors.map((e, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : "4px 0 0", fontSize: "12px", color: "#fc8181" }}>{e}</p>
              ))}
            </div>
          )}

          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: "var(--teal)",
              color: "var(--navy)",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              transition: "all 0.15s ease",
              marginTop: "4px",
            }}
          >
            Access Protocol Tool →
          </button>
        </div>

        <p style={{ fontSize: "11px", color: "rgba(160,174,192,0.45)", margin: 0, lineHeight: 1.5 }}>
          All compounds dispensed by FDA-registered 503B outsourcing facility.
          For licensed practitioner use only. Not for public consumer access.
        </p>
      </div>
    </main>
  );
}
