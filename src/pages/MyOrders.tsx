import React from "react";
import locationimg from "@/assets/../../public/images/icons/locaion-icon.svg";
import calendar from "@/assets/../../public/images/icons/calendar.svg";
import { Button } from "./catering/components/ui/button";
import { useNavigate } from "react-router-dom";
import VendingHeader from "@/components/vending_home/VendingHeader";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import OrderList from "@/components/Cart/OrderList";
import TotalOrders from "@/components/checkout/TotalOrders";
import VendingMap from "@/components/vending_home/VendingMap";
import { useState } from "react";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import Header from "./catering/components/layout/Header";
const MyOrders = () => {
 const navigate = useNavigate();
 const [step, setStep] = useState(1); // Step state to track progress

 // Function to handle changing the step
 const changeStep = (newStep) => {
  if (newStep >= 1 && newStep <= 2) {
   setStep(newStep);
  }
 };
 const items = [
  {
   id: 1,
   name: "Angus Burger",
   notes: "Other notes or copy here",
   pickupLocation: " Barsha 1, Near Mall of the Emirates.",
   imageUrl: "/images/vending_home/food.svg", // Placeholder image
   quantity: 2,
   price: 12.4,
  },
  {
   id: 2,
   name: "Angus Burger",
   notes: "Other notes or copy here",
   pickupLocation: " Barsha 1, Near Mall of the Emirates.",
   imageUrl: "/images/vending_home/food.svg", // Placeholder image
   quantity: 2,
   price: 53.0,
  },
  {
   id: 3,
   name: "Angus Burger",
   notes: "Other notes or copy here",
   pickupLocation: " Barsha 1, Near Mall of the Emirates.",
   imageUrl: "/images/vending_home/food.svg", // Placeholder image
   quantity: 1,
   price: 35.0,
  },
 ];
 return (
  <div className="min-h-screen flex flex-col">
   <Header />
   {/* Breadcrumbs and title section  */}
   <div className="w-full bg-white pt-2 pb-6">
    <div className="main-container">
     <BreadCrumb />
     <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
      Cart
     </h2>
    </div>
   </div>
   <main className="flex-1 bg-background max-md:pb-24">
    <div className="main-container !py-6 ">
     <div className="grid gap-4 md:gap-[30px] md:grid-cols-[1fr_320px]">
      {/* LEFT: Booking Card + Details */}
      <div className="space-y-4">
       {/* Booking Header Card */}
       <div
        className="rounded-2xl border border-[#EDEEF2] bg-white"
        onClick={() => setStep(2)}
        onDoubleClick={() => setStep(1)}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4">
         <div className="flex w-full flex-col md:flex-row gap-1">
          <div className="flex flex-col justify-between gap-3 w-full">
           <p className="text-[24px] font-bold leading-8 text-#2B2B43">
            Order ID 67352427
           </p>
           <div className="mt-1 flex items-center gap-2">
            {step === 1 && (
             <span className="h-1.5 w-1.5 rounded-full bg-[#054A86]" />
            )}
            {step === 2 && (
             <span className="h-1.5 w-1.5 rounded-full bg-[#1ABF70]" />
            )}

            {step === 1 && (
             <span className="text-sm font-semibold leading-5">
              In progress
             </span>
            )}
            {step === 2 && (
             <span className="text-sm font-semibold leading-5">Completed</span>
            )}
           </div>
          </div>
          <div className="flex md:items-end items-start max-md:pt-4 flex-col  gap-3 w-full">
           <div className="flex max-md:flex-row-reverse gap-2 items-center">
            <p className="text-xs font-semibold leading-[16px] text-[#83859C]">
             Location at Barsha 1, near Mall of the Emirates
            </p>
            <img
             src={locationimg}
             alt="location Icon"
             className="w-[16px] h-[16px]"
            />
           </div>
           <div className="flex gap-2 items-center max-md:flex-row-reverse">
            <p className="text-xs font-semibold leading-[16px] text-[#83859C]">
             06 November 2025, 08:00 PM
            </p>
            <img
             src={calendar}
             alt="calendar Icon"
             className="w-[16px] h-[16px]"
            />
           </div>
          </div>
         </div>
        </div>

        {/* Progress */}
        <div className="px-4 pt-3">
         {/* ==================================================================== */}
         {/* 1. DESKTOP / TABLET LAYOUT (Horizontal) - Original Code - Visible SM+ */}
         {/* ==================================================================== */}
         <div className="hidden sm:block">
          {/* Progress Circles and Horizontal Bar (Original Structure) */}
          <div className="flex justify-between w-full gap-2 items-center">
           {/* Step 1 Circle */}
           <span
            className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${
             step >= 1 ? "bg-[#1ABF70]" : "bg-[#EDEEF2]"
            } text-white ring-[#1ABF70]`}>
            <svg
             width="20"
             height="20"
             viewBox="0 0 20 20"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
             <path
              d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
             />
            </svg>
           </span>

           {/* Progress Bar (Horizontal) */}
           <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
             className={`absolute left-0 top-0 h-full ${
              step === 1 ? "w-1/2" : step === 2 ? "w-full" : "w-0"
             } rounded-full bg-emerald-500`}
             aria-hidden
            />
           </div>

           {/* Step 2 Circle */}
           <span
            className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${
             step >= 2
              ? "bg-[#1ABF70]"
              : "bg-[#EDEEF2] text-[#2B2B43] font-semibold"
            } text-white ring-[#1ABF70]`}
            style={{
             // Ensure the circle doesn't get squished by flex
             flexShrink: 0,
            }}>
            {step >= 2 ? (
             <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
               d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
               stroke="white"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
              />
             </svg>
            ) : (
             "2"
            )}
           </span>
          </div>

          {/* Labels (Original Structure) */}
          <div className="mt-3 flex items-center justify-between">
           <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#2B2B43]">
             Order Placed
            </span>
           </div>
           <span className="text-base font-bold text-[#2B2B43]">
            Ready for Pickup
           </span>
          </div>
          <p className="text-sm text-gray-500">09:51</p>
         </div>

         {/* ==================================================================== */}
         {/* 2. MOBILE LAYOUT (Vertical) - Visible up to SM (block sm:hidden) */}
         {/* ==================================================================== */}
         <div className=" sm:hidden flex flex-col">
          {/* Step 1: Order Placed (Done) */}
          <div className="flex items-start">
           {/* Left Column: Circle & Progress Line */}
           <div className="flex flex-col items-center mr-4">
            {/* Step 1 Circle */}
            <span
             className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${
              step >= 1 ? "bg-[#1ABF70]" : "bg-[#EDEEF2]"
             } text-white ring-[#1ABF70]`}>
             <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
               d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
               stroke="white"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
              />
             </svg>
            </span>
            {/* Vertical Line */}
            <div
             className={`w-0.5 h-12 transition-colors duration-500 ${
              step >= 2 ? "bg-[#1ABF70]" : "bg-gray-200"
             }`}
            />
           </div>

           {/* Right Column: Content */}
           <div className="flex flex-col pt-0.5 pb-4">
            <span className="text-base font-bold text-[#2B2B43]">
             Order Placed
            </span>
            <p className="text-sm text-gray-500">09:51</p>
           </div>
          </div>

          {/* Step 2: Ready for Pickup */}
          <div className="flex items-start">
           {/* Left Column: Circle */}
           <div className="flex flex-col items-center mr-4">
            {/* Step 2 Circle */}
            <span
             className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${
              step >= 2
               ? "bg-[#1ABF70]"
               : "bg-[#EDEEF2] text-[#2B2B43] font-semibold"
             } text-white ring-[#1ABF70]`}
             style={{ flexShrink: 0 }}>
             {step >= 2 ? (
              <svg
               width="20"
               height="20"
               viewBox="0 0 20 20"
               fill="none"
               xmlns="http://www.w3.org/2000/svg">
               <path
                d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
               />
              </svg>
             ) : (
              "2"
             )}
            </span>
           </div>

           {/* Right Column: Content */}
           <div className="flex flex-col pt-0.5">
            <span className="text-base font-bold text-[#2B2B43]">
             Ready for Pickup
            </span>
           </div>
          </div>
         </div>
         {/* ==================================================================== */}

         {/* Actions */}

         <div className="flex items-center gap-3 md:py-4 py-6">
          <Button
           onClick={() => navigate("/catering/request-custom-quote")}
           variant="default"
           size="lg">
           Reschedule Booking
          </Button>
         </div>
        </div>

        {/* Info note */}
        {step === 1 && (
         <div className="md:p-4 px-4 pb-4 text-xsm font-normal leading-5 text-[#2B2B43">
          You can edit or cancel your order before 23 September 2025, 09:50 am
         </div>
        )}
        {/* print qr code */}
        {step === 2 && (
         <div className="flex flex-col justify-center items-center md:py-[40px] py-[16px]">
          <p className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
           Woohoo! Your order is ready for pickup!
          </p>
          <div className="mt-[24px] mb-[20px] rounded-[16px] border border-[#83859C] max-w-[158px] max-h-[158px] p-5">
           <img src="/images/icons/barcode.svg" alt="barcode" />
          </div>
          <Button className="border w-[158px] border-[#545563] bg-transparent hover:bg-transparent text-[14px] leading-[16px] text-[#545563]">
           Print
          </Button>
         </div>
        )}
       </div>

       {/* Booking Details */}
       <TotalOrders items={items} />
      </div>

      {/* RIGHT: Summary */}
      <aside className="">
       <div className="rounded-2xl border border-[#EDEEF2] bg-white h-fit p-4">
        <h1 className="text-[24px] leading-[32px] font-[700] text-[#2B2B43] ">
         Pickup Location
        </h1>
        {/* map view */}
        <div className="rounded-[12px] py-4 w-full max-h-[220px]">
         <div className="flex-1 overflow-y-auto h-full space-y-4 pb-28">
          <div className="w-full h-[220px] rounded-2xl overflow-hidden">
           <VendingMap />
          </div>
         </div>
        </div>
        {/* content */}
        <div className="pt-6 ">
         <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
          Work
         </h4>
         <p className="text-[12px] leading-[16px] font-[600] tracking-[0.1px] text-[#83859C]">
          Dubai , UAE
         </p>
         <p className="text-[14px] leading-[20px] font-[400] tracking-[0.2px] text-[#545563] pt-2">
          Barsha 1, near Mall of the Emirates. St 12.
         </p>
        </div>
       </div>
       <div className="rounded-2xl border border-[#EDEEF2] bg-white h-fit p-4 mt-[24px]">
        <h1 className="text-[24px] leading-[32px] font-[700] text-[#2B2B43] pb-4">
         Payment Details
        </h1>
        {/* card detail */}
        <div className="h-[88px] w-full border border-[#C7C8D2] bg-[#F6FBFF] rounded-[8px] p-[12px]">
         <h3 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-black pb-[2px]">
          **** **** **** 4629
         </h3>
         <p className="text-neutral-gray text-[12px] font-[400] leading-[16px] pb-2">
          12/25
         </p>
         <div className="flex justify-between items-center">
          <p className="text-[14px] font-[400] leading-[20px] text-neutral-gray-dark">
           Mohammad Esam
          </p>
          <img src={"/images/icons/visa.svg"} alt="card icon" />
         </div>
        </div>
        {/* content */}
        <div className="space-y-3 pt-6">
         <div className="flex justify-between">
          <span className="text-[#545563]">Subtotal</span>
          <span className="font-medium">AED 165.80</span>
         </div>
         <div className="flex justify-between">
          <span className="text-[#545563]">VAT</span>
          <span className="font-medium">AED5.00</span>
         </div>

         <div className="flex justify-between text-[#056AC1]">
          <span>Discount (coupon)</span>
          <span className="font-medium">- AED 5</span>
         </div>
        </div>
        <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
         <span className="text-[16px] leading-[24px] text-[#2B2B43] font-[400]">
          Total <span className="">(VAT incl.)</span>
         </span>
         <span className="text-[#054A86]">AED 165</span>
        </div>
       </div>
      </aside>
     </div>
    </div>
   </main>
   <MobileFooterNav />
   {/* <Footer /> */}
  </div>
 );
};

export default MyOrders;
