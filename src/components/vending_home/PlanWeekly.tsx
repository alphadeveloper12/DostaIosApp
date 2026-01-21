import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import ImageWithShimmer from "../ui/ImageWithShimmer";

interface FoodItem {
 imgSrc: string;
 heading: string;
 imgAlt: string;
 description: string;
 price: string;

 id: number; // ⭐ REQUIRED
 day_of_week?: string; // optional
 week_number?: number; // optional
}
interface SelectedFoodItem extends FoodItem {
 quantity: number;
}

interface WeeklyPlan {
 [day: string]: SelectedFoodItem[];
}

interface SavedPlan {
 id: string;
 name: string;
 kind: string;
 is_default: boolean;
 is_global: boolean;
 items: [];
}

interface MenuProps {
  handleConfirmStep: () => void;
  weekMenuFunc: (plan: WeeklyPlan) => void;
  savedPlanData?: WeeklyPlan;
  allSavedPlans?: SavedPlan[];
  apiMenuData?: any; // ✅ new prop for API menu data
  timeSlots?: any[];
  dayPickupSlots?: Record<string, number>;
  setDayPickupSlots?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  weekNumber?: number;
  defaultSlotId?: number | null;
}

const days = [
 { day: "Monday" },
 { day: "Tuesday" },
 { day: "Wednesday" },
 { day: "Thursday" },
 { day: "Friday" },
];

const features = [
 { feature: "  Select your favorite" },
 { feature: "  Preselected For You" },
];

const createInitialPlan = (savedData?: WeeklyPlan): WeeklyPlan => {
 if (savedData && Object.keys(savedData).length > 0) {
  return savedData;
 }
 const plan: WeeklyPlan = {};
 days.forEach((day) => {
  plan[day.day] = [];
 });
 return plan;
};

const PlanWeekly: React.FC<MenuProps> = ({
  handleConfirmStep,
  weekMenuFunc,
  savedPlanData,
  allSavedPlans = [],
  apiMenuData,
  timeSlots = [],
  dayPickupSlots = {},
  setDayPickupSlots,
  weekNumber = 1,
  defaultSlotId = null,
}) => {
 const [openDialouge, setOpenDialouge] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
 const [isSheetOpen, setIsSheetOpen] = useState(false);
 const [toaster, setToaster] = useState(false);
 const [tab, setTab] = useState(0);
 const [tab1, setTab1] = useState<number | null>(null);
 const [savedPlans, setSavedPlans] = useState(false);
 const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);
 const [menuByDay, setMenuByDay] = useState<Record<string, FoodItem[]>>({});
 const [loadingPlans, setLoadingPlans] = useState(false);
 const [fetchedPlans, setFetchedPlans] = useState<SavedPlan[]>([]);

 const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(
  createInitialPlan(savedPlanData),
 );

 const fetchSavedPlans = async () => {
  try {
   setLoadingPlans(true);
   const token = sessionStorage.getItem("authToken");
   const baseUrl =
    import.meta.env.VITE_BASE_URL || "http://192.168.100.58:8000";
   const res = await fetch(`${baseUrl}/api/vending/saved-plans/`, {
    headers: {
     "Content-Type": "application/json",
     Authorization: token ? `Token ${token}` : "",
    },
   });
   if (!res.ok) throw new Error(`HTTP ${res.status}`);
   const data = await res.json();

   // match backend key structure
   setFetchedPlans(data.saved_plans || []);
  } catch (err) {
   console.error("Error fetching saved plans:", err);
  } finally {
   setLoadingPlans(false);
  }
 };

 // call this when sidebar opens
 useEffect(() => {
  if (savedPlans) fetchSavedPlans();
 }, [savedPlans]);

 useEffect(() => {
  if (!apiMenuData) return;

  const parsed: Record<string, FoodItem[]> = {};

  // Handle WEEKLY menu
  if (apiMenuData.Monday || apiMenuData.Tuesday) {
   Object.entries(apiMenuData).forEach(([day, data]: [string, any]) => {
    if (data?.items) {
     parsed[day] = data.items.map((it: any) => ({
      imgSrc: it.image_url,
      heading: it.name,
      imgAlt: `food-${it.id}`,
      description: it.description,
      price: `AED ${parseFloat(it.price).toFixed(2)}`,

      id: it.id, // ⭐ add this
      day_of_week: day,
      week_number: apiMenuData.week_no ?? 1,
     }));
    } else {
     parsed[day] = [];
    }
   });
  }

  // Handle MONTHLY menu (apiMenuData for a specific week)
  else if (apiMenuData.menu) {
   Object.entries(apiMenuData.menu).forEach(([day, data]: [string, any]) => {
    if (data?.items) {
     parsed[day] = data.items.map((it: any) => ({
      imgSrc: it.image_url,
      heading: it.name,
      imgAlt: `food-${it.id}`,
      description: it.description,
      price: `AED ${parseFloat(it.price).toFixed(2)}`,
     }));
    } else {
     parsed[day] = [];
    }
   });
  }

  setMenuByDay(parsed);
 }, [apiMenuData]);

 useEffect(() => {
  weekMenuFunc?.(weeklyPlan);
 }, [weeklyPlan, weekMenuFunc]);

 useEffect(() => {
  let ticking = false;
  const onScroll = () => {
   if (!ticking) {
    window.requestAnimationFrame(() => {
     setScrolled(window.scrollY > 120);
     ticking = false;
    });
    ticking = true;
   }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
 }, []);

 const currentDay = days[tab]?.day;
 const currentDayItems = Array.isArray(weeklyPlan?.[currentDay])
  ? weeklyPlan[currentDay]
  : [];

 const totalMealsForDay = currentDayItems.reduce(
  (acc, item) => acc + (item?.quantity || 0),
  0,
 );

 const totalMealsInPlan = Object.values(weeklyPlan).reduce((planTotal, day) => {
  if (Array.isArray(day)) {
   return (
    planTotal + day.reduce((dayTotal, i) => dayTotal + (i?.quantity || 0), 0)
   );
  }
  return planTotal;
 }, 0);

 const handleCardClick = (item: FoodItem) => {
  setSelectedItem(item);
  setIsSheetOpen(true);
 };

 const confirmFunc = () => {
  setOpenDialouge(false);
  if (currentDay) {
   setWeeklyPlan((prevPlan) => ({ ...prevPlan, [currentDay]: [] }));
  }
  setToaster(true);
  setTimeout(() => setToaster(false), 2000);
 };

 const handleQuantityChange = (
  e: React.MouseEvent,
  foodItem: FoodItem,
  change: number,
 ) => {
  e.stopPropagation();
  if (!currentDay) return;

  setWeeklyPlan((prevPlan) => {
   const dayItems = Array.isArray(prevPlan[currentDay])
    ? prevPlan[currentDay]
    : [];
   const existingItemIndex = dayItems.findIndex(
    (item) => item.imgAlt === foodItem.imgAlt,
   );
   const newDayItems = [...dayItems];
   if (existingItemIndex > -1) {
    const newQuantity = newDayItems[existingItemIndex].quantity + change;
    if (newQuantity <= 0) {
     newDayItems.splice(existingItemIndex, 1);
    } else if (newQuantity > 3) {
     // Limit to 3
     return prevPlan;
    } else {
     newDayItems[existingItemIndex] = {
      ...newDayItems[existingItemIndex],
      id: newDayItems[existingItemIndex].id,
      quantity: newQuantity,
     };
    }
   } else if (change > 0) {
    newDayItems.push({
     ...foodItem,
     id: foodItem.id, // ⭐ PRESERVE ID
     day_of_week: currentDay, // ⭐ ADD CORRECT DAY
     week_number: 1, // ⭐ For weekly plans
     quantity: 1,
    });
   }
   return { ...prevPlan, [currentDay]: newDayItems };
  });
 };

 const handleLoadPlan = () => {
  if (!selectedPlan) return;

  // Step 1: initialize empty plan with weekdays
  const newPlan: WeeklyPlan = {};
  days.forEach(({ day }) => {
   newPlan[day] = [];
  });

  // Step 2: populate with items from API
  selectedPlan.items.forEach((item: any) => {
   const day = item.day_of_week || "Monday"; // fallback if null
   const menu = item.menu_item || {};

   const mappedItem: SelectedFoodItem = {
    id: menu.id,
    imgSrc: menu.image_url,
    heading: menu.name,
    imgAlt: `food-${menu.id}`,
    description: menu.description,
    price: `AED ${parseFloat(menu.price).toFixed(2)}`,
    quantity: item.quantity || 1,
   };

   if (!newPlan[day]) newPlan[day] = [];
   newPlan[day].push(mappedItem);
  });

  // Step 3: update weeklyPlan (this will re-render)
  setWeeklyPlan(newPlan);

  // Step 4: close sidebar + clear selection
  setSavedPlans(false);
  setSelectedPlan(null);
 };

 return (
  <div className="min-h-screen">
   <main className="flex-1 bg-neutral-white relative">
    {/* ... (All JSX for title, buttons, tabs, food cards is unchanged) ... */}
    {/* It will all work correctly because it reads from 'weeklyPlan' state */}

    {/* ... (Unchanged JSX for title, buttons, tabs) ... */}
    <div className="w-full bg-transparent pt-2 pb-6">
     <div className="md:px-[30px]">
      {/* title and button */}
      <div className="flex md:flex-row gap-2 flex-col justify-between items-center pb-2 md:py-4">
       <h2 className="text-[16px] text-[#2B2B43] leading-[24px] font-[700] tracking-[0.1px]">
        Choose meals for each weekday :
       </h2>
       <div className="md:flex gap-4 hidden md:flex-row flex-col">
        {currentDayItems.length > 0 && (
         <Button
          className="bg-transparent hover:bg-transparent text-[#545563] border border-[#545563]"
          onClick={() => setOpenDialouge(true)}>
          Reset
         </Button>
        )}
        {totalMealsInPlan > 0 ? (
         <Button
          className="bg-[#054A86] hover:bg-[#054A86]"
          onClick={() => handleConfirmStep()}>
          Confirm and review
         </Button>
        ) : (
         <Button
          className="bg-[#F7F7F9] hover:bg-[#F7F7F9] text-[#C7C8D2]"
          disabled>
          Confirm and review
         </Button>
        )}
       </div>
      </div>

      {/* select your favourite buttons */}
      <div className="flex flex-row  md:justify-between items-center gap-3 py-[8px] w-full">
       {features.map((data, index) => {
        return (
         <div
          key={index} // Added key for list rendering
          onClick={() => setTab1(index)}
          className={` ${
           tab1 === index
            ? "bg-[#EAF5FF]  border-[#054A86]"
            : "bg-neutral-white border-[#C7C8D2]"
          } md:h-[56px] w-full md:w-[50%] h-auto max-md:py-[11px]  cursor-pointer text-center inline-flex items-center  justify-center rounded-[8px]  md:rounded-[16px] border-2 `}>
          <span className="md:text-[16px] text-[14px] leading-[20px] font-[600] md:leading-[24px] md:font-[400]">
           {data.feature}
          </span>
         </div>
        );
       })}
      </div>

      {/* weekly tabs and saved button */}
      <div className="flex w-full items-center justify-between gap-3  pt-[8px]">
       <div className="flex md:hidden w-full max-w-[250px]">
        <select
         value={tab}
         onChange={(e) => setTab(parseInt(e.target.value, 10))}
         className="w-full h-[30px] p-0 px-2  text-[12px] leading-[18px] 
                                  border-2 border-[#054A86] text-[#054A86] bg-[#EAF5FF] rounded-[8px] 
                                  focus:ring-[#054A86] focus:border-[#054A86] font-medium appearance-none"
         style={{
          backgroundImage:
           "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23054A86' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.25rem center",
          backgroundSize: "1.2em",
         }}>
         {days.map((week, index) => (
          <option key={index} value={index}>
           {week?.day}
          </option>
         ))}
        </select>
       </div>

       {/* Desktop Tabs (Original - Hidden on screens < md) */}
       <div className="hidden md:flex md:w-full items-center gap-3 flex-wrap">
        {days.map((week, index) => {
         return (
          <div
           key={index}
           onClick={() => setTab(index)}
           className={` ${
            tab === index
             ? "bg-[#EAF5FF] border-[#054A86]"
             : "bg-white border-[#C7C8D2]"
           } md:h-[56px] h-[26px] cursor-pointer text-center inline-flex items-center w-full justify-center md:max-w-[153px] max-w-[80px] rounded-[8px] md:rounded-[16px] border-2 `}>
           <span className="md:text-[16px] text-[12px] leading-[18px] md:leading-[24px] font-[400]">
            {week?.day}
           </span>
          </div>
         );
        })}
       </div>

       {/* Saved Plans Button (Original - Visible on all screens) */}
       <div
        onClick={() => setSavedPlans(true)}
        className={`md:h-[44px] h-[30px] gap-2 bg-neutral-white cursor-pointer text-center inline-flex items-center w-full justify-center md:max-w-[153px] max-w-[120px] rounded-[8px] border md:border-2 border-[#054A86]`}>
        <svg
         className="w-4 h-4 text-[#054A86]"
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <span className="md:text-[16px] text-[#545563] font-[700] text-[12px] leading-[18px] md:leading-[24px] ">
         Saved Plans
        </span>
       </div>
      </div>

      <div className="flex md:flex-row justify-between flex-col gap-2 md:py-2 pt-4">
       <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
        {currentDayItems?.length === 0
         ? "No selected meals"
         : `Selected for ${currentDay} : ${currentDayItems
            .map((item) => `${item?.heading} (x${item.quantity})`)
            .join(", ")}`}
       </p>
       <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
        Total: <span className="font-[700]">{totalMealsForDay} Meals</span>
       </p>
      </div>
     </div>
    </div>

            <div className="flex md:flex-row justify-between flex-col gap-2 md:py-2 pt-4 items-center">
              <div className="flex flex-col">
                <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
                  {currentDayItems?.length === 0
                    ? "No selected meals"
                    : `Selected for ${currentDay} : ${currentDayItems
                      .map((item) => `${item?.heading} (x${item.quantity})`)
                      .join(", ")}`}
                </p>
                <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
                  Total: <span className="font-[700]">{totalMealsForDay} Meals</span>
                </p>
              </div>

              {timeSlots.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-[600] text-[#545563]">Pickup Time:</span>
                  <select
                    value={dayPickupSlots[`${weekNumber}-${currentDay}`] || defaultSlotId || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (setDayPickupSlots) {
                        setDayPickupSlots((prev) => ({
                          ...prev,
                          [`${weekNumber}-${currentDay}`]: val,
                        }));
                      }
                    }}
                    className="h-[36px] px-3 text-[14px] border-2 border-[#054A86] text-[#054A86] bg-[#EAF5FF] rounded-[8px] focus:ring-[#054A86] focus:border-[#054A86] font-medium appearance-none min-w-[150px]"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23054A86' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.2em",
                    }}
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot: any) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
           </>
          ) : (
           <button onClick={(e) => handleQuantityChange(e, data, 1)}>
            <img src="/images/icons/plusicon.svg" alt="plus icon" />
           </button>
          )}
         </div>
        </div>
       );
      })}
     </div>
     <div className="flex gap-4 md:hidden  flex-col pt-6">
      {currentDayItems.length > 0 && (
       <Button
        className="bg-transparent hover:bg-transparent text-[#545563] border border-[#545563]"
        onClick={() => setOpenDialouge(true)}>
        Reset
       </Button>
      )}
      {totalMealsInPlan > 0 ? (
       <Button
        className="bg-[#054A86] hover:bg-[#054A86]"
        onClick={() => handleConfirmStep()}>
        Confirm and review
       </Button>
      ) : (
       <Button
        className="bg-[#F7F7F9] hover:bg-[#F7F7F9] text-[#C7C8D2]"
        disabled>
        Confirm and review
       </Button>
      )}
     </div>
    </div>

    {/* ... (Unchanged JSX for Sidebar, Reset, Toaster) ... */}
    <AnimatePresence>
     {selectedItem && (
      <motion.div
       className="fixed inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between pb-[40px] md:pb-[16px]">
         <h2 className="text-[28px] leading-[36px] font-[700]  ">
          {selectedItem.heading}
         </h2>
         <button
          onClick={() => setSelectedItem(null)}
          className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
         </button>
        </div>
        <ImageWithShimmer
         src={selectedItem.imgSrc}
         alt={selectedItem.imgAlt}
         wrapperClassName="w-full h-60 md:h-[343px] rounded-[16px]"
        />
        <div className="flex-1 p-5 space-y-4">
         <p className="text-gray-600 text-sm">{selectedItem.description}</p>
         <h3 className="text-[24px] leading-[32px] font-[700] tracking-[0.1px]">
          {selectedItem.price}
         </h3>
         {selectedItem && (
          <div className="md:pb-[24px]">
           <img src="/images/icons/offertag.svg" alt="offer" />
           <p className="py-3 px-[18px]">Buy one get one for free</p>
          </div>
         )}
         <div>
          <Link
           className="text-[#056AC1] text-[16px] leading-[24px] font-[400] tracking-[0.1px] underline"
           to={"/"}>
           Terms & conditions Apply
          </Link>
         </div>
        </div>
        <div className="md:p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setSelectedItem(null)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          onClick={() => {
           handleQuantityChange(
            { stopPropagation: () => {} } as React.MouseEvent,
            selectedItem,
            1,
           );
           setSelectedItem(null);
          }}
          className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium ">
          + Add
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
    {openDialouge && (
     <motion.div
      className="fixed hidden inset-0 bg-black/75 md:flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
       className="bg-white px-4 py-5  rounded-lg shadow-lg max-w-[394px] "
       initial={{ scale: 0.8, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       exit={{ scale: 0.8, opacity: 0 }}
       transition={{ duration: 0.2 }}>
       <div className=" text-lg font-bold mb-2 gap-3 flex ">
        <img src="/images/icons/info_icon.svg" alt="info" />
        <h3>Reset Menu Selection?</h3>
       </div>
       <p className="text-[#545563] mb-8">
        Are you sure you want to reset your menu selection?
       </p>
       <div className="flex justify-end gap-4">
        <button
         onClick={() => setOpenDialouge(false)}
         className="px-4 py-2 bg-neutral-white border border-[neutral/gray dark] rounded-[8px] hover:bg-gray-300">
         Cancel
        </button>
        <button
         onClick={() => confirmFunc()}
         className="px-4 py-2 bg-[#054A86] text-white rounded-lg hover:bg-[#054A86]">
         Confirm
        </button>
       </div>
      </motion.div>
     </motion.div>
    )}
    <AnimatePresence>
     {openDialouge && (
      <motion.div
       className="fixed md:hidden inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center gap-4 pb-[24px] md:pb-[16px]">
         <img src="/images/icons/info_icon.svg" alt="alert" />
         <h2 className="text-[28px] leading-[36px] font-[700]   ">
          Reset Menu Selection?
         </h2>
        </div>
        <div className="flex-1 py-0 ">
         <p className="text-gray-600 text-[16px] leading-[24px] font-[400] tracking-[0.1px]">
          Are you sure you want to reset your menu selection?
         </p>
        </div>
        <div className="md:p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setOpenDialouge(false)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          onClick={() => confirmFunc()}
          className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium ">
          Confirm
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
    {toaster && (
     <div className="fixed top-[104px] left-1/2 transform -translate-x-1/2 max-w-[540px] w-full h-[52px] bg-[#E8F9F1] rounded-[16px] shadow-[0px_4px_10px_rgba(232,249,241,0.6)] flex items-center px-4 gap-3 z-50">
      <svg
       width="20"
       height="20"
       viewBox="0 0 20 20"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
       className="flex-shrink-0">
       {/* ... (SVG paths) ... */}
      </svg>
      <span className="flex-grow whitespace-nowrap text-[#2B2B43] font-medium text-sm">
       Menu selections have been successfully reset.
      </span>
     </div>
    )}

    {/* --- UPDATED: Saved Plans Sidebar --- */}
    <AnimatePresence>
     {savedPlans && (
      <motion.div
       className="fixed inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full md:px-8 md:py-4 px-[16px] py-[22px] max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between pb-[16px] ">
         <h2 className="text-[28px] leading-[36px] font-[700] ">Saved Plans</h2>
         <button
          onClick={() => setSavedPlans(false)}
          className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
         </button>
        </div>
        <div className="flex-1 py-4 space-y-4">
         <p className="text-gray-600 text-[16px] leading-[24px] font-[400]">
          Select one of your saved plans to load it into the calendar. This will
          overwrite any current selections.
         </p>

         {/* --- UPDATED: Map over the 'allSavedPlans' prop --- */}
         {loadingPlans ? (
          <Shrimmer />
         ) : fetchedPlans.length > 0 ? (
          fetchedPlans.map((plan) => {
           return (
            <div
             key={plan.id}
             className={` ${
              selectedPlan?.id === plan.id
               ? "bg-[#EAF5FF]  border border-[#054A86]"
               : "border border-[#EDEEF2]"
             } py-[10px] cursor-pointer  px-4 my-2  rounded-[8px]`}
             onClick={() => setSelectedPlan(plan)} // Store the whole plan object
            >
             <p className="text-[#2B2B43] text-[16px] leading-[24px] font-[700]">
              {plan.name}
              {plan.is_default && (
               <span className="text-xs font-normal text-gray-500">
                {" "}
                (Default)
               </span>
              )}
             </p>
            </div>
           );
          })
         ) : (
          <p className="text-gray-500 text-center py-8">
           You have no saved plans.
          </p>
         )}
        </div>
        <div className="md:p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setSavedPlans(false)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          className="w-full bg-[#054A86]  text-white rounded-lg py-2 font-medium "
          // --- UPDATED: Call the new load plan function ---
          onClick={handleLoadPlan}
          // Disable if no plan is selected
          disabled={!selectedPlan}>
          Confirm
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
   </main>
  </div>
 );
};

export default PlanWeekly;
