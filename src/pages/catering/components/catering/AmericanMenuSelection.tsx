import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import LazyLoad from "@/components/ui/LazyLoad";
import Shrimmer from "@/components/ui/Shrimmer";
import ImageWithShimmer from "@/components/ui/ImageWithShimmer";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface AmericanMenuItem {
 id: number;
 name: string;
 description: string;
 category: string;
 image_url: string | null;
}

interface AmericanMenu {
 id: number;
 name: string;
 description?: string;
 items: AmericanMenuItem[];
}

interface AmericanMenuSelectionProps {
 selectedMenuItems: { id: string; name: string; course: string }[];
 setSelectedMenuItems: React.Dispatch<
  React.SetStateAction<{ id: string; name: string; course: string }[]>
 >;
 setSelectedMenuDescription: React.Dispatch<
  React.SetStateAction<string | null>
 >;
 handleGoBack: () => void;
 handleContinue: () => void;
}

const AmericanMenuSelection: React.FC<AmericanMenuSelectionProps> = ({
 handleGoBack,
 handleContinue,
 setSelectedMenuItems,
 setSelectedMenuDescription,
}) => {
 const [menus, setMenus] = useState<AmericanMenu[]>([]);
 const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 useEffect(() => {
  const fetchMenus = async () => {
   try {
    const response = await axios.get(
     `${baseUrl}/api/catering/american-menus/`,
     {
      headers: { Authorization: `Token ${authToken}` },
     }
    );
    setMenus(response.data);
    if (response.data.length > 0) {
     setActiveMenuId(response.data[0].id);
    }
    setLoading(false);
   } catch (err) {
    console.error("Error fetching American menus:", err);
    setError("Failed to load menus.");
    setLoading(false);
   }
  };

  fetchMenus();
 }, [baseUrl, authToken]);

 const activeMenu = menus.find((m) => m.id === activeMenuId);

 const handleSelectMenu = () => {
  if (!activeMenu) return;

  // Convert all items in the menu to the selected format
  const menuItems = activeMenu.items.map((item) => ({
   id: item.id.toString(),
   name: item.name,
   course: item.category, // Map category to course
  }));

  setSelectedMenuItems(menuItems);

  if (activeMenu.description) {
   setSelectedMenuDescription(activeMenu.description);
  } else {
   setSelectedMenuDescription(null);
  }

  handleContinue();
 };

 if (loading) {
  return (
   <div className="w-full h-[600px] rounded-2xl overflow-hidden">
    <Shrimmer />
   </div>
  );
 }
 if (error) return <div className="p-4 text-red-500">{error}</div>;

 // Group items for the sidebar list
 const groupedItems = activeMenu
  ? activeMenu.items.reduce((acc, item) => {
     if (!acc[item.category]) acc[item.category] = [];
     acc[item.category].push(item);
     return acc;
    }, {} as Record<string, AmericanMenuItem[]>)
  : {};

 return (
  <LazyLoad>
   <div className="flex flex-col lg:flex-row gap-6 items-start max-w-full">
    {/* Left Column: Menu Display */}
    <div
     className="flex-1 bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5 w-full min-w-0"
     style={{ border: "1px solid #EDEEF2" }}>
     {/* Header */}
     <div className="flex items-center mb-6 gap-4">
      <div
       className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
       style={{ backgroundColor: "hsl(var(--primary))" }}>
       <span className="text-primary-foreground font-bold">6</span>
      </div>
      <h2 className="text-primary-text md:text-2xl text-xl font-bold">
       Select Your American Menu
      </h2>
     </div>

     <h4 className="ml-12 mb-6 text-neutral-gray font-[700] text-[16px] leading-[24px]">
      Please choose one of our curated menus below:
     </h4>

     {/* Menu Tabs */}
     <div className="md:ml-12 flex overflow-x-auto gap-3 mb-8 pb-2 no-scrollbar max-w-full">
      {menus.map((menu) => (
       <button
        key={menu.id}
        onClick={() => setActiveMenuId(menu.id)}
        className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-200 font-semibold text-sm border ${
         activeMenuId === menu.id
          ? "bg-[#054A86] text-white border-[#054A86] shadow-md"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}>
        {menu.name}
       </button>
      ))}
     </div>

     {/* Active Menu Items Grid */}
     {activeMenu && (
      <div className="md:ml-12 flex flex-col gap-8">
       {Object.keys(groupedItems).map((category) => (
        <div key={category}>
         <h3 className="text-xl font-semibold mb-4 text-[#2B2B43]">
          {category}
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupedItems[category].map((item) => (
           <div
            key={item.id}
            className="rounded-2xl border p-3 bg-white border-[#EBEBEB] hover:border-[#C7C8D2] transition-all duration-200">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-200">
             <ImageWithShimmer
              src={
               item.image_url || "https://placehold.co/400x300?text=Menu+Item"
              }
              alt={item.name}
              className={`w-full h-full object-cover ${
               !item.image_url ? "opacity-50" : ""
              }`}
              wrapperClassName="w-full h-full"
             />
             <div
              className="absolute top-0 left-0 bg-[#8BC34A] text-primary-dark text-[10px] font-bold h-8 px-3 flex items-center justify-center rounded-br-[12px]"
              style={{ letterSpacing: "0.5px" }}>
              ADDED
             </div>
            </div>

            <h4 className="font-bold text-[#2B2B43] text-base mb-1">
             {item.name}
            </h4>
            <p className="text-neutral-gray text-[14px] leading-[20px] font-[400]">
             {item.description}
            </p>
           </div>
          ))}
         </div>
        </div>
       ))}
      </div>
     )}

     <div className="flex justify-between mt-8 md:ml-12">
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
     </div>
    </div>

    {/* Right Column: Selected Items Sidebar (Preview) */}
    <div className="w-full lg:w-[320px] flex-shrink-0">
     <div
      className="bg-white rounded-2xl p-6 sticky top-6"
      style={{
       border: "1px solid #EDEEF2",
       boxShadow: "0px 4px 20px 0px #00000008",
      }}>
      <h3 className="text-xl font-bold text-[#2B2B43] mb-6">Menu Preview</h3>

      <div className="flex flex-col gap-6 mb-8 max-h-[60vh] overflow-y-auto pr-2">
       {/* List items to show what user gets */}
       {Object.keys(groupedItems).length === 0 ? (
        <p className="text-gray-400 text-sm">Select a menu to view items.</p>
       ) : (
        Object.entries(groupedItems).map(([category, items]) => (
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
        ))
       )}
      </div>

      <div className="flex flex-col gap-3">
       <Button
        onClick={handleSelectMenu}
        className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 bg-[#054A86] hover:bg-[#043e70] shadow-lg shadow-[#4E60FF29]"
        style={{ height: "48px" }}>
        Select This Menu
       </Button>

       <Button
        onClick={handleGoBack}
        variant="outline"
        className="w-full py-3 rounded-lg text-[#2B2B43] font-semibold border-[#C7C8D2] hover:bg-gray-50 bg-white"
        style={{ height: "48px" }}>
        Go Back
       </Button>
      </div>
     </div>
    </div>
   </div>
  </LazyLoad>
 );
};

export default AmericanMenuSelection;
