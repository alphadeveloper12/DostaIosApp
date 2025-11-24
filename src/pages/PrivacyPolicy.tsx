import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PrivacyPolicyContent from "@/components/privayPolicy/PrivacyPolicyContent";
import React from "react";

const PrivacyPolicy = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <PrivacyPolicyContent />
   </main>

   <Footer />
  </div>
 );
};

export default PrivacyPolicy;
