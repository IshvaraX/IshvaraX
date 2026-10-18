"use client";

import { useAuth } from "@/context/AuthContext";
import Hero from "@/component/home/Hero";
import Roadmap from "@/component/home/Roadmap";
import ProjectSearch from "@/component/home/ProjectSearch";
import FreelanceProjects from "@/component/home/FreelanceProjects";
import LatestContent from "@/component/home/LatestContent";
import Team from "@/component/home/Team";
import Pinaka from "@/component/home/Pinaka";
import Footer from "@/component/home/Footer";
import { HomeSearchProvider } from "@/context/HomeSearchContext";

/**
 * Home page body, laid out like m3.material.io: a full-width hero pair of
 * panels, then headline + tile-grid sections in a centred column.
 */
const HomeView = () => {
  const { user, isReady } = useAuth();

  // Avoid flashing the wrong copy before auth state is known.
  if (!isReady) return null;

  return (
    <HomeSearchProvider>
      <Hero />
      <main className="mx-auto w-full max-w-[1320px] px-5 pb-24 md:px-12 xl:px-[88px]">
        {!user && <Roadmap />}
        <ProjectSearch />
        <FreelanceProjects />
        <LatestContent />
        <Team />
        <Pinaka />
      </main>
      <Footer />
    </HomeSearchProvider>
  );
};

export default HomeView;
