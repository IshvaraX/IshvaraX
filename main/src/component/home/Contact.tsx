"use client";

import { FormEvent, useState } from "react";
import { MdOutlineSend } from "react-icons/md";
import content from "@/app/site-content.json";
import Reveal from "@/component/ui/Reveal";
import Field from "@/component/ui/Field";
import { contactApi } from "@/lib/api";

const { contact } = content;

type Status = { kind: "idle" | "sending" | "sent" | "error"; text?: string };

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const res = await contactApi.send({ name, email, message });
      setStatus({ kind: "sent", text: res.message });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  };

  const sending = status.kind === "sending";

  return (
    <section id="contact" className="pt-16 md:pt-24">
      <Reveal>
        <h2 className="m3-section-title">{contact.heading}</h2>
      </Reveal>
      <Reveal className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,24rem)_1fr]">
        <p className="m3-body-large text-on-surface-variant lg:pt-8">{contact.body}</p>
        <form onSubmit={onSubmit} className="m3-panel flex flex-col gap-5 p-6 md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="contact-name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={100}
              required
            />
            <Field
              id="contact-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <label htmlFor="contact-message" className="m3-field">
            <textarea
              id="contact-message"
              className="g-input"
              rows={5}
              placeholder=" "
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minLength={10}
              maxLength={4000}
              required
            />
            <span className="m3-field-label">Message</span>
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="m3-btn m3-btn-filled pl-4" disabled={sending}>
              <MdOutlineSend />
              {sending ? "Sending…" : contact.submit}
            </button>
            {status.text && (
              <p
                role="status"
                className={`m3-body-medium ${status.kind === "error" ? "text-error" : "text-on-surface-variant"}`}
              >
                {status.text}
              </p>
            )}
          </div>
        </form>
      </Reveal>
    </section>
  );
};

export default Contact;
