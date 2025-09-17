import type { MentorApplication } from "@shared/api";

export async function createMentorApplication(payload: Omit<MentorApplication, "id" | "createdAt">) {
  const res = await fetch("/api/mentors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let data: any = null;
  try {
    data = await res.clone().json();
  } catch {
    // non-JSON response
  }
  if (!res.ok || (data && data.ok === false)) {
    const msg = data?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data as { ok: true; id: string; record: MentorApplication };
}

export async function listMentorApplications() {
  const res = await fetch("/api/mentors");
  let data: any = null;
  try {
    data = await res.clone().json();
  } catch {}
  if (!res.ok || (data && data.ok === false)) {
    const msg = data?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data as { ok: true; items: MentorApplication[] };
}
