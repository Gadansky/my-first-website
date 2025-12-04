// Usa la misma origin por defecto; si quieres otro host/puerto define NEXT_PUBLIC_API_BASE_URL.
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

type ApiPayload = Record<string, unknown> & {
  message?: string;
  error?: string;
  token?: string;
  user?: { name?: string; email?: string };
};

async function postJSON<T extends ApiPayload>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const url = `${API_BASE || ""}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await res.json().catch(() => ({}))) as ApiPayload;
  if (!res.ok) {
    const message = payload.error || payload.message || `Error ${res.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export type RegisterInput = {
  name?: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export function registerUser(data: RegisterInput) {
  return postJSON<ApiPayload>("/api/register", data);
}

export function loginUser(data: LoginInput) {
  return postJSON<ApiPayload>("/api/login", data);
}
