"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import content from "@/app/site-content.json";
import { useAuth } from "@/context/AuthContext";
import { BrandMark, Wordmark } from "@/component/nav/LearnNav";

const { footer, site } = content;

const SOCIAL_ICONS: Record<string, IconType> = {
  GitHub: FaGithub,
  X: FaXTwitter,
  LinkedIn: FaLinkedinIn,
  Instagram: FaInstagram,
  YouTube: FaYoutube,
};

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer className="mx-auto w-full max-w-[1320px] px-5 pb-10 md:px-12 xl:px-[88px]">
      <div className="m3-wave mb-12" aria-hidden />

      <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] lg:gap-8">
        <div className="lg:pr-8">
          <Link href="/" className="inline-flex items-center gap-2 text-on-surface">
            <BrandMark size={24} />
            <span className="m3-title-large">
              <Wordmark />
            </span>
          </Link>
          <p className="m3-body-medium mt-4 max-w-sm text-on-surface-variant">
            {footer.tagline}
          </p>
          <div className="mt-6 flex gap-2">
            {!user && (
              <Link href="/register" className="m3-btn m3-btn-filled">
                Join now
              </Link>
            )}
            <Link href="/login" className="m3-btn m3-btn-text">
              Sign in
            </Link>
          </div>
        </div>

        {footer.columns.map((column) => (
          <div key={column.heading}>
            <h3 className="m3-title-small mb-4 text-on-surface">{column.heading}</h3>
            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="m3-body-medium text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-outline-variant pt-6 sm:flex-row sm:items-center">
        <span className="m3-body-small text-on-surface-variant">
          © {new Date().getFullYear()} {site.name}. Built by the community, for
          the community.
        </span>
        <ul className="flex items-center gap-1" aria-label="Social media">
          {footer.social.map(({ name, href }) => {
            const Icon = SOCIAL_ICONS[name];
            return (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                  className="m3-icon-btn"
                >
                  {Icon ? <Icon /> : name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="m3-body-small mt-4 text-on-surface-variant">
        PINAKA is a separate, independent research side project.
      </p>
    </footer>
  );
};

export default Footer;