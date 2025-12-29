import BreadCrumb from "@/components/home/BreadCrumb";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./catering/components/layout/Header";
import Shrimmer from "@/components/ui/Shrimmer";
import LazyLoad from "@/components/ui/LazyLoad";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuByDay } from "../redux/slices/menuSlice";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import { fetchCartData } from "../redux/slices/cartSlice";

// Define the interface for the food item
interface FoodItem {
 name: string;
 price: string;
 description: string;
 imgAlt: string;
 offer: string;
 terms_and_conditions: string;
 image_url: string;
 //  title: string;
}

const VendingMenu = () => {
 const [scrolled, setScrolled] = useState(false);
 const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
 const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
 const [isSheetOpen, setIsSheetOpen] = useState(false);
 const [tab, setTab] = useState<number>(0);
 const dispatch = useDispatch();
 const { foodData, isLoading, error } = useSelector(
  (state: any) => state?.menu
 );
 const userData = useSelector((state: any) => state?.user?.user);
 const [orderData, setOrderData] = useState<any>({
  user: userData ? userData.id : "",
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
 });
 useEffect(() => {
  const storedOrder = sessionStorage.getItem("orderData");
  if (storedOrder) {
   try {
    const parsed = JSON.parse(storedOrder);
    setOrderData(parsed);
   } catch (err) {
    console.error("Error parsing orderData:", err);
   }
  }
 }, []);

 const days = [
  { day: "Monday" },
  { day: "Tuesday" },
  { day: "Wednesday" },
  { day: "Thursday" },
  { day: "Friday" },
 ];
 // Function to handle card click and open the item details in the sidebar
 const handleCardClick = (item: FoodItem) => {
  setSelectedItem(item);
  setIsSheetOpen(true);
 };

 // Modified startOrder to dispatch to Redux
 const startOrder = () => {
  if (selectedItem && days?.[tab]?.day) {
   const dayKey = days[tab].day.toLowerCase(); // e.g. "monday"

   // Dispatch to Redux
   // Dispatch to Redux - REMOVED for API sync transition
   // dispatch(
   //  addItemToCart({
   //   day: dayKey,
   //   item: selectedItem,
   //   userId: userData?.id,
   //  })
   // );
   console.log(
    "Add to cart clicked in VendingMenu (Logic pending API integration)"
   );

   // Local state update (legacy, keeping for safety or removing if fully migrated)
   // We will keep setOrderData for now to avoid breaking local component logic if any rely on it,
   // but primarily relying on Redux sync.
   // Actually, let's keep the existing local logic as a backup or just rely on the effect sync?
   // Better to just replicate the logic locally to update UI immediately without waiting for a re-render from selector if we were using it.
   // But we aren't using useSelector for orderData here yet.

   setOrderData((prev: any) => {
    const existingDayItems = prev[dayKey] || [];
    const exists = existingDayItems.some(
     (item: any) => item.name === selectedItem.name
    );

    if (!exists) {
     const updatedDayItems = [...existingDayItems, selectedItem];

     const updatedOrder = {
      ...prev,
      user: userData?.id,
      [dayKey]: updatedDayItems,
     };

     // console.log("✅ Updated Order Data:", JSON.stringify(updatedOrder));
     // sessionStorage.setItem("orderData", JSON.stringify(updatedOrder)); // Redux handles this now?
     // Actually, let's let Redux handle the session storage update to avoid race conditions.
     // But wait, our reducer does it. So we don't need to do it here.
     return updatedOrder;
    }
    return prev;
   });
  }
 };

 // Handle scroll to change sticky header visibility
 useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY >= 220);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
 }, []);

 useEffect(() => {
  if (days?.[tab]?.day) {
   dispatch(fetchMenuByDay(days[tab].day));
  }
 }, [tab, dispatch]);

 return (
  <div className="min-h-screen">
   {/* <VendingHeader /> */}
   <Header />
   <main className="flex-1 bg-[#F7F7F9]">
    {/* BreadCrumb and title (hidden when scrolled) */}
    <div
     className={`w-full bg-neutral-white pt-2 pb-6 ${
      scrolled ? "hidden" : ""
     }`}>
     <div className="main-container">
      <BreadCrumb />
      <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
       Vending Menu
      </h2>
     </div>
    </div>

    {/* Sticky Header ( when scrolled) */}
    <div
     className={`w-full sticky top-[64px] bg-neutral-white pt-2 pb-6 transition-all duration-300 ${
      scrolled ? " shadow-lg" : "shadow-none"
     }`}>
     <div className="main-container">
      <div className="md:flex hidden justify-between items-center py-4 md:flex-row flex-col gap-2">
       <h2 className="md:text-[24px] text-[18px] leading-[24px] text-[#2B2B43] md:leading-[32px] font-[700] tracking-[0.1px]">
        Browse our daily menu of 13 chef-prepared meals
       </h2>
       <Button className="bg-[#054A86] max-md:w-full hidden md:block">
        Start Your Order
       </Button>
      </div>

      <div className="flex gap-3 flex-wrap pt-[8px] w-full">
       {/* Mobile Select Field (New - Visible on screens < md) */}
       <div className="flex gap-2 md:hidden  w-full items-center ">
        <select
         // Uses the existing 'tab' state for the current selection
         value={tab}
         // Uses the existing 'setTab' function to update state
         onChange={(e) => setTab(parseInt(e.target.value, 10))}
         className="w-1/2 h-[40px] p-0 px-2 text-[12px] leading-[18px] 
                   border border-neutral-gray-light text-neutral-gray-dark bg-neutral-white rounded-[8px] 
                   focus:ring-[#054A86]  focus:border-[#054A86] font-medium appearance-none"
         // Custom styling to add a dropdown arrow icon
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
        <Button className="bg-[#054A86] w-1/2">Start Your Order</Button>
       </div>

       {/* Desktop Tabs (Hidden on screens < md, uses updated max-width [212px]) */}
       <div className="hidden md:flex w-full items-center gap-3 flex-wrap">
        {days.map((week, index) => {
         return (
          <div
           key={index}
           onClick={() => setTab(index)}
           className={`md:h-[56px] h-[26px] ${
            tab === index
             ? // Active state
               "bg-[#EAF5FF] border-2 border-[#054A86]"
             : // Inactive state - adding a subtle border for consistency
               " bg-neutral-white border border-[#C7C8D2]"
           } cursor-pointer text-center inline-flex items-center w-full justify-center md:max-w-[212px] max-w-[80px] rounded-[16px] `}>
           <span className="md:text-[16px] text-[12px] leading-[18px] md:leading-[24px] font-[400]">
            {week?.day}
           </span>
          </div>
         );
        })}
       </div>
      </div>
     </div>
    </div>

    {/* Display menu items for the selected day */}
    <div className="w-full h-full pb-[100px] pt-6">
     <LazyLoad>
      <div className="main-container flex gap-[24px] flex-wrap">
       {isLoading ? (
        <div className="w-full">
         <Shrimmer />
        </div>
       ) : (
        foodData?.map((data: any, index: number) => (
         <div
          key={index}
          onClick={() => handleCardClick(data)}
          className="w-full border border-[#EDEEF2] max-w-[354px] bg-neutral-white rounded-[16px] px-3 pt-3 pb-5 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
          <img
           src={data.image_url}
           alt={data?.imgAlt || "Food Item"}
           className="block w-full md:max-h-[180px] h-full rounded-[12px] sm:rounded-[16px] object-cover"
          />
          <h3 className="text-[24px] pt-3 pb-1 leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43]">
           {data.name}
          </h3>
          <p className="text-[14px] line-clamp-2 leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
           {data.description}
          </p>
          <h4 className="text-[16px] pt-2 leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
           AED {data.price}
          </h4>
         </div>
        ))
       )}
      </div>
     </LazyLoad>
    </div>

    {/* Sidebar Sheet (Details of selected item) */}
    <AnimatePresence>
     {selectedItem && (
      <motion.div
       className="fixed inset-0 z-50 flex justify-end bg-black/75"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full px-8 py-4 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between pb-[16px]">
         <h2 className="text-[28px] leading-[36px] font-[700]">
          {selectedItem.name}
         </h2>
         <button
          onClick={() => setSelectedItem(null)}
          className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
         </button>
        </div>
        <img
         src={selectedItem.image_url}
         alt={selectedItem.imgAlt}
         className="w-full object-cover h-60 md:h-[343px] rounded-[16px]"
        />
        <div className="flex-1 p-5 space-y-4">
         <p className="text-gray-600 text-sm">{selectedItem.description}</p>
         <div className="text-lg font-semibold">{selectedItem.price}</div>
         <div className="pb-[24px]">
          <p>Buy one get one for free</p>
         </div>
         <div>
          <Link
           className="text-[#056AC1] text-[16px] leading-[24px] font-[400] tracking-[0.1px] underline"
           to={"/"}>
           Terms & conditions Apply
          </Link>
         </div>
        </div>
        <div className="p-4 flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setSelectedItem(null)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          onClick={() => {
           startOrder();
           setIsSheetOpen(false);
           setSelectedItem(null);
          }}
          className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium hover:bg-blue-700">
          Start Your Order
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
   </main>
   <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default VendingMenu;
