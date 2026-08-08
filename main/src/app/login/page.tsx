"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import AuthShell from "@/component/ui/AuthShell";
import Field from "@/component/ui/Field";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your IshvaraX freelancer account."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="text-[rgb(var(--foreground-rgb))] font-medium">
            Join as a freelancer
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          id="username"
          name="username"
          label="Username"
          placeholder="your_username"
          autoComplete="username"
          required
          value={form.username}
          onChange={onChange}
        />
        <Field
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={onChange}
        />

        <Link
          href="/reset-password"
          className="self-end text-[0.8rem] text-[rgb(var(--muted-rgb))] hover:text-[rgb(var(--foreground-rgb))] transition-colors"
        >
          Forgot password?
        </Link>

        {error && (
          <p className="text-[0.85rem] text-red-500" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="gdm-btn gdm-btn-primary w-full mt-1 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
