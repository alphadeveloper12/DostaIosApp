import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BreadCrumb from "../components/home/BreadCrumb";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const TradeLicenses = () => {
 const licenses = [
  {
   id: 1,
   title: "Dosta Vending",
   description: "Official Trade License for our automated vending operations.",
   file: "/licenses/dosta_vending.pdf",
  },
  {
   id: 2,
   title: "Dosta Catering",
   description:
    "Certified documentation for our specialized catering services.",
   file: "/licenses/dosta_catering.pdf",
  },
  {
   id: 3,
   title: "Dosta for Events",
   description: "Authorized license for complete event food management.",
   file: "/licenses/dosta_events.pdf",
  },
 ];

 const handleOpenPdf = (fileUrl: string) => {
  window.open(fileUrl, "_blank");
 };

 return (
  <div className="flex flex-col min-h-screen bg-gray-50">
   <Header />

   <main className="flex-grow">
    {/* Hero Section */}
    <div className="bg-primary text-white py-16">
     <div className="main-container text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
       Trade Licenses
      </h1>
      <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
       Transparency and compliance are at the core of our operations. View our
       official trade licenses below.
      </p>
     </div>
    </div>

    {/* Breadcrumb & Content */}
    <div className="main-container py-8">
     <BreadCrumb />

     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 mb-20">
      {licenses.map((license) => (
       <div
        key={license.id}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-gray-100 group">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
         <FileText className="w-10 h-10 text-primary" />
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">
         {license.title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
         {license.description}
        </p>

        <Button
         onClick={() => handleOpenPdf(license.file)}
         className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg w-full flex items-center justify-center gap-2 group-hover:-translate-y-1 transition-transform duration-300">
         <span className="font-semibold">View License</span>
         <Download className="w-5 h-5" />
        </Button>
       </div>
      ))}
     </div>
    </div>
   </main>

   <Footer />
  </div>
 );
};

export default TradeLicenses;
