import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import RefundPolicyContent from "@/components/refundpolicy/RefundPolicyContent";

const RefundPolicy = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <RefundPolicyContent />
   </main>

   <Footer />
  </div>
 );
};

export default RefundPolicy;
