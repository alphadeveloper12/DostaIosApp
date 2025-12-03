import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import PortfolioContent from "@/components/portfolio/PortfolioContent";

const Portfolio = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <PortfolioContent />
   </main>
   <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default Portfolio;
