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
          <Link href="/register" className="font-medium text-primary">
            Join as a freelancer
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Field
          id="username"
          name="username"
          label="Username or email"
          placeholder="your_username or you@example.com"
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
          className="m3-label-large self-end text-primary"
        >
          Forgot password?
        </Link>

        {error && (
          <p className="m3-body-small text-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="m3-btn m3-btn-filled mt-1 w-full"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
