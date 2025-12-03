import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import ServicesContent from "@/components/services/ServicesContent";

const Services = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <ServicesContent /> 
   </main>
   <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default Services;
