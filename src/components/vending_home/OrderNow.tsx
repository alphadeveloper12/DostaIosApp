import { useState, useEffect } from "react";
import axios from "axios";

import { Check } from "lucide-react";
import { Button } from "../ui/button";
import BreadCrumb from "../home/BreadCrumb";
import GrabMenu from "./GrabMenu";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Menu from "./Menu";
import PlanWeekly from "./PlanWeekly";
import { Input } from "../ui/input";
import Header from "@/pages/catering/components/layout/Header";
import MobileFooterNav from "../home/MobileFooterNav";

type StepStatus = "completed" | "active" | "pending";

// 1. Define a default state for ALL properties we want to save
const defaultProgress = {
 activeStep: 2,
 maxCompleted: 1,
 time: "",
 pickOrder: "",
 orderType: "",
 planType: "",
 orderNowMenu: [],
 smartGrabMenu: [],
 weekMenu: {},
 weekMenu1: {},
 weekMenu2: {},
 weekMenu3: {},
 weekMenu4: {},
 allSavedPlans: [], // --- NEW: To store all saved plans
 orderId: 1,
};

// 2. This function runs ONCE on component load
const getInitialState = () => {
 try {
  const savedState = localStorage.getItem("orderProgress");
  if (savedState) {
   // If we find saved data, parse it and merge it with defaults
   const loadedState = JSON.parse(savedState);
   // Ensure all keys from defaultProgress are present
   return { ...defaultProgress, ...loadedState };
  }
  // Otherwise, just return the defaults
  return defaultProgress;
 } catch (e) {
  console.error("Failed to load state from localStorage", e);
  return defaultProgress;
 }
};
// --- LOCALSTORAGE LOGIC END (Loading) ---

// --- NEW HELPER FUNCTION 1: For Weekly Plans (weekMenu, weekMenu1, etc.) ---
const generatePlanSummary = (planData) => {
 // Ensure planData is an object, even if it's null, undefined, or a string
 const week =
  typeof planData === "string" ? JSON.parse(planData) : planData || {};

 const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
 let totalMeals = 0;
 const lines = [];

 for (const day of days) {
  const items = week[day] || [];
  if (items.length > 0) {
   let dayTotal = 0;
   const titles = [];

   for (const item of items) {
    // --- FIX: Sum the quantity, not just the number of items ---
    const quantity = item.quantity || 1;
    dayTotal += quantity;
    titles.push(`${item.heading}${quantity > 1 ? ` (x${quantity})` : ""}`);
   }

   totalMeals += dayTotal;
   lines.push(`“${day}: ${titles.join(", ")}”`);
  }
 }

 return { totalMeals, lines };
};

// --- NEW HELPER FUNCTION 2: For simple carts (orderNowMenu, smartGrabMenu) ---
const generateCartSummary = (cartData) => {
 const cart = cartData || [];
 // --- FIX: Sum the quantity from the cart items ---
 const totalMeals = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
 const line = cart
  .map(
   (item) => `${item.heading}${item.quantity > 1 ? ` (x${item.quantity})` : ""}`
  )
  .join(", ");

 return { totalMeals, line };
};

const OrderNow = () => {
 const navigate = useNavigate();

 // --- Use the getInitialState() function to set the initial state ---
 const initialState = getInitialState();
 const [activeStep, setActiveStep] = useState(initialState.activeStep);
 const [maxCompleted, setMaxCompleted] = useState(initialState.maxCompleted);
 const [pickupLocation, setPickupLocation] = useState("no location selected");
 const [time, setTime] = useState(initialState.time);
 const [isOpen, setIsOpen] = useState<Boolean>(false);
 const [pickOrder, SetPickOrder] = useState(initialState.pickOrder);
 const [orderType, setOrderType] = useState(initialState.orderType);
 const [planType, setPlanType] = useState(initialState.planType);
 const [savePlanMenu, setSavePlanMenu] = useState<boolean>(false);

 // --- NEW: State for "Save Plan" sidebar ---
 const [currentPlanName, setCurrentPlanName] = useState("");
 const [isDefaultPlan, setIsDefaultPlan] = useState(false);
 const [stepToSave, setStepToSave] = useState<number | null>(null); // To know which plan to save
 const [allSavedPlans, setAllSavedPlans] = useState(initialState.allSavedPlans);

 // --- UPDATED: All menu data states, loaded from localStorage ---
 const [orderNowMenu, setOrderNowMenu] = useState(initialState.orderNowMenu);
 const [smartGrabMenu, setSmartGrabMenu] = useState(initialState.smartGrabMenu);
 const [weekMenu, setWeekMenu] = useState(initialState.weekMenu);
 const [weekMenu1, setWeekMenu1] = useState(initialState.weekMenu1);
 const [weekMenu2, setWeekMenu2] = useState(initialState.weekMenu2);
 const [weekMenu3, setWeekMenu3] = useState(initialState.weekMenu3);
 const [weekMenu4, setWeekMenu4] = useState(initialState.weekMenu4);
 // --- API states ---
 const [planTypeOptions, setPlanTypeOptions] = useState([]);
 const [pickupOptions, setPickupOptions] = useState([]);
 const [timeSlots, setTimeSlots] = useState([]);
 const [planSubTypes, setPlanSubTypes] = useState([]);
 const [apiWeeklyMenu, setApiWeeklyMenu] = useState<any>(null);
 const [apiMonthlyMenu, setApiMonthlyMenu] = useState<any>(null);

 // --- REMOVED: Old static summary logic (week, days, totalMeals, lines) ---
 const token = sessionStorage.getItem("authToken");
 const authHeaders = {
  headers: {
   Authorization: `token ${token}`,
  },
 };

 /* helper function for formating api payload data  */
 const buildConfirmPayload = ({
  location,
  orderType,
  planType,
  pickOrder,
  time,
  pickupOptions,
  timeSlots,
  menuData,
 }) => {
  // ---- MAP ORDER TYPE ----
  const plan_type_map = {
   "Order Now": "ORDER_NOW",
   "Smart Grab": "SMART_GRAB",
   "Start a Plan": planType === "weekly" ? "WEEKLY" : "MONTHLY",
  };

  // ---- MAP PICKUP TYPE ----
  const pickup_type_map = {
   "Pickup Today": "TODAY",
   "Pickup in 24 hours": "NEXT_DAY",
  };

  const pickup_type = pickup_type_map[pickOrder] ?? "TODAY";

  // ---- FIND PICKUP SLOT ID ----
  const selectedSlot = timeSlots.find((slot) => slot.label === time);

  // ---- FORMAT ITEMS ----
  const formatItems = (menuData, planType) => {
   if (!menuData) return [];

   // WEEKLY
   if (planType === "weekly") {
    const days = Object.keys(menuData);
    let allItems = [];

    days.forEach((day) => {
     menuData[day]?.forEach((item) => {
      allItems.push({
       menu_item_id: item.id,
       quantity: item.quantity || 1,
       day_of_week: day,
       week_number: 1, // Always 1 for weekly plans
      });
     });
    });

    return allItems;
   }

   // MONTHLY
   if (planType === "monthly") {
    // Determine week number based on the step
    const _weekNumber =
     activeStep === 4
      ? 1
      : activeStep === 5
      ? 2
      : activeStep === 6
      ? 3
      : activeStep === 7
      ? 4
      : null;

    const items = [];
    Object.keys(menuData).forEach((day) => {
     menuData[day]?.forEach((item) => {
      items.push({
       menu_item_id: item.id,
       quantity: item.quantity || 1,
       day_of_week: day,
       week_number: _weekNumber, // FIXED
      });
     });
    });
    return items;
   }

   return [];
  };

  return {
   location_id: location,
   plan_type: plan_type_map[orderType],
   plan_subtype: orderType === "Start a Plan" ? planType.toUpperCase() : "NONE",
   pickup_type,
   pickup_date: new Date().toISOString().split("T")[0], // today's date
   pickup_slot_id: selectedSlot?.id || null,
   items: formatItems(menuData, planType),
  };
 };
 /* post api call function */
 const postConfirm = async (payload) => {
  try {
   await axios.post(
    `${baseUrl}/api/vending/order/confirm/`,
    payload,
    authHeaders
   );
   console.log("✅ Confirm saved:", payload);
  } catch (err) {
   console.error("❌ Confirm error:", err);
  }
 };

 {
  /*****week menu funcs****************************/
 }
 const weekMenuFunc = (n: any) => {
  setWeekMenu(n);
 };
 const weekMenuFunc1 = (n: any) => {
  setWeekMenu1(n);
 };
 const weekMenuFunc2 = (n: any) => {
  setWeekMenu2(n);
 };
 const weekMenuFunc3 = (n: any) => {
  setWeekMenu3(n);
 };
 const weekMenuFunc4 = (n: any) => {
  setWeekMenu4(n);
 };
 const orderNowMenuFunc = (n: any) => {
  setOrderNowMenu(n);
 };
 const smartGrabMenuFunc = (n: any) => {
  setSmartGrabMenu(n);
 };
 const baseUrl = import.meta.env.VITE_API_URL;
 // 🟢 PATCH ORDER PROGRESS WHEN STEP CHANGES
 useEffect(() => {
  console.log(activeStep);

  const saveProgressToBackend = async () => {
   try {
    await axios.patch(
     `${baseUrl}/api/vending/order/progress/`,
     {
      order_id: 1,
      current_step: activeStep,
     },
     authHeaders
    );

    console.log("🟢 Progress synced:", activeStep);
   } catch (err) {
    console.error("❌ Progress sync failed:", err);
   }
  };

  saveProgressToBackend();
 }, [activeStep]);

 {
  /* use effect to load monthly and weekly menu  */
 }
 useEffect(() => {
  const fetchMenuData = async () => {
   try {
    if (planType === "weekly") {
     const res = await axios.get(
      `${baseUrl}/api/vending/menu/plan/WEEKLY/`,
      authHeaders
     );
     setApiWeeklyMenu(res.data.week_menu);
    } else if (planType === "monthly") {
     const res = await axios.get(
      `${baseUrl}/api/vending/menu/plan/MONTHLY/`,
      authHeaders
     );
     setApiMonthlyMenu(res.data.month_menu);
    }
   } catch (error) {
    console.error("Error fetching menu:", error);
   }
  };

  if (orderType === "Start a Plan") {
   fetchMenuData();
  }
 }, [planType, orderType]);

 {
  /* use effect for plan sub types */
 }
 useEffect(() => {
  const fetchPlanOptions = async () => {
   if (orderType !== "Start a Plan") return;

   const token = sessionStorage.getItem("authToken");
   const authHeaders = {
    headers: { Authorization: `Token ${token}` },
   };

   try {
    const res = await axios.get(
     `${baseUrl}/api/vending/plan-options/`,
     authHeaders
    );
    if (res.data?.plan_subtypes) {
     setPlanSubTypes(res.data.plan_subtypes);
    }
   } catch (error) {
    console.error("Error fetching plan options:", error);
   }
  };

  fetchPlanOptions();
 }, [orderType]);

 {
  /* use effect for order now / pickup in 24 */
 }
 useEffect(() => {
  const fetchPickupOptions = async () => {
   try {
    const res = await axios.get(
     `${baseUrl}/api/vending/pickup-options/?location_id=1`,
     authHeaders
    );
    if (res.data?.pickup_types) {
     setPickupOptions(res.data.pickup_types);
    }
    if (res.data?.time_slots) {
     setTimeSlots(res.data.time_slots);
    }
   } catch (error) {
    console.error("Error fetching pickup options:", error);
   }
  };
  fetchPickupOptions();
 }, []);

 {
  /* use effect for fetching the smart grab , start plan and order now */
 }
 useEffect(() => {
  const fetchPlanTypes = async () => {
   try {
    const res = await axios.get(
     `${baseUrl}/api/vending/plan-types/`,
     authHeaders
    );
    if (res.data?.options) {
     setPlanTypeOptions(res.data.options);
    }
   } catch (error) {
    console.error("Error fetching plan types:", error);
   }
  };
  fetchPlanTypes();
 }, []);

 // --- LOCALSTORAGE LOGIC (Saving) ---
 useEffect(() => {
  const stateToSave = {
   activeStep,
   maxCompleted,
   time,
   pickOrder,
   orderType,
   planType,
   orderNowMenu,
   smartGrabMenu,
   weekMenu,
   weekMenu1,
   weekMenu2,
   weekMenu3,
   weekMenu4,
   allSavedPlans,
  };
  try {
   localStorage.setItem("orderProgress", JSON.stringify(stateToSave));
  } catch (e) {
   console.error("Failed to save state to localStorage", e);
  }
 }, [
  activeStep,
  maxCompleted,
  time,
  pickOrder,
  orderType,
  planType,
  orderNowMenu,
  smartGrabMenu,
  weekMenu,
  weekMenu1,
  weekMenu2,
  weekMenu3,
  weekMenu4,
  allSavedPlans,
 ]);

 // --- (sessionStorage effect is unchanged) ---
 useEffect(() => {
  const selectedLocation = JSON.parse(
   sessionStorage.getItem("selectedLocation") || "{}"
  );
  if (selectedLocation && selectedLocation.location) {
   const locationInfo = `${selectedLocation.location.name}, ${selectedLocation.location.info}`;
   setPickupLocation(locationInfo);
  }
 }, []);

 const getStepStatus = (stepId: number): StepStatus => {
  if (stepId === activeStep) return "active";
  if (stepId <= maxCompleted) return "completed";
  return "pending";
 };

 const monthly = () => {
  setPlanType("monthly");
 };

 // --- (All handlers are correct and unchanged from your version) ---
 const savedMenu = (stepId: number) => {
  setStepToSave(stepId);
  setSavePlanMenu(true);
 };

 const confirmSavePlan = () => {
  if (!currentPlanName || !stepToSave) {
   console.error("No plan name or step to save.");
   return;
  }
  let menuDataToSave;
  if (planType === "weekly" && stepToSave === 4) {
   menuDataToSave = weekMenu;
  } else if (planType === "monthly") {
   switch (stepToSave) {
    case 4:
     menuDataToSave = weekMenu1;
     break;
    case 5:
     menuDataToSave = weekMenu2;
     break;
    case 6:
     menuDataToSave = weekMenu3;
     break;
    case 7:
     menuDataToSave = weekMenu4;
     break;
    default:
     console.error("Invalid step to save:", stepToSave);
     return;
   }
  }
  if (!menuDataToSave || Object.keys(menuDataToSave).length === 0) {
   console.warn("No menu data to save for this step.");
   return;
  }
  const newPlan = {
   id: crypto.randomUUID(),
   name: currentPlanName,
   isDefault: isDefaultPlan,
   planData: menuDataToSave,
  };
  let updatedPlans = [...allSavedPlans, newPlan];
  if (isDefaultPlan) {
   updatedPlans = updatedPlans.map((plan) =>
    plan.id === newPlan.id ? plan : { ...plan, isDefault: false }
   );
  }
  setAllSavedPlans(updatedPlans);
  setCurrentPlanName("");
  setIsDefaultPlan(false);
  setStepToSave(null);
  setSavePlanMenu(false);
 };

 const handleOrderTypeSelect = (type: string) => {
  setOrderType(type);
 };

 const handleConfirmStep = () => {
  let menuDataToSend = [];

  if (activeStep === 2) {
   menuDataToSend = [];
  }

  if (activeStep === 4 && orderType === "Order Now") {
   menuDataToSend = orderNowMenu;
  }

  if (activeStep === 4 && orderType === "Smart Grab") {
   menuDataToSend = smartGrabMenu;
  }

  // WEEKLY FIX
  if (
   activeStep === 4 &&
   orderType === "Start a Plan" &&
   planType === "weekly"
  ) {
   menuDataToSend = weekMenu; // FIX
  }

  // MONTHLY FIX
  if (activeStep === 4 && planType === "monthly") menuDataToSend = weekMenu1;
  if (activeStep === 5 && planType === "monthly") menuDataToSend = weekMenu2;
  if (activeStep === 6 && planType === "monthly") menuDataToSend = weekMenu3;
  if (activeStep === 7 && planType === "monthly") menuDataToSend = weekMenu4;

  const payload = buildConfirmPayload({
   location: 1,
   orderType,
   planType,
   pickOrder,
   time,
   pickupOptions,
   timeSlots,
   menuData: menuDataToSend,
  });

  postConfirm(payload);
  if (activeStep === maxCompleted + 1) {
   setMaxCompleted(activeStep);
   setActiveStep(activeStep + 1);
  } else {
   setActiveStep(maxCompleted + 1);
  }
  if (isOpen) {
   setIsOpen(false);
  }

  console.log("STEP:", activeStep);
  console.log("ORDER TYPE:", orderType);
  console.log("PLAN TYPE:", planType);
  console.log("RAW MENU DATA TO SEND:", menuDataToSend);
 };

 const handleEditStep = (stepId: number) => {
  setActiveStep(stepId);
  setMaxCompleted(stepId - 1);
 };

 const timeFrame = [
  { time: "8:00 AM – 10:00 AM" },
  { time: "10:00 AM – 12:00 PM" },
  { time: "12:00 PM – 2:00 PM" },
  { time: "2:00 PM – 4:00 PM" },
  { time: "4:00 PM – 6:00 PM" },
 ];

 const step1Status = getStepStatus(1);
 const step2Status = getStepStatus(2);
 const step3Status = getStepStatus(3);
 const step4Status = getStepStatus(4);
 const step5Status = getStepStatus(5);
 const step6Status = getStepStatus(6);
 const step7Status = getStepStatus(7);

 return (
  <div className="min-h-screen relative ">
   <Header />
   <main className="flex-1 bg-[#F7F7F9] max-md:pb-[122px]">
    {/* ... (Breadcrumb, Title, Steps 1, 2, 3 are unchanged) ... */}
    {/* Breadcrumb and Title */}
    <div className="w-full bg-white pt-2 pb-6">
     <div className="main-container">
      <BreadCrumb />
      <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
       Vending Pickup
      </h2>
     </div>
    </div>

    {/* Steps Container */}
    <div className="w-full py-6">
     <div className="main-container space-y-4">
      {/* --- Step 1: Select Pickup Location --- */}
      {step1Status !== "pending" && (
       <div
        key={1}
        className={`w-full border rounded-[16px] transition-all ${
         step1Status === "active"
          ? "border-[#EDEEF2] bg-white shadow-lg"
          : "border-[#EDEEF2] bg-white"
        }`}>
        <div className="py-[20px] md:px-[24px] px-3">
         <div className="flex flex-row justify-between max-md:gap-4">
          <div className="flex gap-4">
           <div
            className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
             step1Status === "completed"
              ? "bg-[#10B981] text-white"
              : "bg-[#054A86] text-white"
            }`}>
            {step1Status === "completed" ? <Check className="w-4 h-4" /> : 1}
           </div>
           <div className="flex-1">
            <h2
             className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
             Select Pickup Location
            </h2>
            {step1Status === "completed" && (
             <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
              "{pickupLocation}"
             </h4>
            )}
           </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-1">
           {step1Status === "completed" && (
            <Button
             onClick={() => navigate("/vending-home")}
             className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
             Edit
            </Button>
           )}
          </div>
         </div>
        </div>
       </div>
      )}
      {/* --- Step 2 --- */}
      {step2Status !== "pending" && (
       <div
        key={2}
        className={`w-full border rounded-[16px] transition-all ${
         step2Status === "active"
          ? "border-[#EDEEF2] bg-white shadow-lg"
          : "border-[#EDEEF2] bg-white"
        }`}>
        <div className="py-[20px] md:px-[24px] px-3">
         <div className="flex flex-row justify-between max-md:gap-4">
          <div className="flex gap-4">
           <div
            className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
             step2Status === "completed"
              ? "bg-[#10B981] text-white"
              : "bg-[#054A86] text-white"
            }`}>
            {step2Status === "completed" ? <Check className="w-4 h-4" /> : 2}
           </div>
           <div className="flex-1">
            <h2
             className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
             Choose How You'd Like to Order
            </h2>
            {step2Status === "completed" && (
             <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
              "{orderType === "Start a Plan" ? planType : orderType}"
             </h4>
            )}
           </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-1">
           {step2Status === "completed" && (
            <Button
             onClick={() => handleEditStep(2)}
             className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
             Edit
            </Button>
           )}
          </div>
         </div>

         {step2Status === "active" && (
          <div className="mt-4 pl-0 ">
           {/* ... Step 2 Content ... */}
           <div className="mt-6 space-y-6">
            <div className="md:flex gap-4 md:flex-row grid grid-cols-12">
             {/* {allPlanTypes} */}
             {planTypeOptions.map((opt) => (
              <Button
               key={opt.key}
               onClick={() => handleOrderTypeSelect(opt.label)}
               className={` ${
                orderType === opt.label
                 ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                 : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
               } px-6 py-3 md:rounded-[16px] rounded-[10px] font-bold col-span-4`}>
               {opt.label}
              </Button>
             ))}
             {/* <Button
              onClick={() => handleOrderTypeSelect("Order Now")}
              className={` ${
               orderType === "Order Now"
                ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
              } px-6 py-3  md:rounded-[16px] rounded-[10px] font-bold col-span-4`}>
              Order Now
             </Button>
             <Button
              onClick={() => handleOrderTypeSelect("Start a Plan")}
              className={` ${
               orderType === "Start a Plan"
                ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
              } px-6 py-3  md:rounded-[16px] rounded-[10px] font-bold col-span-4`}>
              Start a Plan
             </Button>
             <Button
              onClick={() => handleOrderTypeSelect("Smart Grab")}
              className={` ${
               orderType === "Smart Grab"
                ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
              } px-6 py-3  md:rounded-[16px] rounded-[10px] font-bold col-span-4`}>
              Smart Grab
             </Button> */}
            </div>

            <div className="flex md:flex-row flex-col items-start gap-8">
             <div className="flex-1">
              <h3 className="text-[20px] leading-[28px] font-bold text-[#545563] mb-3">
               Today's Menu, Ready to Go!
              </h3>
              <p className="text-[14px] leading-[20px] text-[#545563] mb-4">
               Freshly made meals, available to pickup within 24 hours.
              </p>
              <p className="text-[14px] leading-[20px] text-[#545563] mb-6">
               Browse our daily menu of 13–15+ prepared menus, available Monday
               to Friday. Simply place your order now, and we'll make it fresh
               just for you. Your meal will be stocked in our vending stations
               within 24 hours.
              </p>

              {orderType === "Start a Plan" && (
               <>
                <p className="text-[14px] leading-[20px] text-[#545563] mb-6">
                 Select a plan to get started{" "}
                </p>
                <div className="flex gap-4 pb-6">
                 {planSubTypes.map((opt) => (
                  <Button
                   key={opt.key}
                   onClick={() => setPlanType(opt.key.toLowerCase())}
                   className={` ${
                    planType === opt.key.toLowerCase()
                     ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                     : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
                   } px-6 py-3 md:rounded-[16px] rounded-[10px] font-bold`}>
                   {opt.label}
                  </Button>
                 ))}
                 {/* <Button
                  onClick={() => setPlanType("weekly")}
                  className={` ${
                   planType === "weekly"
                    ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                    : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B4A3]"
                  } px-6 py-3  md:rounded-[16px] rounded-[10px] font-bold`}>
                  Weekly
                 </Button>
                 <Button
                  onClick={() => monthly()}
                  className={` ${
                   planType === "monthly"
                    ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                    : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
                  } px-6 py-3  md:rounded-[16px] rounded-[10px] font-bold`}>
                  Monthly
                 </Button> */}
                </div>
               </>
              )}
              <Button
               onClick={handleConfirmStep}
               disabled={!orderType}
               className="bg-[#054A86] hover:bg-[#043968] text-white px-8 py-3 rounded-lg font-bold">
               Confirm
              </Button>
             </div>

             <div className="flex-shrink-0">
              <div className="relative w-[282px] h-[188px] flex items-center justify-center">
               <div className="absolute inset-0 "></div>
               <img
                src={
                 orderType === "Start a Plan"
                  ? "/images/order/planing.svg"
                  : "/images/order/desktop.svg"
                }
                alt="logo"
                className="h-full w-full"
               />
              </div>
             </div>
            </div>
           </div>
          </div>
         )}
        </div>
       </div>
      )}
      {/* --- Step 3 --- */}
      {step3Status !== "pending" && (
       <div
        key={3}
        className={`w-full border rounded-[16px] transition-all ${
         step3Status === "active"
          ? "border-[#EDEEF2] bg-white shadow-lg"
          : "border-[#EDEEF2] bg-white"
        }`}>
        <div className="py-[20px] md:px-[24px] px-3">
         <div className="flex flex-row justify-between max-md:gap-4">
          <div className="flex gap-4">
           <div
            className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
             step3Status === "completed"
              ? "bg-[#10B981] text-white"
              : "bg-[#054A86] text-white"
            }`}>
            {step3Status === "completed" ? <Check className="w-4 h-4" /> : 3}
           </div>
           <div className="flex-1">
            <h2
             className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
             Set Your Pickup Time
            </h2>
            {step3Status === "completed" && (
             <>
              <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
               "{pickOrder}"
              </h4>

              <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
               "{time}"
              </h4>
             </>
            )}
           </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-1">
           {step3Status === "completed" && (
            <Button
             onClick={() => handleEditStep(3)}
             className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
             Edit
            </Button>
           )}
          </div>
         </div>

         {step3Status === "active" && (
          <div className="mt-4 pl-0 ">
           {/* ... Step 3 Content ... */}
           <div className="mt-6 space-y-6">
            <div className="flex gap-4 flex-row ">
             {pickupOptions.map((opt) => (
              <Button
               key={opt.key}
               onClick={() => SetPickOrder(opt.label)}
               className={` ${
                pickOrder === opt.label
                 ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                 : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
               } px-6 py-3 md:rounded-[16px] rounded-[10px] font-bold`}>
               {opt.label}
              </Button>
             ))}
             {/* <Button
              onClick={() => SetPickOrder("Pickup Today")}
              className={` ${
               pickOrder === "Pickup Today"
                ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
              } px-6 py-3  md:rounded-[16px] rounded-[10px] font-bold`}>
              Pickup Today
             </Button>
             <Button
              onClick={() => SetPickOrder("Pickup in 24")}
              className={` ${
               pickOrder === "Pickup in 24"
                ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
              } px-6 py-3  md:rounded-[16px] rounded-[10px] font-bold`}>
              Pickup in 24
             </Button> */}
            </div>

            <div className="flex md:flex-row flex-col items-start gap-8">
             <div className="flex-1">
              <h3 className="text-[20px] leading-[28px]  md:font-bold text-[#545563] mb-3">
               Select a timeframe to pickup your meal
              </h3>
              <p className="text-[14px] leading-[20px] text-[#545563] mb-4">
               Sub copy if needed
              </p>

              <Button
               onClick={() => setIsOpen(true)}
               disabled={!orderType}
               className="bg-[#054A86] hover:bg-[#043968] text-white px-8 py-3 rounded-lg font-bold">
               Select Timeframe{" "}
              </Button>
             </div>
            </div>
           </div>
          </div>
         )}
        </div>
       </div>
      )}

      {/* --- Path 1: Order Now --- */}
      {/* --- UPDATED: Completed view now uses generateCartSummary --- */}
      {orderType === "Order Now" && step4Status !== "pending" && (
       <div
        key={4}
        className={`w-full border rounded-[16px] transition-all ${
         step4Status === "active"
          ? "border-[#EDEEF2] bg-white shadow-lg"
          : "border-[#EDEEF2] bg-white"
        }`}>
        <div className="py-[20px] md:px-[24px] px-3">
         <div className="flex flex-row justify-between max-md:gap-4">
          <div className="flex gap-4">
           <div
            className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
             step4Status === "completed"
              ? "bg-[#10B981] text-white"
              : "bg-[#054A86] text-white"
            }`}>
            {step4Status === "completed" ? <Check className="w-4 h-4" /> : 4}
           </div>
           <div className="flex-1">
            <h2
             className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
             Choose Your Meal
            </h2>
            {step4Status === "completed" && (
             <>
              {(() => {
               const summary = generateCartSummary(orderNowMenu);
               return (
                <>
                 <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                  {`“${summary.totalMeals} Meals”`}
                 </h4>
                 <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                  <h4 className="font-[700] tracking-[0.1px]">
                   {summary.line}
                  </h4>
                 </div>
                </>
               );
              })()}
             </>
            )}
           </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-1">
           {step4Status === "completed" && (
            <Button
             onClick={() => handleEditStep(4)}
             className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
             Edit
            </Button>
           )}
          </div>
         </div>

         {step4Status === "active" && (
          <div className="mt-4 pl-0 ">
           <Menu
            handleConfirmStep={handleConfirmStep}
            orderNowMenuFunc={orderNowMenuFunc}
           />
          </div>
         )}
        </div>
       </div>
      )}
      {orderType === "Order Now" && step4Status === "completed" && (
       <div className="w-full">
        <div className="main-container flex md:flex-row flex-col-reverse gap-4 !py-10">
         <Button
          className="md:min-w-[200px] bg-neutral-white text-[#545563] hover:bg-neutral-white border border-[#545563]"
          onClick={() => navigate("/vending-home")}>
          Continue Shopping
         </Button>
         <Button
          className="md:min-w-[200px]"
          onClick={() => navigate("/vending-home/cart")}>
          Continue to Cart
         </Button>
        </div>
       </div>
      )}

      {/* --- Path 2: Smart Grab --- */}
      {/* --- UPDATED: Completed view now uses generateCartSummary --- */}
      {orderType === "Smart Grab" && step4Status !== "pending" && (
       <div
        key={4}
        className={`w-full border rounded-[16px] transition-all ${
         step4Status === "active"
          ? "border-[#EDEEF2] bg-white shadow-lg"
          : "border-[#EDEEF2] bg-white"
        }`}>
        <div className="py-[20px] md:px-[24px] px-3">
         <div className="flex flex-row justify-between max-md:gap-4">
          <div className="flex gap-4">
           <div
            className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
             step4Status === "completed"
              ? "bg-[#10B981] text-white"
              : "bg-[#054A86] text-white"
            }`}>
            {step4Status === "completed" ? <Check className="w-4 h-4" /> : 4}
           </div>
           <div className="flex-1">
            <h2
             className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
             Choose Your Meal
            </h2>
            {step4Status === "completed" && (
             <>
              {(() => {
               const summary = generateCartSummary(smartGrabMenu);
               return (
                <>
                 <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                  {`“${summary.totalMeals} Meals”`}
                 </h4>
                 <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                  <h4 className="font-[700] tracking-[0.1px]">
                   {summary.line}
                  </h4>
                 </div>
                </>
               );
              })()}
             </>
            )}
           </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 gap-1">
           {step4Status === "completed" && (
            <Button
             onClick={() => handleEditStep(4)}
             className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
             Edit
            </Button>
           )}
          </div>
         </div>

         {step4Status === "active" && (
          <div className="mt-4 pl-0 ">
           <GrabMenu
            handleConfirmStep={handleConfirmStep}
            smartGrabMenuFunc={smartGrabMenuFunc}
            // savedMenuData={smartGrabMenu}
           />
          </div>
         )}
        </div>
       </div>
      )}
      {orderType === "Smart Grab" && step4Status === "completed" && (
       <div className="w-full">
        <div className="main-container flex md:flex-row flex-col-reverse gap-4 !py-10">
         <Button
          className="md:min-w-[200px] bg-neutral-white text-[#545563] hover:bg-neutral-white border border-[#545563]"
          onClick={() => navigate("/vending-home")}>
          Continue Shopping
         </Button>
         <Button
          className="md:min-w-[200px]"
          onClick={() => navigate("/vending-home/cart")}>
          Continue to Cart
         </Button>
        </div>
       </div>
      )}

      {/* --- Path 3: Start a Plan (Weekly) --- */}
      {/* --- UPDATED: Completed view now uses generatePlanSummary --- */}
      {orderType === "Start a Plan" &&
       planType === "weekly" &&
       step4Status !== "pending" && (
        <div
         key={4}
         className={`w-full border rounded-[16px] transition-all ${
          step4Status === "active"
           ? "border-[#EDEEF2] bg-white shadow-lg"
           : "border-[#EDEEF2] bg-white"
         }`}>
         <div className="py-[20px] md:px-[24px] px-3">
          <div className="flex flex-row justify-between max-md:gap-4">
           <div className="flex gap-4">
            <div
             className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
              step4Status === "completed"
               ? "bg-[#10B981] text-white"
               : "bg-[#054A86] text-white"
             }`}>
             {step4Status === "completed" ? <Check className="w-4 h-4" /> : 4}
            </div>
            <div className="flex-1">
             <h2
              className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
              Plan Your Week Menu
             </h2>
             {step4Status === "completed" && (
              <>
               {(() => {
                const summary = generatePlanSummary(weekMenu);
                return (
                 <>
                  <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                   {`“${summary.totalMeals} Meals”`}
                  </h4>
                  <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                   {summary.lines.map((line, idx) => (
                    <h4 key={idx} className="font-[700] tracking-[0.1px]">
                     {line}
                    </h4>
                   ))}
                  </div>
                 </>
                );
               })()}
              </>
             )}
            </div>
           </div>
           <div className="flex flex-col md:flex-row md:gap-4 gap-1">
            {step4Status === "completed" && (
             <div className="flex gap-4">
              <Button
               onClick={() => savedMenu(4)}
               className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
               Save Plan
              </Button>
              <Button
               onClick={() => handleEditStep(4)}
               className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
               Edit
              </Button>
             </div>
            )}
           </div>
          </div>

          {step4Status === "active" && (
           <div className="mt-4 pl-0 ">
            <PlanWeekly
             handleConfirmStep={handleConfirmStep}
             weekMenuFunc={weekMenuFunc}
             savedPlanData={weekMenu}
             allSavedPlans={allSavedPlans}
             apiMenuData={apiWeeklyMenu}
            />
           </div>
          )}
         </div>
        </div>
       )}
      {orderType === "Start a Plan" &&
       planType === "weekly" &&
       step4Status === "completed" && (
        <div className="w-full">
         <div className="main-container flex md:flex-row flex-col-reverse gap-4 !py-10">
          <Button
           className="md:min-w-[200px] bg-neutral-white text-[#545563] hover:bg-neutral-white border border-[#545563]"
           onClick={() => navigate("/vending-home")}>
           Continue Shopping
          </Button>
          <Button
           className="md:min-w-[200px]"
           onClick={() => navigate("/vending-home/cart")}>
           Continue to Cart
          </Button>
         </div>
        </div>
       )}
      {/* --- Path 4: Start a Plan (Monthly) --- */}
      {/* --- UPDATED: All monthly steps now use generatePlanSummary --- */}
      {orderType === "Start a Plan" && planType === "monthly" && (
       <>
        {/* --- Monthly Step 4 (Week 1) --- */}
        {step4Status !== "pending" && (
         <div
          key={4}
          className={`w-full border rounded-[16px] transition-all ${
           step4Status === "active"
            ? "border-[#EDEEF2] bg-white shadow-lg"
            : "border-[#EDEEF2] bg-white"
          }`}>
          <div className="py-[20px] md:px-[24px] px-3">
           <div className="flex flex-row justify-between max-md:gap-4">
            <div className="flex gap-4">
             <div
              className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
               step4Status === "completed"
                ? "bg-[#10B981] text-white"
                : "bg-[#054A86] text-white"
              }`}>
              {step4Status === "completed" ? <Check className="w-4 h-4" /> : 4}
             </div>
             <div className="flex-1">
              <h2
               className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
               Plan Your Week 1 Menu
              </h2>
              {step4Status === "completed" && (
               <>
                {(() => {
                 const summary = generatePlanSummary(weekMenu1);
                 return (
                  <>
                   <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                    {`“${summary.totalMeals} Meals”`}
                   </h4>
                   <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                    {summary.lines.map((line, idx) => (
                     <h4 key={idx} className="font-[700] tracking-[0.1px]">
                      {line}
                     </h4>
                    ))}
                   </div>
                  </>
                 );
                })()}
               </>
              )}
             </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-4 gap-1">
             {step4Status === "completed" && (
              <div className="flex gap-4">
               <Button
                onClick={() => savedMenu(4)}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
                Save Plan
               </Button>
               <Button
                onClick={() => handleEditStep(4)}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
                Edit
               </Button>
              </div>
             )}
            </div>
           </div>

           {step4Status === "active" && (
            <div className="mt-4 pl-0 ">
             <PlanWeekly
              handleConfirmStep={handleConfirmStep}
              weekMenuFunc={weekMenuFunc1}
              savedPlanData={weekMenu1}
              allSavedPlans={allSavedPlans}
              apiMenuData={apiMonthlyMenu?.[0]?.menu}
             />
            </div>
           )}
          </div>
         </div>
        )}

        {/* --- Monthly Step 5 (Week 2) --- */}
        {step5Status !== "pending" && (
         <div
          key={5}
          className={`w-full border rounded-[16px] transition-all ${
           step5Status === "active"
            ? "border-[#EDEEF2] bg-white shadow-lg"
            : "border-[#EDEEF2] bg-white"
          }`}>
          <div className="py-[20px] md:px-[24px] px-3">
           <div className="flex flex-row justify-between max-md:gap-4">
            <div className="flex gap-4">
             <div
              className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
               step5Status === "completed"
                ? "bg-[#10B981] text-white"
                : "bg-[#054A86] text-white"
              }`}>
              {step5Status === "completed" ? <Check className="w-4 h-4" /> : 5}
             </div>
             <div className="flex-1">
              <h2
               className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
               Plan Your Week 2 Menu
              </h2>
              {step5Status === "completed" && (
               <>
                {(() => {
                 const summary = generatePlanSummary(weekMenu2);
                 return (
                  <>
                   <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                    {`“${summary.totalMeals} Meals”`}
                   </h4>
                   <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                    {summary.lines.map((line, idx) => (
                     <h4 key={idx} className="font-[700] tracking-[0.1px]">
                      {line}
                     </h4>
                    ))}
                   </div>
                  </>
                 );
                })()}
               </>
              )}
             </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-4 gap-1">
             {step5Status === "completed" && (
              <div className="flex gap-4">
               <Button
                onClick={() => savedMenu(5)}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
                Save Plan
               </Button>
               <Button
                onClick={() => handleEditStep(5)}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
                Edit
               </Button>
              </div>
             )}
            </div>
           </div>

           {step5Status === "active" && (
            <div className="mt-4 pl-0 ">
             <PlanWeekly
              handleConfirmStep={handleConfirmStep}
              weekMenuFunc={weekMenuFunc2}
              savedPlanData={weekMenu2}
              allSavedPlans={allSavedPlans}
              apiMenuData={apiMonthlyMenu?.[1]?.menu}
             />
            </div>
           )}
          </div>
         </div>
        )}

        {/* --- Monthly Step 6 (Week 3) --- */}
        {step6Status !== "pending" && (
         <div
          key={6}
          className={`w-full border rounded-[16px] transition-all ${
           step6Status === "active"
            ? "border-[#EDEEF2] bg-white shadow-lg"
            : "border-[#EDEEF2] bg-white"
          }`}>
          <div className="py-[20px] md:px-[24px] px-3">
           <div className="flex flex-row justify-between max-md:gap-4">
            <div className="flex gap-4">
             <div
              className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
               step6Status === "completed"
                ? "bg-[#10B981] text-white"
                : "bg-[#054A86] text-white"
              }`}>
              {step6Status === "completed" ? <Check className="w-4 h-4" /> : 6}
             </div>
             <div className="flex-1">
              <h2
               className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
               Plan Your Week 3 Menu
              </h2>
              {step6Status === "completed" && (
               <>
                {(() => {
                 const summary = generatePlanSummary(weekMenu3);
                 return (
                  <>
                   <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                    {`“${summary.totalMeals} Meals”`}
                   </h4>
                   <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                    {summary.lines.map((line, idx) => (
                     <h4 key={idx} className="font-[700] tracking-[0.1px]">
                      {line}
                     </h4>
                    ))}
                   </div>
                  </>
                 );
                })()}
               </>
              )}
             </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-4 gap-1">
             {step6Status === "completed" && (
              <div className="flex gap-4">
               <Button
                onClick={() => savedMenu(6)}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
                Save Plan
               </Button>
               <Button
                onClick={() => handleEditStep(6)}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
                Edit
               </Button>
              </div>
             )}
            </div>
           </div>

           {step6Status === "active" && (
            <div className="mt-4 pl-0 ">
             <PlanWeekly
              handleConfirmStep={handleConfirmStep}
              weekMenuFunc={weekMenuFunc3}
              savedPlanData={weekMenu3}
              allSavedPlans={allSavedPlans}
              apiMenuData={apiMonthlyMenu?.[2]?.menu}
             />
            </div>
           )}
          </div>
         </div>
        )}

        {/* --- Monthly Step 7 (Week 4) --- */}
        {step7Status !== "pending" && (
         <div
          key={7}
          className={`w-full border rounded-[16px] transition-all ${
           step7Status === "active"
            ? "border-[#EDEEF2] bg-white shadow-lg"
            : "border-[#EDEEF2] bg-white"
          }`}>
          <div className="py-[20px] md:px-[24px] px-3">
           <div className="flex flex-row justify-between max-md:gap-4">
            <div className="flex gap-4">
             <div
              className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
               step7Status === "completed"
                ? "bg-[#10B981] text-white"
                : "bg-[#054A86] text-white"
              }`}>
              {step7Status === "completed" ? <Check className="w-4 h-4" /> : 7}
             </div>
             <div className="flex-1">
              <h2
               className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}>
               Plan Your Week 4 Menu
              </h2>
              {step7Status === "completed" && (
               <>
                {(() => {
                 const summary = generatePlanSummary(weekMenu4);
                 return (
                  <>
                   <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                    {`“${summary.totalMeals} Meals”`}
                   </h4>
                   <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                    {summary.lines.map((line, idx) => (
                     <h4 key={idx} className="font-[700] tracking-[0.1px]">
                      {line}
                     </h4>
                    ))}
                   </div>
                  </>
                 );
                })()}
               </>
              )}
             </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-4 gap-1">
             {step7Status === "completed" && (
              <div className="flex gap-4">
               <Button
                onClick={() => savedMenu(7)}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
                Save Plan
               </Button>
               <Button
                onClick={() => handleEditStep(7)}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0">
                Edit
               </Button>
              </div>
             )}
            </div>
           </div>

           {step7Status === "active" && (
            <div className="mt-4 pl-0 ">
             <PlanWeekly
              handleConfirmStep={handleConfirmStep}
              weekMenuFunc={weekMenuFunc4}
              savedPlanData={weekMenu4}
              allSavedPlans={allSavedPlans}
              apiMenuData={apiMonthlyMenu?.[3]?.menu}
             />
            </div>
           )}
          </div>
         </div>
        )}
        {orderType === "Start a Plan" &&
         planType === "monthly" &&
         step4Status === "completed" && (
          <div className="w-full">
           <div className="main-container flex md:flex-row flex-col-reverse gap-4 !py-10">
            <Button
             className="md:min-w-[200px] bg-neutral-white text-[#545563] hover:bg-neutral-white border border-[#545563]"
             onClick={() => navigate("/vending-home")}>
             Continue Shopping
            </Button>
            <Button
             className="md:min-w-[200px]"
             onClick={() => navigate("/vending-home/cart")}>
             Continue to Cart
            </Button>
           </div>
          </div>
         )}
       </>
      )}
     </div>
    </div>

    {/* ... (All sidebars are unchanged and correct from your code) ... */}
    {/* side bar sheet for timeframe */}
    <AnimatePresence>
     {isOpen && (
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
        <div className="flex items-center justify-between pb-[16px] ">
         <h2 className="text-[20px] leading-[24px] font-[600] md:text-[28px] md:leading-[36px] md:font-[700] ">
          Select a Timeframe
         </h2>
         <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
         </button>
        </div>
        <div className="flex-1 py-4 space-y-4">
         <p className="text-gray-600 text-[16px] leading-[24px] font-[400]">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since:
         </p>
         {timeSlots.map((frame, index) => {
          return (
           <div
            key={frame.id}
            className={` ${
             time === frame.label
              ? "bg-[#EAF5FF] border border-[#054A86]"
              : "border border-[#EDEEF2]"
            } py-[10px] cursor-pointer px-4 my-8 rounded-[8px]`}
            onClick={() => setTime(frame.label)}>
            <p className="text-[#2B2B43] text-[16px] leading-[24px] font-[700]">
             {frame.label}
            </p>
           </div>
          );
         })}
        </div>
        <div className="p-4  flex flex-col sm:flex-row gap-3">
         <button
          className="w-full bg-[#054A86]  text-white rounded-lg py-2 font-medium "
          onClick={handleConfirmStep}>
          Confirm
         </button>
         <button
          onClick={() => setIsOpen(false)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>

    {/* save new plan menu sidebar */}
    <AnimatePresence>
     {savePlanMenu && (
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
        <div className="flex items-center justify-between pb-[16px] ">
         <h2 className="text-[28px] leading-[36px] font-[700] ">
          Save Week Plan
         </h2>
         <button
          onClick={() => setSavePlanMenu(false)}
          className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
         </button>
        </div>
        <div className="flex-1 py-4 space-y-4">
         <p className="text-gray-600 text-[16px] leading-[24px] font-[400]">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since:
         </p>
         <div>
          <label className="text-[12px] leading-[16px] font-[600] text-[#545563]">
           Enter Plan Name
          </label>
          <Input
           type="text"
           placeholder="Example: Low Carbs"
           className="md:max-w-[350px] w-full bg-neutral-white"
           value={currentPlanName}
           onChange={(e) => setCurrentPlanName(e.target.value)}
          />
         </div>
         <div className="flex gap-3 items-center">
          <input
           type="checkbox"
           id="defaultCheck"
           className="h-5 w-5 cursor-pointer"
           checked={isDefaultPlan}
           onChange={(e) => setIsDefaultPlan(e.target.checked)}
          />
          <label htmlFor="defaultCheck" className="cursor-pointer">
           Set as default
          </label>
         </div>
        </div>
        <div className="md:p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setSavePlanMenu(false)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          className="w-full bg-[#054A86]  text-white rounded-lg py-2 font-medium "
          onClick={confirmSavePlan}>
          Confirm
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
   </main>
   <MobileFooterNav />
  </div>
 );
};

export default OrderNow;
