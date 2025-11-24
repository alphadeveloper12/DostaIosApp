import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TermsContent from "@/components/terms/TermsContent";

const Terms = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <TermsContent />
   </main>

   <Footer />
  </div>
 );
};

export default Terms;
