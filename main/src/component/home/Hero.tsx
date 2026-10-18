"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MdArrowOutward,
  MdOutlineArticle,
  MdOutlineGroups,
  MdOutlineSchool,
  MdOutlineWork,
} from "react-icons/md";
import content from "@/app/site-content.json";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectsContext";
import { productsApi, type ProductDTO, type ProductPlatform } from "@/lib/api";
import { BrandMark } from "@/component/nav/LearnNav";

const { hero, site } = content;

const PLATFORM_LABEL: Record<ProductPlatform, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
  desktop: "Desktop",
};

// Tonal tiles for the four product slots (tall, tall, wide, wide).
const PRODUCT_TONES = [
  "bg-inverse-surface text-inverse-on-surface",
  "bg-surface-container-highest text-on-surface",
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
];

const ProductIcon = ({ product, className }: { product: ProductDTO; className: string }) =>
  product.icon ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={product.icon}
      alt=""
      className={`${className} shrink-0 rounded-xl object-cover shadow-sm`}
    />
  ) : (
    <span
      className={`${className} m3-title-large flex shrink-0 items-center justify-center rounded-xl bg-current/15`}
    >
      {product.name.charAt(0).toUpperCase()}
    </span>
  );

/** A product (app) card inside the mosaic; links out to the store / site. */
const ProductTile = ({
  product,
  tall,
  tone,
}: {
  product: ProductDTO;
  tall: boolean;
  tone: string;
}) => (
  <a
    href={product.link}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${product.name} — ${product.tagline}`}
    className={`m3-state rounded-2xl ${tone} ${
      tall
        ? "col-span-2 row-span-2 flex flex-col justify-between gap-3 p-5"
        : "col-span-3 flex items-center gap-4 px-4 py-3"
    }`}
  >
    <ProductIcon product={product} className={tall ? "h-14 w-14" : "h-12 w-12"} />
    <div className="min-w-0 flex-1">
      <p className="m3-title-medium truncate">{product.name}</p>
      <p className={`m3-body-small opacity-85 ${tall ? "line-clamp-3" : "line-clamp-1"}`}>
        {product.tagline}
      </p>
    </div>
    <span className="m3-label-medium inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-current/15 px-2.5 py-1">
      {PLATFORM_LABEL[product.platform]}
      <MdArrowOutward className="h-3.5 w-3.5" aria-hidden />
    </span>
  </a>
);

/**
 * Hero media panel: a tonal collage. The "open projects" and "Build together"
 * tiles are fixed; the other four slots show featured products (admin-managed)
 * and fall back to decorative tiles while there are fewer than four.
 */
const HeroMosaic = ({
  openCount,
  ready,
  skills,
  products,
}: {
  openCount: number;
  ready: boolean;
  skills: string[];
  products: ProductDTO[];
}) => {
  // Slot order: tall, tall, wide, wide — the first product gets the most prominent tile.
  const [tallA, tallB, wideA, wideB] = products;

  return (
    <div className="m3-panel grid min-h-[22rem] grid-cols-6 grid-rows-[repeat(4,minmax(0,1fr))] gap-3 p-3 lg:min-h-0">
      <div className="relative col-span-3 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl bg-primary-container p-5 text-on-primary-container">
        <span aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/15" />
        <MdOutlineWork className="h-7 w-7" aria-hidden />
        <div>
          <span className="m3-display-small block font-medium">{ready ? openCount : "—"}</span>
          <span className="m3-label-large">open projects</span>
        </div>
      </div>

      {wideA ? (
        <ProductTile product={wideA} tall={false} tone={PRODUCT_TONES[2]} />
      ) : (
        <div aria-hidden className="col-span-3 flex items-center gap-3 rounded-2xl bg-secondary-container px-5 text-on-secondary-container">
          <MdOutlineSchool className="h-7 w-7 shrink-0" />
          <span className="m3-title-medium">Courses, notes &amp; playlists</span>
        </div>
      )}

      {wideB ? (
        <ProductTile product={wideB} tall={false} tone={PRODUCT_TONES[3]} />
      ) : (
        <div aria-hidden className="col-span-3 flex flex-wrap content-center items-center gap-2 overflow-hidden rounded-2xl bg-tertiary-container px-4 py-3 text-on-tertiary-container">
          {(skills.length ? skills : ["React", "Python", "Design"]).map((s) => (
            <span key={s} className="m3-label-medium rounded-full bg-tertiary px-3 py-1 text-on-tertiary">
              {s}
            </span>
          ))}
        </div>
      )}

      <div aria-hidden className="col-span-2 row-span-2 flex flex-col justify-between rounded-2xl bg-amber-container p-5 text-on-amber-container">
        <MdOutlineGroups className="h-7 w-7" />
        <span className="m3-title-medium">Build together</span>
      </div>

      {tallA ? (
        <ProductTile product={tallA} tall tone={PRODUCT_TONES[0]} />
      ) : (
        <div aria-hidden className="relative col-span-2 row-span-2 flex items-center justify-center overflow-hidden rounded-2xl bg-inverse-surface text-inverse-on-surface">
          <span className="absolute inset-x-5 bottom-5 h-2 rounded-full bg-inverse-primary/60" />
          <span className="font-mono text-4xl font-medium">{"</>"}</span>
        </div>
      )}

      {tallB ? (
        <ProductTile product={tallB} tall tone={PRODUCT_TONES[1]} />
      ) : (
        <div aria-hidden className="col-span-2 row-span-2 flex flex-col justify-between rounded-2xl bg-surface-container-highest p-5 text-on-surface">
          <MdOutlineArticle className="h-7 w-7" />
          <span className="m3-title-medium">Notes &amp; updates</span>
        </div>
      )}
    </div>
  );
};

/** Opening hero: white text panel + tonal media panel, side by side like m3.material.io. */
const Hero = () => {
  const { user } = useAuth();
  const { projects, isReady } = useProjects();
  const [products, setProducts] = useState<ProductDTO[]>([]);

  useEffect(() => {
    productsApi
      .list()
      .then((all) => setProducts(all.filter((p) => p.featured)))
      .catch(() => {});
  }, []);

  const openCount = projects.filter((p) => p.status === "open").length;
  const skills = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) for (const s of p.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s]) => s);
  }, [projects]);

  return (
    <section
      id="hero"
      className="grid gap-3 p-2 lg:grid-cols-[minmax(0,34rem)_1fr] lg:p-3 lg:pl-1"
    >
      <div className="m3-panel flex flex-col justify-center p-8 md:p-12 lg:min-h-[30rem]">
        <span className="m3-title-medium inline-flex items-center gap-2 text-on-surface-variant">
          <BrandMark size={22} />
          {site.name}
        </span>

        <h1 className="m3-hero-title mt-6">
          {user ? (
            <>
              Welcome back,
              <br />
              {user.username}
            </>
          ) : (
            hero.headingLead
          )}
        </h1>

        <p className="m3-body-large mt-6 max-w-md text-on-surface-variant md:text-lg md:leading-7">
          {user
            ? "Pick up where you left off — new projects and study materials are waiting."
            : hero.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {user ? (
            <Link href="/projects" className="m3-btn m3-btn-filled m3-btn-large">
              Browse projects
            </Link>
          ) : (
            <>
              <Link href={hero.cta.href} className="m3-btn m3-btn-filled m3-btn-large">
                {hero.cta.label}
              </Link>
              <Link href={hero.ctaSecondary.href} className="m3-btn m3-btn-text m3-btn-large">
                {hero.ctaSecondary.label}
              </Link>
            </>
          )}
        </div>
      </div>

      <HeroMosaic openCount={openCount} ready={isReady} skills={skills} products={products} />
    </section>
  );
};

export default Hero;