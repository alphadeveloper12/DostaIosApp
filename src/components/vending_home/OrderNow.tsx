// src/components/vending_home/OrderNow.tsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import BreadCrumb from "../home/BreadCrumb";
import Footer from "../layout/Footer";
import MobileFooterNav from "../home/MobileFooterNav";
import Header from "@/pages/catering/components/layout/Header";

import Menu from "./Menu";
import GrabMenu from "./GrabMenu";
import PlanWeekly from "./PlanWeekly";

type StepStatus = "completed" | "active" | "pending";

/** 1) Default state for all properties */
const defaultProgress: any = {
  activeStep: 1,
  maxCompleted: 0,
  time: "",
  pickOrder: "",
  orderType: "",
  planType: "",
  orderNowMenu: [],
  smartGrabMenu: [],
  weekMenu: {},
  weekMenu1: {},
  weekMenu2: {},
  weekMenu3: {},
  weekMenu4: {},
  allSavedPlans: [],
};

/** Helper: weekly/monthly plans summary */
const generatePlanSummary = (planData: any) => {
  const week = typeof planData === "string" ? JSON.parse(planData) : planData || {};
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  let totalMeals = 0;
  const lines: string[] = [];

  for (const day of days) {
    const items = week[day] || [];
    if (items.length > 0) {
      let dayTotal = 0;
      const titles: string[] = [];

      for (const item of items) {
        const quantity = item.quantity || 1;
        dayTotal += quantity;
        titles.push(`${item.heading}${quantity > 1 ? ` (x${quantity})` : ""}`);
      }

      totalMeals += dayTotal;
      lines.push(`“${day}: ${titles.join(", ")}”`);
    }
  }

  return { totalMeals, lines };
};

/** Helper: order-now / smart-grab carts summary */
const generateCartSummary = (cartData: any[]) => {
  const cart = cartData || [];
  const totalMeals = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const line = cart
    .map((item) => `${item.heading}${item.quantity > 1 ? ` (x${item.quantity})` : ""}`)
    .join(", ");

  return { totalMeals, line };
};

/** Payload builder for /api/vending/cart/ */
const buildConfirmPayload = ({
  locationId,
  orderType,
  planType,
  pickOrder,
  time,
  timeSlots,
  menuData,
  activeStep,
}: any) => {
  const plan_type_map: any = {
    "Order Now": "ORDER_NOW",
    "Smart Grab": "SMART_GRAB",
    "Start a Plan": "START_PLAN",
  };

  const pickup_type_map: any = {
    "Pickup Today": "TODAY",
    "Pickup in 24 hours": "IN_24_HOURS",
    "Pickup in 24": "IN_24_HOURS",
  };

  const pickup_type = pickup_type_map[pickOrder] ?? "TODAY";
  const selectedSlot = timeSlots?.find((slot: any) => slot.label === time);

  const formatItems = (data: any, pType: string) => {
    if (!data) return [];

    // WEEKLY (object by day)
    if (pType === "weekly") {
      const days = Object.keys(data);
      const items: any[] = [];

      days.forEach((day) => {
        (data[day] || []).forEach((item: any) => {
          items.push({
            menu_item_id: item.id,
            quantity: item.quantity || 1,
            day_of_week: day,
            week_number: 1,
            vending_good_uuid: item.vendingGoodUuid || null,
          });
        });
      });

      return items;
    }

    // MONTHLY (object by day) - week_number derived from activeStep (4-7)
    if (pType === "monthly") {
      const week_number =
        activeStep === 4 ? 1 : activeStep === 5 ? 2 : activeStep === 6 ? 3 : activeStep === 7 ? 4 : null;

      const items: any[] = [];
      Object.keys(data).forEach((day) => {
        (data[day] || []).forEach((item: any) => {
          items.push({
            menu_item_id: item.id,
            quantity: item.quantity || 1,
            day_of_week: day,
            week_number,
            vending_good_uuid: item.vendingGoodUuid || null,
          });
        });
      });
      return items;
    }

    // ORDER NOW / SMART GRAB (array)
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        menu_item_id: item.id,
        quantity: item.quantity || 1,
        day_of_week: null,
        week_number: null,
        vending_good_uuid: item.vendingGoodUuid || null,
      }));
    }

    return [];
  };

  return {
    location_id: locationId,
    plan_type: plan_type_map[orderType] || "ORDER_NOW",
    plan_subtype: orderType === "Start a Plan" ? (planType ? planType.toUpperCase() : "NONE") : "NONE",
    pickup_type,
    pickup_date: new Date().toISOString().split("T")[0],
    pickup_slot_id: selectedSlot?.id || null,
    items: formatItems(menuData, planType),
  };
};

const OrderNow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("authToken") || "";

  // IMPORTANT: Your API seems inconsistent in repo: Token vs token.
  // Most DRF uses "Token <key>". Keep it consistent:
  const authHeaders = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  // --- PROGRESS STATES ---
  const [activeStep, setActiveStep] = useState(defaultProgress.activeStep);
  const [maxCompleted, setMaxCompleted] = useState(defaultProgress.maxCompleted);

  const [pickupLocation, setPickupLocation] = useState("no location selected");
  const [time, setTime] = useState(defaultProgress.time);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [pickOrder, SetPickOrder] = useState(defaultProgress.pickOrder);
  const [orderType, setOrderType] = useState(defaultProgress.orderType);
  const [planType, setPlanType] = useState(defaultProgress.planType);

  // --- SAVE PLAN SIDEBAR ---
  const [savePlanMenu, setSavePlanMenu] = useState<boolean>(false);
  const [currentPlanName, setCurrentPlanName] = useState("");
  const [isDefaultPlan, setIsDefaultPlan] = useState(false);
  const [stepToSave, setStepToSave] = useState<number | null>(null);
  const [allSavedPlans, setAllSavedPlans] = useState<any[]>(defaultProgress.allSavedPlans);

  // --- MENU STATES ---
  const [orderNowMenu, setOrderNowMenu] = useState<any[]>(defaultProgress.orderNowMenu);
  const [smartGrabMenu, setSmartGrabMenu] = useState<any[]>(defaultProgress.smartGrabMenu);

  const [weekMenu, setWeekMenu] = useState<any>(defaultProgress.weekMenu);
  const [weekMenu1, setWeekMenu1] = useState<any>(defaultProgress.weekMenu1);
  const [weekMenu2, setWeekMenu2] = useState<any>(defaultProgress.weekMenu2);
  const [weekMenu3, setWeekMenu3] = useState<any>(defaultProgress.weekMenu3);
  const [weekMenu4, setWeekMenu4] = useState<any>(defaultProgress.weekMenu4);

  // --- OPTIONS FROM API ---
  const [planTypeOptions, setPlanTypeOptions] = useState<any[]>([]);
  const [pickupOptions, setPickupOptions] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [planSubTypes, setPlanSubTypes] = useState<any[]>([]);

  // menus from API for plan selection UI
  const [apiWeeklyMenu, setApiWeeklyMenu] = useState<any>(null);
  const [apiMonthlyMenu, setApiMonthlyMenu] = useState<any>(null);

  // machine goods (smart grab / stock matching)
  const [machineGoods, setMachineGoods] = useState<any[] | null>(null);
  const [originalOrderNowMenu, setOriginalOrderNowMenu] = useState<any[]>([]);
  const [originalSmartGrabMenu, setOriginalSmartGrabMenu] = useState<any[]>([]);

  // --- Restore state from API on mount ---
  useEffect(() => {
    const loadStateFromApi = async () => {
      let restored = false;

      try {
        const res = await axios.get(`${baseUrl}/api/vending/cart/`, authHeaders);
        const cart = res.data;

        if (cart && (cart.items?.length > 0 || (cart.current_step && cart.current_step > 1))) {
          restored = true;

          if (cart.location) {
            setPickupLocation(`${cart.location.name}, ${cart.location.info}`);
          }

          let restoredStep = cart.current_step || 1;
          if (
            restoredStep === 1 &&
            (cart.plan_type !== "NONE" || (cart.items && cart.items.length > 0) || cart.location)
          ) {
            restoredStep = 2;
          }

          setActiveStep(restoredStep);
          setMaxCompleted(Math.max(0, restoredStep - 1));

          if (cart.plan_type) {
            const typeMap: any = {
              ORDER_NOW: "Order Now",
              SMART_GRAB: "Smart Grab",
              START_PLAN: "Start a Plan",
            };
            setOrderType(typeMap[cart.plan_type] || "");
          }

          const rawSubtype = cart.plan_subtype || cart.plan_sub_type;
          if (rawSubtype && rawSubtype !== "NONE") {
            setPlanType(String(rawSubtype).toLowerCase());
          }

          if (cart.pickup_type) {
            const pMap: any = {
              TODAY: "Pickup Today",
              IN_24_HOURS: "Pickup in 24 hours",
            };
            SetPickOrder(pMap[cart.pickup_type] || "");
          }

          if (cart.pickup_slot) {
            setTime(cart.pickup_slot.label);
          }

          // restore items
          const restoredItems = (cart.items || []).map((item: any) => ({
            ...item.menu_item,
            heading: item.menu_item.name,
            imgAlt: `food-${item.menu_item.id}`,
            imgSrc: item.menu_item.image_url || "/images/placeholder_food.png",
            quantity: item.quantity,
            id: item.menu_item.id,
            price: `AED ${parseFloat(item.menu_item.price).toFixed(2)}`,
          }));

          if (cart.plan_type === "ORDER_NOW") {
            setOrderNowMenu(restoredItems);
          } else if (cart.plan_type === "SMART_GRAB") {
            setSmartGrabMenu(restoredItems);
          } else if (cart.plan_type === "START_PLAN" && String(cart.plan_subtype).toUpperCase() === "WEEKLY") {
            const weekObj: any = {};
            (cart.items || []).forEach((it: any) => {
              const d = it.day_of_week;
              if (!weekObj[d]) weekObj[d] = [];
              weekObj[d].push({
                ...it.menu_item,
                heading: it.menu_item.name,
                imgAlt: `food-${it.menu_item.id}`,
                imgSrc: it.menu_item.image_url || "/images/placeholder_food.png",
                quantity: it.quantity,
                id: it.menu_item.id,
                price: `AED ${parseFloat(it.menu_item.price).toFixed(2)}`,
              });
            });
            setWeekMenu(weekObj);
          }
        }
      } catch (err) {
        // ignore: no active cart
      }

      // fallback: if not restored, check local/session selectedLocation
      if (!restored) {
        try {
          const selectedLocation = JSON.parse(
            sessionStorage.getItem("selectedLocation") ||
            localStorage.getItem("selectedLocation") ||
            "{}"
          );

          if (selectedLocation?.location) {
            setActiveStep(2);
            setMaxCompleted(1);
            setPickupLocation(`${selectedLocation.location.name}, ${selectedLocation.location.info}`);
          }
        } catch (e) {
          // ignore
        }
      }
    };

    loadStateFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load pickup location from sessionStorage when it changes
  useEffect(() => {
    try {
      const selectedLocation = JSON.parse(sessionStorage.getItem("selectedLocation") || "{}");
      if (selectedLocation?.location) {
        setPickupLocation(`${selectedLocation.location.name}, ${selectedLocation.location.info}`);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // --- Machine goods fetch with caching ---
  useEffect(() => {
    const fetchMachineGoods = async () => {
      try {
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
          const isExpired = Date.now() - timestamp > 5 * 60 * 1000;

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
  }, [baseUrl]);

  // normalize name for matching
  const normalizeName = (name: string) => (name || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // smart grab available items from machine goods
  const smartGrabAvailableItems = useMemo(() => {
    if (!machineGoods || machineGoods.length === 0) return [];
    return machineGoods.map((good: any) => ({
      id: good.uuid,
      heading: (good.goodsName || "").replace(/\*/g, "").trim(),
      price: good.goodsPrice,
      imgSrc: good.goodsUrl
        ? `http://pic.hnzczy.cn/${good.goodsUrl}`
        : "/images/placeholder-food.png",
      imgAlt: good.goodsName,
      description: good.goodsDesc || "",
      vendingGoodUuid: good.uuid,
      machinePrice: good.goodsPrice,
      machineStock: true,
    }));
  }, [machineGoods]);

  // OPTION APIs
  useEffect(() => {
    const fetchPlanTypes = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/vending/plan-types/`, authHeaders);
        setPlanTypeOptions(res.data?.options || []);
      } catch (error) {
        console.error("Error fetching plan types:", error);
      }
    };

    fetchPlanTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  useEffect(() => {
    const fetchPickupOptions = async () => {
      try {
        // NOTE: this endpoint currently hardcodes location_id=1 in your code.
        // Better: read selectedLocation id here.
        const selectedLocation = JSON.parse(localStorage.getItem("selectedLocation") || "{}");
        const locId = selectedLocation?.location?.id || 1;

        const res = await axios.get(`${baseUrl}/api/vending/pickup-options/?location_id=${locId}`, authHeaders);
        setPickupOptions(res.data?.pickup_types || []);
        setTimeSlots(res.data?.time_slots || []);
      } catch (error) {
        console.error("Error fetching pickup options:", error);
      }
    };

    fetchPickupOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  useEffect(() => {
    const fetchPlanOptions = async () => {
      if (orderType !== "Start a Plan") return;
      try {
        const res = await axios.get(`${baseUrl}/api/vending/plan-options/`, authHeaders);
        setPlanSubTypes(res.data?.plan_subtypes || []);
      } catch (error) {
        console.error("Error fetching plan options:", error);
      }
    };

    fetchPlanOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, baseUrl]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        if (orderType !== "Start a Plan") return;

        if (planType === "weekly") {
          const res = await axios.get(`${baseUrl}/api/vending/menu/plan/WEEKLY/`, authHeaders);
          setApiWeeklyMenu(res.data?.week_menu || null);
        } else if (planType === "monthly") {
          const res = await axios.get(`${baseUrl}/api/vending/menu/plan/MONTHLY/`, authHeaders);
          setApiMonthlyMenu(res.data?.month_menu || null);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, planType, baseUrl]);

  // --- Step status logic ---
  const getStepStatus = (stepId: number): StepStatus => {
    if (stepId === activeStep) return "active";
    if (stepId <= maxCompleted) return "completed";
    return "pending";
  };

  const handleEditStep = (stepId: number) => {
    setActiveStep(stepId);
    setMaxCompleted(stepId - 1);
  };

  // --- Save Plan handlers ---
  const openSavePlan = (stepId: number) => {
    setStepToSave(stepId);
    setSavePlanMenu(true);
  };

  const confirmSavePlan = () => {
    if (!currentPlanName || !stepToSave) return;

    let menuDataToSave: any = null;

    if (planType === "weekly" && stepToSave === 4) menuDataToSave = weekMenu;

    if (planType === "monthly") {
      if (stepToSave === 4) menuDataToSave = weekMenu1;
      if (stepToSave === 5) menuDataToSave = weekMenu2;
      if (stepToSave === 6) menuDataToSave = weekMenu3;
      if (stepToSave === 7) menuDataToSave = weekMenu4;
    }

    if (!menuDataToSave || Object.keys(menuDataToSave).length === 0) return;

    const newPlan = {
      id: crypto.randomUUID(),
      name: currentPlanName,
      isDefault: isDefaultPlan,
      planData: menuDataToSave,
    };

    let updated = [...allSavedPlans, newPlan];

    if (isDefaultPlan) {
      updated = updated.map((p) => (p.id === newPlan.id ? p : { ...p, isDefault: false }));
    }

    setAllSavedPlans(updated);
    setCurrentPlanName("");
    setIsDefaultPlan(false);
    setStepToSave(null);
    setSavePlanMenu(false);
  };

  // menu setter funcs used by child components
  const orderNowMenuFunc = (n: any[]) => {
    setOriginalOrderNowMenu(n);
    setOrderNowMenu(n);
  };

  const smartGrabMenuFunc = (n: any[]) => {
    setOriginalSmartGrabMenu(n);
    setSmartGrabMenu(n);
  };

  const weekMenuFunc = (n: any) => setWeekMenu(n);
  const weekMenuFunc1 = (n: any) => setWeekMenu1(n);
  const weekMenuFunc2 = (n: any) => setWeekMenu2(n);
  const weekMenuFunc3 = (n: any) => setWeekMenu3(n);
  const weekMenuFunc4 = (n: any) => setWeekMenu4(n);

  const handleOrderTypeSelect = (type: string) => setOrderType(type);

  // --- Core: confirm step (API sync) ---
  const handleConfirmStep = async () => {
    const isMonthly = orderType === "Start a Plan" && planType === "monthly";
    const isWeeklyPlan = orderType === "Start a Plan" && planType === "weekly";

    const lastStep = isMonthly ? 7 : 4;
    const isLastStep = activeStep === lastStep;

    // location id
    let locId = 1;
    try {
      const selectedLocation = JSON.parse(localStorage.getItem("selectedLocation") || "{}");
      locId = selectedLocation?.location?.id || 1;
    } catch (e) {
      locId = 1;
    }

    // determine currentMenuData for payload
    let currentMenuData: any = [];
    if (orderType === "Order Now") currentMenuData = orderNowMenu;
    if (orderType === "Smart Grab") currentMenuData = smartGrabMenu;
    if (isWeeklyPlan) currentMenuData = weekMenu;

    // MONTHLY needs special: at last step send all weeks
    let itemsToSend: any[] = [];

    if (isMonthly && isLastStep) {
      const finalItems: any[] = [];

      const processWeek = (wm: any, weekNum: number) => {
        Object.keys(wm || {}).forEach((day) => {
          (wm[day] || []).forEach((item: any) => {
            finalItems.push({
              menu_item_id: item.id,
              quantity: item.quantity || 1,
              day_of_week: day,
              week_number: weekNum,
              vending_good_uuid: item.vendingGoodUuid || null,
            });
          });
        });
      };

      processWeek(weekMenu1, 1);
      processWeek(weekMenu2, 2);
      processWeek(weekMenu3, 3);
      processWeek(weekMenu4, 4);

      // consolidate duplicates by menu_item_id + day_of_week + week_number
      const keyMap = new Map<string, any>();
      for (const it of finalItems) {
        const key = `${it.menu_item_id}-${it.day_of_week}-${it.week_number}`;
        if (keyMap.has(key)) {
          keyMap.get(key).quantity += it.quantity || 1;
        } else {
          keyMap.set(key, { ...it });
        }
      }

      itemsToSend = Array.from(keyMap.values());
    } else {
      const payloadTemp = buildConfirmPayload({
        locationId: locId,
        orderType,
        planType: orderType === "Start a Plan" ? planType : "",
        pickOrder,
        time,
        timeSlots,
        menuData: isMonthly ? (activeStep === 4 ? weekMenu1 : activeStep === 5 ? weekMenu2 : activeStep === 6 ? weekMenu3 : weekMenu4) : currentMenuData,
        activeStep,
      });

      itemsToSend = payloadTemp.items || [];
    }

    // final payload to /api/vending/cart/
    const nextStep = activeStep + 1;

    const payload: any = {
      location_id: locId,
      plan_type:
        orderType === "Start a Plan"
          ? "START_PLAN"
          : orderType === "Smart Grab"
            ? "SMART_GRAB"
            : "ORDER_NOW",
      plan_subtype: orderType === "Start a Plan" ? (planType ? planType.toUpperCase() : "NONE") : "NONE",
      pickup_type:
        pickOrder === "Pickup in 24 hours" || pickOrder === "Pickup in 24" ? "IN_24_HOURS" : "TODAY",
      pickup_date: new Date().toISOString().split("T")[0],
      pickup_slot_id: timeSlots.find((slot: any) => slot.label === time)?.id || null,
      items: itemsToSend,
      current_step: nextStep,
    };

    try {
      await axios.post(`${baseUrl}/api/vending/cart/`, payload, authHeaders);

      // progress update locally
      if (activeStep === maxCompleted + 1) {
        setMaxCompleted(activeStep);
        setActiveStep(nextStep);
      } else {
        setActiveStep(maxCompleted + 1);
      }

      // close side sheet if open
      if (isOpen) setIsOpen(false);

      // optional: refresh redux cart after sync
      // @ts-ignore
      // dispatch(fetchCartData());
    } catch (err) {
      console.error("❌ Cart sync error:", err);
      alert("Failed to save cart. Please try again.");
    }
  };

  // statuses
  const step1Status = getStepStatus(1);
  const step2Status = getStepStatus(2);
  const step3Status = getStepStatus(3);
  const step4Status = getStepStatus(4);
  const step5Status = getStepStatus(5);
  const step6Status = getStepStatus(6);
  const step7Status = getStepStatus(7);

  return (
    <div className="bg-[#F8F8FA] min-h-screen relative flex flex-col justify-between">
      <Header />

      <main className="flex-1 bg-[#F7F7F9] max-md:pb-[122px]">
        {/* Breadcrumb and Title */}
        <div className="w-full bg-white pt-2 pb-6">
          <div className="main-container">
            <BreadCrumb />
            <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
              Vending Pickup
            </h2>
          </div>
        </div>

        {/* Steps Container */}
        <div className="w-full py-6">
          <div className="main-container space-y-4">

            {/* STEP 1 */}
            {step1Status !== "pending" && (
              <div className={`w-full border rounded-[16px] transition-all ${step1Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                }`}>
                <div className="py-[20px] md:px-[24px] px-3">
                  <div className="flex flex-row justify-between max-md:gap-4">
                    <div className="flex gap-4">
                      <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step1Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                        }`}>
                        {step1Status === "completed" ? <Check className="w-4 h-4" /> : 1}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                          Select Pickup Location
                        </h2>
                        {step1Status === "completed" && (
                          <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                            "{pickupLocation}"
                          </h4>
                        )}
                      </div>
                    </div>

                    {step1Status === "completed" && (
                      <Button
                        onClick={() => navigate("/vending-home")}
                        className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step2Status !== "pending" && (
              <div className={`w-full border rounded-[16px] transition-all ${step2Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                }`}>
                <div className="py-[20px] md:px-[24px] px-3">
                  <div className="flex flex-row justify-between max-md:gap-4">
                    <div className="flex gap-4">
                      <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step2Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                        }`}>
                        {step2Status === "completed" ? <Check className="w-4 h-4" /> : 2}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                          Choose How You&apos;d Like to Order
                        </h2>
                        {step2Status === "completed" && (
                          <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                            "{orderType === "Start a Plan" ? planType : orderType}"
                          </h4>
                        )}
                      </div>
                    </div>

                    {step2Status === "completed" && (
                      <Button
                        onClick={() => handleEditStep(2)}
                        className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {step2Status === "active" && (
                    <div className="mt-6 space-y-6">
                      <div className="md:flex gap-4 md:flex-row grid grid-cols-12">
                        {planTypeOptions.map((opt: any) => (
                          <Button
                            key={opt.key}
                            onClick={() => handleOrderTypeSelect(opt.label)}
                            className={`${orderType === opt.label
                              ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                              : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
                              } px-6 py-3 md:rounded-[16px] rounded-[10px] font-bold col-span-4`}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>

                      <div className="flex md:flex-row flex-col items-start gap-8">
                        <div className="flex-1">
                          <h3 className="text-[20px] leading-[28px] font-bold text-[#545563] mb-3">
                            Today's Menu, Ready to Go!
                          </h3>
                          <p className="text-[14px] leading-[20px] text-[#545563] mb-4">
                            Freshly made meals, available to pickup within 24 hours.
                          </p>
                          <p className="text-[14px] leading-[20px] text-[#545563] mb-6">
                            Browse our daily menu of 13–15+ prepared menus, available Monday to Friday.
                            Simply place your order now, and we&apos;ll make it fresh just for you.
                            Your meal will be stocked in our vending stations within 24 hours.
                          </p>

                          {orderType === "Start a Plan" && (
                            <>
                              <p className="text-[14px] leading-[20px] text-[#545563] mb-6">
                                Select a plan to get started
                              </p>
                              <div className="flex gap-4 pb-6">
                                {planSubTypes.map((opt: any) => (
                                  <Button
                                    key={opt.key}
                                    onClick={() => setPlanType(String(opt.key).toLowerCase())}
                                    className={`${planType === String(opt.key).toLowerCase()
                                      ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                                      : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
                                      } px-6 py-3 md:rounded-[16px] rounded-[10px] font-bold`}
                                  >
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                            </>
                          )}

                          <Button
                            onClick={handleConfirmStep}
                            disabled={!orderType}
                            className="bg-[#054A86] hover:bg-[#043968] text-white px-8 py-3 rounded-lg font-bold"
                          >
                            Confirm
                          </Button>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="relative w-[282px] h-[188px] flex items-center justify-center">
                            <img
                              src={orderType === "Start a Plan" ? "/images/order/planing.svg" : "/images/order/desktop.svg"}
                              alt="logo"
                              className="h-full w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step3Status !== "pending" && (
              <div className={`w-full border rounded-[16px] transition-all ${step3Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                }`}>
                <div className="py-[20px] md:px-[24px] px-3">
                  <div className="flex flex-row justify-between max-md:gap-4">
                    <div className="flex gap-4">
                      <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step3Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                        }`}>
                        {step3Status === "completed" ? <Check className="w-4 h-4" /> : 3}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                          Set Your Pickup Time
                        </h2>
                        {step3Status === "completed" && (
                          <>
                            <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                              "{pickOrder}"
                            </h4>
                            <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                              "{time}"
                            </h4>
                          </>
                        )}
                      </div>
                    </div>

                    {step3Status === "completed" && (
                      <Button
                        onClick={() => handleEditStep(3)}
                        className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {step3Status === "active" && (
                    <div className="mt-6 space-y-6">
                      <div className="flex gap-4 flex-row">
                        {pickupOptions.map((opt: any) => (
                          <Button
                            key={opt.key}
                            onClick={() => SetPickOrder(opt.label)}
                            className={`${pickOrder === opt.label
                              ? "bg-[#EAF5FF] hover:bg-[#EAF5FF] border border-[#054A86] text-[#2B2B43]"
                              : "bg-neutral-white hover:bg-neutral-white border border-[#C7C8D2] text-[#2B2B43]"
                              } px-6 py-3 md:rounded-[16px] rounded-[10px] font-bold`}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>

                      <div className="flex md:flex-row flex-col items-start gap-8">
                        <div className="flex-1">
                          <h3 className="text-[20px] leading-[28px] md:font-bold text-[#545563] mb-3">
                            Select a timeframe to pickup your meal
                          </h3>
                          <p className="text-[14px] leading-[20px] text-[#545563] mb-4">
                            Sub copy if needed
                          </p>

                          <Button
                            onClick={() => setIsOpen(true)}
                            disabled={!orderType}
                            className="bg-[#054A86] hover:bg-[#043968] text-white px-8 py-3 rounded-lg font-bold"
                          >
                            Select Timeframe
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* STEP 4 paths */}
            {orderType === "Order Now" && step4Status !== "pending" && (
              <div className={`w-full border rounded-[16px] transition-all ${step4Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                }`}>
                <div className="py-[20px] md:px-[24px] px-3">
                  <div className="flex flex-row justify-between max-md:gap-4">
                    <div className="flex gap-4">
                      <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step4Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                        }`}>
                        {step4Status === "completed" ? <Check className="w-4 h-4" /> : 4}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                          Choose Your Meal
                        </h2>

                        {step4Status === "completed" && (() => {
                          const summary = generateCartSummary(orderNowMenu);
                          return (
                            <>
                              <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                                {`“${summary.totalMeals} Meals”`}
                              </h4>
                              <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                                <h4 className="font-[700] tracking-[0.1px]">{summary.line}</h4>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {step4Status === "completed" && (
                      <Button
                        onClick={() => handleEditStep(4)}
                        className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {step4Status === "active" && (
                    <div className="mt-4 pl-0">
                      <Menu
                        handleConfirmStep={handleConfirmStep}
                        orderNowMenuFunc={orderNowMenuFunc}
                        initialCart={orderNowMenu}
                        machineGoods={machineGoods}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {orderType === "Smart Grab" && step4Status !== "pending" && (
              <div className={`w-full border rounded-[16px] transition-all ${step4Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                }`}>
                <div className="py-[20px] md:px-[24px] px-3">
                  <div className="flex flex-row justify-between max-md:gap-4">
                    <div className="flex gap-4">
                      <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step4Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                        }`}>
                        {step4Status === "completed" ? <Check className="w-4 h-4" /> : 4}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                          Choose Your Meal
                        </h2>

                        {step4Status === "completed" && (() => {
                          const summary = generateCartSummary(smartGrabMenu);
                          return (
                            <>
                              <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                                {`“${summary.totalMeals} Meals”`}
                              </h4>
                              <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                                <h4 className="font-[700] tracking-[0.1px]">{summary.line}</h4>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {step4Status === "completed" && (
                      <Button
                        onClick={() => handleEditStep(4)}
                        className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {step4Status === "active" && (
                    <div className="mt-4 pl-0">
                      <GrabMenu
                        handleConfirmStep={handleConfirmStep}
                        smartGrabMenuFunc={smartGrabMenuFunc}
                        initialCart={smartGrabMenu}
                        availableItems={smartGrabAvailableItems}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Weekly plan (Step 4) */}
            {orderType === "Start a Plan" && planType === "weekly" && step4Status !== "pending" && (
              <div className={`w-full border rounded-[16px] transition-all ${step4Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                }`}>
                <div className="py-[20px] md:px-[24px] px-3">
                  <div className="flex flex-row justify-between max-md:gap-4">
                    <div className="flex gap-4">
                      <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step4Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                        }`}>
                        {step4Status === "completed" ? <Check className="w-4 h-4" /> : 4}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                          Plan Your Week Menu
                        </h2>

                        {step4Status === "completed" && (() => {
                          const summary = generatePlanSummary(weekMenu);
                          return (
                            <>
                              <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                                {`“${summary.totalMeals} Meals”`}
                              </h4>
                              <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                                {summary.lines.map((line, idx) => (
                                  <h4 key={idx} className="font-[700] tracking-[0.1px]">{line}</h4>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {step4Status === "completed" && (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => openSavePlan(4)}
                          className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                        >
                          Save Plan
                        </Button>
                        <Button
                          onClick={() => handleEditStep(4)}
                          className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  {step4Status === "active" && (
                    <div className="mt-4 pl-0">
                      <PlanWeekly
                        handleConfirmStep={handleConfirmStep}
                        weekMenuFunc={weekMenuFunc}
                        savedPlanData={weekMenu}
                        allSavedPlans={allSavedPlans}
                        apiMenuData={apiWeeklyMenu}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Monthly plan (Steps 4-7) */}
            {orderType === "Start a Plan" && planType === "monthly" && (
              <>
                {/* Step 4 */}
                {step4Status !== "pending" && (
                  <div className={`w-full border rounded-[16px] transition-all ${step4Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                    }`}>
                    <div className="py-[20px] md:px-[24px] px-3">
                      <div className="flex flex-row justify-between max-md:gap-4">
                        <div className="flex gap-4">
                          <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step4Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                            }`}>
                            {step4Status === "completed" ? <Check className="w-4 h-4" /> : 4}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                              Plan Your Week 1 Menu
                            </h2>

                            {step4Status === "completed" && (() => {
                              const summary = generatePlanSummary(weekMenu1);
                              return (
                                <>
                                  <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                                    {`“${summary.totalMeals} Meals”`}
                                  </h4>
                                  <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                                    {summary.lines.map((line, idx) => (
                                      <h4 key={idx} className="font-[700] tracking-[0.1px]">{line}</h4>
                                    ))}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {step4Status === "completed" && (
                          <div className="flex gap-3">
                            <Button
                              onClick={() => openSavePlan(4)}
                              className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                            >
                              Save Plan
                            </Button>
                            <Button
                              onClick={() => handleEditStep(4)}
                              className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>

                      {step4Status === "active" && (
                        <div className="mt-4 pl-0">
                          <PlanWeekly
                            handleConfirmStep={handleConfirmStep}
                            weekMenuFunc={weekMenuFunc1}
                            savedPlanData={weekMenu1}
                            allSavedPlans={allSavedPlans}
                            apiMenuData={apiMonthlyMenu?.[0]?.menu}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5 */}
                {step5Status !== "pending" && (
                  <div className={`w-full border rounded-[16px] transition-all ${step5Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                    }`}>
                    <div className="py-[20px] md:px-[24px] px-3">
                      <div className="flex flex-row justify-between max-md:gap-4">
                        <div className="flex gap-4">
                          <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step5Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                            }`}>
                            {step5Status === "completed" ? <Check className="w-4 h-4" /> : 5}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                              Plan Your Week 2 Menu
                            </h2>

                            {step5Status === "completed" && (() => {
                              const summary = generatePlanSummary(weekMenu2);
                              return (
                                <>
                                  <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                                    {`“${summary.totalMeals} Meals”`}
                                  </h4>
                                  <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                                    {summary.lines.map((line, idx) => (
                                      <h4 key={idx} className="font-[700] tracking-[0.1px]">{line}</h4>
                                    ))}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {step5Status === "completed" && (
                          <div className="flex gap-3">
                            <Button
                              onClick={() => openSavePlan(5)}
                              className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                            >
                              Save Plan
                            </Button>
                            <Button
                              onClick={() => handleEditStep(5)}
                              className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>

                      {step5Status === "active" && (
                        <div className="mt-4 pl-0">
                          <PlanWeekly
                            handleConfirmStep={handleConfirmStep}
                            weekMenuFunc={weekMenuFunc2}
                            savedPlanData={weekMenu2}
                            allSavedPlans={allSavedPlans}
                            apiMenuData={apiMonthlyMenu?.[1]?.menu}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 6 */}
                {step6Status !== "pending" && (
                  <div className={`w-full border rounded-[16px] transition-all ${step6Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                    }`}>
                    <div className="py-[20px] md:px-[24px] px-3">
                      <div className="flex flex-row justify-between max-md:gap-4">
                        <div className="flex gap-4">
                          <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step6Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                            }`}>
                            {step6Status === "completed" ? <Check className="w-4 h-4" /> : 6}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                              Plan Your Week 3 Menu
                            </h2>

                            {step6Status === "completed" && (() => {
                              const summary = generatePlanSummary(weekMenu3);
                              return (
                                <>
                                  <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                                    {`“${summary.totalMeals} Meals”`}
                                  </h4>
                                  <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                                    {summary.lines.map((line, idx) => (
                                      <h4 key={idx} className="font-[700] tracking-[0.1px]">{line}</h4>
                                    ))}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {step6Status === "completed" && (
                          <div className="flex gap-3">
                            <Button
                              onClick={() => openSavePlan(6)}
                              className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                            >
                              Save Plan
                            </Button>
                            <Button
                              onClick={() => handleEditStep(6)}
                              className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>

                      {step6Status === "active" && (
                        <div className="mt-4 pl-0">
                          <PlanWeekly
                            handleConfirmStep={handleConfirmStep}
                            weekMenuFunc={weekMenuFunc3}
                            savedPlanData={weekMenu3}
                            allSavedPlans={allSavedPlans}
                            apiMenuData={apiMonthlyMenu?.[2]?.menu}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 7 */}
                {step7Status !== "pending" && (
                  <div className={`w-full border rounded-[16px] transition-all ${step7Status === "active" ? "border-[#EDEEF2] bg-white shadow-lg" : "border-[#EDEEF2] bg-white"
                    }`}>
                    <div className="py-[20px] md:px-[24px] px-3">
                      <div className="flex flex-row justify-between max-md:gap-4">
                        <div className="flex gap-4">
                          <div className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${step7Status === "completed" ? "bg-[#10B981] text-white" : "bg-[#054A86] text-white"
                            }`}>
                            {step7Status === "completed" ? <Check className="w-4 h-4" /> : 7}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
                              Plan Your Week 4 Menu
                            </h2>

                            {step7Status === "completed" && (() => {
                              const summary = generatePlanSummary(weekMenu4);
                              return (
                                <>
                                  <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                                    {`“${summary.totalMeals} Meals”`}
                                  </h4>
                                  <div className="mt-1 space-y-1 text-[14px] leading-[20px] text-[#056AC1]">
                                    {summary.lines.map((line, idx) => (
                                      <h4 key={idx} className="font-[700] tracking-[0.1px]">{line}</h4>
                                    ))}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {step7Status === "completed" && (
                          <div className="flex gap-3">
                            <Button
                              onClick={() => openSavePlan(7)}
                              className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                            >
                              Save Plan
                            </Button>
                            <Button
                              onClick={() => handleEditStep(7)}
                              className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>

                      {step7Status === "active" && (
                        <div className="mt-4 pl-0">
                          <PlanWeekly
                            handleConfirmStep={handleConfirmStep}
                            weekMenuFunc={weekMenuFunc4}
                            savedPlanData={weekMenu4}
                            allSavedPlans={allSavedPlans}
                            apiMenuData={apiMonthlyMenu?.[3]?.menu}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Continue buttons once step 4 completed for non-monthly, and after step 7 completed for monthly */}
          {(step4Status === "completed" || step7Status === "completed") && (
            <div className="w-full">
              <div className="main-container flex md:flex-row flex-col-reverse gap-4 !py-10">
                <Button
                  className="md:min-w-[200px] bg-neutral-white text-[#545563] hover:bg-neutral-white border border-[#545563]"
                  onClick={() => navigate("/vending-home")}
                >
                  Continue Shopping
                </Button>
                <Button className="md:min-w-[200px]" onClick={() => navigate("/vending-home/cart")}>
                  Continue to Cart
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Timeframe sidebar */}
        <AnimatePresence>
          {isOpen && (
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
                className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-[16px]">
                  <h2 className="text-[20px] leading-[24px] font-[600] md:text-[28px] md:leading-[36px] md:font-[700]">
                    Select a Timeframe
                  </h2>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 py-4 space-y-4">
                  {timeSlots.map((slot: any) => (
                    <div
                      key={slot.id}
                      className={`${time === slot.label ? "bg-[#EAF5FF] border border-[#054A86]" : "border border-[#EDEEF2]"
                        } py-[10px] cursor-pointer px-4 my-3 rounded-[8px]`}
                      onClick={() => setTime(slot.label)}
                    >
                      <p className="text-[#2B2B43] text-[16px] leading-[24px] font-[700]">{slot.label}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 flex flex-col sm:flex-row gap-3">
                  <button
                    className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium"
                    onClick={handleConfirmStep}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save plan sidebar */}
        <AnimatePresence>
          {savePlanMenu && (
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
                className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-[16px]">
                  <h2 className="text-[28px] leading-[36px] font-[700]">Save Week Plan</h2>
                  <button onClick={() => setSavePlanMenu(false)} className="p-2 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 py-4 space-y-4">
                  <div>
                    <label className="text-[12px] leading-[16px] font-[600] text-[#545563]">
                      Enter Plan Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Example: Low Carbs"
                      className="md:max-w-[350px] w-full bg-neutral-white"
                      value={currentPlanName}
                      onChange={(e) => setCurrentPlanName(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      id="defaultCheck"
                      className="h-5 w-5 cursor-pointer"
                      checked={isDefaultPlan}
                      onChange={(e) => setIsDefaultPlan(e.target.checked)}
                    />
                    <label htmlFor="defaultCheck" className="cursor-pointer">
                      Set as default
                    </label>
                  </div>
                </div>

                <div className="md:p-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSavePlanMenu(false)}
                    className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]"
                  >
                    Close
                  </button>
                  <button
                    className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium"
                    onClick={confirmSavePlan}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="max-md:hidden">
        <Footer />
      </div>
      <MobileFooterNav />
    </div>
  );
};

export default OrderNow;
