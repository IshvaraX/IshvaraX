import Link from "next/link";
import { FaUserPlus, FaLaptopCode, FaRocket } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus className="w-6 h-6" />,
    accent: "g-icon-blue",
    title: "1 · Register",
    description:
      "Create your freelancer account in minutes and tell us about the skills you love to build with.",
    href: "/register",
    cta: "Create account",
  },
  {
    icon: <FaLaptopCode className="w-6 h-6" />,
    accent: "g-icon-red",
    title: "2 · Pick a project",
    description:
      "Browse open projects and apply to the ones that excite you the most.",
    href: "/projects",
    cta: "Browse projects",
  },
  {
    icon: <FaRocket className="w-6 h-6" />,
    accent: "g-icon-green",
    title: "3 · Learn & grow",
    description:
      "Collaborate, learn, and grow with a community that loves to code.",
    href: "/register",
    cta: "Get started",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="g-contained g-contained-yellow p-6 md:p-12">
          <div className="mb-10 max-w-2xl">
            <span className="g-label block mb-2">How it works</span>
            <h2 className="g-heading-lg mb-3">Become a contributor</h2>
            <p className="g-body">
              New to the community? Here&apos;s how you go from your first commit
              to shipping work that matters.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="g-card flex flex-col">
                <div className={`g-icon ${step.accent} mb-4`}>{step.icon}</div>
                <h3 className="g-heading-sm mb-2">{step.title}</h3>
                <p className="g-body flex-1">{step.description}</p>
                <Link href={step.href} className="g-link mt-4">
                  {step.cta} <span className="arrow">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
