import React, { useEffect, useState } from "react";
import axios from "axios";
import Shrimmer from "@/components/ui/Shrimmer";
import { Button } from "@/components/ui/button";

interface CanapeItem {
 id: number;
 name: string;
 category: string;
 image_url: string | null;
}

interface CanapeMenuProps {
 selectedMenuItems: { id: string; name: string; course: string }[];
 toggleMenuItem: (item: { id: string; name: string; course: string }) => void;
 handleGoBack: () => void;
 handleContinue: () => void;
 selectedBudget: {
  id: string | null;
  label: string | null;
  price_range: string | null;
 };
}

const CanapeMenu: React.FC<CanapeMenuProps> = ({
 selectedMenuItems,
 toggleMenuItem,
 handleGoBack,
 handleContinue,
 selectedBudget,
}) => {
 const [items, setItems] = useState<CanapeItem[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 useEffect(() => {
  const fetchItems = async () => {
   try {
    const response = await axios.get(`${baseUrl}/api/catering/canape-items/`, {
     headers: { Authorization: `Token ${authToken}` },
    });
    setItems(response.data);
    setLoading(false);
   } catch (err) {
    setError("Failed to load canape menu.");
    setLoading(false);
   }
  };
  fetchItems();
 }, [baseUrl, authToken]);

 const getConstraints = () => {
  const price = selectedBudget.price_range
   ? parseInt(selectedBudget.price_range.match(/\d+/)?.[0] || "0")
   : 0;
  if (price >= 135) return { food: 12, coldBev: 2, hotBev: 2 };
  if (price >= 120) return { food: 10, coldBev: 2, hotBev: 2 };
  if (price >= 100) return { food: 8, coldBev: 1, hotBev: 1 };
  if (price >= 85) return { food: 5, coldBev: 1, hotBev: 1 };
  return { food: 3, coldBev: 1, hotBev: 1 }; // Default for 70 and others
 };

 const constraints = getConstraints();

 if (loading) {
  return (
   <div className="w-full h-[600px] rounded-2xl overflow-hidden">
    <Shrimmer />
   </div>
  );
 }
 if (error)
  return <div className="text-red-500 text-center py-10">{error}</div>;

 // Group items by category
 const groupedItems: Record<string, CanapeItem[]> = {
  Cold: [],
  Hot: [],
  Arabic: [],
  Sweet: [],
  Vegetarian: [],
  "Cold Beverages": [],
  "Hot Beverages": [],
 };

 items.forEach((item) => {
  if (groupedItems[item.category]) {
   groupedItems[item.category].push(item);
  } else {
   // Fallback just in case
   if (!groupedItems[item.category]) groupedItems[item.category] = [];
   groupedItems[item.category].push(item);
  }
 });

 const categoriesOrder = [
  "Cold",
  "Hot",
  "Arabic",
  "Sweet",
  "Vegetarian",
  "Cold Beverages",
  "Hot Beverages",
 ];

 const handleItemClick = (item: CanapeItem, category: string) => {
  const itemId = `canape-${item.id}`;
  const isSelected = selectedMenuItems.some((i) => i.id === itemId);

  if (isSelected) {
   toggleMenuItem({
    id: itemId,
    name: item.name,
    course: category + " Canape",
   });
   return;
  }

  // Check constraints
  const currentSelections = selectedMenuItems.filter(
   (i) => i.course === category + " Canape"
  ).length;
  let limit = constraints.food;
  if (category === "Cold Beverages") limit = constraints.coldBev;
  if (category === "Hot Beverages") limit = constraints.hotBev;

  if (currentSelections >= limit) {
   alert(`You can only select ${limit} items from ${category}.`);
   return;
  }

  toggleMenuItem({ id: itemId, name: item.name, course: category + " Canape" });
 };

 return (
  <div className="animate-fade-in-up">
   <div
    className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 mb-6"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex flex-col gap-4 mb-6">
     <div className="flex items-center gap-4">
      <div
       className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
       style={{ backgroundColor: "hsl(var(--primary))" }}>
       <span className="text-primary-foreground font-bold">5</span>
      </div>
      <div>
       <h2 className="text-primary-text md:text-2xl text-xl font-bold">
        Canape Selection
       </h2>
       <p className="text-neutral-gray text-sm font-bold mt-1">
        Select your preferred canapes
       </p>
      </div>
     </div>

     {/* Instruction Banner */}
     <div className="bg-[#EAF5FF] border border-[#054A86] p-4 rounded-xl text-[#054A86]">
      <p className="font-bold mb-1">
       Based on your budget ({selectedBudget.price_range}):
      </p>
      <ul className="list-disc list-inside text-sm font-medium">
       <li>
        Choose <strong>{constraints.food}</strong> from Each Food Category
        (Cold, Hot, Arabic, Sweet, Vegetarian)
       </li>
       <li>
        Choose <strong>{constraints.coldBev}</strong> Cold Beverage(s)
       </li>
       <li>
        Choose <strong>{constraints.hotBev}</strong> Hot Beverage(s)
       </li>
      </ul>
     </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-6">
     {/* Left Side: Menu Items */}
     <div className="flex-1 w-full">
      <div className="flex flex-col gap-8">
       {categoriesOrder.map(
        (category) =>
         groupedItems[category] &&
         groupedItems[category].length > 0 && (
          <div key={category}>
           <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-xl font-semibold text-[#2B2B43]">
             {category} Canapes
            </h3>
            <span className="text-sm font-bold text-[#054A86]">
             Selected:{" "}
             {
              selectedMenuItems.filter((i) => i.course === category + " Canape")
               .length
             }{" "}
             /{" "}
             {category.includes("Beverages")
              ? category.includes("Cold")
                ? constraints.coldBev
                : constraints.hotBev
              : constraints.food}
            </span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedItems[category].map((item) => {
             const itemId = `canape-${item.id}`;
             const isSelected = selectedMenuItems.some((i) => i.id === itemId);

             return (
              <div
               key={item.id}
               onClick={() => handleItemClick(item, category)}
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
                 src={
                  item.image_url || "https://placehold.co/400x300?text=Canape"
                 }
                 alt={item.name}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                  (e.target as HTMLImageElement).src =
                   "https://placehold.co/400x300?text=Canape"; // Fallback
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

               <h4 className="font-bold text-[#2B2B43] text-base mb-1">
                {item.name}
               </h4>
              </div>
             );
            })}
           </div>
          </div>
         )
       )}
      </div>
     </div>

     {/* Right Side: Sidebar */}
     <div className="w-full lg:w-[320px] flex-shrink-0">
      <div
       className="bg-white rounded-2xl p-6 sticky top-24"
       style={{
        border: "1px solid #EDEEF2",
        boxShadow: "0px 4px 20px 0px #00000008",
       }}>
       <h3 className="text-xl font-bold text-[#2B2B43] mb-6">Selected Items</h3>

       <div className="flex flex-col gap-6 mb-8 max-h-[60vh] overflow-y-auto pr-2">
        {/* List items from state to show what is selected */}
        {selectedMenuItems.length > 0 ? (
         Object.entries(
          selectedMenuItems.reduce((acc, item) => {
           // We only want to show Canape related items here, or everything?
           // Usually just the items for this step or all items.
           // User asked "same as other menus", typically showing all selections is helpful.
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
         ))
        ) : (
         <p className="text-gray-500 text-sm">No items selected yet.</p>
        )}
       </div>

       <div className="flex flex-col gap-3">
        <Button
         onClick={handleContinue}
         className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 w-full py-3 h-12 rounded-lg font-semibold shadow-lg shadow-[#4E60FF29] flex items-center justify-center gap-2`}>
         Continue
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
   </div>
  </div>
 );
};

export default CanapeMenu;
