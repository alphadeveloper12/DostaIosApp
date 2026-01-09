import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import Shrimmer from "@/components/ui/Shrimmer";
import LazyLoad from "@/components/ui/LazyLoad";
import { steps } from "framer-motion";

interface BudgetSelectionProps {
 selectedBudget: {
  id: string | null;
  label: string | null;
  price_range: string | null;
 };
 setSelectedBudget: React.Dispatch<
  React.SetStateAction<{
   id: string | null;
   label: string | null;
   price_range: string | null;
  }>
 >;
 handleGoBack: () => void;
 handleContinue: () => void;
 selectedEvent: { id: string | null; name: string | null } | null;
 selectedPax: {
  id: string | null;
  label: string | null;
  number: string | null;
 };
 setSelectedPax: React.Dispatch<
  React.SetStateAction<{
   id: string | null;
   label: string | null;
   number: string | null;
  }>
 >;
 selectedServiceStyles: { id: number; name: string } | null;
 selectedCuisines: { id: number; name: string }[];
 guestCount: number;
}

const BudgetSelection: React.FC<BudgetSelectionProps> = ({
 selectedBudget,
 setSelectedBudget,
 handleGoBack,
 handleContinue,
 selectedEvent,
 selectedPax,
 setSelectedPax,
 selectedServiceStyles,
 selectedCuisines,
 guestCount,
}) => {
 const [budgetOptions, setBudgetOptions] = useState<
  { id: string; label: string; price_range: string }[]
 >([]); // State to store the fetched budget options
 const [paxOptions, setPaxOptions] = useState<
  { id: string; label: string; number: string }[]
 >([]);

 const [loading, setLoading] = useState<boolean>(true); // State for loading status
 const [error, setError] = useState<string | null>(null); // State for error message

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 // Auto-select Pax based on guestCount
 useEffect(() => {
  if (guestCount && paxOptions.length > 0) {
   const match = paxOptions.find((pax) => {
    // Expected format: "10-20" or "50+" or "100"
    const range = pax.number.replace(/\s/g, ""); // remove spaces
    if (range.includes("+")) {
     const min = parseInt(range.replace("+", ""));
     return guestCount >= min;
    }
    const parts = range.split("-");
    if (parts.length === 2) {
     const min = parseInt(parts[0]);
     const max = parseInt(parts[1]);
     return guestCount >= min && guestCount <= max;
    }
    // Single number case
    const exact = parseInt(range);
    if (!isNaN(exact)) {
     return guestCount === exact;
    }
    return false;
   });

   if (match) {
    setSelectedPax(match);
   }
  }
 }, [guestCount, paxOptions, setSelectedPax]);

 // Fetch data from the API
 useEffect(() => {
  const fetchData = async () => {
   try {
    const budgetEndpoint = "/api/catering/budget-options/";
    const paxEndpoint = "/api/catering/pax/";
    const isPrivate = !selectedEvent?.name?.toLowerCase().includes("corporate");

    // Convert selected cuisines to CSV ID string
    const cuisineIds = selectedCuisines?.map((c) => c.id).join(",");

    const [budgetRes, paxRes] = await Promise.all([
     axios.get(`${baseUrl}${budgetEndpoint}`, {
      params: {
       service_style_id: selectedServiceStyles?.id,
       is_private: isPrivate,
       cuisine_ids: cuisineIds, // Pass cuisine_ids for filtering
      },
      headers: { Authorization: `Token ${authToken}` },
     }),
     axios.get(`${baseUrl}${paxEndpoint}`, {
      params: {
       service_style_id: selectedServiceStyles?.id,
       is_private: isPrivate,
      },
      headers: { Authorization: `Token ${authToken}` },
     }),
    ]);

    setBudgetOptions(budgetRes.data);
    setPaxOptions(paxRes.data);
    setLoading(false); // Stop loading after data is fetched
   } catch (err) {
    setError("Failed to load options. Please try again later.");
    setLoading(false); // Stop loading on error
   }
  };
  const timer = setTimeout(() => {
   fetchData();
  }, 1000); // ⏱️ 2-second delay

  return () => clearTimeout(timer); // cleanup
 }, [
  baseUrl,
  authToken,
  selectedEvent,
  selectedServiceStyles,
  selectedCuisines,
 ]);

 // Show loading or error message if data is still being fetched
 if (loading) {
  return (
   <div className="w-full h-[50vh] rounded-2xl overflow-hidden">
    <Shrimmer />
   </div>
  );
 }

 if (error) {
  return <div>{error}</div>;
 }

 // Handle selection of a budget
 const handleBudgetSelection = (budget: {
  id: string;
  label: string;
  price_range: string;
 }) => {
  setSelectedBudget(budget); // Store the entire budget object (id, label, price_range)
 };

 const handlePaxSelection = (pax: {
  id: string;
  label: string;
  number: string;
 }) => {
  setSelectedPax(pax);
 };

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">5</span>
     </div>
     <h2 className="text-primary-text md:text-2xl text-xl font-bold">
      What's the Budget you have in Mind?
     </h2>
    </div>

    <div className="md:ml-12">
     <div className="grid md:grid-cols-4 gap-6 max-w-5xl">
      {budgetOptions.map((budget) => (
       <Button
        key={budget.id}
        onClick={() =>
         handleBudgetSelection({
          id: budget.id,
          label: budget.label,
          price_range: budget.price_range,
         })
        }
        style={{
         fontSize: "16px",
         height: "80px",
         backgroundColor: selectedBudget?.id === budget.id ? "#EAF5FF" : "#fff", // Use optional chaining here
         color: "#2B2B43",
         fontWeight: "400",
         borderRadius: "16px",
         padding: "16px",
         width: "245px",
         border:
          selectedBudget?.id === budget.id // Use optional chaining here as well
           ? "1px solid #054A86"
           : "1px solid #C7C8D2",
         display: "flex",
         flexDirection: "column",
         alignItems: "center",
         justifyContent: "center",
         gap: "4px",
        }}>
        <span style={{ fontWeight: "400", fontSize: "16px" }}>
         {budget.label}
        </span>
        <span style={{ fontWeight: "400", fontSize: "16px" }}>
         {budget.price_range}
        </span>
       </Button>
      ))}
     </div>
    </div>

    <div className="flex items-center mb-6 gap-4 mt-8">
     <h3 className="text-primary-text md:text-xl text-lg font-bold md:ml-12">
      Select Minimum Pax
     </h3>
    </div>

    <div className="md:ml-12">
     <div className="grid md:grid-cols-4 gap-6 max-w-5xl">
      {paxOptions.map((pax) => (
       <Button
        key={pax.id}
        onClick={() =>
         handlePaxSelection({
          id: pax.id,
          label: pax.label,
          number: pax.number,
         })
        }
        style={{
         fontSize: "16px",
         height: "80px",
         backgroundColor: selectedPax?.id === pax.id ? "#EAF5FF" : "#fff",
         color: "#2B2B43",
         fontWeight: "400",
         borderRadius: "16px",
         padding: "16px",
         width: "245px",
         border:
          selectedPax?.id === pax.id
           ? "1px solid #054A86"
           : "1px solid #C7C8D2",
         display: "flex",
         flexDirection: "column",
         alignItems: "center",
         justifyContent: "center",
         gap: "4px",
        }}>
        <span style={{ fontWeight: "400", fontSize: "16px" }}>{pax.label}</span>
        <span style={{ fontWeight: "400", fontSize: "16px" }}>
         {pax.number}
        </span>
       </Button>
      ))}
     </div>
    </div>

    <div className="flex justify-between mt-8">
     <Button
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
     </Button>
     <Button
      onClick={handleContinue}
      disabled={!selectedBudget?.id || !selectedPax?.id}
      className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
       !selectedBudget?.id || !selectedPax?.id ? "cursor-not-allowed" : ""
      }`}
      style={{
       padding: "12px 16px",
       borderRadius: "8px",
       fontSize: "16px",
       fontWeight: "600",
       boxShadow: "0px 8px 20px 0px #4E60FF29",
      }}>
      Continue
     </Button>
    </div>
   </div>
  </LazyLoad>
 );
};

export default BudgetSelection;
