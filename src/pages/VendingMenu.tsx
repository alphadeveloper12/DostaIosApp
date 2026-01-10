import BreadCrumb from "@/components/home/BreadCrumb";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./catering/components/layout/Header";
import Shrimmer from "@/components/ui/Shrimmer";
import LazyLoad from "@/components/ui/LazyLoad";
import { useDispatch, useSelector } from "react-redux";
import MobileFooterNav from "@/components/home/MobileFooterNav";

// Define the interface for the food item
interface FoodItem {
  id: number; // Added ID
  name: string;
  price: string;
  description: string;
  imgAlt: string;
  offer: string;
  terms_and_conditions: string;
  image_url: string;
  vendingGoodUuid?: string; // Optional for matching
  //  title: string;
}

const MenuItemCard = ({
  data,
  onClick,
}: {
  data: FoodItem;
  onClick: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="w-full border border-[#EDEEF2] max-w-[354px] bg-neutral-white rounded-[16px] px-3 pt-3 pb-5 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      {/* Image Container with Shimmer */}
      <div className="relative w-full md:h-[180px] h-[180px] rounded-[12px] sm:rounded-[16px] overflow-hidden z-[1]">
        {!imageLoaded && (
          <div className="absolute inset-0">
            <Shrimmer />
          </div>
        )}
        <img
          src={data.image_url}
          alt={data?.imgAlt || "Food Item"}
          onLoad={() => setImageLoaded(true)}
          className={`block w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
            }`}
        />
      </div>

      <h3 className="text-[24px] pt-3 pb-1 leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43]">
        {data.name}
      </h3>
      <p className="text-[14px] line-clamp-2 leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
        {data.description}
      </p>
      <h4 className="text-[16px] pt-2 leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
        AED {data.price}
      </h4>
    </div>
  );
};

const VendingMenu = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tab, setTab] = useState<number>(0);
  const [weeklyMenu, setWeeklyMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [machineGoods, setMachineGoods] = useState<any[] | null>(null);

  // Fetch Weekly Menu on Mount
  useEffect(() => {
    const fetchWeeklyMenu = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const authToken = sessionStorage.getItem("authToken");
        const headers: any = {};
        if (authToken) {
          headers["Authorization"] = `Token ${authToken}`;
        }

        const response = await fetch(`${baseUrl}/api/vending/menu/plan/WEEKLY/`, {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          setWeeklyMenu(data.week_menu);
        } else {
          console.error("Failed to fetch weekly menu");
        }
      } catch (error) {
        console.error("Error fetching weekly menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyMenu();
  }, []);

  // Fetch Machine Goods (for availability check)
  useEffect(() => {
    const fetchMachineGoods = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const selectedLocation = JSON.parse(localStorage.getItem("selectedLocation") || "{}");
        const serialNumber = selectedLocation?.location?.serial_number;

        if (!serialNumber) {
          setMachineGoods([]);
          return;
        }

        const cacheKey = `machine_goods_${serialNumber}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          const { goods, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5 min cache

          if (goods && goods.length > 0) {
            setMachineGoods(goods);
            if (!isExpired) return;
          }
        }

        const response = await fetch(
          `${baseUrl}/api/vending/external/machine-goods/?machineUuid=${serialNumber}`
        );
        const data = await response.json();

        if (data?.data) {
          const allGoods = data.data.flatMap((category: any) => category.goodsList || []);
          setMachineGoods(allGoods);

          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              goods: allGoods,
              timestamp: Date.now(),
            })
          );
        } else {
          setMachineGoods([]);
        }
      } catch (error) {
        console.error("Failed to fetch machine goods:", error);
        setMachineGoods([]);
      }
    };

    fetchMachineGoods();
  }, []);

  const userData = useSelector((state: any) => state?.user?.user);
  const [orderData, setOrderData] = useState<any>({
    user: userData ? userData.id : "",
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  });
  useEffect(() => {
    const storedOrder = sessionStorage.getItem("orderData");
    if (storedOrder) {
      try {
        const parsed = JSON.parse(storedOrder);
        setOrderData(parsed);
      } catch (err) {
        console.error("Error parsing orderData:", err);
      }
    }
  }, []);

  const days = [
    { day: "Monday" },
    { day: "Tuesday" },
    { day: "Wednesday" },
    { day: "Thursday" },
    { day: "Friday" },
  ];

  // Helper to normalize names for comparison
  const normalizeName = (name: string) => (name || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Get items for the selected day with filtering logic
  const currentDayItems = useMemo(() => {
    if (!weeklyMenu || !days[tab]) return [];

    const selectedDayName = days[tab].day; // e.g., "Monday"
    const dayData = weeklyMenu[selectedDayName];
    const items = dayData?.items || [];

    // Determine current day
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // If selected tab is TODAY, filter by machine availability
    if (selectedDayName === today && machineGoods) {
      const availableItems = items.filter((item: any) => {
        const normalizedItemName = normalizeName(item.name);
        return machineGoods.some((good: any) => {
          const rawName = typeof good === "string" ? good : good?.goodsName || "";
          return normalizeName(rawName) === normalizedItemName;
        });
      });

      // Attach vendingGoodUuid
      return availableItems.map((item: any) => {
        const normalizedItemName = normalizeName(item.name);
        const match = machineGoods.find((good: any) => {
          const rawName = typeof good === "string" ? good : good?.goodsName || "";
          return normalizeName(rawName) === normalizedItemName;
        });

        return {
          ...item,
          vendingGoodUuid: match?.uuid
        };
      });
    }

    // Otherwise return all items for that day
    return items;
  }, [weeklyMenu, tab, machineGoods]);

  // Function to handle card click and open the item details in the sidebar
  const handleCardClick = (item: FoodItem) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  // Modified startOrder to dispatch to Redux
  const startOrder = async () => {
    if (!selectedItem) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const authToken = sessionStorage.getItem("authToken");
      const headers: any = {
        "Content-Type": "application/json",
      };
      if (authToken) {
        headers["Authorization"] = `Token ${authToken}`;
      }

      // 1. Fetch current cart to append
      let existingItems: any[] = [];
      let locationId = 1;

      try {
        const cartRes = await fetch(`${baseUrl}/api/vending/cart/`, {
          method: "GET",
          headers: headers,
        });

        if (cartRes.ok) {
          const cartData = await cartRes.json();
          locationId = cartData.location?.id || 1;
          // Filter for ORDER_NOW items to preserve them
          existingItems = (cartData.items || []).filter((i: any) => i.plan_type === "ORDER_NOW");
        } else {
          // Try to get location from local storage if cart fetch fails
          const selectedLocation = JSON.parse(localStorage.getItem("selectedLocation") || "{}");
          locationId = selectedLocation?.location?.id || 1;
        }
      } catch (e) {
        const selectedLocation = JSON.parse(localStorage.getItem("selectedLocation") || "{}");
        locationId = selectedLocation?.location?.id || 1;
      }

      // 2. Prepare Items List
      const newItemId = selectedItem.id;

      // Map existing items to simple format
      let updatedItems = existingItems.map((i: any) => ({
        menu_item_id: i.menu_item.id,
        quantity: i.quantity,
        day_of_week: null,
        week_number: null,
        vending_good_uuid: i.vending_good_uuid
      }));

      const existingIndex = updatedItems.findIndex((i: any) => i.menu_item_id === newItemId);

      if (existingIndex >= 0) {
        // Increment quantity if < 3
        if (updatedItems[existingIndex].quantity < 3) {
          updatedItems[existingIndex].quantity += 1;
        }
      } else {
        // Add new item
        updatedItems.push({
          menu_item_id: newItemId,
          quantity: 1,
          day_of_week: null,
          week_number: null,
          vending_good_uuid: selectedItem.vendingGoodUuid || null
        });
      }

      // 3. Post Cart
      const payload = {
        location_id: locationId,
        plan_type: "ORDER_NOW",
        plan_subtype: "NONE",
        items: updatedItems
      };

      const postRes = await fetch(`${baseUrl}/api/vending/cart/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (postRes.ok) {
        navigate("/vending-home/cart");
      } else {
        console.error("Failed to update cart");
        alert("Failed to add item to cart. Please try again.");
      }

    } catch (error) {
      console.error("Error in startOrder:", error);
    }
  };

  // Handle scroll to change sticky header visibility
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 220);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* <VendingHeader /> */}
      <Header />
      <main className="flex-1 bg-[#F7F7F9]">
        {/* BreadCrumb and title (hidden when scrolled) */}
        <div
          className={`w-full bg-neutral-white pt-2 pb-6 ${scrolled ? "hidden" : ""
            }`}
        >
          <div className="main-container">
            <BreadCrumb />
            <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
              Vending Menu
            </h2>
          </div>
        </div>

        {/* Sticky Header ( when scrolled) */}
        <div
          className={`w-full sticky top-[64px] bg-neutral-white pt-2 pb-6 transition-all duration-300 z-[40] ${scrolled ? " shadow-lg" : "shadow-none"
            }`}
        >
          <div className="main-container">
            <div className="md:flex hidden justify-between items-center py-4 md:flex-row flex-col gap-2">
              <h2 className="md:text-[24px] text-[18px] leading-[24px] text-[#2B2B43] md:leading-[32px] font-[700] tracking-[0.1px]">
                Browse our daily menu of {currentDayItems.length} chef-prepared meals
              </h2>
              <Button className="bg-[#054A86] max-md:w-full hidden md:block">
                Start Your Order
              </Button>
            </div>

            <div className="flex gap-3 flex-wrap pt-[8px] w-full">
              {/* Mobile Select Field (New - Visible on screens < md) */}
              <div className="flex gap-2 md:hidden  w-full items-center ">
                <select
                  // Uses the existing 'tab' state for the current selection
                  value={tab}
                  // Uses the existing 'setTab' function to update state
                  onChange={(e) => setTab(parseInt(e.target.value, 10))}
                  className="w-1/2 h-[40px] p-0 px-2 text-[12px] leading-[18px] 
                    border border-neutral-gray-light text-neutral-gray-dark bg-neutral-white rounded-[8px] 
                    focus:ring-[#054A86]  focus:border-[#054A86] font-medium appearance-none"
                  // Custom styling to add a dropdown arrow icon
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23054A86' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.25rem center",
                    backgroundSize: "1.2em",
                  }}
                >
                  {days.map((week, index) => (
                    <option key={index} value={index}>
                      {week?.day}
                    </option>
                  ))}
                </select>
                <Button className="bg-[#054A86] w-1/2">Start Your Order</Button>
              </div>

              {/* Desktop Tabs (Hidden on screens < md, uses updated max-width [212px]) */}
              <div className="hidden md:flex w-full items-center gap-3 flex-wrap">
                {days.map((week, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => setTab(index)}
                      className={`md:h-[56px] h-[26px] ${tab === index
                        ? // Active state
                        "bg-[#EAF5FF] border-2 border-[#054A86]"
                        : // Inactive state - adding a subtle border for consistency
                        " bg-neutral-white border border-[#C7C8D2]"
                        } cursor-pointer text-center inline-flex items-center w-full justify-center md:max-w-[212px] max-w-[80px] rounded-[16px] `}
                    >
                      <span className="md:text-[16px] text-[12px] leading-[18px] md:leading-[24px] font-[400]">
                        {week?.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Display menu items for the selected day */}
        <div className="w-full h-full pb-[100px] pt-6">
          <LazyLoad>
            <div className="main-container flex gap-[24px] flex-wrap">
              {loading ? (
                <div className="w-full">
                  <Shrimmer />
                </div>
              ) : currentDayItems.length > 0 ? (
                currentDayItems.map((data: any, index: number) => (
                  <MenuItemCard
                    key={index}
                    data={{
                      ...data,
                      // Map API fields to FoodItem interface if needed
                      imgAlt: data.name,
                      image_url: data.image_url || "/images/placeholder_food.png"
                    }}
                    onClick={() => handleCardClick({
                      ...data,
                      imgAlt: data.name,
                      image_url: data.image_url || "/images/placeholder_food.png"
                    })}
                  />
                ))
              ) : (
                <div className="w-full text-center py-10 text-gray-500">
                  No items available for {days[tab].day}.
                </div>
              )}
            </div>
          </LazyLoad>
        </div>

        {/* Sidebar Sheet (Details of selected item) */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 z-50 flex justify-end bg-black/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 250, damping: 30 }}
                className="bg-white w-full px-8 py-4 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-[16px]">
                  <h2 className="text-[28px] leading-[36px] font-[700]">
                    {selectedItem.name}
                  </h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.imgAlt}
                  className="w-full object-cover h-60 md:h-[343px] rounded-[16px]"
                />
                <div className="flex-1 p-5 space-y-4">
                  <p className="text-gray-600 text-sm">{selectedItem.description}</p>
                  <div className="text-lg font-semibold">{selectedItem.price}</div>
                  <div className="pb-[24px]">
                    <p>Buy one get one for free</p>
                  </div>
                  <div>
                    <Link
                      className="text-[#056AC1] text-[16px] leading-[24px] font-[400] tracking-[0.1px] underline"
                      to={"/"}
                    >
                      Terms & conditions Apply
                    </Link>
                  </div>
                </div>
                <div className="p-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      startOrder();
                      setIsSheetOpen(false);
                      setSelectedItem(null);
                    }}
                    className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium hover:bg-blue-700"
                  >
                    Start Your Order
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <MobileFooterNav />
      <Footer />
    </div>
  );
};

export default VendingMenu;
