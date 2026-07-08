const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

export interface BackendDocument {
  id: number;
  doc_type: string;
  original_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  status: "processing" | "verified" | "failed";
  extracted_data: Record<string, string> | null;
  needs_review: boolean;
  uploaded_at: string;
}

export type ProfileFields = Record<string, string>;

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export function documentFileUrl(id: number): string {
  return `${API_BASE}/documents/${id}/file`;
}

export const api = {
  getProfile: (authId: string) =>
    fetch(`${API_BASE}/profile/${encodeURIComponent(authId)}`).then((r) => handle<ProfileFields>(r)),

  updateProfile: (authId: string, fields: ProfileFields) =>
    fetch(`${API_BASE}/profile/${encodeURIComponent(authId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    }).then((r) => handle<ProfileFields>(r)),

  listDocuments: (authId: string) =>
    fetch(`${API_BASE}/documents?auth_id=${encodeURIComponent(authId)}`).then((r) =>
      handle<BackendDocument[]>(r)
    ),

  uploadDocument: (authId: string, docType: string, file: File) => {
    const form = new FormData();
    form.append("auth_id", authId);
    form.append("doc_type", docType);
    form.append("file", file);
    return fetch(`${API_BASE}/documents`, { method: "POST", body: form }).then((r) =>
      handle<BackendDocument>(r)
    );
  },

  deleteDocument: (id: number) =>
    fetch(`${API_BASE}/documents/${id}`, { method: "DELETE" }).then((r) => handle<{ deleted: boolean }>(r)),
};
