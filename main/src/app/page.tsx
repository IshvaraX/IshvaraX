import AppShell from "@/component/nav/AppShell";
import Hero from "@/component/home/Hero";
import Roadmap from "@/component/home/Roadmap";
import FreelanceProjects from "@/component/home/FreelanceProjects";
import LatestContent from "@/component/home/LatestContent";
import Team from "@/component/home/Team";
import Pinaka from "@/component/home/Pinaka";
import Footer from "@/component/home/Footer";
import BackgroundDecor from "@/component/ui/BackgroundDecor";
import { HomeSearchProvider } from "@/context/HomeSearchContext";

const Home = () => {
  return (
    <AppShell>
      {/* Decorative symbols/grid span only the hero + timeline */}
      <div className="relative overflow-hidden">
        <BackgroundDecor />
        <Hero />
        <Roadmap />
      </div>
      <HomeSearchProvider>
        <FreelanceProjects />
      </HomeSearchProvider>
      <LatestContent />
      <Team />
      <Pinaka />
      <Footer />
    </AppShell>
  );
};

export default Home;