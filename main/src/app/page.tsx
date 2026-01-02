import Navbar from "@/component/nav/Navbar"
import Hero from "@/component/home/Hero"
import Mission from "@/component/home/Mission"
import Technology from "@/component/home/Technology"
import JanSeva from "@/component/home/JanSeva"
import Ethics from "@/component/home/Ethics"
import Footer from "@/component/home/Footer"

const Home = () => {
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-black">
        <Hero />
        <Mission />
        <Technology />
        <JanSeva />
        <Ethics />
        <Footer />
      </main>
    </>
  )
}

export default Home
