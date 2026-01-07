import React, { useEffect, useState } from "react";
import axios from "axios";
import Shrimmer from "@/components/ui/Shrimmer";
import { Button } from "@/components/ui/button";

interface PlatterItem {
 id: number;
 name: string;
 description: string;
 image_url: string | null;
}

interface PlatterMenuProps {
 selectedMenuItems: { id: string; name: string; course: string }[];
 toggleMenuItem: (item: { id: string; name: string; course: string }) => void;
 handleGoBack: () => void;
 handleContinue: () => void;
}

const PlatterMenu: React.FC<PlatterMenuProps> = ({
 selectedMenuItems,
 toggleMenuItem,
 handleGoBack,
 handleContinue,
}) => {
 const [platters, setPlatters] = useState<PlatterItem[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 useEffect(() => {
  const fetchPlatters = async () => {
   try {
    const response = await axios.get(`${baseUrl}/api/catering/platter-items/`, {
     headers: { Authorization: `Token ${authToken}` },
    });
    setPlatters(response.data);
    setLoading(false);
   } catch (err) {
    setError("Failed to load platter menu.");
    setLoading(false);
   }
  };
  fetchPlatters();
 }, [baseUrl, authToken]);

 if (loading) {
  return (
   <div className="w-full h-[600px] rounded-2xl overflow-hidden">
    <Shrimmer />
   </div>
  );
 }
 if (error)
  return <div className="text-red-500 text-center py-10">{error}</div>;

 return (
  <div className="animate-fade-in-up">
   <div
    className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 mb-6"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">5</span>
     </div>
     <div>
      <h2 className="text-primary-text md:text-2xl text-xl font-bold">
       Platter Menu
      </h2>
      <p className="text-neutral-gray text-sm font-bold mt-1">
       Each Platter is good for 10 People / Price Starting from 600AED as
       Minimum
      </p>
     </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {platters.map((item) => {
      const itemId = `platter-${item.id}`;
      const isSelected = selectedMenuItems.some((i) => i.id === itemId);

      return (
       <div
        key={item.id}
        onClick={() =>
         toggleMenuItem({ id: itemId, name: item.name, course: "Platter" })
        }
        className={`
         cursor-pointer rounded-2xl border p-3 transition-all duration-200
         ${
          isSelected
           ? "border-[#054A86] border-2 bg-[#F5F9FF]"
           : "border-[#EBEBEB] bg-white hover:border-[#C7C8D2]"
         }
        `}>
        {/* Image Placeholder */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-200">
         <img
          src={item.image_url || "https://placehold.co/400x300?text=Platter"}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
           (e.target as HTMLImageElement).src =
            "https://placehold.co/400x300?text=Menu+Item"; // Fallback
          }}
         />
         {isSelected && (
          <div
           className="absolute top-0 left-0 bg-[#8BC34A] text-primary-dark text-[10px] font-bold h-8 w-[75px] flex items-center justify-center rounded-br-[12px]"
           style={{ letterSpacing: "0.5px" }}>
           ADDED
          </div>
         )}
        </div>

        <h4 className="font-bold text-[#2B2B43] text-base mb-1">{item.name}</h4>
        <p className="text-neutral-gray text-[14px] leading-[20px] font-[400]">
         {item.description}
        </p>
       </div>
      );
     })}
    </div>
   </div>

   <div className="flex justify-between mt-8">
    <Button
     onClick={handleGoBack}
     style={{
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "700",
      color: "#054A86",
      border: "1px solid #054A86",
      backgroundColor: "#fff",
     }}>
     Go Back
    </Button>
    <Button
     onClick={handleContinue}
     className="bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70"
     style={{
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "0px 8px 20px 0px #4E60FF29",
     }}>
     Continue
    </Button>
   </div>
  </div>
 );
};

export default PlatterMenu;
