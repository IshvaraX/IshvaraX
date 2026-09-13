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
import BackgroundDecor from "@/component/ui/BackgroundDecor";
import { HomeSearchProvider } from "@/context/HomeSearchContext";

/**
 * Home page body. Visitors get the marketing hero + roadmap; signed-in members
 * get a dashboard-style view with an icon rail and the project search up top.
 */
const HomeView = () => {
  const { user, isReady } = useAuth();

  // Avoid flashing the wrong layout before auth state is known.
  if (!isReady) return null;

  if (user) {
    return (
      <>
        <HomeSearchProvider>
          <ProjectSearch hero />
          <FreelanceProjects />
        </HomeSearchProvider>
        <LatestContent />
        <Team />
        <Pinaka />
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Decorative symbols/grid span only the hero + timeline */}
      <div className="relative overflow-hidden">
        <BackgroundDecor />
        <Hero />
        <Roadmap />
      </div>
      <HomeSearchProvider>
        <ProjectSearch />
        <FreelanceProjects />
      </HomeSearchProvider>
      <LatestContent />
      <Team />
      <Pinaka />
      <Footer />
    </>
  );
};

export default HomeView;
