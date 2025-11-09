import React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface FoodItem {
 imgSrc: string;
 heading: string;
 imgAlt: string;
 description: string;
 price: string;
}
interface MenuProps {
 handleConfirmStep: () => void;
}

const PlanWeekly: React.FC<MenuProps> = ({ handleConfirmStep }) => {
 const [openDialouge, setOpenDialouge] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
 const [isSheetOpen, setIsSheetOpen] = useState(false);
 const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
 const [toaster, setToaster] = useState<boolean>(false);
 const [tab, setTab] = useState(null);
 const [tab1, setTab1] = useState(null);
 const [savedPlans, setSavedPlans] = useState(false);
 const [selectedPlan, setSelectedPlan] = useState(null);
 const [quantity, setQuantity] = useState(1);

 const handleCardClick = (item: FoodItem) => {
  setSelectedItem(item);
  setIsSheetOpen(true);
 };
 const confirmFunc = () => {
  setOpenDialouge(false);
  setSelectedItems([]);
  setToaster(true);
  setTimeout(() => {
   setToaster(false);
  }, 2000);
 };

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

 const foodData: FoodItem[] = [
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food1",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food2",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food3",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food4",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food5",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food6",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food7",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food8",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food9",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food10",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food11",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food12",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food13",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
 ];
 const savedPlansData = [
  { name: "My plan 01" },
  { name: "Low Carbs" },
  { name: "High Protein" },
  { name: "my plan 2" },
 ];
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

 return (
  <div className="min-h-screen">
   <main className="flex-1 bg-neutral-white relative">
    <div className="w-full bg-transparent pt-2 pb-6">
     <div className="md:px-[30px]">
      {/* title and button */}
      <div className="flex md:flex-row gap-2 flex-col justify-between items-center pb-2 md:py-4">
       <h2 className="text-[16px] text-[#2B2B43] leading-[24px] font-[700] tracking-[0.1px]">
        Choose meals for each weekday :
       </h2>
       <div className="md:flex gap-4 hidden md:flex-row flex-col">
        {selectedItems.length > 0 && (
         <Button
          className="bg-transparent hover:bg-transparent text-[#545563] border border-[#545563]"
          onClick={() => setOpenDialouge(true)}>
          Reset
         </Button>
        )}
        {selectedItems.length > 0 ? (
         <Button
          className="bg-[#054A86] hover:bg-[#054A86]"
          onClick={() => handleConfirmStep()}>
          Confirm and review
         </Button>
        ) : (
         <Button className="bg-[#F7F7F9] hover:bg-[#F7F7F9] text-[#C7C8D2]">
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
         // Uses the existing 'tab' state for the current selection
         value={tab}
         // Uses the existing 'setTab' function to update state
         onChange={(e) => setTab(parseInt(e.target.value, 10))}
         className="w-full h-[30px] p-0 px-2  text-[12px] leading-[18px] 
                   border-2 border-[#054A86] text-[#054A86] bg-[#EAF5FF] rounded-[8px] 
                   focus:ring-[#054A86] focus:border-[#054A86] font-medium appearance-none"
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
        {/* Replaced image with inline SVG for self-containment */}
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
        {selectedItems?.length === 0
         ? "No selected meals"
         : `Selected for ${days[tab]?.day} : ${selectedItems
            .map((item) => item?.heading)
            .join(", ")}`}
       </p>
       <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
        Total: <span className="font-[700]">{selectedItems.length} Meals</span>
       </p>
      </div>
     </div>
    </div>

    <div className="w-full h-full pb-4">
     <div className="md:px-[30px] grid grid-cols-12  md:flex md:gap-[24px] gap-[12px] flex-wrap">
      {foodData.map((data, index) => {
       return (
        <div
         key={index}
         onClick={() => handleCardClick(data)}
         className={`w-full border ${
          selectedItems.find((item) => item.imgAlt === data.imgAlt)
           ? "border-[#054A86]"
           : "border-[#EDEEF2]"
         } max-w-[306px] max-md:col-span-6 bg-neutral-white rounded-[16px] px-3 pt-3 pb-5 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}>
         <img
          src={data.imgSrc}
          alt={data.imgAlt}
          className="block w-full md:h-auto h-[120px] rounded-[12px] sm:rounded-[16px] object-cover"
         />
         <h3 className="text-[16px] leading-[24px] md:text-[24px] pt-3 pb-1 md:leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43]">
          {data.heading}
         </h3>
         <p className="text-[14px] line-clamp-2 leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
          {data.description}
         </p>
         <div className="flex justify-between items-center pt-2">
          <h4 className="text-[13px] leading-[18px] md:text-[16px]  md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
           {data.price}
          </h4>

          {selectedItems.find((item) => item.imgAlt === data.imgAlt) ? (
           <>
            {/* Quantity Stepper */}
            <div className="flex items-center  ">
             <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-black bg-[#EDEEF2] rounded-[8px]">
              <MinusIcon className="w-3 h-3" />
             </button>
             <span className="md:px-3 px-2 md:text-lg text-sm font-medium">
              {quantity}
             </span>
             <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-black bg-[#EDEEF2] rounded-[8px]">
              <PlusIcon className="w-3 h-3" />
             </button>
            </div>
           </>
          ) : (
           <img src="/images/icons/plusicon.svg" alt="plus icon" />
          )}
         </div>
        </div>
       );
      })}
     </div>
     <div className="flex gap-4 md:hidden  flex-col pt-6">
      {selectedItems.length > 0 && (
       <Button
        className="bg-transparent hover:bg-transparent text-[#545563] border border-[#545563]"
        onClick={() => setOpenDialouge(true)}>
        Reset
       </Button>
      )}
      {selectedItems.length > 0 ? (
       <Button
        className="bg-[#054A86] hover:bg-[#054A86]"
        onClick={() => handleConfirmStep()}>
        Confirm and review
       </Button>
      ) : (
       <Button className="bg-[#F7F7F9] hover:bg-[#F7F7F9] text-[#C7C8D2]">
        Confirm and review
       </Button>
      )}
     </div>
    </div>

    {/* Sidebar Sheet */}
    <AnimatePresence>
     {selectedItem && (
      <motion.div
       className="fixed inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       {/* Sidebar Panel */}
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
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

        {/* Image */}
        <img
         src={selectedItem.imgSrc}
         alt={selectedItem.imgAlt}
         className="w-full object-cover h-60 md:h-[343px] rounded-[16px]"
        />

        {/* Content */}
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

        {/* Footer Buttons */}
        <div className="md:p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setSelectedItem(null)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          onClick={() => {
           setSelectedItems((prev) => [...prev, selectedItem]);
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

    {/* menu */}

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
    {/* reset dialouge mobile*/}
    <AnimatePresence>
     {openDialouge && (
      <motion.div
       className="fixed md:hidden inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       {/* Sidebar Panel */}
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-4 pb-[24px] md:pb-[16px]">
         <img src="/images/icons/info_icon.svg" alt="alert" />
         <h2 className="text-[28px] leading-[36px] font-[700]  ">
          Reset Menu Selection?
         </h2>
        </div>

        {/* Content */}
        <div className="flex-1 py-0 ">
         <p className="text-gray-600 text-[16px] leading-[24px] font-[400] tracking-[0.1px]">
          Are you sure you want to reset your menu selection?
         </p>
        </div>

        {/* Footer Buttons */}
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

    {/* toaster  */}
    {toaster && (
     <div className="fixed top-[104px] left-1/2 transform -translate-x-1/2 max-w-[540px] w-full h-[52px] bg-[#E8F9F1] rounded-[16px] shadow-[0px_4px_10px_rgba(232,249,241,0.6)] flex items-center px-4 gap-3 z-50">
      <svg
       width="20"
       height="20"
       viewBox="0 0 20 20"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
       className="flex-shrink-0">
       <g clipPath="url(#clip0_1_9188)">
        <path
         d="M10.0013 18.3334C14.6037 18.3334 18.3346 14.6025 18.3346 10.0001C18.3346 5.39771 14.6037 1.66675 10.0013 1.66675C5.39893 1.66675 1.66797 5.39771 1.66797 10.0001C1.66797 14.6025 5.39893 18.3334 10.0013 18.3334Z"
         stroke="#2B2B43"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
        />
        <path
         d="M10 13.3333V10"
         stroke="#2B2B43"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
        />
        <path
         d="M10 6.66675H10.0083"
         stroke="#2B2B43"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
        />
       </g>
       <defs>
        <clipPath id="clip0_1_9188">
         <rect width="20" height="20" fill="white" />
        </clipPath>
       </defs>
      </svg>
      <span className="flex-grow whitespace-nowrap text-[#2B2B43] font-medium text-sm">
       Menu selections have been successfully reset.
      </span>
     </div>
    )}
    {/* saved plans sidebar */}
    <AnimatePresence>
     {savedPlans && (
      <motion.div
       className="fixed inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       {/* Sidebar Panel */}
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full md:px-8 md:py-4 px-[16px] py-[22px] max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-[16px] ">
         <h2 className="text-[28px] leading-[36px] font-[700] ">Saved Plans</h2>
         <button
          onClick={() => setSavedPlans(false)}
          className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
         </button>
        </div>

        {/* Content */}
        <div className="flex-1 py-4 space-y-4">
         <p className="text-gray-600 text-[16px] leading-[24px] font-[400]">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since:
         </p>

         {savedPlansData.map((data, index) => {
          return (
           <div
            className={` ${
             selectedPlan === data.name
              ? "bg-[#EAF5FF]  border border-[#054A86]"
              : "border border-[#EDEEF2]"
            } py-[10px] cursor-pointer  px-4 my-8  rounded-[8px]`}
            onClick={() => setSelectedPlan(data.name)}>
            <p className="text-[#2B2B43] text-[16px] leading-[24px] font-[700]">
             {data.name}
            </p>
           </div>
          );
         })}
        </div>

        {/* Footer Buttons */}
        <div className="md:p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setSavedPlans(false)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button
          className="w-full bg-[#054A86]  text-white rounded-lg py-2 font-medium "
          onClick={handleConfirmStep}>
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
