import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import Shrimmer from "@/components/ui/Shrimmer";
import ImageWithShimmer from "@/components/ui/ImageWithShimmer";
import LazyLoad from "@/components/ui/LazyLoad";

interface Cuisine {
 id: number;
 name: string;
 image_url: string;
}

interface CuisineSelectionProps {
 selectedCuisines: { id: number; name: string }[];
 setSelectedCuisines: React.Dispatch<
  React.SetStateAction<{ id: number; name: string }[]>
 >;
 handleGoBack: () => void;
 handleContinue: () => void;
 toggleCuisine: (cuisine: { id: number; name: string }) => void;
 selectedBudget: any; // Added to fix lint error, though not used in logic yet. Ideally define proper type.
 selectedEvent: { id: string | null; name: string | null } | null;
 selectedServiceStyles: { id: number; name: string } | null;
}

const CuisineSelection: React.FC<CuisineSelectionProps> = ({
 selectedCuisines,
 setSelectedCuisines,
 handleGoBack,
 handleContinue,
 toggleCuisine,
 selectedEvent,
 selectedServiceStyles,
 selectedBudget,
}) => {
 const [cuisineTypes, setCuisineTypes] = useState<Cuisine[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 // Fetch Cuisines from API
 useEffect(() => {
  const fetchCuisines = async () => {
   try {
    const baseUrl = import.meta.env.VITE_API_URL;
    const authToken = sessionStorage.getItem("authToken");

    // Add query params
    const params: any = {};

    // Pass event_type_name to help backend decide which M2M table to filter (Corporate vs Private)
    if (selectedEvent?.name) {
     params.event_type_name = selectedEvent.name;
    }

    if (selectedServiceStyles?.id) {
     params.service_style_id = selectedServiceStyles.id;
    }

    // Budget is now selected AFTER cuisine, so we don't filter by budget here.
    // if (selectedBudget?.id) {
    //  params.budget_id = selectedBudget.id;
    // }

    const response = await axios.get(`${baseUrl}/api/catering/cuisines/`, {
     headers: {
      Authorization: `Token ${authToken}`,
     },
     params: params,
    });

    setCuisineTypes(response.data);
   } catch (err: any) {
    console.error("Error fetching cuisines:", err);
    setError("Failed to load cuisines.");
   } finally {
    setLoading(false);
   }
  };
  const timer = setTimeout(() => {
   fetchCuisines();
  }, 1000); // ⏱️ 2-second delay

  return () => clearTimeout(timer); // cleanup
 }, [selectedEvent, selectedServiceStyles]); // Removed selectedBudget dependency

 // Render loading and error states
 if (loading) {
  return (
   <div className="w-full h-[50vh] rounded-2xl overflow-hidden">
    <Shrimmer />
   </div>
  );
 }

 if (error) {
  return <div className="text-center text-red-600 py-10">{error}</div>;
 }

 // Toggle cuisine selection and update selected cuisines state
 const handleCuisineSelection = (cuisine: { id: number; name: string }) => {
  // Enforce single selection: always replace the array with the new selection
  // or toggle off if clicking the same one (optional, but usually radio-button style behavior is expected)

  // User said "restricted to select only one cuisine".
  // Let's make it behave like a radio button (selecting one deselects others).
  // Clicking the already selected one could deselect it? Or just keep it?
  // Let's allow deselecting if clicked again, otherwise replace.

  const isSelected = selectedCuisines.some(
   (selectedCuisine) => selectedCuisine.id === cuisine.id
  );

  if (isSelected) {
   setSelectedCuisines([]);
  } else {
   setSelectedCuisines([cuisine]);
  }
 };

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl p-4 md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">4</span>
     </div>
     <h2 className="text-primary-text md:text-2xl text-xl font-bold">
      What's Type of Cuisines Would You Prefer?
     </h2>
    </div>

    <div className="md:ml-12">
     {/* Heading */}
     <p
      style={{
       color: "#545563",
       fontSize: "14px",
       fontWeight: "400",
       marginBottom: "16px",
      }}>
      (You can select multiple options)
     </p>

     {/* Grid of buttons */}
     <div className="grid md:grid-cols-4 gap-6">
      {cuisineTypes.map((cuisine) => (
       <Button
        key={cuisine.id}
        onClick={() =>
         handleCuisineSelection({ id: cuisine.id, name: cuisine.name })
        }
        style={{
         fontSize: "16px",
         height: "80px",
         backgroundColor: selectedCuisines.some(
          (selectedCuisine) => selectedCuisine.id === cuisine.id
         )
          ? "#EAF5FF"
          : "#fff",
         color: "#2B2B43",
         fontWeight: "400",
         borderRadius: "16px",
         padding: "10px",
         width: "245px",
         border: selectedCuisines.some(
          (selectedCuisine) => selectedCuisine.id === cuisine.id
         )
          ? "1px solid #054A86"
          : "1px solid #C7C8D2",
         display: "flex",
         alignItems: "center",
         justifyContent: "flex-start",
        }}>
        <ImageWithShimmer
         src={cuisine.image_url}
         alt={cuisine.name}
         wrapperClassName="rounded-[12px] shrink-0"
         style={{
          width: "60px",
          height: "60px",
          marginRight: "",
         }}
        />
        <span style={{ textAlign: "left" }}>{cuisine.name}</span>
       </Button>
      ))}
     </div>
    </div>

    <div className="flex justify-between mt-8">
     <Button
      onClick={handleGoBack}
      className="bg-[#C7C8D2] text-white cursor-pointer"
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
      disabled={selectedCuisines.length === 0} // Disable Continue button if no cuisine is selected
      className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
       selectedCuisines.length === 0 ? "cursor-not-allowed" : ""
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

export default CuisineSelection;
