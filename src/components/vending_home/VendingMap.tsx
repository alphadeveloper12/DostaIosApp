import {
 GoogleMap,
 useJsApiLoader,
 Marker,
 InfoWindow,
} from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux"; // To get user data

const containerStyle = {
 width: "100%",
 height: "100%",
};

const vendingLocations = [
 {
  id: 1,
  name: "Barsha 1",
  position: { lat: 25.118, lng: 55.201 },
  info: "Near Mall of the Emirates, St. 12",
  hours: "Open - Closes at 10 PM",
 },
 {
  id: 2,
  name: "JLT Cluster D",
  position: { lat: 25.073, lng: 55.141 },
  info: "Beside Carrefour Market",
  hours: "Open 24 Hours",
 },
 {
  id: 3,
  name: "Business Bay",
  position: { lat: 25.189, lng: 55.273 },
  info: "Close to Bay Avenue Mall",
  hours: "Open - Closes at 9 PM",
 },
];

const center = { lat: 25.118, lng: 55.201 };

const VendingMap = () => {
 const { isLoaded, loadError } = useJsApiLoader({
  id: "google-map-script",
  googleMapsApiKey: "AIzaSyCYAsBPyik1DZcOH3jcR-awecFjyYXr5Qw", // 🟥 Replace with your valid key
 });

 const [selected, setSelected] = useState<any>(null); // State for selected location
 const [map, setMap] = useState<google.maps.Map | null>(null);
 const [selectedLocation, setSelectedLocation] = useState<any>(null);

 const userData = useSelector((state: any) => state?.user?.user); // Get user data

 const onLoad = useCallback((mapInstance: google.maps.Map) => {
  setMap(mapInstance);
 }, []);

 const onUnmount = useCallback(() => {
  setMap(null);
 }, []);

 // Load selected location from sessionStorage if available
 useEffect(() => {
  const storedLocation = sessionStorage.getItem("selectedLocation");
  if (storedLocation) {
   const { location } = JSON.parse(storedLocation);
   setSelected(location); // Update state from sessionStorage
  }
 }, []);

 // Hide default close button
 useEffect(() => {
  const hideCloseButton = () => {
   const closeBtn = document.querySelector(
    ".gm-ui-hover-effect"
   ) as HTMLElement;
   if (closeBtn) closeBtn.style.display = "none";
  };

  const observer = new MutationObserver(hideCloseButton);
  observer.observe(document.body, { childList: true, subtree: true });
  hideCloseButton();
  return () => observer.disconnect();
 }, [selected]);

 const handleLocationSelect = (location: any) => {
  setSelected(location); // Update state with the new location
  sessionStorage.setItem(
   "selectedLocation",
   JSON.stringify({ userId: userData.id, location }) // Save to sessionStorage
  );
 };

 const handleConfirmSelection = () => {
  if (selectedLocation) {
   // Save the selected location to sessionStorage
   sessionStorage.setItem(
    "selectedLocation",
    JSON.stringify({ userId: userData.id, location: selectedLocation })
   );
   console.log("✅ Selected Location saved:", selectedLocation);
  }
 };

 if (loadError)
  return <div className="p-6 text-center text-red-500">Error loading map</div>;

 if (!isLoaded)
  return (
   <div className="flex items-center justify-center h-full text-gray-500">
    Loading map...
   </div>
  );

 return (
  <GoogleMap
   mapContainerStyle={containerStyle}
   center={center}
   zoom={13}
   onLoad={onLoad}
   onUnmount={onUnmount}
   onClick={() => setSelected(null)}
   options={{
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: false,
   }}>
   {vendingLocations.map((loc) => (
    <Marker
     key={loc.id}
     position={loc.position}
     onClick={() => handleLocationSelect(loc)}
     icon={{
      url:
       selected?.id === loc.id
        ? "/images/icons/red-marker.svg"
        : "/images/icons/blue-marker.svg",
      scaledSize: new window.google.maps.Size(42, 42),
     }}
    />
   ))}

   {selected && (
    <InfoWindow
     position={{
      lat: selected.position.lat + 0.0002,
      lng: selected.position.lng,
     }}
     options={{
      pixelOffset: new window.google.maps.Size(0, -40),
     }}>
     <div
      style={{
       width: "280px",
       borderRadius: "16px",
       boxShadow: "0 12px 24px rgba(43,43,67,0.15)",
       padding: "0 16px",
       fontFamily: "Inter, sans-serif",
       backgroundColor: "#fff",
      }}>
      <div className="inline-block bg-[#A7CF38] text-[#054A86] text-[12px] font-semibold px-3 py-1 rounded-full mb-2">
       SELECTED LOCATION
      </div>
      <h3 className="text-[20px] font-[700] text-[#1F2937]">{selected.name}</h3>
      <p className="text-[14px] text-[#4B5563] mt-1">{selected.info}</p>
      <p className="text-[14px] text-[#4B5563] mt-1">{selected.hours}</p>
     </div>
    </InfoWindow>
   )}
  </GoogleMap>
 );
};

export default VendingMap;
