import Navbar from "@/component/nav/Navbar";
import SectionGrid from "@/component/home/Grid";
import Hero from "@/component/home/Hero";
import Founders from "@/component/home/Founders";
import Footer from "@/component/home/Footer";
import SiteContent from "@/app/section.json";

import { GiBrain, GiProcessor } from "react-icons/gi";
import {
  FaHandshake,
  FaShieldAlt,
  FaRocket,
  FaHeart,
  FaBullseye,
  FaFlask,
} from "react-icons/fa";

const sectionIcons = {
  pinaka: <GiBrain className="w-8 h-8" />,
  core_mission: <FaBullseye className="w-8 h-8" />,
  social_mission: <FaHandshake className="w-8 h-8" />,
  technology: <GiProcessor className="w-8 h-8" />,
  janseva: <FaHeart className="w-8 h-8" />,
  research: <FaFlask className="w-8 h-8" />,
  ethics: <FaShieldAlt className="w-8 h-8" />,
  future: <FaRocket className="w-8 h-8" />,
};

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <main className="bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]">
        {Object.entries(SiteContent).map(([key, section], index) => {
          const icon = sectionIcons[key as keyof typeof sectionIcons];
          const totalSections = Object.keys(SiteContent).length;
          const hue = Math.round(((index * 250)*2) / totalSections);

          return (
            <SectionGrid
              key={key}
              icon={icon}
              sectionTitle={section.title}
              cards={section.cards}
              hue={hue}
              id={key}
            />
          );
        })}
      </main>
      <Founders />
      <Footer />
    </>
  );
};

export default Home;
