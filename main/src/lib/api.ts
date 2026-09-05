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
  cleanupTokens: "/auth/cleanup-tokens",
  updateProfile: "/auth/profile",
  projects: "/projects",
  applications: "/applications",
  learnings: "/learnings",
  blogs: "/blogs",
  members: "/members",
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
  pan?: string;
  aadhaar?: string;
  upi_id?: string;
  photo?: string;
  skills?: string[];
  language?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type ProfileUpdatePayload = {
  username: string;
  password: string; // current password, to authorize
  email?: string;
  photo?: string | null;
  skills?: string[];
  language?: string;
  upi_id?: string;
  new_password?: string;
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

export type ProjectDTO = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  stipend?: string | null;
  duration?: string | null;
  status: "open" | "closed";
  createdAt: number;
};

export type ProjectCreatePayload = {
  title: string;
  description: string;
  skills: string[];
  stipend?: string;
  duration?: string;
  status: "open" | "closed";
};

export type ApplicationDTO = {
  id: string;
  projectId: string;
  username: string;
  links: string;
  createdAt: number;
  email?: string | null;
  skills?: string[];
  language?: string | null;
  photo?: string | null;
};

export type ApplicationCreatePayload = {
  username: string;
  links: string;
};

export type UserApplicationDTO = {
  id: string;
  projectId: string;
  projectTitle: string;
  projectStatus: "open" | "closed";
  links: string;
  createdAt: number;
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
  return apiFetch<T>(path, { method: "POST", body });
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  adminPassword?: string;
};

async function apiFetch<T>(
  path: string,
  { method = "GET", body, adminPassword }: ApiFetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (adminPassword) headers["X-Admin-Password"] = adminPassword;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
  cleanupTokens: () =>
    request<{ message?: string }>(ENDPOINTS.cleanupTokens, {}),
  updateProfile: (payload: ProfileUpdatePayload) =>
    apiFetch<AuthResponse>(ENDPOINTS.updateProfile, {
      method: "PUT",
      body: payload,
    }),
};

export const projectsApi = {
  list: () => apiFetch<ProjectDTO[]>(ENDPOINTS.projects),
  create: (payload: ProjectCreatePayload, adminPassword: string) =>
    apiFetch<ProjectDTO>(ENDPOINTS.projects, {
      method: "POST",
      body: payload,
      adminPassword,
    }),
  remove: (id: string, adminPassword: string) =>
    apiFetch<{ message?: string }>(`${ENDPOINTS.projects}/${id}`, {
      method: "DELETE",
      adminPassword,
    }),
  apply: (projectId: string, payload: ApplicationCreatePayload) =>
    apiFetch<ApplicationDTO>(
      `${ENDPOINTS.projects}/${projectId}/applications`,
      { method: "POST", body: payload }
    ),
  listApplications: (adminPassword: string) =>
    apiFetch<ApplicationDTO[]>(ENDPOINTS.applications, { adminPassword }),
  myApplications: (username: string) =>
    apiFetch<UserApplicationDTO[]>(
      `${ENDPOINTS.applications}/user/${encodeURIComponent(username)}`
    ),
};

export type LearningDTO = {
  id: string;
  section: string;
  category: string;
  title: string;
  link: string;
  createdAt: number;
};
export type LearningPayload = {
  section: string;
  category: string;
  title: string;
  link: string;
};

export const learningsApi = {
  list: () => apiFetch<LearningDTO[]>(ENDPOINTS.learnings),
  create: (payload: LearningPayload, adminPassword: string) =>
    apiFetch<LearningDTO>(ENDPOINTS.learnings, {
      method: "POST",
      body: payload,
      adminPassword,
    }),
  update: (id: string, payload: LearningPayload, adminPassword: string) =>
    apiFetch<LearningDTO>(`${ENDPOINTS.learnings}/${id}`, {
      method: "PUT",
      body: payload,
      adminPassword,
    }),
  remove: (id: string, adminPassword: string) =>
    apiFetch<{ message?: string }>(`${ENDPOINTS.learnings}/${id}`, {
      method: "DELETE",
      adminPassword,
    }),
};

export type BlogDTO = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
  createdAt: number;
};
export type BlogPayload = {
  title: string;
  content: string;
  tags: string[];
  links: string[];
};

export const blogsApi = {
  list: () => apiFetch<BlogDTO[]>(ENDPOINTS.blogs),
  get: (id: string) => apiFetch<BlogDTO>(`${ENDPOINTS.blogs}/${id}`),
  create: (payload: BlogPayload, adminPassword: string) =>
    apiFetch<BlogDTO>(ENDPOINTS.blogs, {
      method: "POST",
      body: payload,
      adminPassword,
    }),
  update: (id: string, payload: BlogPayload, adminPassword: string) =>
    apiFetch<BlogDTO>(`${ENDPOINTS.blogs}/${id}`, {
      method: "PUT",
      body: payload,
      adminPassword,
    }),
  remove: (id: string, adminPassword: string) =>
    apiFetch<{ message?: string }>(`${ENDPOINTS.blogs}/${id}`, {
      method: "DELETE",
      adminPassword,
    }),
};

export type MemberDTO = {
  id: string;
  name: string;
  role: string;
  photo?: string | null;
  createdAt: number;
};
export type MemberPayload = { name: string; role: string; photo?: string | null };

export const membersApi = {
  list: () => apiFetch<MemberDTO[]>(ENDPOINTS.members),
  create: (payload: MemberPayload, adminPassword: string) =>
    apiFetch<MemberDTO>(ENDPOINTS.members, {
      method: "POST",
      body: payload,
      adminPassword,
    }),
  update: (id: string, payload: MemberPayload, adminPassword: string) =>
    apiFetch<MemberDTO>(`${ENDPOINTS.members}/${id}`, {
      method: "PUT",
      body: payload,
      adminPassword,
    }),
  remove: (id: string, adminPassword: string) =>
    apiFetch<{ message?: string }>(`${ENDPOINTS.members}/${id}`, {
      method: "DELETE",
      adminPassword,
    }),
};

export { ApiError };
