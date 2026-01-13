import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layout/Header";
import "../index.css";

import EventTypeCard from "../components/catering/EventTypeCard";

import { Button } from "../components/ui/button";
import DateTimePicker from "@/components/ui/calendar";
import EventTypeSelection from "../components/catering/EventTypeSelection";
import ProviderTypeSelection from "../components/catering/ProviderTypeSelection";
import CuisineSelection from "../components/catering/CuisineSelection";

import LocationSelection from "../components/catering/LocationSelection";
import BudgetSelection from "../components/catering/BudgetSelection";
import BookingSummary from "../components/catering/BookingSummary"; // Import BookingSummary
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import LazyLoad from "@/components/ui/LazyLoad";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import CoursesMenu from "../components/catering/CoursesMenu";
import CoffeeBreakMenu from "../components/catering/CoffeeBreakMenu";
import PlatterMenu from "../components/catering/PlatterMenu";

import LiveStationMenu from "../components/catering/LiveStationMenu";
import AmericanMenuSelection from "../components/catering/AmericanMenuSelection";
import CanapeMenu from "../components/catering/CanapeMenu";

const Catering = () => {
 const navigate = useNavigate();
 const [selectedEvent, setSelectedEvent] = useState<{
  id: string | null;
  name: string | null;
  description?: string;
 } | null>(null);
 const [selectedDetailedEventName, setSelectedDetailedEventName] = useState<{
  id: string | null;
  name: string | null;
 } | null>(null);
 const [guestCount, setGuestCount] = useState<number>(1);
 const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
 const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
 const [step, setStep] = useState<number>(1); // Step states to manage visibility
 const [selectedProvider, setSelectedProvider] = useState<{
  id: string | null;
  name: string | null;
 } | null>(null);
 const [selectedServiceStyles, setSelectedServiceStyles] = useState<{
  id: number;
  name: string;
  description?: string;
 } | null>(null);
 const [selectedMenuDescription, setSelectedMenuDescription] = useState<
  string | null
 >(null);
 const [selectedCuisines, setSelectedCuisines] = useState<
  { id: number; name: string }[]
 >([]);
 const [selectedCourses, setSelectedCourses] = useState<
  { id: number; name: string }[]
 >([]);
 const [selectedLocation, setSelectedLocation] = useState<{
  id: number | null;
  name: string | null;
 } | null>(null);
 const [selectedBudget, setSelectedBudget] = useState<{
  id: string | null;
  label: string | null;
  price_range: string | null;
 }>({ id: null, label: null, price_range: null });

 const [selectedPax, setSelectedPax] = useState<{
  id: string | null;
  label: string | null;
  number: string | null;
 }>({
  id: null,
  label: null,
  number: null,
 });
 const [selectedMenuItems, setSelectedMenuItems] = useState<
  { id: string; name: string; course: string; description?: string }[]
 >([]);

 // Handler functions
 const handleGuestCountChange = (amount: number) => {
  // Prevent going below 1 guest
  setGuestCount((prevCount) => Math.max(1, prevCount + amount));
 };

 const handleSelectDateTime = () => {
  setIsDateTimePickerVisible(true);
 };

 const handleDateTimeConfirm = (formattedDateTime: string) => {
  setSelectedDateTime(formattedDateTime);
 };

 const handleContinue = () => {
  const isBuffetOrSetMenu =
   selectedServiceStyles?.name &&
   (selectedServiceStyles.name.toLowerCase().includes("buffet") ||
    selectedServiceStyles.name.toLowerCase().includes("set menu"));

  const isPlatters = selectedServiceStyles?.name
   ?.toLowerCase()
   .includes("platter");

  const isCanape = selectedServiceStyles?.name
   ?.toLowerCase()
   .includes("canape");

  const isLiveStation = selectedServiceStyles?.name
   ?.toLowerCase()
   .includes("live station");

  const isAmericanCuisine = selectedCuisines.some(
   (c) => c.name.toLowerCase() === "american"
  );

  if (step === 1 && selectedEvent)
   setStep(2); // Budget (Step 1) -> Event (Step 2)
  else if (step === 2 && selectedLocation?.id)
   setStep(3); // Event (Step 2) -> Provider (Step 3)
  else if (step === 3 && selectedServiceStyles) {
   if (isBuffetOrSetMenu) {
    setStep(4); // Provider (Step 3) -> Cuisine (Step 4)
   } else {
    setStep(5); // Provider (Step 3) -> Budget (Step 5) -- SKIPPING Cuisine
   }
  } else if (step === 4 && selectedCuisines.length > 0) {
   setStep(5); // Cuisine (Step 4) -> Budget (Step 5)
  } else if (step === 5 && selectedBudget.id) {
   if (isAmericanCuisine) {
    setStep(13); // American Menu Selection (Step 13)
   } else if (isBuffetOrSetMenu) {
    setStep(7); // Budget (Step 5) -> Menu (Step 7) (Skipping Course Selection)
   } else if (isPlatters) {
    setStep(10); // Platter Menu (Step 10)
   } else if (isLiveStation) {
    setStep(12); // Live Station Menu (Step 12)
   } else if (isCanape) {
    setStep(14); // Canape Menu (Step 14)
   } else {
    setStep(9); // Coffee Break Menu (Step 9)
   }
  } else if (step === 7) {
   setStep(8); // Menu (Step 7) -> Summary (Step 8)
  } else if (step === 9)
   setStep(8); // Coffee Break Menu (Step 9) -> Summary (Step 8)
  else if (step === 10)
   setStep(8); // Platter Menu (Step 10) -> Summary (Step 8)
  else if (step === 12)
   setStep(8); // Live Station Menu (Step 12) -> Summary (Step 8)
  else if (step === 13)
   setStep(8); // American Menu (Step 13) -> Summary (Step 8)
  else if (step === 14) setStep(8); // Canape Menu (Step 14) -> Summary (Step 8)
 };
 const handleGoBack = () => {
  const isBuffetOrSetMenu =
   selectedServiceStyles?.name &&
   (selectedServiceStyles.name.toLowerCase().includes("buffet") ||
    selectedServiceStyles.name.toLowerCase().includes("set menu"));
  const isPlatters = selectedServiceStyles?.name
   ?.toLowerCase()
   .includes("platter");

  const isLiveStation = selectedServiceStyles?.name
   ?.toLowerCase()
   ?.toLowerCase()
   .includes("live station");
  const isCanape = selectedServiceStyles?.name
   ?.toLowerCase()
   .includes("canape");
  const isAmericanCuisine = selectedCuisines.some(
   (c) => c.name.toLowerCase() === "american"
  );

  if (step === 2) setStep(1); // Go back to Budget
  else if (step === 3) setStep(2); // Go back to Event
  else if (step === 4) setStep(3); // Go back to Provider
  else if (step === 5) {
   // Reset Budget and Pax when going back from Budget Step
   setSelectedBudget({ id: null, label: null, price_range: null });
   setSelectedPax({ id: null, label: null, number: null });

   if (isBuffetOrSetMenu) {
    setStep(4); // Go back to Cuisine
   } else {
    setStep(3); // Go back to Provider (Skipped Cuisine)
   }
  } else if (step === 6) setStep(5); // Go back to Budget
  else if (step === 7) {
   setStep(5); // Go back to Budget (Skipping Course Selection)
  } else if (step === 8) {
   if (isAmericanCuisine) {
    setStep(13); // Back to American Menu
   } else if (isBuffetOrSetMenu) {
    setStep(7); // Go back to Menu
   } else if (isPlatters) {
    setStep(10); // Go back to Platter Menu
   } else if (isLiveStation) {
    setStep(12); // Go back to Live Station
   } else if (isCanape) {
    setStep(14); // Go back to Canape
   } else {
    setStep(9); // Go back to Coffee Break Menu
   }
  } else if (step === 9) setStep(5); // Coffee Break Menu -> Budget
  else if (step === 10) setStep(5); // Platter Menu -> Budget
  else if (step === 12) setStep(5); // Live Station Menu -> Budget
  else if (step === 13) setStep(5); // American Menu -> Budget
  else if (step === 14) setStep(5); // Canape Menu -> Budget
 };

 // Toggle selection functions
 const toggleServiceStyle = (style: {
  id: number;
  name: string;
  description?: string;
 }) => {
  setSelectedServiceStyles(style);
  // Clear downstream selections to prevent stale data
  setSelectedCuisines([]);
  setSelectedCourses([]);
  setSelectedMenuItems([]);
 };

 const toggleCuisine = (cuisine: { id: number; name: string }) => {
  setSelectedCuisines((prevState) =>
   prevState.some((item) => item.id === cuisine.id)
    ? prevState.filter((item) => item.id !== cuisine.id)
    : [...prevState, cuisine]
  );
 };

 const toggleCourse = (course: { id: number; name: string }) => {
  setSelectedCourses((prevState) =>
   prevState.some((item) => item.id === course.id)
    ? prevState.filter((item) => item.id !== course.id)
    : [...prevState, course]
  );
 };

 const toggleMenuItem = (item: {
  id: string;
  name: string;
  course: string;
  description?: string;
 }) => {
  setSelectedMenuItems((prevState) =>
   prevState.some((i) => i.id === item.id)
    ? prevState.filter((i) => i.id !== item.id)
    : [...prevState, item]
  );
 };

 return (
  <div className="min-h-screen flex flex-col">
   <Header />

   <main className="flex-1 bg-background">
    <div className="bg-neutral-white">
     <div className="main-container !py-6">
      {/* <div className="flex items-center gap-2 text-sm mb-6">
               <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-neutral-gray-dark hover:text-primary transition-colors">
                 <ChevronLeft className="w-4 h-4" />
                 Breadcrumbs
               </button>
               <span className="text-neutral-gray">/</span>
               <span className="text-neutral-gray-dark">Breadcrumbs</span>
             </div> */}
      <BreadCrumb />

      <h1 className="md:text-4xl font-bold text-primary text-[28px]">
       Catering Service
      </h1>
     </div>
    </div>
    <LazyLoad>
     <div className="main-container !py-6 !pb-24">
      {/* Show the steps */}

      {step === 1 && (
       <EventTypeSelection
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        selectedDateTime={selectedDateTime}
        setIsDateTimePickerVisible={setIsDateTimePickerVisible}
        handleSelectDateTime={handleSelectDateTime}
        handleContinue={handleContinue}
        handleGuestCountChange={handleGuestCountChange}
        handleGoBack={handleGoBack}
       />
      )}
      {step === 2 && (
       <LocationSelection
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        handleGoBack={handleGoBack}
        handleContinue={handleContinue}
       />
      )}
      {step === 3 && (
       <LazyLoad>
        <ProviderTypeSelection
         selectedProvider={selectedProvider}
         setSelectedProvider={setSelectedProvider}
         toggleServiceStyle={toggleServiceStyle}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         selectedServiceStyles={selectedServiceStyles}
         selectedEvent={selectedEvent}
         selectedDetailedEventName={selectedDetailedEventName}
         setSelectedDetailedEventName={setSelectedDetailedEventName}
         guestCount={guestCount}
        />
       </LazyLoad>
      )}
      {step === 4 && (
       <LazyLoad>
        <CuisineSelection
         selectedCuisines={selectedCuisines}
         setSelectedCuisines={setSelectedCuisines}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         toggleCuisine={toggleCuisine}
         selectedBudget={selectedBudget}
         selectedEvent={selectedEvent}
         selectedServiceStyles={selectedServiceStyles}
        />
       </LazyLoad>
      )}
      {step === 5 && (
       <LazyLoad>
        <BudgetSelection
         selectedBudget={selectedBudget}
         setSelectedBudget={setSelectedBudget}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         selectedEvent={selectedEvent}
         selectedPax={selectedPax}
         setSelectedPax={setSelectedPax}
         selectedServiceStyles={selectedServiceStyles}
         selectedCuisines={selectedCuisines}
         guestCount={guestCount}
        />
       </LazyLoad>
      )}

      {step === 7 && (
       <LazyLoad>
        <CoursesMenu
         selectedMenuItems={selectedMenuItems}
         toggleMenuItem={toggleMenuItem}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         selectedCourses={selectedCourses}
         selectedCuisines={selectedCuisines}
         selectedBudget={selectedBudget}
         selectedEvent={selectedEvent}
         setSelectedMenuItems={setSelectedMenuItems}
         setSelectedMenuDescription={setSelectedMenuDescription}
        />
       </LazyLoad>
      )}
      {step === 9 && (
       <LazyLoad>
        <CoffeeBreakMenu
         selectedMenuItems={selectedMenuItems}
         toggleMenuItem={toggleMenuItem}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         selectedBudget={selectedBudget}
         selectedEvent={selectedEvent}
         setSelectedMenuItems={setSelectedMenuItems}
         setSelectedMenuDescription={setSelectedMenuDescription}
        />
       </LazyLoad>
      )}
      {step === 10 && (
       <LazyLoad>
        <PlatterMenu
         selectedMenuItems={selectedMenuItems}
         toggleMenuItem={toggleMenuItem}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
        />
       </LazyLoad>
      )}

      {step === 12 && (
       <LazyLoad>
        <LiveStationMenu
         selectedMenuItems={selectedMenuItems}
         toggleMenuItem={toggleMenuItem}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
        />
       </LazyLoad>
      )}
      {step === 13 && (
       <LazyLoad>
        <AmericanMenuSelection
         selectedMenuItems={selectedMenuItems}
         setSelectedMenuItems={setSelectedMenuItems}
         setSelectedMenuDescription={setSelectedMenuDescription}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
        />
       </LazyLoad>
      )}
      {step === 14 && (
       <LazyLoad>
        <CanapeMenu
         selectedMenuItems={selectedMenuItems}
         toggleMenuItem={toggleMenuItem}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         selectedBudget={selectedBudget}
        />
       </LazyLoad>
      )}
      {/* Show the Booking Summary after step 6 */}
      {step === 8 && (
       <LazyLoad>
        <BookingSummary
         eventType={selectedEvent}
         guestCount={guestCount}
         selectedDateTime={selectedDateTime}
         selectedProvider={selectedProvider}
         selectedServiceStyles={selectedServiceStyles}
         selectedMenuDescription={selectedMenuDescription}
         selectedCuisines={selectedCuisines}
         selectedCourses={selectedCourses}
         selectedLocation={selectedLocation}
         selectedBudget={selectedBudget}
         selectedMenuItems={selectedMenuItems}
         handleGoBack={handleGoBack} // Pass the handleGoBack function
        />
       </LazyLoad>
      )}
     </div>
    </LazyLoad>
   </main>
   <MobileFooterNav />
   {/* <Footer /> */}

   {isDateTimePickerVisible && (
    <DateTimePicker
     isOpen={isDateTimePickerVisible}
     onClose={() => setIsDateTimePickerVisible(false)}
     onConfirm={handleDateTimeConfirm}
    />
   )}
  </div>
 );
};

export default Catering;
