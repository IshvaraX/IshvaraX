// ─────────────────────────────────────────────────────────────────────────────
// 🔗 REPLACE THIS ONE LINE with your deployed HFI backend URL.
// Locally the FastAPI server runs at http://localhost:8000
// You can also set NEXT_PUBLIC_API_BASE_URL in .env.local to override it.
// ─────────────────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// Route paths from the HFI `auth.router`. Adjust here if your prefix differs
// (e.g. "/register" instead of "/auth/register").
export const ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  forgotPassword: "/auth/forgot-password",
  verifyResetToken: "/auth/reset-password/verify",
  resetPassword: "/auth/reset-password",
} as const;

export type AuthUser = {
  username: string;
  email?: string;
  [key: string]: unknown;
};

// The HFI auth router returns a simple `{ message }` — no token or user object.
export type AuthResponse = {
  message?: string;
  [key: string]: unknown;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type ResetPasswordPayload = {
  token: string;
  new_password: string;
};

export type TokenValidation = {
  valid: boolean;
  user_id: string;
  email: string;
  expires_at: string;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Check that the API is running and the URL is correct.",
      0
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail =
      (data && (data.detail || data.message)) || `Request failed (${res.status})`;
    throw new ApiError(
      typeof detail === "string" ? detail : "Request failed",
      res.status
    );
  }

  return data as T;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<AuthResponse>(ENDPOINTS.register, payload),
  login: (payload: LoginPayload) =>
    request<AuthResponse>(ENDPOINTS.login, payload),
  forgotPassword: (email: string) =>
    request<{ message?: string }>(ENDPOINTS.forgotPassword, { email }),
  verifyResetToken: (token: string) =>
    request<TokenValidation>(ENDPOINTS.verifyResetToken, { token }),
  resetPassword: (payload: ResetPasswordPayload) =>
    request<AuthResponse>(ENDPOINTS.resetPassword, payload),
};

export { ApiError };
