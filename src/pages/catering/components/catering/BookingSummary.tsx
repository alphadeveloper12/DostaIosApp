import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

interface BookingSummaryProps {
 eventType: { id: string | null; name: string | null };
 guestCount: number;
 selectedDateTime: string;
 selectedProvider: { id: string | null; name: string | null };
 selectedServiceStyles: string | null;
 selectedCuisines: { id: number; name: string }[];
 selectedCourses: { id: number; name: string }[];
 selectedLocation: { id: number; name: string } | null;
 selectedBudget: {
  id: string | null;
  label: string | null;
  price_range: string | null;
 };
 selectedMenuItems: {
  id: string;
  name: string;
  course: string;
  price: string;
 }[];
 handleGoBack: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
 eventType,
 guestCount,
 selectedDateTime,
 selectedProvider,
 selectedServiceStyles,
 selectedCuisines,
 selectedCourses,
 selectedLocation,
 selectedBudget,
 selectedMenuItems,
 handleGoBack,
}) => {
 const navigate = useNavigate(); // Initialize useNavigate hook

 // Update the calculateTotal function to use the price_range from selectedBudget
 const calculateTotal = () => {
  const basePricePerGuest = selectedBudget.price_range
   ? parseFloat(selectedBudget.price_range.replace("AED", "").trim())
   : 70;
  const baseTotal = guestCount * basePricePerGuest;
  const vat = baseTotal * 0.15; // 15% VAT
  const total = baseTotal + vat;
  return { baseTotal, vat, total };
 };

 const { baseTotal, vat, total } = calculateTotal();

 // Handle button clicks for navigation
 const handleConfirmAndPay = () => {
  navigate("/catering/confirmation"); // Navigate to catering confirmation
 };

 const handleRequestCustomQuote = () => {
  navigate("/request-custom-quote"); // Navigate to custom quote request page
 };

 // Log the data to see what it's populated with
 console.log(
  "Booking Summary Data: ",
  JSON.stringify({
   eventType,
   guestCount,
   selectedDateTime,
   selectedProvider,
   selectedServiceStyles,
   selectedCuisines,
   selectedCourses,
   selectedLocation,
   selectedBudget,
  })
 );

 return (
  <div className="min-h-screen md:py-8 ">
   <div className="max-w-6xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-6">
     {/* Left side: Event details */}
     <div className="lg:w-2/3">
      <div
       className="bg-neutral-white rounded-lg shadow-sm"
       style={{
        border: "1px solid #EDEEF2",
        borderRadius: "16px",
        padding: "20px 24px",
       }}>
       {/* Event Type Section */}
       <div className="mb-6 pb-6">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#545563" }}>
         Event Type:
        </h2>
        <p
         className="mb-1"
         style={{ fontSize: "16px", fontWeight: "700", color: "#056AC1" }}>
         {eventType?.name || "Not Selected"}
        </p>
        <p
         className="mb-1"
         style={{ fontSize: "16px", fontWeight: "700", color: "#056AC1" }}>
         {guestCount} Guests
        </p>
        <p
         className="mb-1"
         style={{ fontSize: "16px", fontWeight: "700", color: "#056AC1" }}>
         {selectedDateTime || "Not Selected"}
        </p>
       </div>

       {/* Provider Type Section */}
       <div className="mb-6 pb-6">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#545563" }}>
         Provider Type:
        </h2>
        <p className="text-blue-600 font-medium mb-1">
         {selectedProvider?.name || "Not Selected"}
        </p>
        <p className="text-blue-600 font-medium">
         {selectedServiceStyles ? selectedServiceStyles : "Not Selected"}
        </p>
       </div>

       {/* Cuisines Section */}
       <div className="mb-6 pb-6">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#545563" }}>
         Cuisines:
        </h2>
        <p className="text-blue-600 font-medium">
         {selectedCuisines.length > 0
          ? selectedCuisines.map((cuisine) => cuisine.name).join(", ")
          : "Not Selected"}
        </p>
       </div>

       {/* Courses Section */}
       <div className="mb-6 pb-6">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#545563" }}>
         Courses:
        </h2>
        <p className="text-blue-600 font-medium">
         {selectedCourses.length > 0
          ? selectedCourses.map((course) => course.name).join(", ")
          : "Not Selected"}
        </p>
       </div>

       {/* Location Section */}
       <div className="mb-6 pb-6">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#545563" }}>
         Location
        </h2>
        <p className="text-blue-600 font-medium">
         {selectedLocation?.name || "Not Selected"}
        </p>
       </div>

       {/* Budget Section */}
       <div className="mb-6">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#545563" }}>
         Budget:
        </h2>
        <p className="text-blue-600 font-medium">
         {selectedBudget?.label || "Not Selected"}
        </p>
       </div>

       {/* Selected Menu Items Section */}
       <div className="mb-6 pb-6">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#545563" }}>
         Menu Items:
        </h2>
        {selectedMenuItems && selectedMenuItems.length > 0 ? (
         <div className="mt-2">
          {Object.entries(
           selectedMenuItems.reduce((acc, item) => {
            if (!acc[item.course]) {
             acc[item.course] = [];
            }
            acc[item.course].push(item);
            return acc;
           }, {} as Record<string, typeof selectedMenuItems>)
          ).map(([course, items]) => (
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
             {items.map((item) => (
              <li
               key={item.id}
               style={{
                fontSize: "14px",
                fontWeight: "400",
                color: "#545563",
               }}>
               {item.name}
              </li>
             ))}
            </ul>
           </div>
          ))}
         </div>
        ) : (
         <p className="text-blue-600 font-medium">Not Selected</p>
        )}
       </div>

       <button
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
       </button>
      </div>
     </div>

     {/* Right side: Booking Summary */}
     <div className="lg:w-1/3">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-8">
       <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#2B2B43" }}>
        Booking Summary
       </h3>

       <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
         <span
          style={{ fontSize: "14px", fontWeight: "400", color: "#545563" }}>
          Guest x{guestCount}
         </span>
         <span
          style={{ fontSize: "14px", fontWeight: "600", color: "#2B2B43" }}>
          AED{baseTotal.toFixed(2)}
         </span>
        </div>
        <div className="flex justify-between text-sm">
         <span
          style={{ fontSize: "14px", fontWeight: "400", color: "#545563" }}>
          VAT
         </span>
         <span
          style={{ fontSize: "14px", fontWeight: "600", color: "#2B2B43" }}>
          AED{vat.toFixed(2)}
         </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-3">
         <span
          style={{ fontSize: "16px", fontWeight: "400", color: "#2B2B43" }}>
          Total (VAT incl.)
         </span>
         <span
          style={{ fontSize: "16px", fontWeight: "700", color: "#054A86" }}>
          AED{total.toFixed(2)}
         </span>
        </div>
       </div>

       <div className="space-y-3">
        <Button
         onClick={handleConfirmAndPay}
         className="mt-6"
         variant="default"
         size="default"
         style={{
          boxShadow: "0px 8px 20px 0px #4E60FF29",
          width: "100%",
          height: "44px",
         }}>
         Confirm & Pay
        </Button>
        <button
         onClick={handleRequestCustomQuote}
         style={{
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "700",
          color: "#545563",
          border: "1px solid #545563",
          backgroundColor: "#fff",
          width: "100%",
          height: "44px",
         }}>
         Request Custom Quote
        </button>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default BookingSummary;
