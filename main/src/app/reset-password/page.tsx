"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, authApi } from "@/lib/api";
import AuthShell from "@/component/ui/AuthShell";
import Field from "@/component/ui/Field";

const MIN_PASSWORD = 8;

const RequestReset = ({ onHaveToken }: { onHaveToken: () => void }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <p className="m3-body-medium text-on-surface" role="status">
          If an account exists for <strong>{email}</strong>, we&apos;ve emailed a reset link.
          It&apos;s valid for 30 minutes and can only be used once.
        </p>
        <p className="m3-body-small text-on-surface-variant">
          Didn&apos;t get it? Check your spam folder, or{" "}
          <button type="button" onClick={() => setSent(false)} className="font-medium text-primary">
            try again
          </button>
          .
        </p>
        <button type="button" onClick={onHaveToken} className="m3-btn m3-btn-text w-full">
          I have a token — enter it manually
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
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

      {error && (
        <p className="m3-body-small text-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="m3-btn m3-btn-filled w-full">
        {loading ? "Sending…" : "Email me a reset link"}
      </button>
      <button type="button" onClick={onHaveToken} className="m3-btn m3-btn-text w-full">
        I already have a token
      </button>
    </form>
  );
};

type TokenState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid"; email: string }
  | { status: "invalid"; message: string };

const SetNewPassword = ({
  initialToken,
  onRequestNew,
}: {
  initialToken: string;
  onRequestNew: () => void;
}) => {
  const router = useRouter();
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [tokenState, setTokenState] = useState<TokenState>({ status: "idle" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const verify = useCallback(async (value: string) => {
    if (!value.trim()) {
      setTokenState({ status: "idle" });
      return;
    }
    setTokenState({ status: "checking" });
    try {
      const res = await authApi.verifyResetToken(value.trim());
      setTokenState({ status: "valid", email: res.email });
    } catch (err) {
      setTokenState({
        status: "invalid",
        message: err instanceof ApiError ? err.message : "This token is not valid.",
      });
    }
  }, []);

  // Links from the email land here with ?token=…; verify immediately so the user
  // sees whether the link is still good before typing a password.
  useEffect(() => {
    setToken(initialToken);
    if (initialToken) verify(initialToken);
  }, [initialToken, verify]);

  const mismatch = confirm.length > 0 && password !== confirm;
  const tooShort = password.length > 0 && password.length < MIN_PASSWORD;
  const canSubmit =
    tokenState.status === "valid" && password.length >= MIN_PASSWORD && password === confirm && !saving;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSaving(true);
    try {
      await authApi.resetPassword({ token: token.trim(), new_password: password });
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reset password.");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col gap-3 text-center" role="status">
        <p className="m3-body-medium text-on-surface">
          Your password has been reset and all other devices were signed out.
        </p>
        <p className="m3-body-small text-on-surface-variant">Taking you to sign in…</p>
      </div>
    );
  }

  const tokenInvalid = tokenState.status === "invalid";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field
        id="token"
        name="token"
        label="Reset token"
        placeholder="Paste the token from your email"
        autoComplete="one-time-code"
        required
        value={token}
        onChange={(e) => {
          setToken(e.target.value);
          setTokenState({ status: "idle" });
        }}
        onBlur={() => verify(token)}
      />

      {tokenState.status === "checking" && (
        <p className="m3-body-small text-on-surface-variant" role="status">
          Checking token…
        </p>
      )}
      {tokenState.status === "valid" && (
        <p className="m3-body-small text-secondary" role="status">
          Resetting the password for <strong>{tokenState.email}</strong>.
        </p>
      )}
      {tokenInvalid && (
        <div className="flex flex-col gap-2" role="alert">
          <p className="m3-body-small text-error">{tokenState.message}</p>
          <button type="button" onClick={onRequestNew} className="m3-btn m3-btn-outlined w-full">
            Request a new link
          </button>
        </div>
      )}
      {tokenState.status === "idle" && token && (
        <button type="button" onClick={() => verify(token)} className="m3-btn m3-btn-outlined w-full">
          Verify token
        </button>
      )}

      <Field
        id="new_password"
        name="new_password"
        type="password"
        label="New password"
        placeholder={`At least ${MIN_PASSWORD} characters`}
        autoComplete="new-password"
        minLength={MIN_PASSWORD}
        required
        disabled={tokenState.status !== "valid"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Field
        id="confirm_password"
        name="confirm_password"
        type="password"
        label="Confirm new password"
        placeholder="Type it again"
        autoComplete="new-password"
        minLength={MIN_PASSWORD}
        required
        disabled={tokenState.status !== "valid"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {tooShort && (
        <p className="m3-body-small text-error" role="alert">
          Password must be at least {MIN_PASSWORD} characters.
        </p>
      )}
      {mismatch && !tooShort && (
        <p className="m3-body-small text-error" role="alert">
          Passwords don&apos;t match.
        </p>
      )}
      {error && (
        <p className="m3-body-small text-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={!canSubmit} className="m3-btn m3-btn-filled w-full">
        {saving ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
};

const ResetPasswordInner = () => {
  const tokenFromUrl = useSearchParams().get("token") ?? "";
  const [mode, setMode] = useState<"request" | "reset">(tokenFromUrl ? "reset" : "request");

  useEffect(() => {
    if (tokenFromUrl) setMode("reset");
  }, [tokenFromUrl]);

  const isReset = mode === "reset";

  return (
    <AuthShell
      title={isReset ? "Choose a new password" : "Reset password"}
      subtitle={
        isReset
          ? "Your reset link is single-use and expires in 30 minutes."
          : "Enter your email and we'll send you a one-time reset link."
      }
      footer={
        <Link href="/login" className="font-medium text-primary">
          Back to sign in
        </Link>
      }
    >
      {isReset ? (
        <SetNewPassword initialToken={tokenFromUrl} onRequestNew={() => setMode("request")} />
      ) : (
        <RequestReset onHaveToken={() => setMode("reset")} />
      )}
    </AuthShell>
  );
};

const ResetPasswordPage = () => (
  <Suspense fallback={null}>
    <ResetPasswordInner />
  </Suspense>
);

export default ResetPasswordPage;
