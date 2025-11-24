import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VendingMap from "./VendingMap"; // 👈 Import the Google Map component
import { useDispatch, useSelector } from "react-redux";
import {
 fetchLocations,
 selectAllLocations,
 getLocationsStatus,
 getLocationsError,
} from "../../redux/slices/vendingLocationsSlice";
import Shrimmer from "../ui/Shrimmer";

const HeroSection = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const [selectedItem, setSelectedItem] = useState(false);
 const [activeView, setActiveView] = useState<"list" | "map">("list");
 const [selectedLocation, setSelectedLocation] = useState<any>(null);

 const vendingLocations = useSelector(selectAllLocations);
 const status = useSelector(getLocationsStatus);

 useEffect(() => {
  // Only fetch if the status is 'idle' (to prevent re-fetching)
  if (status === "idle") {
   dispatch(fetchLocations());
  }
 }, [status, dispatch]);

 const userData = useSelector((state: any) => state?.user?.user); // Get user data
 useEffect(() => {
  const storedLocation = sessionStorage.getItem("selectedLocation");
  if (storedLocation) {
   setSelectedLocation(JSON.parse(storedLocation).location);
  }
 }, []);

 const handleLocationSelect = (location: any) => {
  setSelectedLocation(location);
  // Save user ID and selected location to sessionStorage
  sessionStorage.setItem(
   "selectedLocation",
   JSON.stringify({ userId: userData.id, location })
  );
 };

 const handleNavigate = () => {
  navigate("/vending-home/order-now");
 };
 return (
  <section className="relative">
   {/* Background image */}
   <div
    className="h-[512px] bg-cover bg-center"
    style={{
     backgroundImage: "url('/images/vending_home/hero-vending.png')",
    }}
   />
   {/* Dark overlay */}
   <div className="absolute inset-0 h-[512px] md:bg-black/30" />

   {/* Content container with the white box */}
   <div className="absolute inset-0 h-[512px]">
    <div className="mx-auto h-full max-w-6xl px-4  flex items-center justify-center">
     <div className="w-full max-w-[585px] h-auto rounded-2xl bg-white shadow-[0_12px_24px_0_#2B2B4329] py-6 md:py-8 px-5 sm:px-[64px]">
      <h1 className=" text-[40px] leading-[56px] font-extrabold text-[#054A86] text-center">
       Meals on Your Schedule
      </h1>
      <p className="mt-6 text-[20px] leading-[28px]  font-semibold text-center text-[#545563]">
       Plan and reserve your meal and pick it up from a vending location nearby.
      </p>

      {/* Search input mock (opens sidebar) */}
      <div className="mt-6 flex justify-center w-full sm:w-[80%] mx-auto">
       <input
        className="w-full max-w-md rounded-xl px-5 py-3 md:px-3 md:py-[10px] text-[16px] leading-[24px] font-[400] outline-none bg-[#EDEEF2] placeholder:text-[#545563]"
        placeholder="Find nearby vending locations…"
        onClick={() => setSelectedItem(true)}
       />
       <svg
        className="md:-ml-7 -ml-8 md:mt-[13px] mt-4 "
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1_12308)">
         <path
          d="M14.5 6.66699C14.5 11.3337 8.5 15.3337 8.5 15.3337C8.5 15.3337 2.5 11.3337 2.5 6.66699C2.5 5.07569 3.13214 3.54957 4.25736 2.42435C5.38258 1.29913 6.9087 0.666992 8.5 0.666992C10.0913 0.666992 11.6174 1.29913 12.7426 2.42435C13.8679 3.54957 14.5 5.07569 14.5 6.66699Z"
          stroke="#2B2B43"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
         />
         <path
          d="M8.5 8.66699C9.60457 8.66699 10.5 7.77156 10.5 6.66699C10.5 5.56242 9.60457 4.66699 8.5 4.66699C7.39543 4.66699 6.5 5.56242 6.5 6.66699C6.5 7.77156 7.39543 8.66699 8.5 8.66699Z"
          stroke="#2B2B43"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
         />
        </g>
        <defs>
         <clipPath id="clip0_1_12308">
          <rect
           width="16"
           height="16"
           fill="white"
           transform="translate(0.5)"
          />
         </clipPath>
        </defs>
       </svg>
      </div>

      <div className="mt-6 text-center">
       <a href="#" className="text-sm text-[#056AC1] font-bold hover:underline">
        Or browse our vending meals
       </a>
      </div>
      <div className="mt-6 flex justify-center w-full">
       <img src="/images/vending_home/meal_browes.png" alt="Browse Meal" />
      </div>
     </div>
    </div>
   </div>

   {/* Sidebar for Vending Locator */}
   <AnimatePresence>
    {selectedItem && (
     <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-black/75"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      {/* Sidebar Panel */}
      <motion.div
       initial={{ x: "100%" }}
       animate={{ x: 0 }}
       exit={{ x: "100%" }}
       transition={{ type: "spring", stiffness: 250, damping: 30 }}
       className="bg-white w-full sm:max-w-[522px] h-full shadow-2xl flex flex-col overflow-hidden">
       {/* Header */}
       <div className="flex items-center justify-between md:px-8 md:pt-6 md:pb-4 py-[18px] px-[15px] border-b border-gray-200">
        <h2 className=" text-[20px] leading-[28px] font-[600] md:text-[28px] md:leading-[36px] md:font-[700] text-gray-900">
         Vending Locator
        </h2>
        <button
         onClick={() => setSelectedItem(false)}
         className="p-2 rounded-full hover:bg-gray-100">
         <X className="w-5 h-5 text-gray-600" />
        </button>
       </div>

       {/* Search Input */}
       <div className="px-8 py-4 flex items-center gap-2">
        <div className="relative flex-1">
         <input
          type="text"
          placeholder="Search by city or street name"
          className="w-full bg-[#EDEEF2] rounded-[12px] py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#054A86]"
         />
         <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
         </svg>
        </div>
        <button className="p-3 bg-[#EDEEF2] rounded-[12px] ">
         <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
           d="M2 7.33301L14.6667 1.33301L8.66667 13.9997L7.33333 8.66634L2 7.33301Z"
           stroke="#2B2B43"
           strokeWidth="1.5"
           strokeLinecap="round"
           strokeLinejoin="round"
          />
         </svg>
        </button>
       </div>

       {/* Toggle Tabs */}
       <div className="px-8 pb-4 shadow-xl">
        <div className="flex bg-gray-100 rounded-xl p-1">
         <button
          onClick={() => setActiveView("list")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                       activeView === "list"
                        ? "bg-[#054A86] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                      }`}>
          List View
         </button>
         <button
          onClick={() => setActiveView("map")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                       activeView === "map"
                        ? "bg-[#054A86] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                      }`}>
          Map View
         </button>
        </div>
       </div>

       {/* List View */}

       {activeView === "list" && (
        <div className="flex-1 overflow-y-auto px-8 space-y-4 py-8">
         {vendingLocations.map((location) => (
          <div
           key={location.id}
           className={`border border-gray-200 rounded-2xl shadow-md p-4 `}>
           {selectedLocation?.id === location.id ? (
            <span className="inline-block bg-[#A7CF38] text-[#054A86] text-[12px] font-semibold px-3 py-1 rounded-full mb-2">
             Selected Location
            </span>
           ) : (
            ""
           )}

           <h3 className="text-[20px] font-[700] text-gray-900">
            {location.name}
           </h3>
           <p className="text-[14px] text-gray-600">{location.info}</p>
           <p className="text-[14px] text-gray-600 mt-1">{location.hours}</p>
           <button
            onClick={() => handleLocationSelect(location)}
            className="mt-3 px-4 py-1.5 text-sm border border-gray-400 rounded-md hover:bg-gray-50">
            {selectedLocation?.id === location.id
             ? "Selected"
             : "Select This Location"}
           </button>
          </div>
         ))}
        </div>
       )}

       {/* Map View 👇 */}
       {activeView === "map" && (
        <div className="flex-1 overflow-y-auto px-8 space-y-4 py-8">
         <div className="w-full h-[500px] rounded-2xl overflow-hidden">
          <VendingMap />
         </div>
        </div>
       )}

       {/* Footer */}
       <div className="bg-white p-4">
        <button
         className="w-full bg-[#054A86] text-white rounded-lg py-3 font-medium hover:bg-[#063a69]"
         onClick={() => handleNavigate()}>
         Confirm & Close
        </button>
       </div>
      </motion.div>
     </motion.div>
    )}
   </AnimatePresence>
  </section>
 );
};

export default HeroSection;
