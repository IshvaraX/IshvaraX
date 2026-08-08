import Link from "next/link";
import type { ReactNode } from "react";

export type CardData = {
  label?: string;
  title: string;
  description: string;
  href?: string;
  tag?: string;
};

type CardProps = CardData & {
  /** Renders a "Learn more" arrow link. Defaults to true when href is set. */
  showLink?: boolean;
  children?: ReactNode;
};

/** Shared card used across Hero and section grids. */
const Card = ({ label, title, description, href, showLink, children }: CardProps) => {
  const withLink = showLink ?? Boolean(href);

  const body = (
    <div className="gdm-card-body">
      {label && <p className="gdm-eyebrow mb-2">{label}</p>}
      <h3 className="gdm-heading-md mb-2 text-base">{title}</h3>
      <p className="gdm-body">{description}</p>
      {withLink && (
        <div className="gdm-link mt-4">
          Learn more <span className="arrow">→</span>
        </div>
      )}
      {children}
    </div>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <Link
        href={href}
        className="gdm-card block"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {body}
      </Link>
    );
  }

  return <div className="gdm-card block">{body}</div>;
};

export default Card;
