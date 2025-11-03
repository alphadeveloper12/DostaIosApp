import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import Shrimmer from "@/components/ui/Shrimmer";
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
}

const CuisineSelection: React.FC<CuisineSelectionProps> = ({
 selectedCuisines,
 setSelectedCuisines,
 handleGoBack,
 handleContinue,
 toggleCuisine,
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

    const response = await axios.get(`${baseUrl}/api/catering/cuisines/`, {
     headers: {
      Authorization: `Token ${authToken}`,
     },
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
 }, []);

 // Render loading and error states
 if (loading) {
  return <Shrimmer></Shrimmer>;
 }

 if (error) {
  return <div className="text-center text-red-600 py-10">{error}</div>;
 }

 // Toggle cuisine selection and update selected cuisines state
 const handleCuisineSelection = (cuisine: { id: number; name: string }) => {
  // Check if the cuisine is already selected
  const isSelected = selectedCuisines.some(
   (selectedCuisine) => selectedCuisine.id === cuisine.id
  );

  // Toggle the selection state
  if (isSelected) {
   setSelectedCuisines(selectedCuisines.filter((c) => c.id !== cuisine.id));
  } else {
   setSelectedCuisines([...selectedCuisines, cuisine]);
  }
 };

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6 gap-4">
     <div
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">3</span>
     </div>
     <h2 className="text-primary-text text-2xl font-bold">
      What's Type of Cuisines Would You Prefer?
     </h2>
    </div>

    <div className="ml-12">
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
        <img
         src={cuisine.image_url}
         alt={cuisine.name}
         style={{
          width: "60px",
          height: "60px",
          marginRight: "8px",
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
       padding: "12px 24px",
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
