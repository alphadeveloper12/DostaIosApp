// src/components/cart/CartPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import OrderList from "@/components/Cart/OrderList";
import OrderSummary from "@/components/Cart/OrderSummary";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import Header from "./catering/components/layout/Header";

import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Types matching Backend API
interface MenuItemAPI {
    id: number;
    name: string;
    price: string; // Decimal often returns as string
    image_url: string | null;
    description: string;
    heating?: string; // "yes" or "no"
}

interface CartItemAPI {
    id: number;
    menu_item: MenuItemAPI;
    quantity: number;
    day_of_week: string | null; // "Monday"
    week_number: number | null; // 1-4
    subtotal: number;
    vending_good_uuid: string | null;
    plan_type: string;
    plan_subtype: string;
    heating_requested?: boolean;
}

interface CartAPI {
    id: number;
    location: {
        id: number;
        name: string;
        info: string;
        serial_number?: string;
    } | null;
    plan_type: "ORDER_NOW" | "START_PLAN" | "SMART_GRAB";
    plan_subtype: "NONE" | "WEEKLY" | "MONTHLY";
    pickup_type: "TODAY" | "IN_24_HOURS" | null;
    pickup_date: string | null;
    pickup_slot: { id: number; label: string } | null;
    total_price: string;
    items: CartItemAPI[];
}

// Define the type for a single cart item for type safety
export interface CartItemType {
    id: number; // Cart Item ID (not menu item id)
    menuItemId: number; // For checkout reconstruction
    name: string;
    notes: string;
    pickupLocation: string;
    imageUrl: string;
    quantity: number;
    price: number;
    dayOfWeek: string | null; // NEW: Day of week
    weekNumber: number | null; // For grouping
    vendingGoodUuid: string | null; // NEW: Good UUID
    planType: string;
    planSubtype: string;
    heating?: string; // "yes" or "no" from API
    heatingChoice?: "yes" | "no"; // User selection
    status?: string; // Fulfillment status
    pickupCode?: string | null; // Item-specific pickup code
}

const CartPage: React.FC = () => {
    const [cartData, setCartData] = useState<CartAPI | null>(null);
    const [items, setItems] = useState<CartItemType[]>([]);
    const [coupon, setCoupon] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL;
    const [stockMap, setStockMap] = useState<Record<string, number>>({});
    const [stockAlerts, setStockAlerts] = useState<string[]>([]);
    const [heatingChoices, setHeatingChoices] = useState<Record<number, "yes" | "no">>({});


    const fetchCart = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("authToken");
            const res = await axios.get(`${baseUrl}/api/vending/cart/`, {
                headers: { Authorization: `Token ${token}` },
            });

            if (res.data) {
                console.log("🛒 Cart Data from API:", res.data);
                setCartData(res.data);
                mapCartToUI(res.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchMenuAndCart = async () => {
            try {
                setLoading(true);
                const token = sessionStorage.getItem("authToken");

                // 1. Fetch Menu for Images
                const menuRes = await axios.get(
                    `${baseUrl}/api/vending/menu/ORDER_NOW/`,
                    { headers: { Authorization: `Token ${token}` } }
                );
                const newImageMap: Record<string, string> = {};
                menuRes.data.menus?.forEach((menu: any) => {
                    menu.items?.forEach((it: any) => {
                        if (it.image_url && !newImageMap[it.name]) {
                            newImageMap[it.name] = it.image_url;
                        }
                    });
                });
                setImageMap(newImageMap);

                // 2. Fetch Cart
                const cartRes = await axios.get(`${baseUrl}/api/vending/cart/`, {
                    headers: { Authorization: `Token ${token}` },
                });

                if (cartRes.data) {
                    console.log("🛒 Cart Data from API:", cartRes.data);
                    setCartData(cartRes.data);
                    mapCartToUI(cartRes.data, newImageMap);
                }
            } catch (error) {
                console.error("Error fetching cart or menu:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuAndCart();
    }, []);

    // --- Stock Check Logic ---
    // --- Stock Check Logic ---
    // --- Stock Check Logic ---
    useEffect(() => {
        const checkStock = async () => {
            if (!cartData?.location?.serial_number || items.length === 0) return;

            const serialNumber = cartData.location.serial_number;
            // Only check for Order Now / Smart Grab items
            const orderNowItems = items.filter(i => i.planType === "ORDER_NOW" || i.planType === "SMART_GRAB");
            if (orderNowItems.length === 0) return;

            // Define reusable function to apply stock limits
            // mapKey: function to extract key from an item or good (e.g. uuid or normalized name)
            const applyStockToItems = (stockSource: Record<string, number>, sourceName: string) => {
                setStockMap(prev => ({ ...prev, ...stockSource })); // Capture stock data for handleQuantityChange
                const alerts: string[] = [];
                let itemsChanged = false;

                const updatedItems = items.map(item => {
                    if (item.planType !== "ORDER_NOW" && item.planType !== "SMART_GRAB") return item;

                    let available: number | undefined;

                    // Try to match by UUID first if both sides have it
                    if (item.vendingGoodUuid && stockSource[item.vendingGoodUuid] !== undefined) {
                        available = stockSource[item.vendingGoodUuid];
                        // Compare item good uuid with api's data and console how much they are available
                        if (item.name.toLowerCase().includes("chicken pesto pasta")) {
                            console.log(`[Stock Check] Chicken Pesto Pasta (UUID: ${item.vendingGoodUuid}) - Available: ${available}`);
                        }
                    } else {
                        // Fallback to name matching
                        const normName = normalizeName(item.name);
                        available = stockSource[normName];
                        if (item.name.toLowerCase().includes("chicken pesto pasta")) {
                            console.log(`[Stock Check] Chicken Pesto Pasta (Name: ${normName}) - Available: ${available}`);
                        }
                    }

                    if (available !== undefined) {
                        if (item.quantity > available) {
                            itemsChanged = true;
                            const newQuantity = available;
                            alerts.push(`${item.name}: Only ${available} left (requested ${item.quantity}). Quantity updated.`);
                            return { ...item, quantity: newQuantity };
                        }
                    } else {
                        if (sourceName === "API") { // Only warn on API source
                            console.warn(`[${sourceName}] Stock Check: Item "${item.name}" not found in machine data.`);
                        }
                    }
                    return item;
                });

                if (itemsChanged) {
                    console.log(`[${sourceName}] ⚠️ Adjustments made, updating state.`);
                    setStockAlerts(prev => [...prev, ...alerts]);
                    setItems(updatedItems);

                    // Sync updated quantities with backend
                    updatedItems.forEach(async (item) => {
                        const original = items.find(i => i.id === item.id);
                        if (original && original.quantity !== item.quantity) {
                            try {
                                const token = sessionStorage.getItem("authToken");
                                await axios.post(
                                    `${baseUrl}/api/vending/cart/`,
                                    {
                                        location_id: cartData.location.id,
                                        plan_type: item.planType,
                                        plan_subtype: item.planSubtype,
                                        items: [{
                                            menu_item_id: item.menuItemId,
                                            quantity: item.quantity,
                                            day_of_week: item.dayOfWeek,
                                            week_number: item.weekNumber,
                                            vending_good_uuid: item.vendingGoodUuid
                                        }]
                                    },
                                    { headers: { Authorization: `Token ${token}` } }
                                );
                                console.log(`[${sourceName}] ✅ Synced adjusted quantity for ${item.name} to ${item.quantity}`);
                            } catch (e) {
                                console.error(`[${sourceName}] Failed to sync adjustment for ${item.name}`, e);
                            }
                        }
                    });
                } else {
                    console.log(`[${sourceName}] ✅ All items within limits.`);
                }
            };

            // Fetch Fresh Data
            try {
                console.log("🔍 Fetching fresh stock for machine:", serialNumber);
                const goodsResponse = await fetch(
                    `${baseUrl}/api/vending/external/machine-goods/?machineUuid=${serialNumber}`
                );
                const goodsData = await goodsResponse.json();

                // Use the same logic as cache: Prioritize Shelves
                const freshStockMap: Record<string, number> = {};
                let loadedCount = 0;

                if (goodsData.shelves && Array.isArray(goodsData.shelves)) {
                    console.log("📦 Updated stock with fresh API data.");

                    goodsData.shelves.forEach((shelf: any) => {
                        if (!shelf.spots) return;
                        shelf.spots.forEach((spot: any) => {
                            if (spot.goods && spot.presentNumber > 0) {
                                const count = spot.presentNumber;
                                const uuid = spot.goods.uuid;
                                const name = normalizeName(spot.goods.goodsName);

                                if (uuid) freshStockMap[uuid] = (freshStockMap[uuid] || 0) + count;
                                if (name) freshStockMap[name] = (freshStockMap[name] || 0) + count;
                                loadedCount++;
                            }
                        });
                    });
                    console.log(`📦 API Loaded ${loadedCount} spots from shelves.`);
                }

                // Fallback or merge with legacy data if needed (usually shelves is enough)
                if (loadedCount === 0 && goodsData.data) {
                    const allGoods = goodsData.data.flatMap((cat: any) => cat.goodsList || []);
                    console.log(`📦 API Fallback: Loaded ${allGoods.length} goods from legacy list.`);
                    allGoods.forEach((good: any) => {
                        const name = normalizeName(good.goodsName);
                        // In new API, presentNumber might correspond to SINGLE items or be missing in this list
                        const val = good.presentNumber || 0;
                        freshStockMap[name] = val;
                        if (good.uuid) freshStockMap[good.uuid] = val;
                        if (good.id) freshStockMap[String(good.id)] = val;
                    });
                }

                // Log specific item for debugging
                if (freshStockMap["1064051"]) {
                    console.log(`[API] Debug Stock: Beef And Broccoli (UUID: 1064051) = ${freshStockMap["1064051"]}`);
                }

                applyStockToItems(freshStockMap, "API");
            } catch (error) {
                console.error("Error checking stock API:", error);
            }
        };

        checkStock();
    }, [cartData, items.length]); // Run when cart/location loads

    const mapCartToUI = (cart: CartAPI, currentImageMap: Record<string, string> = imageMap) => {
        const locationName = cart.location?.name || "Unknown Location";

        const mapped: CartItemType[] = (cart.items || []).map((apiItem) => {
            let notes = "Other notes or copy here";

            if (apiItem.plan_subtype === "WEEKLY" || apiItem.plan_subtype === "MONTHLY") {
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
                imageUrl: currentImageMap[apiItem.menu_item.name] || "/images/icons/food-placeholder.svg",
                quantity: apiItem.quantity,
                price: parseFloat(apiItem.menu_item.price),
                dayOfWeek: apiItem.day_of_week,
                weekNumber: apiItem.week_number,
                vendingGoodUuid: apiItem.vending_good_uuid,
                planType: apiItem.plan_type,
                planSubtype: apiItem.plan_subtype,
                heating: apiItem.menu_item.heating,
                heatingChoice: apiItem.heating_requested ? "yes" : (heatingChoices[apiItem.id] || "no"),
            };
        });

        setItems(mapped);
    };

    const handleHeatingChange = (id: number, choice: "yes" | "no") => {
        setHeatingChoices((prev) => {
            const next = { ...prev, [id]: choice };
            return next;
        });
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, heatingChoice: choice } : item
            )
        );
    };

    // --- Helper to normalize names for "spelling-only" comparison ---
    const normalizeName = (name: string) => {
        if (!name) return "";
        // Replace "&" with "and" to handle variations like "Beef & Broccoli" vs "Beef And Broccoli"
        let normalized = name.replace(/&/g, "and");
        // Remove all non-alphanumeric characters and convert to lowercase
        return normalized.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    };

    const getMainTitle = () => {
        if (!cartData) return "Order Now";
        if (cartData.plan_type === "SMART_GRAB") return "Smart Grab";
        if (cartData.plan_subtype === "WEEKLY") return "Weekly Plan";
        if (cartData.plan_subtype === "MONTHLY") return "Monthly Plan";
        if (cartData.pickup_type === "IN_24_HOURS") return "Pickup in 24";
        return "Order Now";
    };

    const handleQuantityChange = async (id: number, delta: number) => {
        const itemToUpdate = items.find((i) => i.id === id);
        if (!itemToUpdate) return;

        // Check stock limit
        let maxStock = 3; // Default for Plans
        if (itemToUpdate.planType === "ORDER_NOW" || itemToUpdate.planType === "SMART_GRAB") {
            let limitFound = false;
            // 1. Try UUID first (most accurate)
            if (itemToUpdate.vendingGoodUuid && stockMap[itemToUpdate.vendingGoodUuid] !== undefined) {
                maxStock = stockMap[itemToUpdate.vendingGoodUuid];
                limitFound = true;
            }
            // 2. Fallback to Normalized Name
            else {
                const normName = normalizeName(itemToUpdate.name);
                if (stockMap[normName] !== undefined) {
                    maxStock = stockMap[normName];
                    limitFound = true;
                }
            }

            if (!limitFound) {
                // Relaxed default for Order Now if stock unknown (wait for checkStock)
                maxStock = 10;
            }
        }

        const newQ = Math.min(maxStock, Math.max(1, itemToUpdate.quantity + delta));

        if (newQ === itemToUpdate.quantity) {
            if (itemToUpdate.quantity === maxStock && delta > 0) {
                toast.warning(`Only ${maxStock} items available.`);
            }
            return;
        }

        // Optimistically update UI
        const updatedAllItems = items.map((item) =>
            item.id === id ? { ...item, quantity: newQ } : item
        );
        setItems(updatedAllItems);

        try {
            const token = sessionStorage.getItem("authToken");
            // Filter items of the same plan type to sync
            const samePlanItems = updatedAllItems.filter(
                (i) => i.planType === itemToUpdate.planType && i.planSubtype === itemToUpdate.planSubtype
            );

            // Map back to API format
            const apiItems = samePlanItems.map((i) => ({
                menu_item_id: i.menuItemId,
                quantity: i.quantity,
                day_of_week: i.dayOfWeek,
                week_number: i.weekNumber,
                vending_good_uuid: i.vendingGoodUuid,
                heating_requested: i.heatingChoice === "yes",
            }));

            await axios.post(
                `${baseUrl}/api/vending/cart/`,
                {
                    location_id: cartData?.location?.id,
                    plan_type: itemToUpdate.planType,
                    plan_subtype: itemToUpdate.planSubtype,
                    items: apiItems,
                },
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            console.log("✅ Quantity synced with backend.");
        } catch (err) {
            console.error("Failed to sync quantity", err);
        }
    };

    const handleDeleteItem = async (id: number) => {
        const itemToDelete = items.find((i) => i.id === id);
        if (!itemToDelete) return;

        // Optimistically update UI
        const updatedAllItems = items.filter((i) => i.id !== id);
        setItems(updatedAllItems);

        try {
            const token = sessionStorage.getItem("authToken");

            // Filter items of the same plan type to sync
            const samePlanItems = updatedAllItems.filter(
                (i) => i.planType === itemToDelete.planType && i.planSubtype === itemToDelete.planSubtype
            );

            // Map back to API format
            const apiItems = samePlanItems.map((i) => ({
                menu_item_id: i.menuItemId,
                quantity: i.quantity,
                day_of_week: i.dayOfWeek,
                week_number: i.weekNumber,
                vending_good_uuid: i.vendingGoodUuid,
                heating_requested: i.heatingChoice === "yes",
            }));

            await axios.post(
                `${baseUrl}/api/vending/cart/`,
                {
                    location_id: cartData?.location?.id,
                    plan_type: itemToDelete.planType,
                    plan_subtype: itemToDelete.planSubtype,
                    items: apiItems,
                },
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            console.log("✅ Item deleted from backend.");
        } catch (err) {
            console.error("Failed to delete item from backend", err);
            // Revert UI on failure? Or just alert.
            alert("Failed to sync deletion with server.");
            fetchCart(); // Refresh from server to be safe
        }
    };

    const summary = useMemo(() => {
        const subtotal = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const vat = subtotal * 0.05;
        const discount = coupon.toUpperCase() === "DOSTA25" ? 25.0 : 0;
        const total = Math.max(0, subtotal + vat - discount);
        return { subtotal, vat, discount, total };
    }, [items, coupon]);

    const handleClearCart = async () => {
        // Removed window.confirm, handled by AlertDialog

        try {
            const token = sessionStorage.getItem("authToken");
            await axios.post(
                `${baseUrl}/api/vending/cart/`,
                { clear_all: true },
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            setItems([]);
            console.log("🗑️ Cart cleared successfully.");
        } catch (err) {
            console.error("Failed to clear cart", err);
            alert("Failed to clear cart. Please try again.");
        }
    };

    const getGroupedCartItems = () => {
        const groups: { title: string; items: CartItemType[]; groupedItems?: any[] }[] = [];

        // 1. Order Now
        const orderNowItems = items.filter(i => i.planType === "ORDER_NOW" || i.planType === "SMART_GRAB");
        if (orderNowItems.length > 0) {
            groups.push({ title: "Order Now", items: orderNowItems });
        }

        // 2. Weekly Plans
        const weeklyItems = items.filter(i => i.planType === "START_PLAN" && i.planSubtype === "WEEKLY");
        if (weeklyItems.length > 0) {
            groups.push({ title: "Weekly Plan", items: weeklyItems });
        }

        // 3. Monthly Plans
        const monthlyItems = items.filter(i => i.planType === "START_PLAN" && i.planSubtype === "MONTHLY");
        if (monthlyItems.length > 0) {
            // Group monthly items by week
            const weeks = [1, 2, 3, 4];
            const monthlyGroups: any[] = [];
            for (const week of weeks) {
                const weekItems = monthlyItems.filter((i) => i.weekNumber === week);
                if (weekItems.length > 0) {
                    monthlyGroups.push({
                        title: `Week ${week}`,
                        items: weekItems,
                    });
                }
            }
            const extras = monthlyItems.filter((i) => !i.weekNumber);
            if (extras.length > 0) {
                monthlyGroups.push({ title: "Other Items", items: extras });
            }

            groups.push({ title: "Monthly Plan", items: [], groupedItems: monthlyGroups });
        }

        return groups;
    };

    return (
        <div className="bg-gray-50 min-h-screen max-md:pb-[82px]">
            <Header />
            <div className="w-full bg-white pt-2 pb-6">
                <div className="main-container">
                    <BreadCrumb />
                    <div className="flex justify-between items-center">
                        <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
                            {getMainTitle()}
                        </h2>
                        {items.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        <span>Clear Cart</span>
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently remove all items from your cart.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleClearCart} className="bg-red-500 hover:bg-red-600">
                                            Clear Cart
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>
            </div>

            <div className="main-container ">
                {loading ? (
                    <div className="py-10 text-center">Loading cart...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start py-6">
                        <div className="lg:col-span-2 space-y-6">
                            {stockAlerts.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <h4 className="text-yellow-800 font-bold mb-2">Stock Updates</h4>
                                    <ul className="list-disc list-inside text-yellow-700 text-sm">
                                        {stockAlerts.map((alert, i) => (
                                            <li key={i}>{alert}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {getGroupedCartItems().map((group, idx) => (
                                <OrderList
                                    key={idx}
                                    title={group.title}
                                    items={group.items}
                                    groupedItems={group.groupedItems}
                                    onQuantityChange={handleQuantityChange}
                                    onDeleteItem={handleDeleteItem}
                                    onHeatingChange={handleHeatingChange}
                                />
                            ))}
                            {items.length === 0 && (
                                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                                    <p className="text-gray-500">Your cart is empty.</p>
                                    <Link to="/vending-home" className="text-[#054A86] font-bold mt-4 inline-block">
                                        Go Shopping
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <OrderSummary
                                subtotal={summary.subtotal}
                                vat={summary.vat}
                                discount={summary.discount}
                                total={summary.total}
                                coupon={coupon}
                                setCoupon={setCoupon}
                                onCheckout={async () => {
                                    if (!cartData || isCheckingOut) return;
                                    setIsCheckingOut(true);

                                    let updatedItems = [...items];
                                    const serialNumber = cartData.location?.serial_number;

                                    try {
                                        // --- 1. Vending Machine Validation & Matching ---
                                        const hasOrderNowItems = items.some(
                                            (item) => item.planType === "ORDER_NOW" || item.planType === "SMART_GRAB"
                                        );

                                        // --- 1. Vending Machine Validation & Stock Update Preparation ---
                                        let stockUpdates: any[] = [];

                                        if (serialNumber && hasOrderNowItems) {
                                            try {
                                                console.log("🔍 Checkout: Fetching fresh stock for validation...");
                                                const goodsResponse = await fetch(
                                                    `${baseUrl}/api/vending/external/machine-goods/?machineUuid=${serialNumber}`
                                                );
                                                const goodsData = await goodsResponse.json();
                                                const shelves = goodsData.shelves || [];

                                                if (shelves.length > 0) {
                                                    console.log("📦 Checkout: Using Fresh Stock for Validation:", shelves.length, "shelves");

                                                    // Calculate detailed usage per UUID
                                                    const usageMap: Record<string, number> = {};
                                                    items.forEach(item => {
                                                        if ((item.planType === "ORDER_NOW" || item.planType === "SMART_GRAB") && item.vendingGoodUuid) {
                                                            usageMap[item.vendingGoodUuid] = (usageMap[item.vendingGoodUuid] || 0) + item.quantity;
                                                        }
                                                    });

                                                    console.log("🛒 Checkout Usage Map:", JSON.stringify(usageMap));
                                                    console.log("🛒 Items in Cart:", JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, uuid: i.vendingGoodUuid }))));

                                                    // Find spots to decrement
                                                    const goodsListToUpdate: any[] = [];

                                                    shelves.forEach((shelf: any) => {
                                                        if (!shelf.spots) return;
                                                        shelf.spots.forEach((spot: any) => {
                                                            if (spot.goods && spot.goods.uuid && usageMap[spot.goods.uuid] > 0) {
                                                                const uuid = spot.goods.uuid;
                                                                const needed = usageMap[uuid];
                                                                const present = spot.presentNumber || 0;

                                                                const take = Math.min(needed, present);

                                                                if (take > 0) {
                                                                    const newQuantity = Math.max(0, present - take);

                                                                    // Push update payload for this spot
                                                                    goodsListToUpdate.push({
                                                                        arrivalCapacity: spot.arrivalCapacity,
                                                                        arrivalName: spot.arrivalName,
                                                                        commodityState: 0,
                                                                        equipmentUuid: serialNumber,
                                                                        goodsUuid: Number(uuid),
                                                                        presentNumber: newQuantity,
                                                                        salePrice: spot.goods.goodsPrice
                                                                    });

                                                                    usageMap[uuid] -= take;
                                                                    console.log(`📉 Decrementing ${spot.goods.goodsName} (Slot: ${spot.arrivalName}): Present ${present} - Take ${take} = New ${newQuantity}. Remaining Needed: ${usageMap[uuid]}`);
                                                                }
                                                            }
                                                        });
                                                    });

                                                    stockUpdates = goodsListToUpdate;
                                                }
                                            } catch (fetchErr) {
                                                console.error("Error fetching fresh stock for checkout", fetchErr);
                                            }
                                        }

                                        // --- 2. Backend Order Confirmation ---
                                        const checkoutItems = updatedItems.map((uiItem) => {
                                            return {
                                                menu_item_id: uiItem.menuItemId,
                                                quantity: uiItem.quantity,
                                                day_of_week: uiItem.dayOfWeek,
                                                week_number: uiItem.weekNumber,
                                                vending_good_uuid: uiItem.vendingGoodUuid || null,
                                                heating_requested: uiItem.heatingChoice === "yes",
                                                plan_type: uiItem.planType || (cartData.plan_type === "START_PLAN" ? "START_PLAN" : "ORDER_NOW"),
                                                plan_subtype: uiItem.planSubtype || "NONE",
                                            };
                                        });

                                        const payload = {
                                            location_id: cartData.location?.id || null,
                                            plan_type: cartData.plan_type,
                                            plan_subtype: cartData.plan_subtype,
                                            pickup_type: cartData.pickup_type,
                                            pickup_date: cartData.pickup_date,
                                            pickup_slot_id: cartData.pickup_slot?.id || null,
                                            items: checkoutItems,
                                        };

                                        const token = sessionStorage.getItem("authToken");
                                        if (!payload.location_id) {
                                            alert(
                                                "Location data is missing. Please re-select location."
                                            );
                                            setIsCheckingOut(false);
                                            return;
                                        }

                                        const orderRes = await axios.post(
                                            `${baseUrl}/api/vending/order/confirm/`,
                                            payload,
                                            {
                                                headers: { Authorization: `Token ${token}` },
                                            }
                                        );

                                        const orderId = orderRes.data.id;
                                        console.log("✅ Order Confirmed. ID:", orderId);

                                        // --- 3. Update Vending Machine Stock (New API) ---
                                        if (stockUpdates.length > 0) {
                                            try {
                                                console.log("🔄 Sending Stock Update to Vending Machine...", stockUpdates);
                                                const updatePayload = {
                                                    list: stockUpdates,
                                                    machineUuid: Number(serialNumber)
                                                };

                                                await axios.put(
                                                    `${baseUrl}/api/vending/external/update-commodity/`,
                                                    updatePayload,
                                                    {
                                                        headers: { Authorization: `Token ${token}` },
                                                    }
                                                );
                                                console.log("✅ Stock Updated Successfully on Machine.");
                                            } catch (updateErr) {
                                                console.error("❌ Failed to update machine stock", updateErr);
                                                // Don't block flow, but log error
                                            }
                                        }

                                        // Filter only Order Now / Smart Grab items for the vending machine pickup code
                                        const orderNowItems = updatedItems.filter(
                                            (item) => item.planType === "ORDER_NOW" || item.planType === "SMART_GRAB"
                                        );

                                        if (orderNowItems.length > 0) {
                                            const matchedGoods: any[] = [];
                                            let totalGoodsCount = 0;

                                            orderNowItems.forEach((item) => {
                                                if (item.vendingGoodUuid) {
                                                    totalGoodsCount += item.quantity;
                                                    const goodsObj: any = {
                                                        goodsNumber: item.quantity,
                                                        goodsPrice: 0.01,
                                                        goodsUuid: item.vendingGoodUuid,
                                                        heatingChoice: item.heatingChoice,
                                                    };

                                                    matchedGoods.push(goodsObj);
                                                }
                                            });

                                            if (matchedGoods.length > 0) {
                                                console.log("🚀 Requesting Pickup Code for:", matchedGoods);
                                                // Generate UAE time (UTC+4) for the external API
                                                const now = new Date();
                                                const uaeOffset = 4 * 60; // 4 hours in minutes
                                                const uaeTime = new Date(now.getTime() + (now.getTimezoneOffset() + uaeOffset) * 60000);
                                                const orderTimeStr = uaeTime.toISOString();

                                                const pickPayload = {
                                                    goodsList: matchedGoods,
                                                    goodsNumber: totalGoodsCount,
                                                    machineUuid: serialNumber,
                                                    orderNo: orderId.toString(),
                                                    orderTime: orderTimeStr,
                                                    timeOut: 1,
                                                    lock: 0,
                                                };

                                                const pickResponse = await fetch(
                                                    `${baseUrl}/api/vending/external/production-pick/`,
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify(pickPayload),
                                                    }
                                                );
                                                const pickData = await pickResponse.json();

                                                if (pickData.result === "200" && pickData.data) {
                                                    console.log("🔑 Pickup Code Received:", pickData.data);
                                                    const storageKey = `pickup_codes_${orderId}`;
                                                    const existingCodes = JSON.parse(
                                                        localStorage.getItem(storageKey) || "{}"
                                                    );

                                                    matchedGoods.forEach((mg) => {
                                                        existingCodes[mg.goodsUuid] = pickData.data;
                                                        const item = updatedItems.find(
                                                            (i) => i.vendingGoodUuid === mg.goodsUuid
                                                        );
                                                        if (item) {
                                                            existingCodes[`menu_${item.menuItemId}`] =
                                                                pickData.data;
                                                        }
                                                    });

                                                    localStorage.setItem(
                                                        storageKey,
                                                        JSON.stringify(existingCodes)
                                                    );

                                                    // --- 3.5 Save Pickup Code to Backend ---
                                                    try {
                                                        await axios.post(
                                                            `${baseUrl}/api/vending/order/update-pickup-code/`,
                                                            {
                                                                order_id: orderId,
                                                                pickup_code: pickData.data,
                                                            },
                                                            {
                                                                headers: { Authorization: `Token ${token}` },
                                                            }
                                                        );
                                                        console.log("✅ Pickup code saved to backend.");
                                                    } catch (backendErr) {
                                                        console.error("Failed to save pickup code to backend", backendErr);
                                                    }
                                                } else {
                                                    console.warn("Pickup code not received:", pickData);
                                                }
                                            }
                                        }

                                        // --- 4. Clear Cart ---
                                        try {
                                            await axios.post(
                                                `${baseUrl}/api/vending/cart/`,
                                                { clear_all: true },
                                                {
                                                    headers: { Authorization: `Token ${token}` },
                                                }
                                            );
                                            setItems([]);
                                            console.log("🗑️ Cart cleared successfully.");
                                        } catch (clearErr) {
                                            console.error("Failed to clear cart", clearErr);
                                        }

                                        navigate("/vending-home/my-orders");
                                    } catch (err) {
                                        console.error("Checkout failed", err);
                                        alert("Failed to place order.");
                                    } finally {
                                        setIsCheckingOut(false);
                                    }
                                }}
                                loading={isCheckingOut}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="max-md:hidden">
                <Footer />
            </div>
            <MobileFooterNav />
        </div>
    );
};

export default CartPage;
