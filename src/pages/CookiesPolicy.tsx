import CookiesPolicyContent from "@/components/cookiesPolicy/CookiesPolicyContent";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const CookiesPolicy = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <CookiesPolicyContent />
   </main>

   <Footer />
  </div>
 );
};

export default CookiesPolicy;
