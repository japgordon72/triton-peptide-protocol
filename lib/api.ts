export interface QueryRequest {
  biomarkers?: Record<string, number>;
  symptoms?: string[];
  freetext?: string;
}

export interface CompoundProtocol {
  indications: string[];
  mechanism: string;
  dosage: string;
  warnings: string[];
  source: string;
}

export interface CompoundResult {
  name: string;
  sku: string;
  url: string;
  reasons: string[];
  protocol: CompoundProtocol | null;
}

export interface QueryResponse {
  compounds: CompoundResult[];
  response: string;
  mode: "rag" | "direct";
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function queryProtocol(req: QueryRequest): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}
