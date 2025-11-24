import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import EventTypeCard from "../catering/EventTypeCard";
import LazyLoad from "@/components/ui/LazyLoad";
import Shrimmer from "@/components/ui/Shrimmer";

interface ProviderType {
 id: number;
 name: string;
 description: string;
 image_url: string;
}

interface ServiceStyle {
 id: number;
 name: string;
}

interface ProviderTypeSelectionProps {
 selectedProvider: { id: string | null; name: string | null };
 setSelectedProvider: React.Dispatch<
  React.SetStateAction<{ id: string | null; name: string | null }>
 >;
 toggleServiceStyle: (style: string) => void;
 handleGoBack: () => void;
 handleContinue: () => void;
 selectedServiceStyles: string[];
}

const ProviderTypeSelection: React.FC<ProviderTypeSelectionProps> = ({
 selectedProvider,
 setSelectedProvider,
 toggleServiceStyle,
 handleGoBack,
 handleContinue,
 selectedServiceStyles,
}) => {
 const [providerTypes, setProviderTypes] = useState<ProviderType[]>([]);
 const [serviceStyles, setServiceStyles] = useState<ServiceStyle[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 // Fetch Provider Types from API
 useEffect(() => {
  const fetchProviderTypes = async () => {
   try {
    const baseUrl = import.meta.env.VITE_API_URL;
    const authToken = sessionStorage.getItem("authToken");

    const response = await axios.get(
     `${baseUrl}/api/catering/provider-types/`,
     {
      headers: {
       Authorization: `Token ${authToken}`,
      },
     }
    );

    setProviderTypes(response.data);
   } catch (err: any) {
    console.error("Error fetching provider types:", err);
    setError("Failed to load provider types.");
   } finally {
    setLoading(false);
   }
  };
  const timer = setTimeout(() => {
   fetchProviderTypes();
  }, 1000); // ⏱️ 2-second delay

  return () => clearTimeout(timer); // cleanup
 }, []);

 // Fetch Service Styles when a Provider is selected
 useEffect(() => {
  if (!selectedProvider?.id) return; // Safely check if selectedProvider and selectedProvider.id exist

  const fetchServiceStyles = async () => {
   try {
    const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const authToken = sessionStorage.getItem("authToken");

    const response = await axios.get(
     `${baseUrl}/api/catering/service-styles/`,
     {
      headers: {
       Authorization: `Token ${authToken}`,
      },
     }
    );

    setServiceStyles(response.data);
   } catch (err: any) {
    console.error("Error fetching service styles:", err);
    setError("Failed to load service styles.");
   }
  };

  fetchServiceStyles();
 }, [selectedProvider]); // Only run this effect if selectedProvider changes

 // Render loading and error states
 if (loading) {
  return <Shrimmer></Shrimmer>;
 }

 if (error) {
  return <div className="text-center text-red-600 py-10">{error}</div>;
 }

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex md:items-center items-start mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 rounded-full flex items-center flex-shrink-0 justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">2</span>
     </div>
     <h2 className="text-primary-text md:text-2xl text-xl font-bold">
      What Type of Provider Do You Prefer?
     </h2>
    </div>

    {/* Provider Type Cards */}
    <div className="grid md:grid-cols-2 gap-6 md:max-w-3xl max-md:w-full md:ml-12">
     {providerTypes.map((provider) => (
      <EventTypeCard
       key={provider.id}
       image={provider.image_url}
       title={provider.name}
       selected={selectedProvider?.id === String(provider.id)} // Use optional chaining here
       onClick={() =>
        setSelectedProvider({ id: String(provider.id), name: provider.name })
       }
      />
     ))}
    </div>

    {/* Show provider details and service styles only if selected */}
    {selectedProvider?.id && ( // Only render if selectedProvider exists and has an id
     <div style={{ marginTop: "24px" }}>
      {/* Provider Description */}
      <h3
       style={{ fontSize: "16px", fontWeight: "700", color: "#2B2B43" }}
       className="max-md:pb-3 md:pl-[45px]">
       Expert Catering, Your Way
      </h3>
      <p
       style={{
        fontSize: "16px",
        fontWeight: "400",
        color: "#2B2B43",
        marginTop: "8px",
       }}>
       {providerTypes.find((p) => String(p.id) === selectedProvider.id)
        ?.description || "No description available"}
      </p>

      {/* Service Style Section — only shown if a card is selected */}
      <div style={{ marginTop: "24px" }}>
       <h3
        style={{
         fontSize: "16px",
         fontWeight: "700",
         color: "#2B2B43",
        }}>
        Select Service Style:
       </h3>
       <p
        style={{
         fontSize: "14px",
         fontWeight: "400",
         color: "#545563",
         marginTop: "4px",
        }}>
        (You can select multiple options)
       </p>

       <div className="flex flex-wrap md:gap-4 gap-2 mt-4">
        {serviceStyles.map((style) => (
         <Button
          key={style.id}
          onClick={() => toggleServiceStyle(style.name)}
          style={{
           fontSize: "16px",
           backgroundColor: selectedServiceStyles.includes(style.name)
            ? "#EAF5FF"
            : "#fff",
           color: "#2B2B43",
           fontWeight: "400",
           borderRadius: "16px",
           padding: "16px",
           //  height: "56px",

           border: selectedServiceStyles.includes(style.name)
            ? "1px solid #054A86"
            : "1px solid #C7C8D2",
          }}
          className="md:min-w-[200px] max-md:m-w-[120px] md:h-[56px]">
          {style.name}
         </Button>
        ))}
       </div>
      </div>
     </div>
    )}

    {/* Navigation Buttons */}
    <div className="flex justify-between mt-8" style={{ paddingRight: "45px" }}>
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
      disabled={selectedServiceStyles.length === 0} // Disable if no service style is selected
      className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
       selectedServiceStyles.length === 0 ? "cursor-not-allowed" : ""
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

export default ProviderTypeSelection;
