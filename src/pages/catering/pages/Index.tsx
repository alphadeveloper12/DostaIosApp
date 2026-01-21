import Header from "../components/layout/Header";

import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import PromoBanners from "@/components/home/PromoBanners";

import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/home/Newsletter";

const Index = () => {
 return (
  <div className="min-h-screen flex flex-col">
   <Header />

   <main className="flex-1">
    <HeroSection />
    <HowItWorks />
    <PromoBanners />
    <Newsletter />
   </main>

   <Footer />
  </div>
 );
};

export default Index;
