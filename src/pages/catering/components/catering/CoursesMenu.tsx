import React from "react";
import { Button } from "../ui/button";
import LazyLoad from "@/components/ui/LazyLoad";
import { Check } from "lucide-react";

// Dummy Data for Menu Courses and Items
const MENU_COURSES = [
 {
  id: "course-1",
  title: "Course 1",
  items: [
   {
    id: "c1-i1",
    name: "Menu item 1",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 50",
   },
   {
    id: "c1-i2",
    name: "Menu item 2",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 50",
   },
   {
    id: "c1-i3",
    name: "Menu item 3",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 50",
   },
  ],
 },
 {
  id: "course-2",
  title: "Course 2",
  items: [
   {
    id: "c2-i1",
    name: "Menu item 1",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 60",
   },
   {
    id: "c2-i2",
    name: "Menu item 2",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 60",
   },
   {
    id: "c2-i3",
    name: "Menu item 3",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 60",
   },
   {
    id: "c2-i4",
    name: "Menu item 4",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 60",
   },
   {
    id: "c2-i5",
    name: "Menu item 5",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 60",
   },
   {
    id: "c2-i6",
    name: "Menu item 6",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 60",
   },
  ],
 },
 {
  id: "course-3",
  title: "Course 3",
  items: [
   {
    id: "c3-i1",
    name: "Menu item 1",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 40",
   },
   {
    id: "c3-i2",
    name: "Menu item 2",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 40",
   },
   {
    id: "c3-i3",
    name: "Menu item 3",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 40",
   },
   {
    id: "c3-i4",
    name: "Menu item 4",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 40",
   },
   {
    id: "c3-i5",
    name: "Menu item 5",
    description:
     "Ea his sensbus molli eleifend, iudica bit Et cum omittantur id mel.",
    image: "/images/vending_home/food.svg", // Placeholder
    price: "AED 40",
   },
  ],
 },
];

interface MenuItem {
 id: string;
 name: string;
 course: string;
 price: string;
}

interface CoursesMenuProps {
 selectedMenuItems: MenuItem[];
 toggleMenuItem: (item: MenuItem) => void;
 handleGoBack: () => void;
 handleContinue: () => void;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({
 selectedMenuItems,
 toggleMenuItem,
 handleGoBack,
 handleContinue,
}) => {
 // Helper to check if an item is selected
 const isSelected = (itemId: string) =>
  selectedMenuItems.some((item) => item.id === itemId);

 // Group selected items by course for the sidebar
 const groupedSelectedItems = selectedMenuItems.reduce((acc, item) => {
  if (!acc[item.course]) {
   acc[item.course] = [];
  }
  acc[item.course].push(item);
  return acc;
 }, {} as Record<string, MenuItem[]>);

 return (
  <LazyLoad>
   <div className="flex flex-col lg:flex-row gap-6 items-start">
    {/* Left Column: Menu Courses and Items */}
    <div
     className="flex-1 bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5 w-full"
     style={{ border: "1px solid #EDEEF2" }}>
     <div className="flex items-center mb-6 gap-4">
      <div
       className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
       style={{ backgroundColor: "hsl(var(--primary))" }}>
       <span className="text-primary-foreground font-bold">7</span>
      </div>
      <h2 className="text-primary-text md:text-2xl text-xl font-bold">
       Menu options based on your selections and budget
      </h2>
     </div>
     <h4 className="ml-12 mb-6 text-neutral-gray font-[700] text-[16px] leading-[24px]">
      Select menu items from your selected courses below:
     </h4>

     <div className="md:ml-12 flex flex-col gap-8">
      {MENU_COURSES.map((course) => (
       <div key={course.id}>
        <h3 className="text-xl font-semibold mb-4 text-[#2B2B43]">
         {course.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {course.items.map((item) => {
          const selected = isSelected(item.id);
          return (
           <div
            key={item.id}
            onClick={() =>
             toggleMenuItem({
              id: item.id,
              name: item.name,
              course: course.title,
              price: item.price,
             })
            }
            className={`
                              cursor-pointer rounded-2xl border p-3 transition-all duration-200
                              ${
                               selected
                                ? "border-[#054A86] border-2 bg-[#F5F9FF]"
                                : "border-[#EBEBEB] bg-white hover:border-[#C7C8D2]"
                              }
                            `}>
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-200">
             {/* Replace with actual image logic/component if available */}
             <img
              src={item.image} // Use dummy image
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
               (e.target as HTMLImageElement).src =
                "https://placehold.co/400x300?text=Menu+Item"; // Fallback
              }}
             />
             {selected && (
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
            <p className="text-neutral-gray text-[14px] leading-[20px] font-[400]">
             {item.description}
            </p>
           </div>
          );
         })}
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
       disabled={!selectedMenuItems.length}
       className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
        !selectedMenuItems.length ? "cursor-not-allowed" : ""
       }`}
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

    {/* Right Column: Selected Items Sidebar */}
    <div className="w-full lg:w-[320px] flex-shrink-0">
     <div
      className="bg-white rounded-2xl p-6 sticky top-6"
      style={{
       border: "1px solid #EDEEF2",
       boxShadow: "0px 4px 20px 0px #00000008",
      }}>
      <h3 className="text-xl font-bold text-[#2B2B43] mb-6">Selected Items</h3>

      <div className="flex flex-col gap-6 mb-8 max-h-[60vh] overflow-y-auto pr-2">
       {Object.keys(groupedSelectedItems).length === 0 ? (
        <p className="text-gray-400 text-sm">No items selected yet.</p>
       ) : (
        Object.entries(groupedSelectedItems).map(([courseTitle, items]) => (
         <div key={courseTitle}>
          <h4 className="text-sm font-semibold text-[#545563] mb-2">
           {courseTitle}
          </h4>
          <ul className="space-y-1">
           {items.map((item) => (
            <li key={item.id} className="text-[#2B2B43] text-[14px] leading-[20px] font-[600]">
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
        onClick={handleContinue}
        disabled={selectedMenuItems.length === 0}
        className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2
                    ${
                     selectedMenuItems.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#054A86] hover:bg-[#043e70] shadow-lg shadow-[#4E60FF29]"
                    }`}
        style={{ height: "48px" }}>
        Review Catering Service
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

export default CoursesMenu;
