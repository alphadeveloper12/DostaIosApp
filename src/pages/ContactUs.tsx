import ContactUsContent from "@/components/contact/ContactUsContent";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import React from "react";

const ContactUs = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <ContactUsContent />
   </main>

   <Footer />
  </div>
 );
};

export default ContactUs;
