"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import AuthShell from "@/component/ui/AuthShell";
import Field from "@/component/ui/Field";

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    pan: "",
    aadhaar: "",
    upi_id: "",
    skills: "",
    language: "",
  });
  const [photo, setPhoto] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      setError("Please choose a photo under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        pan: form.pan.trim() || undefined,
        aadhaar: form.aadhaar.trim() || undefined,
        upi_id: form.upi_id.trim() || undefined,
        photo: photo || undefined,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        language: form.language.trim() || undefined,
      });
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
      title="Join IshvaraX"
      subtitle="Create your freelancer account and start building with us."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--foreground)] font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          id="username"
          name="username"
          label="Username"
          placeholder="ada_lovelace"
          autoComplete="username"
          minLength={3}
          maxLength={50}
          required
          value={form.username}
          onChange={onChange}
        />
        <Field
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={form.email}
          onChange={onChange}
        />
        <Field
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.password}
          onChange={onChange}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="pan"
            name="pan"
            label="PAN number"
            placeholder="ABCDE1234F"
            autoComplete="off"
            value={form.pan}
            onChange={onChange}
          />
          <Field
            id="aadhaar"
            name="aadhaar"
            label="Aadhaar number"
            placeholder="1234 5678 9012"
            autoComplete="off"
            inputMode="numeric"
            value={form.aadhaar}
            onChange={onChange}
          />
        </div>

        <Field
          id="upi_id"
          name="upi_id"
          label="UPI ID"
          placeholder="name@bank"
          autoComplete="off"
          value={form.upi_id}
          onChange={onChange}
        />

        <Field
          id="skills"
          name="skills"
          label="Skills"
          placeholder="React, Python, UI design (comma separated)"
          autoComplete="off"
          value={form.skills}
          onChange={onChange}
        />

        <Field
          id="language"
          name="language"
          label="Languages"
          placeholder="English, Hindi, Tamil"
          autoComplete="off"
          value={form.language}
          onChange={onChange}
        />

        <label htmlFor="photo" className="flex flex-col gap-1.5">
          <span className="gdm-eyebrow">Profile photo</span>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={onPhoto}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[0.9rem] text-[var(--muted)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--foreground)] file:px-3 file:py-1.5 file:text-[var(--background)]"
          />
        </label>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Profile preview"
            className="h-20 w-20 rounded-xl border border-[var(--border)] object-cover"
          />
        )}

        <p className="text-[0.75rem] text-[var(--muted)]">
          PAN and Aadhaar are sensitive. Only share what you&apos;re comfortable with.
        </p>

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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
