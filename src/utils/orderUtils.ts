export const formatItems = (
 menuData: any,
 planType: string,
 activeStep: number
) => {
 if (!menuData) return [];

 // Safely handle if menuData is a JSON string
 let parsedMenuData = menuData;
 if (typeof menuData === "string") {
  try {
   parsedMenuData = JSON.parse(menuData);
  } catch (e) {
   console.error("Failed to parse menuData string:", e);
   return [];
  }
 }

 // WEEKLY
 if (planType === "weekly") {
  const days = Object.keys(parsedMenuData);
  let allItems: any[] = [];

  days.forEach((day) => {
   const dayItems = parsedMenuData[day];
   if (Array.isArray(dayItems)) {
    dayItems.forEach((item: any) => {
     allItems.push({
      menu_item_id: item.id,
      quantity: item.quantity || 1,
      day_of_week: day,
      week_number: 1, // Always 1 for weekly plans
     });
    });
   }
  });

  return allItems;
 }

 // MONTHLY
 if (planType === "monthly") {
  // Determine week number based on the step
  const _weekNumber =
   activeStep === 4
    ? 1
    : activeStep === 5
    ? 2
    : activeStep === 6
    ? 3
    : activeStep === 7
    ? 4
    : null;

  const items: any[] = [];
  if (parsedMenuData && typeof parsedMenuData === "object") {
   Object.keys(parsedMenuData).forEach((day) => {
    const dayItems = parsedMenuData[day];
    if (Array.isArray(dayItems)) {
     dayItems.forEach((item: any) => {
      items.push({
       menu_item_id: item.id,
       quantity: item.quantity || 1,
       day_of_week: day,
       week_number: _weekNumber,
      });
     });
    }
   });
  }
  return items;
 }

 // ORDER NOW & SMART GRAB (Array based)
 if (Array.isArray(parsedMenuData)) {
  return parsedMenuData.map((item: any) => ({
   menu_item_id: item.id,
   quantity: item.quantity || 1,
   day_of_week: null,
   week_number: null,
  }));
 }

 return [];
};

export const buildConfirmPayload = ({
 location,
 orderType,
 planType,
 pickOrder,
 time,
 pickupOptions,
 timeSlots,
 menuData,
 activeStep,
}: any) => {
 // ---- MAP ORDER TYPE ----
 const plan_type_map: any = {
  "Order Now": "ORDER_NOW",
  "Smart Grab": "SMART_GRAB",
  "Start a Plan": planType === "weekly" ? "WEEKLY" : "MONTHLY",
 };

 // ---- MAP PICKUP TYPE ----
 const pickup_type_map: any = {
  "Pickup Today": "TODAY",
  "Pickup in 24 hours": "NEXT_DAY",
 };

 const pickup_type = pickup_type_map[pickOrder] ?? "TODAY";

 // ---- FIND PICKUP SLOT ID ----
 const selectedSlot = timeSlots.find((slot: any) => slot.label === time);

 return {
  location_id: location,
  plan_type: plan_type_map[orderType],
  plan_subtype: orderType === "Start a Plan" ? planType.toUpperCase() : "NONE",
  pickup_type,
  pickup_date: new Date().toISOString().split("T")[0], // today's date
  pickup_slot_id: selectedSlot?.id || null,
  items: formatItems(menuData, planType, activeStep),
 };
};
