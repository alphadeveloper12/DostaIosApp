import React, { useEffect, useState } from "react";
import locationimg from "@/assets/../../public/images/icons/locaion-icon.svg";
import calendar from "@/assets/../../public/images/icons/calendar.svg";
import { Button } from "./catering/components/ui/button";
import { useNavigate } from "react-router-dom";
import VendingHeader from "@/components/vending_home/VendingHeader";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import OrderedItem from "@/components/Cart/OrderedItem"; // Use new OrderedItem
import MobileFooterNav from "@/components/home/MobileFooterNav";
import Header from "./catering/components/layout/Header";
import VendingMap from "@/components/vending_home/VendingMap";
import axios from "axios";
import { CartItemType } from "@/pages/CartPage";
import { Loader2 } from "lucide-react";
import Shrimmer from "@/components/ui/Shrimmer";

// Types corresponding to Backend Order Serializer
interface OrderItemAPI {
  id: number;
  menu_item: {
    id: number;
    name: string;
    price: string;
    image_url: string | null;
    description: string;
  };
  quantity: number;
  day_of_week: string | null;
  week_number: number | null;
}

interface OrderAPI {
  id: number;
  status: string; // PENDING, CONFIRMED, etc.
  created_at: string;
  total_amount: string;
  location: {
    id: number;
    name: string;
    info: string;
    position: { lat: number; lng: number };
  };
  plan_type: string;
  plan_subtype: string;
  pickup_date: string | null;
  pickup_slot: {
    id: number;
    start_time: string;
    end_time: string;
    label: string;
  } | null;
  pickup_code: string | null;
  qr_code_url: string | null;
  items: OrderItemAPI[];
}

const MyOrders = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState<OrderAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderAPI | null>(null);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  // Derive step from selected order status
  const getStepFromStatus = (status: string) => {
    if (["READY", "COMPLETED", "PICKED_UP"].includes(status)) return 2;
    return 1;
  };

  const currentStep = selectedOrder
    ? getStepFromStatus(selectedOrder.status)
    : 1;
  const [timeRemaining, setTimeRemaining] = useState<string>("10:00");
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("notificationsEnabled") === "true";
  });

  // Fetch Orders with Polling
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const res = await axios.get(`${baseUrl}/api/vending/orders/`, {
          headers: { Authorization: `Token ${token}` },
        });

        const allOrders = res.data;
        setOrders(allOrders);

        if (allOrders.length > 0) {
          // If we have a selected order, try to keep it selected (update it)
          if (selectedOrder) {
            const updated = allOrders.find(
              (o: OrderAPI) => o.id === selectedOrder.id
            );
            if (updated) setSelectedOrder(updated);
            else setSelectedOrder(allOrders[0]); // Fallback if selected was deleted
          } else {
            setSelectedOrder(allOrders[0]);
          }
        } else {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [baseUrl, selectedOrder?.id]); // Keeping dependency simple

  // Helper to normalize names for "spelling-only" comparison
  const normalizeName = (name: string) => {
    if (!name) return "";
    let normalized = name.replace(/&/g, "and");
    return normalized.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  };

  // Fetch Menu for Images
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const res = await axios.get(`${baseUrl}/api/vending/menu/ORDER_NOW/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const newImageMap: Record<string, string> = {};
        res.data.menus?.forEach((menu: any) => {
          menu.items?.forEach((it: any) => {
            if (it.image_url) {
              // Map both raw logic and normalized logic to be safe
              newImageMap[it.name] = it.image_url;
              newImageMap[normalizeName(it.name)] = it.image_url;
            }
          });
        });
        setImageMap(newImageMap);
      } catch (error) {
        console.error("Error fetching menu for images:", error);
      }
    };
    fetchMenu();
  }, [baseUrl]);

  // Timer Logic
  useEffect(() => {
    if (!selectedOrder || currentStep !== 1 || !selectedOrder.created_at) return;

    const createdTime = new Date(selectedOrder.created_at).getTime();
    if (isNaN(createdTime)) return;

    const targetTime = createdTime + 10 * 60 * 1000; // 10 minutes

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeRemaining("00:00");
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [selectedOrder, currentStep]);

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to Map Order Items to UI format
  const getMappedItems = (order: OrderAPI): CartItemType[] => {
    const locationName = order.location?.name || "Unknown Location";
    return order.items.map((apiItem) => {
      let notes = "";
      if (order.plan_subtype === "WEEKLY" || order.plan_subtype === "MONTHLY") {
        if (apiItem.day_of_week) {
          notes = `Meal for ${apiItem.day_of_week}`;
        }
      }

      return {
        id: apiItem.id,
        menuItemId: apiItem.menu_item.id,
        name: apiItem.menu_item.name,
        notes: notes,
        pickupLocation: locationName,
        imageUrl:
          apiItem.menu_item.image_url ||
          imageMap[apiItem.menu_item.name] ||
          imageMap[normalizeName(apiItem.menu_item.name)] ||
          "/images/vending_home/food.svg",
        quantity: apiItem.quantity,
        price: parseFloat(apiItem.menu_item.price),
        weekNumber: apiItem.week_number,
        vendingGoodUuid: null, // Not used in MyOrders but required by type
        planType: order.plan_type,
        planSubtype: order.plan_subtype,
      };
    });
  };

  // Group items logic (Same as CartPage)
  const getGroupedItems = (order: OrderAPI) => {
    const items = getMappedItems(order);
    const isMonthly = order.plan_subtype === "MONTHLY";

    if (!isMonthly) {
      // Flat list for regular orders
      return [{ title: "Order Details", items }];
    }

    // Monthly Grouping
    const weeks = [1, 2, 3, 4];
    const groups = [];

    for (const week of weeks) {
      const weekItems = items.filter((i) => i.weekNumber === week);
      if (weekItems.length > 0) {
        groups.push({
          title: `Week ${week}`,
          items: weekItems,
        });
      }
    }

    // Extras
    const extras = items.filter((i) => !i.weekNumber);
    if (extras.length > 0) {
      groups.push({ title: "Other Items", items: extras });
    }

    return groups;
  };

  if (loading) {
    return (
      <div className="w-full">
        <Shrimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Breadcrumbs and title section  */}
      <div className="w-full bg-white pt-2 pb-6">
        <div className="main-container">
          <BreadCrumb />
          <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
            My Orders
          </h2>
        </div>
      </div>
      <main className="flex-1 bg-background max-md:pb-24">
        <div className="main-container !py-6 ">
          {!selectedOrder ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#2B2B43]">
                  No Active Orders Found
                </h3>
                <p className="text-[#83859C] mt-2 mb-6">
                  Looks like you don't have any orders in progress.
                </p>
                <Button onClick={() => navigate("/vending-home")} className="px-8">
                  Start Ordering
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-[30px] lg:grid-cols-[300px_1fr_320px] md:grid-cols-[250px_1fr]">
              {/* LEFT: Order List Sidebar */}
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 hidden md:block">
                <h3 className="text-lg font-bold text-[#2B2B43] mb-4">Order History</h3>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedOrder.id === order.id
                      ? "border-[#054A86] bg-[#F6FBFF] shadow-sm"
                      : "border-[#EDEEF2] bg-white hover:border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[#2B2B43]">Order #{order.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${order.status === 'COMPLETED' || order.status === 'PICKED_UP' || order.status === 'READY'
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                        }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#83859C]">{formatDate(order.created_at)}</p>
                    <p className="text-sm font-semibold mt-2 text-[#054A86]">AED {parseFloat(order.total_amount).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* MIDDLE: Booking Card + Details */}
              <div className="space-y-4">
                {/* Mobile Order Selector (Horizontal Scroll) */}
                <div className="md:hidden flex gap-3 overflow-x-auto pb-4 -mx-1 px-1">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`flex-shrink-0 p-3 rounded-xl border min-w-[140px] ${selectedOrder.id === order.id
                        ? "border-[#054A86] bg-[#F6FBFF]"
                        : "border-[#EDEEF2] bg-white"
                        }`}
                    >
                      <p className="font-bold text-sm">Order #{order.id}</p>
                      <p className="text-[10px] text-[#83859C] truncate">{formatDate(order.created_at)}</p>
                    </div>
                  ))}
                </div>

                {/* Booking Header Card */}
                <div className="rounded-2xl border border-[#EDEEF2] bg-white">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="flex w-full flex-col md:flex-row gap-1">
                      <div className="flex flex-col justify-between gap-3 w-full">
                        <p className="text-[24px] font-bold leading-8 text-#2B2B43">
                          Order ID {selectedOrder.id}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {currentStep === 1 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#054A86]" />
                          )}
                          {currentStep === 2 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1ABF70]" />
                          )}

                          {currentStep === 1 && (
                            <span className="text-sm font-semibold leading-5 text-[#054A86]">
                              In progress{" "}
                              <span className="text-[#83859C] font-normal ml-1">
                                ({timeRemaining})
                              </span>
                            </span>
                          )}
                          {currentStep === 2 && (
                            <span className="text-sm font-semibold leading-5 text-[#1ABF70]">
                              Ready for Pickup
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex md:items-end items-start max-md:pt-4 flex-col  gap-3 w-full">
                        <div className="flex max-md:flex-row-reverse gap-2 items-center">
                          <p className="text-xs font-semibold leading-[16px] text-[#83859C]">
                            Location at {selectedOrder.location?.name}
                          </p>
                          <img
                            src={locationimg}
                            alt="location Icon"
                            className="w-[16px] h-[16px]"
                          />
                        </div>
                        <div className="flex gap-2 items-center max-md:flex-row-reverse">
                          <p className="text-xs font-semibold leading-[16px] text-[#83859C]">
                            {formatDate(selectedOrder.created_at)}
                          </p>
                          <img
                            src={calendar}
                            alt="calendar Icon"
                            className="w-[16px] h-[16px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="px-4 pt-3">
                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex justify-between w-full gap-2 items-center">
                        <span
                          className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${currentStep >= 1 ? "bg-[#1ABF70]" : "bg-[#EDEEF2]"
                            } text-white ring-[#1ABF70]`}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`absolute left-0 top-0 h-full ${currentStep === 1
                              ? "w-1/2"
                              : currentStep === 2
                                ? "w-full"
                                : "w-0"
                              } rounded-full bg-emerald-500`}
                          />
                        </div>
                        <span
                          className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${currentStep >= 2
                            ? "bg-[#1ABF70]"
                            : "bg-[#EDEEF2] text-[#2B2B43] font-semibold"
                            } text-white ring-[#1ABF70]`}
                          style={{ flexShrink: 0 }}>
                          {currentStep >= 2 ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            "2"
                          )}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#2B2B43]">
                            Order Placed
                          </span>
                        </div>
                        <span className="text-base font-bold text-[#2B2B43]">
                          Ready for Pickup
                        </span>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className=" sm:hidden flex flex-col">
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <span
                            className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${currentStep >= 1 ? "bg-[#1ABF70]" : "bg-[#EDEEF2]"
                              } text-white ring-[#1ABF70]`}>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <div
                            className={`w-0.5 h-12 transition-colors duration-500 ${currentStep >= 2 ? "bg-[#1ABF70]" : "bg-gray-200"
                              }`}
                          />
                        </div>
                        <div className="flex flex-col pt-0.5 pb-4">
                          <span className="text-base font-bold text-[#2B2B43]">
                            Order Placed
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <span
                            className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${currentStep >= 2
                              ? "bg-[#1ABF70]"
                              : "bg-[#EDEEF2] text-[#2B2B43] font-semibold"
                              } text-white ring-[#1ABF70]`}
                            style={{ flexShrink: 0 }}>
                            {currentStep >= 2 ? (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              "2"
                            )}
                          </span>
                        </div>
                        <div className="flex flex-col pt-0.5">
                          <span className="text-base font-bold text-[#2B2B43]">
                            Ready for Pickup
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:py-4 py-6">
                      <Button
                        onClick={() => navigate("/catering/request-custom-quote")}
                        variant="default"
                        size="lg">
                        Reschedule Booking
                      </Button>
                    </div>
                  </div>

                  {/* Info note */}
                  {/* Info note removed */}
                  {/* print qr code */}
                  {(selectedOrder.qr_code_url || selectedOrder.pickup_code) && (
                    <div className="flex flex-col justify-center items-center md:py-[40px] py-[16px] border-t border-gray-50 mt-4">
                      <p className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
                        {currentStep === 2 ? "Woohoo! Your order is ready for pickup!" : "Your Pickup Details"}
                      </p>
                      <div className="mt-[24px] mb-[20px] rounded-[16px] border border-[#83859C] max-w-[158px] max-h-[158px] p-5 overflow-hidden flex items-center justify-center bg-white">
                        <img
                          src={selectedOrder.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedOrder.pickup_code}`}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {selectedOrder.pickup_code && (
                        <p className="text-[20px] font-bold text-[#054A86] mb-4">
                          Code: {selectedOrder.pickup_code}
                        </p>
                      )}
                      <Button className="border w-[158px] border-[#545563] bg-transparent hover:bg-transparent text-[14px] leading-[16px] text-[#545563]">
                        Print
                      </Button>
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="bg-white rounded-[16px] md:p-6 p-4 border border-[#EDEEF2]">
                  <div className="justify-between items-center mb-6">
                    <h2 className="md:text-xl flex text-[18px] leading-6 font-[700] md:font-semibold text-gray-800">
                      {selectedOrder.plan_subtype === "MONTHLY"
                        ? "Monthly Plan Details"
                        : selectedOrder.plan_subtype === "WEEKLY"
                          ? "Weekly Plan Details"
                          : "Order Details"}
                      <span className="text-gray-500 hidden md:block font-normal pl-2">
                        ({selectedOrder.items.length} items)
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {(() => {
                      const pickupCodes = JSON.parse(
                        localStorage.getItem(`pickup_codes_${selectedOrder.id}`) || "{}"
                      );
                      const backendPickupCode = selectedOrder.pickup_code;
                      const backendQrCode = selectedOrder.qr_code_url;
                      return getGroupedItems(selectedOrder).map((group, idx) => {
                        // Further group items by pickup code within this group
                        const itemsByCode: Record<string, CartItemType[]> = {};
                        group.items.forEach((item) => {
                          const code = backendPickupCode || pickupCodes[`menu_${item.menuItemId}`] || "NO_CODE";
                          if (!itemsByCode[code]) itemsByCode[code] = [];
                          itemsByCode[code].push(item);
                        });

                        return (
                          <div key={idx} className="mb-6 last:mb-0">
                            {group.title !== "Order Details" && (
                              <h5 className="text-[14px] font-semibold text-[#83859C] mb-3 uppercase tracking-wider">
                                {group.title}
                              </h5>
                            )}
                            <div className="space-y-6">
                              {Object.entries(itemsByCode).map(([code, items], codeIdx) => (
                                <div key={codeIdx} className="space-y-0 divide-y divide-dashed divide-gray-100 border border-gray-50 rounded-lg p-3 bg-gray-50/30">
                                  <div className="mb-3 flex flex-wrap gap-3 items-center">
                                    {code !== "NO_CODE" && (
                                      <span className="text-[12px] font-[600] text-[#054A86] bg-[#E6F0F9] px-2 py-1 rounded-md border border-[#B3D4F0]">
                                        Pickup Code: <span className="text-[14px] font-[700]">{code}</span>
                                      </span>
                                    )}
                                    {(backendQrCode || (code !== "NO_CODE" && !backendPickupCode)) && (
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={backendQrCode || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`}
                                          alt="QR"
                                          className="w-10 h-10 rounded border border-gray-200 bg-white p-1"
                                        />
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Scan to Pickup</span>
                                      </div>
                                    )}
                                  </div>
                                  {items.map((item) => (
                                    <OrderedItem
                                      key={item.id}
                                      item={item}
                                      isOrderInProgress={currentStep === 1}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* RIGHT: Summary */}
              <aside className="hidden lg:block">
                <div className="rounded-2xl border border-[#EDEEF2] bg-white h-fit p-4">
                  <h1 className="text-[24px] leading-[32px] font-[700] text-[#2B2B43] ">
                    Pickup Location
                  </h1>
                  {/* map view */}
                  <div className="rounded-[12px] py-4 w-full max-h-[220px]">
                    <div className="flex-1 overflow-y-auto h-full space-y-4 pb-28">
                      <div className="w-full h-[220px] rounded-2xl overflow-hidden">
                        <VendingMap
                          readOnlyLocation={
                            selectedOrder.location?.position && selectedOrder.location
                              ? {
                                lat: selectedOrder.location.position.lat,
                                lng: selectedOrder.location.position.lng,
                                name: selectedOrder.location.name,
                                info: selectedOrder.location.info,
                              }
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* content */}
                  <div className="pt-6 ">
                    <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
                      {selectedOrder.location?.name}
                    </h4>
                    <p className="text-[12px] leading-[16px] font-[600] tracking-[0.1px] text-[#83859C]">
                      Dubai , UAE
                    </p>
                    <p className="text-[14px] leading-[20px] font-[400] tracking-[0.2px] text-[#545563] pt-2">
                      {selectedOrder.location?.info}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#EDEEF2] bg-white h-fit p-4 mt-[24px]">
                  <h1 className="text-[24px] leading-[32px] font-[700] text-[#2B2B43] pb-4">
                    Payment Details
                  </h1>
                  {/* card detail */}
                  <div className="h-[88px] w-full border border-[#C7C8D2] bg-[#F6FBFF] rounded-[8px] p-[12px]">
                    <h3 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-black pb-[2px]">
                      **** **** **** 4629
                    </h3>
                    <p className="text-neutral-gray text-[12px] font-[400] leading-[16px] pb-2">
                      12/25
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[14px] font-[400] leading-[20px] text-neutral-gray-dark">
                        Mohammad Esam
                      </p>
                      <img src={"/images/icons/visa.svg"} alt="card icon" />
                    </div>
                  </div>
                  {/* content */}
                  <div className="space-y-3 pt-6">
                    <div className="flex justify-between">
                      <span className="text-[#545563]">Subtotal</span>
                      <span className="font-medium">
                        AED {parseFloat(selectedOrder.total_amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#545563]">VAT</span>
                      <span className="font-medium">Included</span>
                    </div>

                    <div className="flex justify-between text-[#056AC1]">
                      <span>Discount (coupon)</span>
                      <span className="font-medium">- AED 0</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                    <span className="text-[16px] leading-[24px] text-[#2B2B43] font-[400]">
                      Total <span className="">(VAT incl.)</span>
                    </span>
                    <span className="text-[#054A86]">
                      AED {parseFloat(selectedOrder.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <div className="max-md:hidden">
        <Footer />
      </div>
      <MobileFooterNav />
    </div>
  );
};

export default MyOrders;