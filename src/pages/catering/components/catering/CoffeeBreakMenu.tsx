import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import LazyLoad from "@/components/ui/LazyLoad";
import { ChevronRight, Check } from "lucide-react";
import Shrimmer from "@/components/ui/Shrimmer";

interface CoffeeBreakItem {
 id: number;
 name: string;
 category: string;
 image_url: string | null;
}

interface CoffeeBreakRotation {
 id: number;
 name: string;
 description?: string;
 categories: {
  category: string;
  items: CoffeeBreakItem[];
 }[];
}

interface CoffeeBreakMenuProps {
 selectedMenuItems: { id: string; name: string; course: string }[];
 toggleMenuItem: (item: { id: string; name: string; course: string }) => void;
 handleGoBack: () => void;
 handleContinue: () => void;
 selectedBudget: any;
 selectedEvent: any;
 setSelectedMenuItems: React.Dispatch<
  React.SetStateAction<{ id: string; name: string; course: string }[]>
 >;
 setSelectedMenuDescription: React.Dispatch<
  React.SetStateAction<string | null>
 >;
}

const CoffeeBreakMenu: React.FC<CoffeeBreakMenuProps> = ({
 handleGoBack,
 handleContinue,
 selectedMenuItems,
 toggleMenuItem,
 setSelectedMenuItems,
 setSelectedMenuDescription,
}) => {
 const [rotations, setRotations] = useState<CoffeeBreakRotation[]>([]);
 const [activeRotationId, setActiveRotationId] = useState<number | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 useEffect(() => {
  const fetchRotations = async () => {
   try {
    const response = await axios.get(
     `${baseUrl}/api/catering/coffee-break-rotations/`,
     {
      headers: { Authorization: `Token ${authToken}` },
     }
    );

    // Transform backend data to grouped structure
    const fetchedRotations = response.data.map((rot: any) => {
     const groupedItems: Record<string, CoffeeBreakItem[]> = {};

     rot.items.forEach((item: any) => {
      if (!groupedItems[item.category]) {
       groupedItems[item.category] = [];
      }
      groupedItems[item.category].push({
       id: item.id,
       name: item.name,
       category: item.category,
       image_url: item.image_url,
      });
     });

     return {
      id: rot.id,
      name: rot.name,
      description: rot.description,
      categories: Object.entries(groupedItems)
       .map(([cat, items]) => ({
        category: cat,
        items: items,
       }))
       .sort((a, b) => {
        const getPriority = (title: string) => {
         const lowerTitle = title.toLowerCase();
         if (lowerTitle.includes("salad")) return 1;
         if (lowerTitle.includes("appetizer")) return 2;
         if (lowerTitle.includes("soup")) return 3;
         if (lowerTitle.includes("main course")) return 4;
         if (lowerTitle.includes("dessert") || lowerTitle.includes("desert"))
          return 100;
         if (lowerTitle.includes("beverage") || lowerTitle.includes("drink"))
          return 101;
         return 50;
        };
        return getPriority(a.category) - getPriority(b.category);
       }),
     };
    });

    setRotations(fetchedRotations);
    if (fetchedRotations.length > 0) {
     setActiveRotationId(fetchedRotations[0].id);
    }
    setLoading(false);
   } catch (err) {
    console.error("Error fetching rotations:", err);
    setError("Failed to load coffee break menu.");
    setLoading(false);
   }
  };

  fetchRotations();
 }, [baseUrl, authToken]);

 // Effect to auto-select items when activeRotationId changes
 useEffect(() => {
  if (activeRotationId && rotations.length > 0) {
   const activeRotation = rotations.find((r) => r.id === activeRotationId);
   if (activeRotation) {
    if (activeRotation.description) {
     setSelectedMenuDescription(activeRotation.description);
    } else {
     setSelectedMenuDescription(null);
    }

    const allItems = activeRotation.categories.flatMap((cat) =>
     cat.items.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      course: cat.category,
     }))
    );
    setSelectedMenuItems(allItems);
   }
  }
 }, [
  activeRotationId,
  rotations,
  setSelectedMenuItems,
  setSelectedMenuDescription,
 ]);

 const activeRotation = rotations.find((r) => r.id === activeRotationId);

 if (loading) {
  return (
   <div className="w-full h-[600px] rounded-2xl overflow-hidden">
    <Shrimmer />
   </div>
  );
 }
 if (error) return <div className="p-4 text-red-500">{error}</div>;

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">5</span>
     </div>
     <h2 className="text-primary-text md:text-2xl text-xl font-bold">
      Select Your Coffee Break Rotation
     </h2>
    </div>

    {/* Rotations Tabs / List */}
    <div className="flex overflow-x-auto gap-4 mb-8 pb-2">
     {rotations.map((rotation) => (
      <button
       key={rotation.id}
       onClick={() => setActiveRotationId(rotation.id)}
       className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
        activeRotationId === rotation.id
         ? "bg-[#054A86] text-white font-bold shadow-md"
         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
       }`}>
       Start: {rotation.name}
       {activeRotationId === rotation.id && (
        <Check className="inline-block ml-2 w-4 h-4" />
       )}
      </button>
     ))}
    </div>

    {/* Active Rotation Content */}
    {activeRotation && (
     <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Items Grid */}
      <div className="flex-1 w-full">
       <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#054A86]">
         {activeRotation.name} Items
        </h3>
       </div>

       <div className="flex flex-col gap-8">
        {activeRotation.categories.map((cat, idx) => (
         <div key={idx}>
          <h4 className="text-xl font-semibold mb-4 text-[#2B2B43]">
           {cat.category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {cat.items.map((item) => {
            const itemId = item.id.toString();
            const selected = true; // Always selected

            // Construct image URL (mock or real)
            const imageUrl =
             item.image_url ||
             `https://placehold.co/400x300?text=${encodeURIComponent(
              item.name
             )}`;

            return (
             <div
              key={itemId}
              className={`
                                  cursor-pointer rounded-2xl p-3 transition-all duration-200
                                  border-[#054A86] border-2 bg-[#F5F9FF]
                                `}>
              {/* Image Placeholder */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-200">
               <img
                src={imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
               />
               <div
                className="absolute top-0 left-0 bg-[#8BC34A] text-primary-dark text-[10px] font-bold h-8 w-[75px] flex items-center justify-center rounded-br-[12px]"
                style={{ letterSpacing: "0.5px" }}>
                ADDED
               </div>
              </div>

              <h4 className="font-bold text-[#2B2B43] text-base mb-1">
               {item.name}
              </h4>
             </div>
            );
           })}
          </div>
         </div>
        ))}
       </div>
      </div>

      {/* Right Column: Selected Items Sidebar */}
      <div className="w-full lg:w-[320px] flex-shrink-0">
       <div
        className="bg-white rounded-2xl p-6 sticky top-6"
        style={{
         border: "1px solid #EDEEF2",
         boxShadow: "0px 4px 20px 0px #00000008",
        }}>
        <h3 className="text-xl font-bold text-[#2B2B43] mb-6">
         Selected Items
        </h3>

        <div className="flex flex-col gap-6 mb-8 max-h-[60vh] overflow-y-auto pr-2">
         {/* List items from state to show what is selected */}
         {Object.entries(
          selectedMenuItems.reduce((acc, item) => {
           if (!acc[item.course]) acc[item.course] = [];
           acc[item.course].push(item);
           return acc;
          }, {} as Record<string, typeof selectedMenuItems>)
         ).map(([category, items]) => (
          <div key={category}>
           <h4 className="text-sm font-semibold text-[#545563] mb-2">
            {category}
           </h4>
           <ul className="space-y-1">
            {items.map((item) => (
             <li
              key={item.id}
              className="text-[#2B2B43] text-[14px] leading-[20px] font-[600]">
              {item.name}
             </li>
            ))}
           </ul>
          </div>
         ))}
        </div>

        <div className="flex flex-col gap-3">
         <Button
          onClick={handleContinue}
          disabled={selectedMenuItems.length === 0}
          className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 w-full py-3 h-12 rounded-lg font-semibold shadow-lg shadow-[#4E60FF29] flex items-center justify-center gap-2`}>
          Review Catering Service
         </Button>
         <Button
          onClick={handleGoBack}
          variant="outline"
          className="w-full py-3 h-12 rounded-lg text-[#2B2B43] font-semibold border-[#C7C8D2] hover:bg-gray-50 bg-white">
          Go Back
         </Button>
        </div>
       </div>
      </div>
     </div>
    )}
   </div>
  </LazyLoad>
 );
};

export default CoffeeBreakMenu;
