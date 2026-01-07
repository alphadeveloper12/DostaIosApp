import React, { useEffect, useState } from "react";
import axios from "axios";
import EventTypeCard from "../catering/EventTypeCard";
import { Button } from "../ui/button";
import Shrimmer from "@/components/ui/Shrimmer";
import LazyLoad from "@/components/ui/LazyLoad";

interface EventTypeSelectionProps {
 selectedEvent: { id: string | null; name: string | null };
 setSelectedEvent: React.Dispatch<
  React.SetStateAction<{ id: string | null; name: string | null }>
 >;
 guestCount: number;
 setGuestCount: React.Dispatch<React.SetStateAction<number>>;
 selectedDateTime: string | null;
 setIsDateTimePickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
 handleSelectDateTime: () => void;
 handleContinue: () => void;
 handleGuestCountChange: (amount: number) => void;
 handleGoBack: () => void;
}

const EventTypeSelection: React.FC<EventTypeSelectionProps> = ({
 selectedEvent,
 setSelectedEvent,
 guestCount,
 selectedDateTime,
 handleSelectDateTime,
 handleContinue,
 handleGuestCountChange,
 handleGoBack,
 setGuestCount,
}) => {
 const [eventTypes, setEventTypes] = useState<
  { id: number; name: string; image_url: string }[]
 >([]);
 const [loading, setLoading] = useState<boolean>(true);
 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");
 useEffect(() => {
  const fetchEventTypes = async () => {
   try {
    const response = await axios.get(`${baseUrl}/api/catering/event-types/`, {
     headers: { Authorization: `Token ${authToken}` },
    });

    setEventTypes(response.data);
   } catch (error: any) {
    console.error("Error fetching event types:", error);
   } finally {
    setLoading(false);
   }
  };

  const timer = setTimeout(() => {
   fetchEventTypes();
  }, 1000); // ⏱️ 2-second delay

  return () => clearTimeout(timer); // cleanup
 }, [baseUrl, authToken]);

 // Handle selecting an event
 const handleEventSelection = (eventId: string, eventName: string) => {
  setSelectedEvent({ id: eventId, name: eventName });
 };
 if (loading) {
  return (
   <div className="w-full h-[50vh] rounded-2xl overflow-hidden">
    <Shrimmer />
   </div>
  );
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
      <span className="text-primary-foreground font-bold ">1</span>
     </div>
     <h2 className="text-primary-text md:text-2xl text-xl font-bold">
      What Type Of Event Are you Planning?
     </h2>
    </div>

    {/* Event Type Cards */}
    <div className="grid md:grid-cols-2 gap-6 md:max-w-3xl max-md:w-full md:ml-12">
     {eventTypes.map((event) => (
      <EventTypeCard
       key={event.id}
       image={event.image_url}
       title={event.name}
       selected={selectedEvent?.id === String(event.id)} // Use optional chaining here
       onClick={() => handleEventSelection(String(event.id), event.name)}
      />
     ))}
    </div>

    {selectedEvent?.id && ( // Use optional chaining here too
     <div style={{ marginTop: "24px" }}>
      <h2
       style={{ fontSize: "16px", fontWeight: "700", color: "#2B2B43" }}
       className="max-md:pb-3 md:pl-[45px]">
       How Many Guests are you expecting?
      </h2>
      <div className="flex gap-6">
       <button
        onClick={() => handleGuestCountChange(-1)}
        style={{
         height: "32px",
         width: "32px",
         marginTop: "5px",
         backgroundColor: "#EAF5FF",
         borderRadius: "8px",
        }}>
        -
       </button>
       <input
        type="number"
        value={guestCount}
        onChange={(e) => setGuestCount(Number(e.target.value))}
        style={{
         height: "44px",
         width: "94px",
         border: "1px solid #C7C8D2",
         borderRadius: "8px",
         textAlign: "center",
         lineHeight: "44px",
        }}
       />
       <button
        onClick={() => handleGuestCountChange(1)}
        style={{
         height: "32px",
         width: "32px",
         marginTop: "5px",
         backgroundColor: "#EAF5FF",
         borderRadius: "8px",
        }}>
        +
       </button>
      </div>

      {selectedDateTime ? (
       <div>
        <h3
         style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#2B2B43",
          marginBottom: "20px",
          marginTop: "44px",
         }}>
         Date and Time of the Event?
        </h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
         <span style={{ fontSize: "16px", color: "#2B2B43", fontWeight: 400 }}>
          {selectedDateTime}
         </span>
         <button
          onClick={handleSelectDateTime}
          className="text-[#056AC1] underline hover:text-opacity-70 transition-colors"
          style={{ fontSize: "16px", fontWeight: "700" }}>
          Change Date/Time
         </button>
        </div>

        <div
         className="flex justify-between mt-8"
         style={{ paddingRight: "45px" }}>
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
          className="bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70"
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
      ) : (
       <Button
        className="mt-6"
        variant="default"
        size="default"
        style={{ boxShadow: "0px 8px 20px 0px #4E60FF29" }}
        onClick={handleSelectDateTime}>
        Select Date and Time
       </Button>
      )}
     </div>
    )}
   </div>
  </LazyLoad>
 );
};

export default EventTypeSelection;
