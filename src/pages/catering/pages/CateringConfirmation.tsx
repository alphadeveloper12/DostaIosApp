import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
 const location = useLocation(); // Import useLocation
 const { orderId, orderDetails, extraDetails } = location.state || {}; // Destructure orderId, orderDetails, and extraDetails

 const [step, setStep] = useState(1); // Step state to track progress

 // Function to handle change step...

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
       <div className="rounded-2xl border border-[#EDEEF2] bg-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4">
         <div className="flex w-full flex-col md:flex-row gap-1">
          <div className="flex flex-col justify-between gap-3 w-full">
           <p className="text-[24px] font-bold leading-8 text-#2B2B43">
            Order ID {orderId || "67352427"}
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
         </div>
        </div>

        {/* Progress */}
        <div className="px-4 pt-3">
         {/* Actions */}

         <div className="flex flex-col md:flex-row max-md:justify-center items-center gap-3 md:py-4 py-6">
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
            <ItemLink>{orderDetails?.event_type || "Event"}</ItemLink>
            <ItemLink>{orderDetails?.guest_count || 0} Guests</ItemLink>
            <ItemLink>
             {orderDetails?.event_date && orderDetails?.event_time
              ? (() => {
                 const d = new Date(
                  `${orderDetails.event_date}T${orderDetails.event_time}`
                 );
                 // Simple formatter: "06 November 2025, 08:00 PM"
                 const dateStr = d.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                 });
                 const timeStr = d.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                 });
                 return `${dateStr}, ${timeStr}`;
                })()
              : "Date Not Selected"}
            </ItemLink>
           </div>
          }
         />
         <Row
          label="Service Style"
          value={
           <div className="space-y-1">
            <ItemLink>
             {orderDetails?.service_style || "Service Style"}
            </ItemLink>
            {extraDetails?.eventType?.description && (
             <div className="text-sm text-[#545563] font-normal">
              {extraDetails.eventType.description}
             </div>
            )}
           </div>
          }
         />
         <Row
          label="Location"
          value={<ItemLink>{orderDetails?.location || "Location"}</ItemLink>}
         />
         <Row
          label="Budget"
          value={
           <ItemLink>
            {extraDetails?.budget?.label || ""}{" "}
            {extraDetails?.budget?.price_range || ""}
           </ItemLink>
          }
         />

         {/* Menu Items Section */}
         <div className="p-4 border-t border-[#EDEEF2]">
          <div className="text-xl font-medium text-[#545563] mb-3">
           Menu Items
          </div>
          {(orderDetails?.items && orderDetails.items.length > 0) ||
          (extraDetails?.menuItems && extraDetails.menuItems.length > 0) ? (
           <div className="mt-2 text-base text-[#545563]">
            {Object.entries(
             (orderDetails?.items || extraDetails.menuItems).reduce(
              (acc: any, item: any) => {
               // Ensure we have a course key, default to 'Other' if missing
               const course = item.course || "Other";
               if (!acc[course]) {
                acc[course] = [];
               }
               acc[course].push(item);
               return acc;
              },
              {}
             )
            )
             .sort(([courseA], [courseB]) => {
              const getPriority = (c: string) => {
               const name = c.toLowerCase();

               // High Priority (Start)
               if (name.includes("salad")) return 10;
               if (name.includes("cold appetizer")) return 20;
               if (name.includes("hot appetizer")) return 30;
               if (name.includes("starter") || name.includes("appetizer"))
                return 40;
               if (name.includes("soup")) return 50;

               // Low Priority (End - Strict)
               if (name.includes("main")) return 100;
               if (name.includes("dessert")) return 110;
               if (name.includes("beverage") || name.includes("drink"))
                return 120;

               // Medium Priority (Middle)
               return 60;
              };

              const pA = getPriority(courseA as string);
              const pB = getPriority(courseB as string);

              if (pA !== pB) return pA - pB;

              return (courseA as string).localeCompare(courseB as string);
             })
             .map(([course, items]: any) => (
              <div key={course} className="mb-4 last:mb-0">
               <h4
                style={{
                 fontSize: "16px",
                 fontWeight: "700",
                 color: "#056AC1",
                 marginBottom: "4px",
                }}>
                {course}
               </h4>
               <ul className="pl-0 space-y-1">
                {items.map((item: any) => (
                 <li
                  key={item.name}
                  style={{
                   fontSize: "14px",
                   fontWeight: "400",
                   color: "#545563",
                  }}>
                  <span className="font-semibold">{item.name}</span>
                  {item.quantity > 1 && (
                   <span className="text-xs text-gray-500 ml-1">
                    (x{item.quantity})
                   </span>
                  )}
                  {item.description && (
                   <p className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                   </p>
                  )}
                 </li>
                ))}
               </ul>
              </div>
             ))}
           </div>
          ) : (
           <div className="text-base text-[#545563]">Not Selected</div>
          )}
         </div>
        </div>

        {/* Contact Info Box */}
        <div className="p-4 mt-2">
         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-3">
           For any queries, please contact us on this phone number:{" "}
           <span className="font-bold text-gray-800">00971 50 1638612</span>
          </p>
          <Button
           onClick={() => navigate("/contact-us")}
           variant="outline"
           className="w-full sm:w-auto border-[#054A86] text-[#054A86] hover:bg-[#054A86] hover:text-white">
           Contact Us
          </Button>
         </div>
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
          Guest ×{orderDetails?.guest_count || 0}
         </span>
         <span className="text-sm font-semibold text-[#2B2B43]">
          AED{extraDetails?.pricing?.baseTotal?.toFixed(2) || "0.00"}
         </span>
        </div>
        <div className="flex items-center justify-between">
         <span className="text-sm fot-noraml leading-5 text[#545563]">VAT</span>
         <span className="text-sm font-semibold text-[#2B2B43]">
          AED{extraDetails?.pricing?.vat?.toFixed(2) || "0.00"}
         </span>
        </div>
        <div className="flex items-center justify-between">
         <span className="text-fot-noraml leading-5 text[#545563]">
          Total (VAT incl.)
         </span>
         <span className="text-base font-bold text-[#054A86]">
          AED
          {extraDetails?.pricing?.total?.toFixed(2) ||
           orderDetails?.total_amount ||
           "0.00"}
         </span>
        </div>
       </div>
      </aside>
     </div>
    </div>
   </main>
   <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default CateringConfirmation;
