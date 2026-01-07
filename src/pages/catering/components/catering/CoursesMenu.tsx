import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import LazyLoad from "@/components/ui/LazyLoad";
import Shrimmer from "@/components/ui/Shrimmer";

interface MenuItem {
 id: string;
 name: string;
 course: string; // Course Name (Group Title)
 description?: string;
 image_url?: string;
}

interface CoursesMenuProps {
 selectedMenuItems: MenuItem[];
 toggleMenuItem: (item: MenuItem) => void;
 handleGoBack: () => void;
 handleContinue: () => void;
 selectedCourses: { id: number; name: string }[];
 selectedCuisines: { id: number; name: string }[];
 selectedBudget: {
  id: string | null;
  label: string | null;
  price_range: string | null;
 };
 selectedEvent: { id: string | null; name: string | null } | null;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({
 selectedMenuItems = [],
 toggleMenuItem,
 handleGoBack,
 handleContinue,
 selectedCourses = [],
 selectedCuisines = [],
 selectedBudget = { id: null, label: null, price_range: null },
 selectedEvent,
}) => {
 const [menuGroups, setMenuGroups] = useState<
  { id: number; title: string; items: MenuItem[] }[]
 >([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 useEffect(() => {
  const fetchMenuItems = async () => {
   try {
    const courseIds = selectedCourses.map((c) => c.id).join(",");
    const cuisineIds = selectedCuisines.map((c) => c.id).join(",");
    const budgetId = selectedBudget.id;
    const isPrivate = !selectedEvent?.name?.toLowerCase().includes("corporate");

    // Fetch items with filters
    const response = await axios.get(`${baseUrl}/api/catering/menu-items/`, {
     params: {
      course_ids: courseIds,
      cuisine_ids: cuisineIds,
      budget_id: budgetId,
      is_private: isPrivate,
     },
     headers: {
      Authorization: `Token ${authToken}`,
     },
    });

    const items: any[] = response.data;

    // Group items by Course
    // We need to map the flat list of items to the grouped structure expected by the UI.
    // Each item has a 'course' ID/Name in it (based on backend serializer 'course' field nesting?
    // Wait, backend serializer currently returns course ID as integer by default unless nested)

    // NOTE: Backend Serializer 'course' field is currently just ID?
    // Let's check serializer:
    // fields = ['id', 'name', 'description', 'image_url', 'course', 'cuisine', 'variants']
    // 'course' is aForeignKey. Default ModelSerializer uses PK.
    // I should have made it nested or StringRelatedField properly, or use the course list to map IDs to Names.

    // Better approach: Use the `selectedCourses` list I have here to create the groups,
    // and filter the fetched items into those groups.

    const grouped = selectedCourses
     .map((course) => {
      // Filter items belonging to this course
      // Backend item.course is likely just the ID (number)
      const courseItems = items
       .filter((item: any) => item.course === course.id)
       .map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        course: course.name,
        description: item.description,
        image_url: item.image_url,
       }));

      return {
       id: course.id,
       title: course.name,
       items: courseItems,
      };
     })
     .filter((group) => group.items.length > 0); // Only show groups with items

    setMenuGroups(grouped);
    setLoading(false);
   } catch (err) {
    console.error("Error fetching menu items:", err);
    setError("Failed to load menu items. Please try again later.");
    setLoading(false);
   }
  };

  if (!selectedCourses?.length && !selectedCuisines?.length) {
   // If we skipped course selection (Buffet), we might rely on Cuisines only?
   // But the previous implementation assumed Courses are present.
   // If user skipped Step 6 (Buffet), selectedCourses is EMPTY.
   // In that case, we should probably fetch ALL courses related to the Cuisines first, or rely on the backend to Group them?
   // Since backend logic filters by what is provided, if course_ids is empty, it returns items for ALL courses of that Cuisine.
   // However, frontend grouping logic above relies on `selectedCourses` to define groups.

   // FIX for Skipped Step: If selectedCourses is empty, we must infer courses from the fetched items?
   // Or we should have set selectedCourses automatically in the skipped step? To keep it simple, let's infer groups from data.
   fetchMenuItemsFallback();
  } else {
   fetchMenuItems();
  }

  // Define fallback fetch for when selectedCourses is empty (e.g. buffet mode skipping step 6)
  async function fetchMenuItemsFallback() {
   try {
    const cuisineIds = selectedCuisines.map((c) => c.id).join(",");
    const budgetId = selectedBudget.id;
    const isPrivate = !selectedEvent?.name?.toLowerCase().includes("corporate");

    const response = await axios.get(`${baseUrl}/api/catering/menu-items/`, {
     params: {
      cuisine_ids: cuisineIds,
      budget_id: budgetId,
      is_private: isPrivate,
     },
     headers: { Authorization: `Token ${authToken}` },
    });

    const items: any[] = response.data;

    // Dynamic Grouping
    // We need course names. Backend item only has course ID.
    // We might need to fetch all courses or change serializer to return course depth.
    // For now, let's just group by ID and use a placeholder or separate call?
    // Actually, let's query courses first to get names if needed.

    const coursesResponse = await axios.get(
     `${baseUrl}/api/catering/courses/?cuisine_ids=${cuisineIds}`,
     {
      headers: { Authorization: `Token ${authToken}` },
     }
    );
    const coursesMap = new Map(
     coursesResponse.data.map((c: any) => [c.id, c.name])
    );

    const groups: Record<
     number,
     { id: number; title: string; items: MenuItem[] }
    > = {};

    items.forEach((item: any) => {
     const courseId = item.course;
     if (!groups[courseId]) {
      groups[courseId] = {
       id: courseId,
       title: coursesMap.get(courseId) || `Course ${courseId}`,
       items: [],
      };
     }
     groups[courseId].items.push({
      id: item.id.toString(),
      name: item.name,
      course: groups[courseId].title,
      // price: removed
      description: item.description,
      image_url: item.image_url,
     });
    });

    setMenuGroups(Object.values(groups));
    setLoading(false);
   } catch (err) {
    console.error(err);
    setError("Failed to load menu items.");
    setLoading(false);
   }
  }
 }, [
  baseUrl,
  authToken,
  selectedCourses,
  selectedCuisines,
  selectedBudget,
  selectedEvent,
 ]);

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

 if (loading) {
  return (
   <div className="w-full h-[600px] rounded-2xl overflow-hidden">
    <Shrimmer />
   </div>
  );
 }
 if (error) return <div>{error}</div>;

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
      {menuGroups.map((course) => (
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
            onClick={() => toggleMenuItem(item)}
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
             <img
              src={item.image_url}
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
             {item.description || " Delicious option for your event."}
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
