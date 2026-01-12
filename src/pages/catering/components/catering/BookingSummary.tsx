import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

interface BookingSummaryProps {
 eventType: { id: string | null; name: string | null };
 guestCount: number;
 selectedDateTime: string;
 selectedProvider: { id: string | null; name: string | null };
 selectedServiceStyles: {
  id: number;
  name: string;
  description?: string;
 } | null;
 selectedMenuDescription?: string | null;
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
  price?: number;
  description?: string;
 }[];
 handleGoBack: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
 eventType,
 guestCount,
 selectedDateTime,
 selectedProvider,
 selectedServiceStyles,
 selectedMenuDescription,
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
  const isPlatters = selectedServiceStyles?.name
   ?.toLowerCase()
   .includes("platter");

  if (isPlatters) {
   const budgetPrice = selectedBudget.price_range
    ? parseFloat(selectedBudget.price_range.replace("AED", "").trim())
    : 0;
   const totalPerHead = budgetPrice * selectedMenuItems.length;
   const baseTotal = totalPerHead * guestCount;
   const vat = baseTotal * 0.15;
   const total = baseTotal + vat;
   return { baseTotal, vat, total };
  }

  const isBoxedMeal = selectedServiceStyles?.name
   ?.toLowerCase()
   .includes("boxed");

  if (isBoxedMeal) {
   const baseTotal = guestCount * 45;
   const vat = baseTotal * 0.15;
   const total = baseTotal + vat;
   return { baseTotal, vat, total };
  }

  const isLiveStation = selectedServiceStyles?.name
   ?.toLowerCase()
   .includes("live station");

  if (isLiveStation) {
   // Sum up prices of all selected Live Station items
   const liveStationItems = selectedMenuItems.filter(
    (item) => item.course === "Live Station"
   );
   const totalPerPax = liveStationItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
   );

   const baseTotal = guestCount * totalPerPax;
   const vat = baseTotal * 0.15;
   const total = baseTotal + vat;
   return { baseTotal, vat, total };
  }

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
 const handleConfirmAndPay = async () => {
  try {
   const token = sessionStorage.getItem("authToken");

   // Parse Date and Time
   // selectedDateTime format assumption: "YYYY-MM-DD HH:MM" or similar
   // Fallback if parsing fails
   let eventDate = new Date().toISOString().split("T")[0];
   let eventTime = "12:00:00";

   if (selectedDateTime) {
    // Expected format: "DD, MonthName, YYYY - HH:MM AM/PM"
    // e.g. "08, November, 2025 - 08:00 PM"
    try {
     const parts = selectedDateTime.split(" - ");
     if (parts.length === 2) {
      const datePart = parts[0]; // "08, November, 2025"
      const timePart = parts[1]; // "08:00 PM"

      const [day, monthName, year] = datePart.split(", ");
      const monthNames: Record<string, string> = {
       January: "01",
       February: "02",
       March: "03",
       April: "04",
       May: "05",
       June: "06",
       July: "07",
       August: "08",
       September: "09",
       October: "10",
       November: "11",
       December: "12",
      };

      const month = monthNames[monthName] || "01";
      eventDate = `${year}-${month}-${day}`;

      const [time, period] = timePart.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      eventTime = `${hours.toString().padStart(2, "0")}:${minutes
       .toString()
       .padStart(2, "0")}`;
     }
    } catch (error) {
     console.error("Error parsing date:", error);
    }
   }

   const orderData = {
    event_type: eventType?.name || "Unknown",
    guest_count: guestCount,
    event_date: eventDate,
    event_time: eventTime,
    provider_type: selectedProvider?.name || "",
    service_style: selectedServiceStyles?.name || "",
    location: selectedLocation?.name || "",
    total_amount: total,
    items: selectedMenuItems.map((item) => ({
     name: item.name,
     course: item.course,
     quantity: 1, // Defaulting to 1 for per-person items
     price: item.price || 0,
     description: item.description || "",
    })),
   };

   const response = await fetch(
    "http://127.0.0.1:8000/api/catering/orders/create/",
    {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, // Adjust based on your auth scheme (Bearer vs Token)
     },
     body: JSON.stringify(orderData),
    }
   );

   if (response.ok) {
    const data = await response.json();
    console.log("Order placed:", data);
    navigate("/catering/confirmation", {
     state: {
      orderId: data.order_id,
      orderDetails: data,
      // Pass extra details for display that aren't in the backend model
      extraDetails: {
       cuisines: selectedCuisines,
       courses: selectedCourses,
       budget: selectedBudget,
       menuItems: selectedMenuItems,
       pricing: {
        baseTotal,
        vat,
        total,
       },
      },
     },
    });
   } else {
    console.error("Failed to place order", await response.text());
    alert("Failed to place order. Please try again.");
   }
  } catch (error) {
   console.error("Error placing order:", error);
   alert("An error occurred.");
  }
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

       {/* Service Style Section */}
       <div className="mb-6 pb-6">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#545563" }}>
         Service Style:
        </h2>
        <p className="text-blue-600 font-medium">
         {selectedServiceStyles ? selectedServiceStyles.name : "Not Selected"}
        </p>
        {(selectedMenuDescription || selectedServiceStyles?.description) && (
         <>
          <h4
           style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#545563",
            marginTop: "12px",
            marginBottom: "4px",
           }}>
           Description:
          </h4>
          <p className="text-sm text-neutral-gray">
           {selectedMenuDescription || selectedServiceStyles?.description}
          </p>
         </>
        )}
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
         {selectedBudget?.price_range ? ` - ${selectedBudget.price_range}` : ""}
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
               <span className="font-semibold">{item.name}</span>
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
        {selectedServiceStyles?.name?.toLowerCase().includes("live station") ||
        selectedServiceStyles?.name?.toLowerCase().includes("platter") ? (
         <>
          {selectedMenuItems.map((item) => {
           // Filter if we strictly want only specific courses, but for Platter all items are Platter usually
           if (
            !selectedServiceStyles?.name
             ?.toLowerCase()
             .includes("live station") &&
            !selectedServiceStyles?.name?.toLowerCase().includes("platter")
           )
            return null; // Fallback

           // Dynamic Price Logic
           let price = Number(item.price) || 0;
           if (selectedServiceStyles?.name?.toLowerCase().includes("platter")) {
            // Platter uses Budget Price for calculation display
            price = selectedBudget.price_range
             ? parseFloat(selectedBudget.price_range.replace("AED", "").trim())
             : 0;
           }

           const itemTotal = price * guestCount;
           return (
            <div key={item.id} className="flex justify-between text-sm">
             <span
              style={{
               fontSize: "14px",
               fontWeight: "400",
               color: "#545563",
              }}>
              {item.name} ({price} x {guestCount})
             </span>
             <span
              style={{
               fontSize: "14px",
               fontWeight: "600",
               color: "#2B2B43",
              }}>
              AED{itemTotal.toFixed(2)}
             </span>
            </div>
           );
          })}
          <div className="border-t border-gray-100 my-2"></div>
         </>
        ) : (
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
        )}

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
