import React, { useState, useEffect } from "react";

import { Check } from "lucide-react";
import { Button } from "../ui/button";
import VendingHeader from "./VendingHeader";
import BreadCrumb from "../home/BreadCrumb";
import Footer from "../layout/Footer";
import GrabMenu from "./GrabMenu";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { motion, AnimatePresence } from "framer-motion";

import { X } from "lucide-react";
import Menu from "./Menu";
import PlanWeekly from "./PlanWeekly";
import { Input } from "../ui/input";
import Header from "@/pages/catering/components/layout/Header";

type StepStatus = "completed" | "active" | "pending";

interface Step {
 id: number;
 title: string;
 status: StepStatus;
 content?: React.ReactNode;
 subtitle?: string;
}

const OrderNow = () => {
 const navigate = useNavigate();
 const [currentStep, setCurrentStep] = useState(2);
 const [pickupLocation, setPickupLocation] = useState(
  "Barsha 1, Near Mall of the Emirates, St. 12."
 );
 const [time, setTime] = useState("");
 const [isOpen, setIsOpen] = useState<Boolean>(false);
 const [pickOrder, SetPickOrder] = useState("Pickup Today");
 const [orderType, setOrderType] = useState<string>("Order Now");
 const [planType, setPlanType] = useState<string>("weekly");
 const [savePlanMenu, setSavePlanMenu] = useState<boolean>(false);

 const getStepStatus = (stepId: number): StepStatus => {
  if (stepId < currentStep) return "completed";
  if (stepId === currentStep) return "active";
  return "pending";
 };

 const handleEditLocation = () => {
  setCurrentStep(1);
 };
 const savedMenu = () => {
  setSavePlanMenu(!savePlanMenu);
 };

 const handleOrderTypeSelect = (type: string) => {
  setOrderType(type);
 };

 const handleConfirmStep = () => {
  if (currentStep < 5) {
   setCurrentStep(currentStep + 1);
   if (isOpen) {
    setIsOpen(false);
   }
  }
 };
 const timeFrame = [
  { time: "8:00 AM – 10:00 AM" },
  { time: "10:00 AM – 12:00 PM" },
  { time: "12:00 PM – 2:00 PM" },
  { time: "2:00 PM – 4:00 PM" },
  { time: "4:00 PM – 6:00 PM" },
 ];
 const steps: Step[] = [
  {
   id: 1,
   title: "Select Pickup Location",
   status: getStepStatus(1),
   subtitle: pickupLocation,
  },
  {
   id: 2,
   title: "Choose How You'd Like to Order",
   status: getStepStatus(2),
   content: (
    <div className="mt-6 space-y-6">
     <div className="flex gap-4 md:flex-row flex-col">
      <Button
       onClick={() => handleOrderTypeSelect("Order Now")}
       className={` ${
        orderType === "Order Now"
         ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
         : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
       } px-6 py-3  rounded-[16px] font-bold`}>
       Order Now
      </Button>
      <Button
       onClick={() => handleOrderTypeSelect("Start a Plan")}
       className={` ${
        orderType === "Start a Plan"
         ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
         : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
       } px-6 py-3  rounded-[16px] font-bold`}>
       Start a Plan
      </Button>
      <Button
       onClick={() => handleOrderTypeSelect("Smart Grab")}
       className={` ${
        orderType === "Smart Grab"
         ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
         : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
       } px-6 py-3  rounded-[16px] font-bold`}>
       Smart Grab
      </Button>
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
        Browse our daily menu of 13–15+ prepared menus, available Monday to
        Friday. Simply place your order now, and we'll make it fresh just for
        you. Your meal will be stocked in our vending stations within 24 hours.
       </p>

       {orderType === "Start a Plan" && (
        <>
         <p className="text-[14px] leading-[20px] text-[#545563] mb-6">
          Select a plan to get started{" "}
         </p>
         <div className="flex gap-4 pb-6">
          <Button
           onClick={() => setPlanType("weekly")}
           className={` ${
            planType === "weekly"
             ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
             : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
           } px-6 py-3  rounded-[16px] font-bold`}>
           Weekly
          </Button>
          <Button
           onClick={() => setPlanType("monthly")}
           className={` ${
            planType === "monthly"
             ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
             : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
           } px-6 py-3  rounded-[16px] font-bold`}>
           Monthly
          </Button>
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
   ),
   subtitle: orderType === "Start a Plan" ? planType : orderType,
  },
  {
   id: 3,
   title: "Set Your Pickup Time",
   status: getStepStatus(3),
   content: (
    <div className="mt-6 space-y-6">
     <div className="flex gap-4 md:flex-row flex-col">
      <Button
       onClick={() => SetPickOrder("Pickup Today")}
       className={` ${
        pickOrder === "Pickup Today"
         ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
         : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
       } px-6 py-3  rounded-[16px] font-bold`}>
       Pickup Today
      </Button>
      <Button
       onClick={() => SetPickOrder("Pickup in 24")}
       className={` ${
        pickOrder === "Pickup in 24"
         ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
         : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
       } px-6 py-3  rounded-[16px] font-bold`}>
       Pickup in 24
      </Button>
     </div>

     <div className="flex md:flex-row flex-col items-start gap-8">
      <div className="flex-1">
       <h3 className="text-[20px] leading-[28px] font-bold text-[#545563] mb-3">
        Select a timeframe to pickup your meal
       </h3>
       <p className="text-[14px] leading-[20px] text-[#545563] mb-4">
        Sub copy if needed
       </p>

       <Button
        // onClick={handleConfirmStep}
        onClick={() => setIsOpen(true)}
        disabled={!orderType}
        className="bg-[#054A86] hover:bg-[#043968] text-white px-8 py-3 rounded-lg font-bold">
        Select Timeframe{" "}
       </Button>
      </div>
     </div>
    </div>
   ),
   subtitle: pickOrder + time,
  },
  {
   id: 4,
   title: (planType === "weekly" && orderType === "Start a Plan") ? "Plan Your Week Menu" : "Choose Your Meal",
   status: getStepStatus(4),
   content:
    orderType === "Smart Grab" ? (
     <GrabMenu handleConfirmStep={handleConfirmStep} />
    ) : orderType === "Order Now" ? (
     <Menu handleConfirmStep={handleConfirmStep} />
    ) : (
     <PlanWeekly handleConfirmStep={handleConfirmStep} />
    ),
   subtitle: orderType === "Smart Grab" ? "Soft Drink" : "Angus Burger",
  },
 ];

 return (
  <div className="min-h-screen">
   {/* <VendingHeader /> */}
   <Header/>
   <main className="flex-1 bg-[#F7F7F9]">
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
      {steps.map((step, index) => (
       <div
        key={step.id}
        className={`w-full border rounded-[16px] transition-all ${
         step.status === "active"
          ? "border-[#EDEEF2] bg-white shadow-lg"
          : step.status === "completed"
          ? "border-[#EDEEF2] bg-white"
          : "hidden"
        }`}>
        <div className="py-[20px] md:px-[24px] px-3">
         <div className="flex md:flex-row flex-col justify-between">
          <div className="flex gap-4">
           <div
            className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
             step.status === "completed"
              ? "bg-[#10B981] text-white"
              : step.status === "active"
              ? "bg-[#054A86] text-white"
              : "bg-[#E5E7EB] text-[#9CA3AF]"
            }`}>
            {step.status === "completed" ? (
             <Check className="w-4 h-4" />
            ) : (
             step.id
            )}
           </div>
           <div className="flex-1">
            <h2
             className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] ${
              step.status === "pending" ? "text-[#9CA3AF]" : "text-[#545563]"
             }`}>
             {step.title}
            </h2>
            {step.subtitle && step.status === "completed" && (
             <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
              {step.subtitle}
             </h4>
            )}
           </div>
          </div>
          {/* save plan button */}
          {orderType === "Start a Plan" && step.id === 4 && currentStep > 4 && (
           <Button
            onClick={() => savedMenu()}
            className="border text-[14px] hover:bg-[#054A86] hover:text-white leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] mt-4 md:mt-0">
            Save Plan
           </Button>
          )}
          {/* edit button */}
          {step.status === "completed" && (
           <Button
            onClick={() => setCurrentStep(index + 1)}
            className="border text-[14px] hover:bg-[#054A86] hover:text-white leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] mt-4 md:mt-0">
            Edit
           </Button>
          )}
         </div>

         {/* Step Content */}
         {step.status === "active" && step.content && (
          <div className="mt-4 pl-0 ">{step.content}</div>
         )}
        </div>
       </div>
      ))}
     </div>
     {currentStep > 4 && (
      <div className="w-full">
       <div className="main-container flex md:flex-row flex-col gap-4 !py-10">
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
    </div>

    {/* side bar sheet for timeframe */}
    <AnimatePresence>
     {isOpen && (
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
        className="bg-white w-full px-8 py-4 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-[16px] ">
         <h2 className="text-[28px] leading-[36px] font-[700] ">
          Select a Timeframe
         </h2>
         <button
          onClick={() => setIsOpen(false)}
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

         {timeFrame.map((frame, index) => {
          return (
           <div
            className={` ${
             time === frame.time
              ? "bg-[#EAF5FF]  border border-[#054A86]"
              : "border border-[#EDEEF2]"
            } py-[10px] cursor-pointer  px-4 my-8  rounded-[8px]`}
            onClick={() => setTime(frame.time)}>
            <p className="text-[#2B2B43] text-[16px] leading-[24px] font-[700]">
             {frame.time}
            </p>
           </div>
          );
         })}
        </div>

        {/* Footer Buttons */}
        <div className="p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setIsOpen(false)}
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

    {/* save new plan menu sidebar */}
    <AnimatePresence>
     {savePlanMenu && (
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
        className="bg-white w-full px-8 py-4 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-[16px] ">
         <h2 className="text-[28px] leading-[36px] font-[700] ">
          Save Week Plan
         </h2>
         <button
          onClick={() => savedMenu()}
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
         <div>
          <label className="text-[12px] leading-[16px] font-[600] text-[#545563]">Enter Plan Name</label>
          <Input type="text" placeholder="Example: Low Carbs" className="md:max-w-[350px] w-full bg-neutral-white"/>
         </div>
         <div className="flex gap-3">
          <input type="checkbox" className="h-5 w-5"/>
          <span>Set as default</span>
        </div>
        </div>

        

        {/* Footer Buttons */}
        <div className="p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => savedMenu()}
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

   <Footer />
  </div>
 );
};

export default OrderNow;
