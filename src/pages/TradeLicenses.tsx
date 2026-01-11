import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BreadCrumb from "../components/home/BreadCrumb";
import { FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import LicenseViewerModal from "@/components/common/LicenseViewerModal";

const TradeLicenses = () => {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedImages, setSelectedImages] = useState<string[]>([]);
 const [selectedTitle, setSelectedTitle] = useState("");

 const licenses = [
  {
   id: 1,
   title: "Dosta Vending",
   description: "Official Trade License for our automated vending operations.",
   images: [
    "/licenses/vending1.png",
    "/licenses/vending2.png",
    "/licenses/vending3.png",
    "/licenses/vending4.png",
    "/licenses/vending5.png",
   ],
   file: null, // Removed PDF link
  },
  {
   id: 2,
   title: "Dosta Catering",
   description:
    "Certified documentation for our specialized catering services.",
   images: [
    "/licenses/TradeL1.png",
    "/licenses/TradeL2.png",
    "/licenses/TradeL3.png",
    "/licenses/TradeL4.png",
    "/licenses/TradeL5.png",
   ],
   file: null,
  },
  {
   id: 3,
   title: "Dosta for Events",
   description: "Authorized license for complete event food management.",
   images: [
    "/licenses/event1.png",
    "/licenses/event2.png",
    "/licenses/event3.png",
    "/licenses/event4.png",
   ],
   file: null,
  },
 ];

 const handleViewLicense = (license: (typeof licenses)[0]) => {
  if (license.images && license.images.length > 0) {
   setSelectedImages(license.images);
   setSelectedTitle(license.title);
   setIsModalOpen(true);
  } else {
   // Fallback or alert if no images are available
   // alert("License preview not available.");
  }
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
         onClick={() => handleViewLicense(license)}
         disabled={!license.images || license.images.length === 0}
         className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg w-full flex items-center justify-center gap-2 group-hover:-translate-y-1 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
         <span className="font-semibold">
          {license.images && license.images.length > 0
           ? "View License"
           : "Not Available"}
         </span>
         {license.images && license.images.length > 0 && (
          <Eye className="w-5 h-5" />
         )}
        </Button>
       </div>
      ))}
     </div>
    </div>
   </main>

   <Footer />

   <LicenseViewerModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    images={selectedImages}
    title={selectedTitle}
   />
  </div>
 );
};

export default TradeLicenses;
