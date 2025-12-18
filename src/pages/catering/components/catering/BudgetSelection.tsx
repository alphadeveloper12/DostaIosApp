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
}

const BudgetSelection: React.FC<BudgetSelectionProps> = ({
 selectedBudget,
 setSelectedBudget,
 handleGoBack,
 handleContinue,
}) => {
 const [budgetOptions, setBudgetOptions] = useState<
  { id: string; label: string; price_range: string }[]
 >([]); // State to store the fetched budget options
 const [loading, setLoading] = useState<boolean>(true); // State for loading status
 const [error, setError] = useState<string | null>(null); // State for error message

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 // Fetch data from the API
 useEffect(() => {
  const fetchBudgetOptions = async () => {
   try {
    const response = await axios.get(
     `${baseUrl}/api/catering/budget-options/`,
     {
      headers: {
       Authorization: `Token ${authToken}`,
      },
     }
    );
    setBudgetOptions(response.data); // Assuming the response is an array of budget options
    setLoading(false); // Stop loading after data is fetched
   } catch (err) {
    setError("Failed to load budget options. Please try again later.");
    setLoading(false); // Stop loading on error
   }
  };
  const timer = setTimeout(() => {
   fetchBudgetOptions();
  }, 1000); // ⏱️ 2-second delay

  return () => clearTimeout(timer); // cleanup
 }, [baseUrl, authToken]);

 // Show loading or error message if data is still being fetched
 if (loading) {
  return <Shrimmer />;
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

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">1</span>
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

    <div className="flex justify-between mt-8">
     <Button
      disabled={true}
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
      disabled={!selectedBudget?.id}
      className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
       !selectedBudget?.id ? "cursor-not-allowed" : ""
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
