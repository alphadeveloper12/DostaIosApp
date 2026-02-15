import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import LazyLoad from "@/components/ui/LazyLoad";
import Shrimmer from "@/components/ui/Shrimmer";
import ImageWithShimmer from "@/components/ui/ImageWithShimmer";

interface MenuItem {
 id: string;
 name: string;
 description?: string;
 image_url?: string;
 quantity?: number;
 course?: string; // Transformed from nested structure
}

interface MenuCourse {
 id: string;
 course_name: string;
 items: MenuItem[];
}

interface RamadanMenuSelectionProps {
 selectedServiceStyles: {
  id: number;
  name: string;
  description?: string;
 } | null;
 selectedBudget: {
  id: string | null;
  label: string | null;
  price_range: string | null;
 };
 handleGoBack: () => void;
 handleContinue: () => void;
 setSelectedMenuItems: React.Dispatch<React.SetStateAction<any[]>>;
 setSelectedMenuDescription: React.Dispatch<
  React.SetStateAction<string | null>
 >;
}

const RamadanMenuSelection: React.FC<RamadanMenuSelectionProps> = ({
 selectedServiceStyles,
 selectedBudget,
 handleGoBack,
 handleContinue,
 setSelectedMenuItems,
 setSelectedMenuDescription,
}) => {
 const [menu, setMenu] = useState<any>(null);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken =
  sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

 useEffect(() => {
  const fetchRamadanMenu = async () => {
   try {
    if (!selectedServiceStyles?.id || !selectedBudget?.id) {
     setError("Missing service style or budget selection.");
     setLoading(false);
     return;
    }

    // Fetch menus filtering by service style and budget
    const response = await axios.get(`${baseUrl}/api/catering/ramadan-menus/`, {
     params: {
      service_style_id: selectedServiceStyles.id,
      budget_option_id: selectedBudget.id,
      is_active: true,
     },
     headers: { Authorization: `Token ${authToken}` },
    });

    const menus = response.data;

    if (menus.length > 0) {
     // Get the first matching menu (or user logic if multiple exist)
     // For now, we assume the first one is the target menu.
     // We need to fetch details to get nested items if the list view doesn't provide them.
     // Our backend list view DOES return nested items if `prefetch_related` is used,
     // but let's check the serializer.
     // RamadanMenuListSerializer DOES NOT have requested items.
     // So we need to fetch detail.

     const listMenu = menus[0];

     const detailResponse = await axios.get(
      `${baseUrl}/api/catering/ramadan-menus/${listMenu.id}/`,
      {
       headers: { Authorization: `Token ${authToken}` },
      },
     );

     const fullMenu = detailResponse.data;
     setMenu(fullMenu);
     setSelectedMenuDescription(fullMenu.description);

     // Flatten items for booking summary
     const allItems: any[] = [];
     fullMenu.menu_courses.forEach((course: any) => {
      course.items.forEach((item: any) => {
       allItems.push({
        id: item.id.toString(), // Unique ID from RamadanMenuItem
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        course: course.course_name,
        image_url: item.image_url,
       });
      });
     });

     setSelectedMenuItems(allItems);
    } else {
     setError("No menu found for this selection.");
    }
   } catch (err) {
    console.error("Error fetching Ramadan menu:", err);
    setError("Failed to load menu.");
   } finally {
    setLoading(false);
   }
  };

  fetchRamadanMenu();
 }, [
  baseUrl,
  authToken,
  selectedServiceStyles,
  selectedBudget,
  setSelectedMenuItems,
  setSelectedMenuDescription,
 ]);

 if (loading) {
  return (
   <div className="w-full h-[400px] flex items-center justify-center">
    <Shrimmer />
   </div>
  );
 }

 if (error || !menu) {
  return (
   <div className="flex flex-col items-center justify-center p-8 bg-neutral-white border rounded-2xl">
    <p className="text-red-500 mb-4">{error || "Menu not found"}</p>
    <Button onClick={handleGoBack} variant="outline">
     Go Back
    </Button>
   </div>
  );
 }

 return (
  <LazyLoad>
   <div className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5 w-full border-[#EDEEF2]">
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">5</span>
     </div>
     <div>
      <h2 className="text-primary-text md:text-2xl text-xl font-bold">
       {menu.name}
      </h2>
      {menu.description && (
       <p className="text-neutral-gray text-sm mt-1">{menu.description}</p>
      )}
     </div>
    </div>

    <div className="md:ml-12 flex flex-col gap-8">
     {menu.menu_courses
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      .map((course: any) => (
       <div key={course.id}>
        <h3 className="text-xl font-semibold mb-4 text-[#2B2B43]">
         {course.course_name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {course.items
          ?.sort((a: any, b: any) => a.display_order - b.display_order)
          .map((item: any) => (
           <div
            key={item.id}
            className={`
                                             cursor-pointer rounded-2xl p-3 transition-all duration-200
                                             border-[#054A86] border-2 bg-[#F5F9FF]
                                           `}>
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-200">
             <ImageWithShimmer
              src={
               item.image_url ||
               `/images/catering/lunch-box/${encodeURIComponent(
                item.name,
               ).replace(/%2B/g, "+")}.png`
              }
              alt={item.name}
              className="w-full h-full object-cover"
              wrapperClassName="w-full h-full"
              onError={(e: any) => {
               if (
                !e.target.src.includes("placehold.co") &&
                !e.target.src.includes("Menu+Item")
               ) {
                e.target.src = "https://placehold.co/400x300?text=Menu+Item";
               }
              }}
             />
             <div
              className="absolute top-0 left-0 bg-[#8BC34A] text-primary-dark text-[10px] font-bold h-8 w-[75px] flex items-center justify-center rounded-br-[12px]"
              style={{ letterSpacing: "0.5px" }}>
              INCLUDED
             </div>
            </div>

            <h4 className="font-bold text-[#2B2B43] text-base mb-1">
             {item.name}
            </h4>
            <p className="text-neutral-gray text-[14px] leading-[20px] font-[400]">
             {item.description}
            </p>
            {item.quantity > 1 && (
             <div className="mt-2 text-sm font-semibold text-primary">
              Qty: {item.quantity}
             </div>
            )}
           </div>
          ))}
        </div>
       </div>
      ))}
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
  </LazyLoad>
 );
};

export default RamadanMenuSelection;
