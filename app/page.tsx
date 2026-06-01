"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AgeGatePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("ageVerified") === "true") {
      router.replace("/protocol");
    }
  }, [router]);

  function handleConfirm() {
    if (!checked) return;
    localStorage.setItem("ageVerified", "true");
    router.push("/protocol");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--navy)",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <div style={{ width: "140px", height: "140px" }}>
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
            <img
              src="/logo.svg"
              alt="Triton Peptide Biologics Lab"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
        </div>

        {/* Wordmark */}
        <div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--teal)",
              margin: 0,
              fontWeight: 600,
            }}
          >
            Triton Peptide Biologics Lab
          </p>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 600,
              margin: "8px 0 0",
              lineHeight: 1.3,
              color: "var(--white)",
            }}
          >
            Protocol Reference Tool
          </h1>
        </div>

        {/* Gate card */}
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "28px 24px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "var(--gray-text)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            This tool is intended for licensed researchers, laboratory
            professionals, and qualified practitioners only. All compounds are
            for research purposes only — not for human or animal consumption.
          </p>

          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{ marginTop: "2px", flexShrink: 0 }}
            />
            <span style={{ fontSize: "13px", color: "var(--white)", lineHeight: 1.5 }}>
              I confirm I am 21 years or older and a licensed researcher or
              qualified laboratory professional. I understand this tool is for{" "}
              <strong>research purposes only</strong>.
            </span>
          </label>

          <button
            onClick={handleConfirm}
            disabled={!checked}
            style={{
              backgroundColor: checked ? "var(--teal)" : "rgba(75,163,181,0.2)",
              color: checked ? "var(--navy)" : "var(--gray-text)",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              transition: "all 0.15s ease",
              cursor: checked ? "pointer" : "not-allowed",
            }}
          >
            Enter Research Portal
          </button>
        </div>

        {/* Disclaimer */}
        <p
          style={{
            fontSize: "11px",
            color: "rgba(160,174,192,0.6)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Not FDA-approved. Not for human or animal consumption. Not medical
          advice. For laboratory and analytical research only.
        </p>
      </div>
    </main>
  );
}
