import React, { useEffect, useState } from "react";
import axios from "axios";
import Shrimmer from "@/components/ui/Shrimmer";
import ImageWithShimmer from "@/components/ui/ImageWithShimmer";
import { Button } from "@/components/ui/button";

// Using Button from ui/button as requested (like Step 2, 3, 4)

interface LiveStationItem {
 id: number;
 name: string;
 price: number;
 setup: string;
 ingredients: string;
 image_url: string | null;
}

interface LiveStationMenuProps {
 selectedMenuItems: {
  id: string;
  name: string;
  course: string;
  price?: number;
 }[];
 toggleMenuItem: (item: {
  id: string;
  name: string;
  course: string;
  price?: number;
 }) => void;
 handleGoBack: () => void;
 handleContinue: () => void;
}

const LiveStationMenu: React.FC<LiveStationMenuProps> = ({
 selectedMenuItems,
 toggleMenuItem,
 handleGoBack,
 handleContinue,
}) => {
 const [items, setItems] = useState<LiveStationItem[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 useEffect(() => {
  const fetchItems = async () => {
   try {
    const response = await axios.get(
     `${baseUrl}/api/catering/live-station-items/`,
     {
      headers: { Authorization: `Token ${authToken}` },
     }
    );
    setItems(response.data);
    setLoading(false);
   } catch (err) {
    setError("Failed to load live station menu.");
    setLoading(false);
   }
  };
  fetchItems();
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
       Live Station Menu
      </h2>
      <p className="text-neutral-gray text-sm font-bold mt-1">
       Minimum of 10 Pax
      </p>
     </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {items.map((item) => {
      const itemId = `live-${item.id}`;
      const isSelected = selectedMenuItems.some((i) => i.id === itemId);

      return (
       <div
        key={item.id}
        onClick={() => {
         // Toggle existing one on/off or add new one
         toggleMenuItem({
          id: `live-${item.id}`,
          name: item.name,
          course: "Live Station",
          // @ts-ignore
          description: item.description,
          price: Number(item.price),
         });
        }}
        className={`
                    cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col h-full
                    ${
                     isSelected
                      ? "border-[#054A86] border-2 bg-[#F5F9FF]"
                      : "border-[#EBEBEB] bg-white hover:border-[#C7C8D2]"
                    }
                  `}>
        {/* Image Placeholder */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-200">
         <ImageWithShimmer
          src={
           item.image_url || "https://placehold.co/400x300?text=Live+Station"
          }
          alt={item.name}
          className="w-full h-full object-cover"
          wrapperClassName="w-full h-full"
          onError={(e: any) => {
           (e.target as HTMLImageElement).src =
            "https://placehold.co/400x300?text=Live+Station"; // Fallback
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

        <div className="flex justify-between items-start mb-2">
         <h4 className="font-bold text-[#2B2B43] text-lg">{item.name}</h4>
         <span className="font-bold text-primary text-sm whitespace-nowrap">
          {item.price} AED / per head
         </span>
        </div>

        <div className="flex-1 space-y-2 mb-2">
         <div>
          <span className="font-semibold text-xs text-neutral-dark uppercase tracking-wide">
           Setup:
          </span>
          <p className="text-sm text-neutral-gray leading-tight mt-0.5">
           {item.setup}
          </p>
         </div>
         <div>
          <span className="font-semibold text-xs text-neutral-dark uppercase tracking-wide">
           Ingredients:
          </span>
          <p className="text-sm text-neutral-gray leading-tight mt-0.5">
           {item.ingredients}
          </p>
         </div>
        </div>
       </div>
      );
     })}
    </div>
   </div>

   {/* Navigation Footer */}
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

export default LiveStationMenu;
