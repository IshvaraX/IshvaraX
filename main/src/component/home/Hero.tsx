"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MdArrowOutward,
  MdKeyboardArrowDown,
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

const PRODUCT_TONES = [
  "bg-inverse-surface text-inverse-on-surface",
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-surface-container-highest text-on-surface",
  "bg-surface-container-high text-on-surface",
];

const ProductIcon = ({ product, className }: { product: ProductDTO; className: string }) =>
  product.icon ? (
    <img
      src={product.icon}
      alt=""
      decoding="async"
      className={`${className} shrink-0 rounded-xl object-cover shadow-sm`}
    />
  ) : (
    <span
      className={`${className} m3-title-large flex shrink-0 items-center justify-center rounded-xl bg-current/15`}
    >
      {product.name.charAt(0).toUpperCase()}
    </span>
  );

const ProductTile = ({
  product,
  tall,
  tone,
}: {
  product: ProductDTO;
  tall: boolean;
  tone: string;
}) => {
  if (tall && product.icon) {
    return (
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${product.name} — ${product.tagline}`}
        className="m3-state relative col-span-2 row-span-2 flex flex-col justify-end overflow-hidden rounded-2xl bg-surface-container-highest"
      >
        <img src={product.icon} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative m-3 flex items-end gap-3 rounded-xl bg-surface-container-lowest/92 p-3 text-on-surface">
          <div className="min-w-0 flex-1">
            <p className="m3-title-medium truncate">{product.name}</p>
            <p className="m3-body-small line-clamp-2 text-on-surface-variant">{product.tagline}</p>
          </div>
          <span className="m3-label-medium inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-container px-2.5 py-1 text-on-primary-container">
            {PLATFORM_LABEL[product.platform]}
            <MdArrowOutward className="h-3 w-3" aria-hidden />
          </span>
        </div>
      </a>
    );
  }

  if (!tall) {
    return (
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${product.name} — ${product.tagline}`}
        className={`m3-state col-span-2 flex items-center gap-3 rounded-2xl px-4 py-3 ${tone}`}
      >
        <ProductIcon product={product} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <p className="m3-title-small truncate">{product.name}</p>
          <p className="m3-label-medium inline-flex items-center gap-1 opacity-85">
            {PLATFORM_LABEL[product.platform]}
            <MdArrowOutward className="h-3 w-3" aria-hidden />
          </p>
        </div>
      </a>
    );
  }

  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${product.name} — ${product.tagline}`}
      className={`m3-state col-span-2 row-span-2 flex flex-col justify-between gap-3 rounded-2xl p-5 ${tone}`}
    >
      <ProductIcon product={product} className="h-12 w-12" />
      <div className="min-w-0 flex-1">
        <p className="m3-title-medium truncate">{product.name}</p>
        <p className="m3-body-small line-clamp-3 opacity-85">{product.tagline}</p>
      </div>
      <span className="m3-label-medium inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-current/15 px-2.5 py-1">
        {PLATFORM_LABEL[product.platform]}
        <MdArrowOutward className="h-3 w-3" aria-hidden />
      </span>
    </a>
  );
};

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
  const [tallA, tallB, tallC, tallD, wide] = products;

  return (
    <div className="m3-panel grid min-h-[22rem] grid-cols-6 grid-rows-[repeat(4,minmax(0,1fr))] gap-3 p-3 lg:min-h-0">
      <div className="relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl bg-primary-container p-5 text-on-primary-container">
        <span aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/15" />
        <MdOutlineWork className="h-6 w-6" aria-hidden />
        <div>
          <span className="m3-display-small block font-medium">{ready ? openCount : "—"}</span>
          <span className="m3-label-large">open projects</span>
        </div>
      </div>

      {tallA ? (
        <ProductTile product={tallA} tall tone={PRODUCT_TONES[0]} />
      ) : (
        <div aria-hidden className="relative col-span-2 row-span-2 flex items-center justify-center overflow-hidden rounded-2xl bg-inverse-surface text-inverse-on-surface">
          <span className="absolute inset-x-5 bottom-5 h-2 rounded-full bg-inverse-primary/60" />
          <span className="font-mono text-3xl font-medium">{"</>"}</span>
        </div>
      )}

      {tallB ? (
        <ProductTile product={tallB} tall tone={PRODUCT_TONES[1]} />
      ) : (
        <div aria-hidden className="col-span-2 row-span-2 flex flex-col justify-between rounded-2xl bg-secondary-container p-5 text-on-secondary-container">
          <MdOutlineSchool className="h-6 w-6" />
          <span className="m3-title-medium">Courses, notes &amp; playlists</span>
        </div>
      )}

      <div aria-hidden className="col-span-2 flex items-center gap-3 rounded-2xl bg-amber-container px-4 text-on-amber-container">
        <MdOutlineGroups className="h-6 w-6 shrink-0" />
        <span className="m3-title-small">Build together</span>
      </div>

      {tallC ? (
        <ProductTile product={tallC} tall tone={PRODUCT_TONES[2]} />
      ) : (
        <div aria-hidden className="col-span-2 row-span-2 flex flex-wrap content-center items-center gap-2 overflow-hidden rounded-2xl bg-tertiary-container p-4 text-on-tertiary-container">
          {(skills.length ? skills : ["React", "Python", "Design"]).map((s) => (
            <span key={s} className="m3-label-medium rounded-full bg-tertiary px-3 py-1 text-on-tertiary">
              {s}
            </span>
          ))}
        </div>
      )}

      {tallD ? (
        <ProductTile product={tallD} tall tone={PRODUCT_TONES[3]} />
      ) : (
        <div aria-hidden className="col-span-2 row-span-2 flex flex-col justify-between rounded-2xl bg-surface-container-highest p-5 text-on-surface">
          <MdOutlineArticle className="h-6 w-6" />
          <span className="m3-title-medium">Notes &amp; updates</span>
        </div>
      )}

      {wide ? (
        <ProductTile product={wide} tall={false} tone={PRODUCT_TONES[4]} />
      ) : (
        <div aria-hidden className="col-span-2 flex items-center justify-center rounded-2xl bg-surface-container-high">
          <BrandMark size={28} />
        </div>
      )}
    </div>
  );
};

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
    <>
    <section
      id="hero"
      className="mx-auto grid w-full max-w-[1680px] gap-3 p-2 lg:min-h-[calc(90vh-3.5rem)] lg:grid-cols-[minmax(0,34rem)_1fr] lg:p-3 lg:pl-1 2xl:pl-3"
    >
      <div className="m3-panel flex min-w-0 flex-col justify-center p-8 md:p-12 lg:min-h-[30rem]">
        <span className="m3-title-medium inline-flex items-center gap-2 text-on-surface-variant">
          <BrandMark size={20} />
          {site.name}
        </span>

        <h1 className="m3-hero-title mt-6 min-w-0 [overflow-wrap:anywhere]">
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

    <div className="flex items-center justify-center py-4 lg:h-[10vh] lg:py-0">
      <a href="#content" aria-label="Scroll to content" className="m3-fab-small">
        <MdKeyboardArrowDown className="h-6 w-6" aria-hidden />
      </a>
    </div>
    </>
  );
};

export default Hero;