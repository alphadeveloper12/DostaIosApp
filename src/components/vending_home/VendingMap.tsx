import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocations,
  selectAllLocations,
  getLocationsStatus,
} from "../../redux/slices/vendingLocationsSlice";

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

const VendingMap = ({
  readOnlyLocation,
  selectedLocation,
  onLocationSelect,
}: {
  readOnlyLocation?: { lat: number; lng: number; name: string; info: string };
  selectedLocation?: any;
  onLocationSelect?: (location: any) => void;
}) => {
  const dispatch = useDispatch();

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCYAsBPyik1DZcOH3jcR-awecFjyYXr5Qw",
  });

  const [selected, setSelected] = useState<any>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Use prop if provided, otherwise use internal state
  const currentSelected =
    selectedLocation !== undefined ? selectedLocation : selected;
  const setCurrentSelected = onLocationSelect || setSelected;

  /* loading vending locations */
  const vendingLocationsFromStore = useSelector(selectAllLocations);
  const status = useSelector(getLocationsStatus);

  /* use effect for vending locations */
  useEffect(() => {
    if (status === "idle" && !readOnlyLocation) {
      dispatch(fetchLocations() as any);
    }
  }, [status, dispatch, readOnlyLocation]);

  const userData = useSelector((state: any) => state?.user?.user);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Load selected location from localStorage if available (ONLY IF NOT READ ONLY)
  useEffect(() => {
    if (readOnlyLocation) {
      setSelected({
        id: -1,
        name: readOnlyLocation.name,
        info: readOnlyLocation.info,
        position: { lat: readOnlyLocation.lat, lng: readOnlyLocation.lng },
        hours: "",
      });
      return;
    }

    const storedLocation = localStorage.getItem("selectedLocation");
    if (storedLocation && selectedLocation === undefined) {
      const { location } = JSON.parse(storedLocation);
      setSelected(location);
    }
  }, [readOnlyLocation, selectedLocation]);

  // Effect to pan map to selection
  useEffect(() => {
    if (map && currentSelected?.position) {
      map.panTo(currentSelected.position);
    }
  }, [map, currentSelected]);

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
  }, [currentSelected]);

  const handleLocationSelect = (location: any) => {
    if (readOnlyLocation) return;

    setCurrentSelected(location);
    localStorage.setItem(
      "selectedLocation",
      JSON.stringify({ userId: userData?.id, location })
    );
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
      center={
        readOnlyLocation
          ? { lat: readOnlyLocation.lat, lng: readOnlyLocation.lng }
          : center
      }
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={() => !readOnlyLocation && setCurrentSelected(null)}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: false,
      }}
    >
      {/* Render Markers : If read-only, show single marker. Else show all vending locations */}
      {readOnlyLocation ? (
        <Marker
          position={{ lat: readOnlyLocation.lat, lng: readOnlyLocation.lng }}
          icon={{
            url: "/images/icons/red-marker.svg",
            scaledSize: new window.google.maps.Size(42, 42),
          }}
        />
      ) : (
        (vendingLocationsFromStore?.length
          ? vendingLocationsFromStore
          : vendingLocations
        ).map((loc: any) => (
          <Marker
            key={loc.id}
            position={loc.position}
            onClick={() => handleLocationSelect(loc)}
            icon={{
              url:
                currentSelected?.id === loc.id
                  ? "/images/icons/red-marker.svg"
                  : "/images/icons/blue-marker.svg",
              scaledSize: new window.google.maps.Size(42, 42),
            }}
          />
        ))
      )}

      {currentSelected && (
        <InfoWindow
          position={{
            lat: currentSelected.position.lat + 0.0002,
            lng: currentSelected.position.lng,
          }}
          options={{
            pixelOffset: new window.google.maps.Size(0, -40),
          }}
        >
          <div
            style={{
              width: "280px",
              borderRadius: "16px",
              boxShadow: "0 12px 24px rgba(43,43,67,0.15)",
              padding: "0 16px",
              fontFamily: "Inter, sans-serif",
              backgroundColor: "#fff",
            }}
          >
            <div className="inline-block bg-[#A7CF38] text-[#054A86] text-[12px] font-semibold px-3 py-1 rounded-full mb-2">
              {readOnlyLocation ? "ORDER LOCATION" : "SELECTED LOCATION"}
            </div>
            <h3 className="text-[20px] font-[700] text-[#1F2937]">
              {currentSelected.name}
            </h3>
            <p className="text-[14px] text-[#4B5563] mt-1">
              {currentSelected.info}
            </p>
            {currentSelected.hours && (
              <p className="text-[14px] text-[#4B5563] mt-1">
                {currentSelected.hours}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default VendingMap;
