import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";

import Footer from "@/components/layout/Footer";
import locationimg from "@/assets/../../public/images/icons/locaion-icon.svg";
import calendar from "@/assets/../../public/images/icons/calendar.svg";
import { Button } from "@/components/ui/button"; // Import the Button component
import BreadCrumb from "@/components/home/BreadCrumb";
import { useState } from "react";
import MobileFooterNav from "@/components/home/MobileFooterNav";

function Row({ label, value }) {
 return (
  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-3 sm:gap-4 border-none">
   <div className="text-xl font-medium text-[#545563]">{label}</div>
   <div className="sm:col-span-2 text-base font-bold text-[#056AC1]">
    {value}
   </div>
  </div>
 );
}

function ItemLink({ children }) {
 return (
  <div className="cursor-default font-bold text-[#056AC1] hover:underline">
   {children}
  </div>
 );
}
const CateringConfirmation = () => {
 const navigate = useNavigate();
 const [step, setStep] = useState(1); // Step state to track progress

 // Function to handle changing the step
 const changeStep = (newStep) => {
  if (newStep >= 1 && newStep <= 2) {
   setStep(newStep);
  }
 };
 return (
  <div className="min-h-screen flex flex-col">
   <Header />

   <main className="flex-1 bg-background max-md:pb-[20px]">
    <div className="bg-neutral-white">
     <div className="main-container !py-6">
      <BreadCrumb />

      <h1 className="md:text-4xl font-bold text-primary text-[28px]">
       Catering Service Confirmation
      </h1>
     </div>
    </div>

    <div className="main-container !py-6 !pb-24">
     <div className="grid gap-4 md:grid-cols-[1fr_320px]">
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
             Booking Confirmed
            </span>
           </div>
           <span className="text-base font-bold text-[#2B2B43]">Served</span>
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
             Booking Confirmed
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
            <span className="text-base font-bold text-[#2B2B43]">Served</span>
           </div>
          </div>
         </div>
         {/* ==================================================================== */}

         {/* Actions */}

         <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:py-4 py-6">
          <Button
           onClick={() => navigate("/catering/request-custom-quote")}
           variant="outline"
           size="lg"
           className="max-md:w-full">
           Cancel Booking
          </Button>
          <Button
           onClick={() => navigate("/catering/request-custom-quote")}
           variant="default"
           size="lg"
           className="max-md:w-full">
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
       <div className="rounded-2xl border border-[#EDEEF2] bg-white pb-3">
        <div className="p-4">
         <h2 className="text-[24px] font-bold leading-8 text-#2B2B43">
          Booking details
         </h2>
        </div>

        <div className="divide-y pl-2">
         <Row
          label="Event Type"
          value={
           <div className="space-y-1">
            <ItemLink>Corporate Event</ItemLink>
            <ItemLink>20 Guests</ItemLink>
            <ItemLink>06 November 2025, 08:00 PM</ItemLink>
           </div>
          }
         />
         <Row
          label="Provider Type"
          value={
           <div className="space-y-1">
            <ItemLink>Caterers</ItemLink>
            <ItemLink>Boxed Meal, Plated Meal</ItemLink>
           </div>
          }
         />
         <Row
          label="Cuisines"
          value={<ItemLink>American, Italian, Mediterranean</ItemLink>}
         />
         <Row
          label="Courses"
          value={<ItemLink>Canapes, Coffee/Tea</ItemLink>}
         />
         <Row label="Location" value={<ItemLink>Ajman</ItemLink>} />
         <Row
          label="Budget"
          value={<ItemLink>Basic AED70 per guest</ItemLink>}
         />
        </div>
       </div>
      </div>

      {/* RIGHT: Summary */}
      <aside className="rounded-2xl border border-[#EDEEF2] bg-white h-fit p-4">
       <div>
        <h3 className="text-[28PX] Font-bold leading-9 text-[#2B2B43]">
         Booking Summary
        </h3>
       </div>

       <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
         <span className="text-sm fot-noraml leading-5 text[#545563]">
          Guest ×20
         </span>
         <span className="text-sm font-semibold text-[#2B2B43]">
          AED1400.00
         </span>
        </div>
        <div className="flex items-center justify-between">
         <span className="text-sm fot-noraml leading-5 text[#545563]">VAT</span>
         <span className="text-sm font-semibold text-[#2B2B43]">AED150.00</span>
        </div>
        <div className="flex items-center justify-between">
         <span className="text-fot-noraml leading-5 text[#545563]">
          Total (VAT incl.)
         </span>
         <span className="text-base font-bold text-[#054A86]">AED1550.50</span>
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

export default CateringConfirmation;
