"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, authApi } from "@/lib/api";
import AuthShell from "@/component/ui/AuthShell";
import Field from "@/component/ui/Field";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setNotice(
        "If that email exists, we've sent a reset token. Check your inbox, then enter the token below."
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {notice && (
        <p className="text-[0.85rem] text-green-600" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="text-[0.85rem] text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="gdm-btn gdm-btn-primary w-full disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send reset token"}
      </button>
    </form>
  );
};

const SetNewPassword = ({ initialToken }: { initialToken: string }) => {
  const router = useRouter();
  const [form, setForm] = useState({ token: initialToken, new_password: "" });
  const [verified, setVerified] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, token: initialToken }));
  }, [initialToken]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onVerify = async () => {
    setError(null);
    setVerified(null);
    if (!form.token) {
      setError("Paste the token from your email first.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyResetToken(form.token);
      setVerified(res.email);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Token is invalid.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.resetPassword(form);
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <p className="text-[0.9rem] text-green-600 text-center" role="status">
        Password reset successful. Redirecting to sign in…
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        id="token"
        name="token"
        label="Reset token"
        placeholder="Paste the token from your email"
        required
        value={form.token}
        onChange={onChange}
      />

      <button
        type="button"
        onClick={onVerify}
        disabled={loading}
        className="gdm-btn w-full disabled:opacity-60"
      >
        Verify token
      </button>

      {verified && (
        <p className="text-[0.85rem] text-green-600" role="status">
          Token valid for {verified}. Set your new password below.
        </p>
      )}

      <Field
        id="new_password"
        name="new_password"
        type="password"
        label="New password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        minLength={8}
        required
        value={form.new_password}
        onChange={onChange}
      />

      {error && (
        <p className="text-[0.85rem] text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="gdm-btn gdm-btn-primary w-full disabled:opacity-60"
      >
        {loading ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
};

const ResetPasswordInner = () => {
  const token = useSearchParams().get("token") ?? "";

  return (
    <AuthShell
      title="Reset password"
      subtitle="Request a reset token, then set a new password."
      footer={
        <Link href="/login" className="text-[rgb(var(--foreground-rgb))] font-medium">
          Back to sign in
        </Link>
      }
    >
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="gdm-eyebrow mb-3">1 · Request a token</h2>
          <RequestReset />
        </section>

        <div className="gdm-divider" />

        <section>
          <h2 className="gdm-eyebrow mb-3">2 · Set a new password</h2>
          <SetNewPassword initialToken={token} />
        </section>
      </div>
    </AuthShell>
  );
};

const ResetPasswordPage = () => (
  <Suspense fallback={null}>
    <ResetPasswordInner />
  </Suspense>
);

export default ResetPasswordPage;
