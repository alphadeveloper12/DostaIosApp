import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import LazyLoad from "@/components/ui/LazyLoad";
import Shrimmer from "@/components/ui/Shrimmer";

interface Location {
 id: number;
 name: string;
}

interface LocationSelectionProps {
 selectedLocation: { id: number | null; name: string | null };
 setSelectedLocation: React.Dispatch<
  React.SetStateAction<{ id: number | null; name: string | null }>
 >;
 handleGoBack: () => void;
 handleContinue: () => void;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({
 selectedLocation,
 setSelectedLocation,
 handleGoBack,
 handleContinue,
}) => {
 const [locations, setLocations] = useState<Location[]>([]); // Updated type for locations
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 useEffect(() => {
  const fetchLocations = async () => {
   try {
    const response = await axios.get(`${baseUrl}/api/catering/locations/`, {
     headers: {
      Authorization: `Token ${authToken}`,
     },
    });
    setLocations(response.data); // Assuming the response is an array of location objects
    setLoading(false);
   } catch (err) {
    setError("Failed to load locations. Please try again later.");
    setLoading(false);
   }
  };
  const timer = setTimeout(() => {
   fetchLocations();
  }, 1000); // ⏱️ 2-second delay

  return () => clearTimeout(timer); // cleanup
 }, [baseUrl, authToken]);

 if (loading) {
  return <Shrimmer/>;
 }

 if (error) {
  return <div>{error}</div>;
 }

 // Handle location selection
 const handleLocationSelection = (location: { id: number; name: string }) => {
  setSelectedLocation(location); // Save both id and name of the selected location
 };

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">6</span>
     </div>
     <h2 className="text-primary-text md:text-2xl text-xl font-bold">
      Where is your Event?
     </h2>
    </div>

    <div className="md:ml-12">
     <div className="grid md:grid-cols-3 gap-6 max-w-3xl">
      {locations.map((location) => (
       <Button
        key={location.id} // Use the location id as the key
        onClick={() => handleLocationSelection(location)} // Pass the location object
        style={{
         fontSize: "16px",
         height: "56px",
         backgroundColor:
          selectedLocation?.id === location.id ? "#EAF5FF" : "#fff", // Optional chaining used here
         color: "#2B2B43",
         fontWeight: "400",
         borderRadius: "16px",
         padding: "12px 16px",
         width: "245px",
         border:
          selectedLocation?.id === location.id
           ? "1px solid #054A86"
           : "1px solid #C7C8D2", // Optional chaining used here
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
        }}>
        {location.name} {/* Render the location name */}
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
      disabled={!selectedLocation?.id} // Disable continue button if no location is selected (using optional chaining)
      className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
       !selectedLocation?.id ? "cursor-not-allowed" : ""
      }`} // Optional chaining here too
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

export default LocationSelection;
