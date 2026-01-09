import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import LazyLoad from "@/components/ui/LazyLoad";
import Shrimmer from "@/components/ui/Shrimmer";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface ServiceStyle {
 id: number;
 name: string;
 min_pax: number;
}

interface EventName {
 id: string;
 name: string;
}

interface ProviderTypeSelectionProps {
 selectedProvider: { id: string | null; name: string | null } | null;
 setSelectedProvider: React.Dispatch<
  React.SetStateAction<{ id: string | null; name: string | null } | null>
 >;
 toggleServiceStyle: (style: { id: number; name: string }) => void;
 handleGoBack: () => void;
 handleContinue: () => void;
 selectedServiceStyles: { id: number; name: string } | null;
 selectedEvent: { id: string | null; name: string | null } | null;
 selectedDetailedEventName: { id: string | null; name: string | null } | null;
 setSelectedDetailedEventName: React.Dispatch<
  React.SetStateAction<{ id: string | null; name: string | null } | null>
 >;
 guestCount: number;
}

const ProviderTypeSelection: React.FC<ProviderTypeSelectionProps> = ({
 toggleServiceStyle,
 handleGoBack,
 handleContinue,
 selectedServiceStyles,
 selectedEvent,
 selectedDetailedEventName,
 setSelectedDetailedEventName,
 guestCount,
}) => {
 const [serviceStyles, setServiceStyles] = useState<ServiceStyle[]>([]);
 const [eventNames, setEventNames] = useState<EventName[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 // Determine if we should show Event Name selection (Non-Corporate)
 const showEventNameSelection = !selectedEvent?.name
  ?.toLowerCase()
  .includes("corporate");

 useEffect(() => {
  const fetchData = async () => {
   try {
    const requests = [];

    // 1. Service Styles
    let styleEndpoint = "/api/catering/service-styles-private/";
    if (selectedEvent?.name?.toLowerCase().includes("corporate")) {
     styleEndpoint = "/api/catering/service-styles/";
    }
    requests.push(
     axios.get(`${baseUrl}${styleEndpoint}`, {
      headers: { Authorization: `Token ${authToken}` },
     })
    );

    // 2. Event Names (only if non-corporate)
    if (showEventNameSelection) {
     requests.push(
      axios.get(`${baseUrl}/api/catering/event-names/`, {
       headers: { Authorization: `Token ${authToken}` },
      })
     );
    }

    const responses = await Promise.all(requests);

    setServiceStyles(responses[0].data);

    // If showEventNameSelection is true, the response for event names will be at index 1
    if (showEventNameSelection && responses[1]) {
     setEventNames(responses[1].data);
    }

    setLoading(false);
   } catch (err) {
    setError("Failed to load options. Please try again later.");
    setLoading(false);
   }
  };

  const timer = setTimeout(() => {
   fetchData();
  }, 1000);

  return () => clearTimeout(timer);
 }, [baseUrl, authToken, selectedEvent, showEventNameSelection]);

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

 const isContinueDisabled = showEventNameSelection
  ? !selectedServiceStyles || !selectedDetailedEventName?.id
  : !selectedServiceStyles;

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">3</span>
     </div>
     <h2 className="text-primary-text md:text-2xl text-xl font-bold">
      Select Service Style
     </h2>
    </div>

    {/* --- Event Name Section (Conditional) --- */}
    {showEventNameSelection && (
     <div className="md:ml-12 mb-8">
      <h3 className="text-primary-text md:text-xl text-lg font-bold mb-4">
       Select Event Name
      </h3>
      <div className="grid md:grid-cols-4 gap-6 max-w-5xl">
       {eventNames.map((event) => (
        <Button
         key={event.id}
         onClick={() =>
          setSelectedDetailedEventName({ id: event.id, name: event.name })
         }
         style={{
          fontSize: "16px",
          height: "60px",
          backgroundColor:
           selectedDetailedEventName?.id === event.id ? "#EAF5FF" : "#fff",
          color: "#2B2B43",
          fontWeight: "400",
          borderRadius: "16px",
          padding: "16px",
          width: "245px",
          border:
           selectedDetailedEventName?.id === event.id
            ? "1px solid #054A86"
            : "1px solid #C7C8D2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
         }}>
         {event.name}
        </Button>
       ))}
      </div>
     </div>
    )}

    {/* --- Service Style Section --- */}
    <div className="md:ml-12">
     <div className="grid md:grid-cols-4 gap-6 max-w-5xl">
      {serviceStyles.map((style) => {
       const isDisabled = style.min_pax > guestCount;
       const tooltipContent = isDisabled
        ? `Minimum ${style.min_pax} guests required`
        : "";

       return (
        <Tippy key={style.id} content={tooltipContent} disabled={!isDisabled}>
         <div className="inline-block">
          {" "}
          {/* Wrapper for Tippy on disabled button */}
          <Button
           onClick={() =>
            !isDisabled &&
            toggleServiceStyle({ id: style.id, name: style.name })
           }
           disabled={isDisabled}
           style={{
            fontSize: "16px",
            height: "60px",
            backgroundColor: isDisabled
             ? "#F5F5F5"
             : selectedServiceStyles?.id === style.id
             ? "#EAF5FF"
             : "#fff",
            color: isDisabled ? "#A0A0A0" : "#2B2B43",
            fontWeight: "400",
            borderRadius: "16px",
            padding: "16px",
            width: "245px",
            border:
             selectedServiceStyles?.id === style.id
              ? "1px solid #054A86"
              : "1px solid #C7C8D2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.7 : 1,
           }}>
           {style.name}
          </Button>
         </div>
        </Tippy>
       );
      })}
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
      disabled={isContinueDisabled}
      className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
       isContinueDisabled ? "cursor-not-allowed" : ""
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
