import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layout/Header";

import EventTypeCard from "../components/catering/EventTypeCard";

import { Button } from "../components/ui/button";
import DateTimePicker from "@/components/ui/calendar";
import EventTypeSelection from "../components/catering/EventTypeSelection";
import ProviderTypeSelection from "../components/catering/ProviderTypeSelection";
import CuisineSelection from "../components/catering/CuisineSelection";
import CourseSelection from "../components/catering/CourseSelection";
import LocationSelection from "../components/catering/LocationSelection";
import BudgetSelection from "../components/catering/BudgetSelection";
import BookingSummary from "../components/catering/BookingSummary"; // Import BookingSummary
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import LazyLoad from "@/components/ui/LazyLoad";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import CoursesMenu from "../components/catering/CoursesMenu";

const Catering = () => {
 const navigate = useNavigate();
 const [selectedEvent, setSelectedEvent] = useState<{
  id: string | null;
  name: string | null;
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
 const [selectedServiceStyles, setSelectedServiceStyles] = useState<
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
  { id: string; name: string; course: string; price: string }[]
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
   selectedServiceStyles &&
   (selectedServiceStyles.toLowerCase().includes("buffet") ||
    selectedServiceStyles.toLowerCase().includes("set menu"));

  if (step === 1 && selectedEvent)
   setStep(2); // Budget (Step 1) -> Event (Step 2)
  else if (step === 2 && selectedLocation?.id)
   setStep(3); // Event (Step 2) -> Provider (Step 3)
  else if (step === 3 && selectedServiceStyles)
   setStep(4); // Provider (Step 3) -> Cuisine (Step 4)
  else if (step === 4 && selectedBudget.id)
   setStep(5); // Cuisine (Step 4) -> Course (Step 5)
  else if (step === 5 && selectedCuisines.length > 0) {
   setStep(6); // Go to Course Selection (Step 6)
  } else if (step === 6 && selectedCourses.length > 0)
   setStep(7); // Location (Step 6) -> Menu (Step 7)
  else if (step === 7) setStep(8); // Menu (Step 7) -> Summary (Step 8)
 };
 const handleGoBack = () => {
  const isBuffetOrSetMenu =
   selectedServiceStyles &&
   (selectedServiceStyles.toLowerCase().includes("buffet") ||
    selectedServiceStyles.toLowerCase().includes("set menu"));

  if (step === 2) setStep(1); // Go back to Budget
  else if (step === 3) setStep(2); // Go back to Event
  else if (step === 4) setStep(3); // Go back to Provider
  else if (step === 5) setStep(4); // Go back to Cuisine
  else if (step === 6) setStep(5); // Go back to Course
  else if (step === 7) {
   setStep(6); // Go back to Course Selection (Step 6)
  } else if (step === 8) setStep(7); // Go back to Menu
 };

 // Toggle selection functions
 const toggleServiceStyle = (style: string) => {
  setSelectedServiceStyles(style);
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
  price: string;
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
       <LazyLoad>
        <LocationSelection
         selectedLocation={selectedLocation}
         setSelectedLocation={setSelectedLocation}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
        />
       </LazyLoad>
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
        />
       </LazyLoad>
      )}
      {step === 4 && (
       <LazyLoad>
        <BudgetSelection
         selectedBudget={selectedBudget}
         setSelectedBudget={setSelectedBudget}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         selectedEvent={selectedEvent}
         selectedPax={selectedPax}
         setSelectedPax={setSelectedPax}
        />
       </LazyLoad>
      )}
      {step === 5 && (
       <LazyLoad>
        <CuisineSelection
         selectedCuisines={selectedCuisines}
         setSelectedCuisines={setSelectedCuisines}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         toggleCuisine={toggleCuisine}
         selectedBudget={selectedBudget}
         selectedEvent={selectedEvent}
        />
       </LazyLoad>
      )}
      {step === 6 && (
       <LazyLoad>
        <CourseSelection
         selectedCourses={selectedCourses}
         setSelectedCourses={setSelectedCourses}
         handleGoBack={handleGoBack}
         handleContinue={handleContinue}
         selectedCuisines={selectedCuisines}
         toggleCourse={toggleCourse}
         selectedBudget={selectedBudget}
         selectedEvent={selectedEvent}
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
