
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/vending_home/HeroSection";
import SliderSection from "@/components/vending_home/SliderSection";
import GetApp from "@/components/vending_home/GetApp";
import Newsletter from "@/components/home/Newsletter";
import Header from "./catering/components/layout/Header";
import MobileFooterNav from "@/components/home/MobileFooterNav";

const VendingHome = () => {
 return (
  <div className="min-h-screen flex flex-col">
   <Header />

   <main className="bg-white">
    <HeroSection />
    <SliderSection />
    <GetApp />
    <Newsletter />

    
   </main>
    <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default VendingHome;
