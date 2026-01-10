// src/components/cart/CartPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import OrderList from "@/components/Cart/OrderList";
import OrderSummary from "@/components/Cart/OrderSummary";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import Header from "./catering/components/layout/Header";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import MobileFooterNav from "@/components/home/MobileFooterNav";

// Types matching Backend API
interface MenuItemAPI {
    id: number;
    name: string;
    price: string; // Decimal often returns as string
    image_url: string | null;
    description: string;
}

interface CartItemAPI {
    id: number;
    menu_item: MenuItemAPI;
    quantity: number;
    day_of_week: string | null; // "Monday"
    week_number: number | null; // 1-4
    subtotal: number;
    vending_good_uuid: string | null;
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
    weekNumber: number | null; // For grouping
    vendingGoodUuid: string | null; // NEW: Good UUID
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

    const mapCartToUI = (cart: CartAPI, currentImageMap: Record<string, string> = imageMap) => {
        const locationName = cart.location?.name || "Unknown Location";

        const mapped: CartItemType[] = (cart.items || []).map((apiItem) => {
            let notes = "Other notes or copy here";

            if (cart.plan_subtype === "WEEKLY" || cart.plan_subtype === "MONTHLY") {
                if (apiItem.day_of_week) {
                    notes = `Meal for ${apiItem.day_of_week}`;
                }
            }

            return {
                id: apiItem.id,
                menuItemId: apiItem.menu_item.id,
                name: apiItem.menu_item.name,
                notes: notes,
                pickupLocation: `${locationName}`,
                imageUrl:
                    apiItem.menu_item.image_url ||
                    currentImageMap[apiItem.menu_item.name] ||
                    "/images/vending_home/food.svg",
                quantity: apiItem.quantity,
                price: parseFloat(apiItem.menu_item.price),
                weekNumber: apiItem.week_number,
                vendingGoodUuid: apiItem.vending_good_uuid,
            };
        });

        setItems(mapped);
    };

    // --- Helper to normalize names for "spelling-only" comparison ---
    const normalizeName = (name: string) =>
        (name || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const getMainTitle = () => {
        if (!cartData) return "Order Now";
        if (cartData.plan_type === "SMART_GRAB") return "Smart Grab";
        if (cartData.plan_subtype === "WEEKLY") return "Weekly Plan";
        if (cartData.plan_subtype === "MONTHLY") return "Monthly Plan";
        if (cartData.pickup_type === "IN_24_HOURS") return "Pickup in 24";
        return "Order Now";
    };

    const handleQuantityChange = (id: number, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQ = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQ };
                }
                return item;
            })
        );
    };

    const handleDeleteItem = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
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

    const activePlanSubtype = cartData?.plan_subtype || "NONE";

    // Prepare grouped items for Monthly Plan
    const getMonthlyGroupedItems = () => {
        const weeks = [1, 2, 3, 4];
        const groups: any[] = [];

        for (const week of weeks) {
            const weekItems = items.filter((i) => i.weekNumber === week);
            if (weekItems.length > 0) {
                groups.push({
                    title: `Week ${week}`,
                    items: weekItems,
                });
            }
        }

        const extras = items.filter(
            (i) => !i.weekNumber && activePlanSubtype === "MONTHLY"
        );
        if (extras.length > 0) {
            groups.push({ title: "Other Items", items: extras });
        }

        return groups;
    };

    return (
        <div className="bg-gray-50 min-h-screen max-md:pb-[82px]">
            <Header />
            <div className="w-full bg-white pt-2 pb-6">
                <div className="main-container">
                    <BreadCrumb />
                    <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
                        Cart
                    </h2>
                </div>
            </div>

            <div className="main-container ">
                {loading ? (
                    <div className="py-10 text-center">Loading cart...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start py-6">
                        <div className="lg:col-span-2 space-y-6">
                            {activePlanSubtype === "MONTHLY" ? (
                                <OrderList
                                    title="Monthly Plan"
                                    groupedItems={getMonthlyGroupedItems()}
                                    onQuantityChange={handleQuantityChange}
                                    onDeleteItem={handleDeleteItem}
                                />
                            ) : (
                                <OrderList
                                    title={getMainTitle()}
                                    items={items}
                                    onQuantityChange={handleQuantityChange}
                                    onDeleteItem={handleDeleteItem}
                                />
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
                                        if (serialNumber) {
                                            console.log(
                                                "🔍 Validating items with Vending Machine:",
                                                serialNumber
                                            );
                                            const goodsResponse = await fetch(
                                                `${baseUrl}/api/vending/external/machine-goods/?machineUuid=${serialNumber}`
                                            );
                                            const goodsData = await goodsResponse.json();

                                            if (goodsData.data) {
                                                const allGoods = goodsData.data.flatMap(
                                                    (cat: any) => cat.goodsList || []
                                                );

                                                updatedItems = items.map((cartItem) => {
                                                    const normalizedCartName = normalizeName(
                                                        cartItem.name
                                                    );
                                                    const match = allGoods.find(
                                                        (good: any) =>
                                                            normalizeName(good.goodsName) ===
                                                            normalizedCartName
                                                    );
                                                    if (match) {
                                                        console.log(
                                                            `✨ Matched "${cartItem.name}" -> ${match.uuid}`
                                                        );
                                                        return { ...cartItem, vendingGoodUuid: match.uuid };
                                                    }
                                                    return cartItem;
                                                });

                                                setItems(updatedItems);
                                            }
                                        }

                                        // --- 2. Backend Order Confirmation ---
                                        const checkoutItems = updatedItems.map((uiItem) => {
                                            const original = cartData.items.find(
                                                (api) => api.id === uiItem.id
                                            );
                                            return {
                                                menu_item_id: uiItem.menuItemId,
                                                quantity: uiItem.quantity,
                                                day_of_week: original?.day_of_week || null,
                                                week_number: uiItem.weekNumber,
                                                vending_good_uuid: uiItem.vendingGoodUuid || null,
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

                                        // --- 3. Production Pick API ---
                                        if (serialNumber) {
                                            const matchedGoods: any[] = [];
                                            let totalGoodsCount = 0;

                                            updatedItems.forEach((item) => {
                                                if (item.vendingGoodUuid) {
                                                    totalGoodsCount += item.quantity;
                                                    matchedGoods.push({
                                                        goodsNumber: item.quantity,
                                                        goodsPrice: 0.01,
                                                        goodsUuid: item.vendingGoodUuid,
                                                    });
                                                }
                                            });

                                            if (matchedGoods.length > 0) {
                                                console.log("🚀 Requesting Pickup Code for:", matchedGoods);
                                                const pickPayload = {
                                                    goodsList: matchedGoods,
                                                    goodsNumber: totalGoodsCount,
                                                    machineUuid: serialNumber,
                                                    orderNo: orderId.toString(),
                                                    orderTime: "",
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
                                                } else {
                                                    console.warn("Pickup code not received:", pickData);
                                                }
                                            }
                                        }

                                        // --- 4. Clear Cart ---
                                        try {
                                            await axios.post(
                                                `${baseUrl}/api/vending/cart/`,
                                                { items: [], current_step: 1 },
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
