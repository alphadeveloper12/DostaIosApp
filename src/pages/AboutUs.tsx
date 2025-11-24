import AboutUsContent from "@/components/about/AboutUsContent";
// import MobileFooterNav from "@/components/home/MobileFooterNav";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const AboutUs = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <AboutUsContent />
   </main>
   {/* <MobileFooterNav /> */}
   <Footer />
  </div>
 );
};

export default AboutUs;
