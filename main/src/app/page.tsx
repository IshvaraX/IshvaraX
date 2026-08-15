import AppShell from "@/component/nav/AppShell";
import Hero from "@/component/home/Hero";
import FreelanceProjects from "@/component/home/FreelanceProjects";
import GetStarted from "@/component/home/GetStarted";
import Explore from "@/component/home/Explore";
import Pinaka from "@/component/home/Pinaka";
import Footer from "@/component/home/Footer";
import { HomeSearchProvider } from "@/context/HomeSearchContext";

const Home = () => {
  return (
    <AppShell>
      <HomeSearchProvider>
        <Hero />
        <FreelanceProjects />
      </HomeSearchProvider>
      <GetStarted />
      <Explore />
      <Pinaka />
      <Footer />
    </AppShell>
  );
};

export default Home;