import Navbar from "@/component/nav/Navbar"
import SectionGrid from "@/component/home/Grid"
import Hero from "@/component/home/Hero"
import Founders from "@/component/home/Founders"
import Footer from "@/component/home/Footer"
import SiteContent from "@/app/section.json"

import { GiBrain, GiProcessor } from "react-icons/gi"
import { FaHandshake, FaShieldAlt, FaRocket, FaHeart, FaBullseye, FaFlask } from "react-icons/fa"

const sectionIcons = {
  pinaka: <GiBrain className="w-8 h-8" />,
  core_mission: <FaBullseye className="w-8 h-8" />,
  social_mission: <FaHandshake className="w-8 h-8" />,
  technology: <GiProcessor className="w-8 h-8" />,
  janseva: <FaHeart className="w-8 h-8" />,
  research: <FaFlask className="w-8 h-8" />,
  ethics: <FaShieldAlt className="w-8 h-8" />,
  future: <FaRocket className="w-8 h-8" />,
}

const Home = () => {
  const sectionsWithBg = ['technology', 'research', 'ethics']
  
  return (
    <>
      <Navbar />
      <Hero />
      <main className="bg-white dark:bg-black">
        
        {Object.entries(SiteContent).map(([key, section], index) => {
          const icon = sectionIcons[key as keyof typeof sectionIcons]
          
          // Calculate hue based on index - evenly distribute colors
          const totalSections = Object.keys(SiteContent).length
          const hue = Math.round((index * 360) / totalSections)
          
          return (
            <div 
              key={key} 
              className={
                sectionsWithBg.includes(key) 
                  ? "bg-zinc-50 dark:bg-zinc-950" 
                  : ""
              }
            >
              <SectionGrid
                icon={icon}
                sectionTitle={section.title}
                cards={section.cards}
                hue={hue}
                id={key}
              />
            </div>
          )
        })}
        
        <Founders />
        <Footer />
      </main>
    </>
  )
}

export default Home