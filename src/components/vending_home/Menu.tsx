import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Shrimmer from "../ui/Shrimmer";
import MenuCard from "./MenuCard";

interface FoodItem {
    imgSrc: string;
    heading: string;
    imgAlt: string;
    description: string;
    price: string;
    id: number; // Added ID field
    offer?: string; // Optional offer text
    terms?: string; // Optional terms link/text
    vendingGoodUuid?: string; // NEW: Vending machine good UUID (e.g., 1069950)
}

// --- NEW: Interface for items in our cart, now with quantity ---
interface SelectedFoodItem extends FoodItem {
    quantity: number;
}

interface MenuProps {
    handleConfirmStep: () => void;
    orderNowMenuFunc?: any; // Added optional prop for orderNowMenuFunc
    initialCart?: SelectedFoodItem[]; // NEW: Accept initial state
    machineGoods?: any[]; // NEW: Machine goods for filtering
    machineShelves?: any[]; // NEW: Machine shelves for structured display
}

const Menu: React.FC<MenuProps> = ({
    handleConfirmStep,
    orderNowMenuFunc,
    initialCart = [],
    machineGoods,
    machineShelves,
}) => {
    const [openDialouge, setOpenDialouge] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false); // This state is set but not used
    const [toaster, setToaster] = useState<boolean>(false);

    // --- NEW: Single state for the cart. Initialize from prop ---
    const [cart, setCart] = useState<SelectedFoodItem[]>(initialCart);
    const [foodData, setFoodData] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- NEW: Derived state (calculated from 'cart') ---
    // This calculates the total number of meals in the cart
    const totalMeals = cart.reduce((acc, item) => acc + item.quantity, 0);

    // --- NEW: Helper to normalize names for "spelling-only" comparison ---
    const normalizeName = (name: string) =>
        (name || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // --- NEW: Split items into Available and Others ---
    const { availableItems, otherItems, shelfData, totalAvailableCount } = React.useMemo(() => {
        // If machineGoods is null (still loading), show everything in 'others' for now
        if (machineGoods === null) {
            return { availableItems: [], otherItems: foodData, shelfData: [] };
        }

        // If machineGoods is empty array (loaded but no items), show everything in 'others'
        if (machineGoods && machineGoods.length === 0) {
            return { availableItems: [], otherItems: foodData, shelfData: [] };
        }

        const available: FoodItem[] = [];
        const others: FoodItem[] = [];

        // Create a lookup for foodData by normalized name
        const foodLookup = new Map<string, FoodItem>();
        foodData.forEach(item => {
            foodLookup.set(normalizeName(item.heading), item);
        });

        // Process shelves if available
        const processedShelves = (machineShelves || []).map(shelf => ({
            ...shelf,
            spots: shelf.spots.map((spot: any) => {
                if (!spot.goods) return { ...spot, enrichedItem: null };

                const normalizedName = normalizeName(spot.goods.goodsName);
                const menuItem = foodLookup.get(normalizedName);

                if (menuItem) {
                    return {
                        ...spot,
                        enrichedItem: {
                            ...menuItem,
                            vendingGoodUuid: spot.goods.uuid,
                            price: `AED ${parseFloat(spot.goods.goodsPrice).toFixed(2)}`,
                            // Initialize quantity to 1 for cart addition
                            quantity: 1,
                            // Track total available stock for this spot
                            availableQuantity: spot.presentNumber
                        }
                    };
                }

                // If not in daily menu or sold out, do not show it
                return {
                    ...spot,
                    enrichedItem: null
                };
            })
        })).filter(shelf => shelf.spots.some((spot: any) => spot.enrichedItem !== null && spot.presentNumber > 0));

        foodData.forEach((item) => {
            const normalizedItemName = normalizeName(item.heading);

            let matchedUuid: string | undefined;
            const isAvailable = (machineGoods || []).some((good) => {
                // Handle both object and string formats
                const rawName =
                    typeof good === "string" ? good : good?.goodsName || "";
                const normalizedGoodName = normalizeName(rawName);

                // Log matches for debugging
                if (normalizedGoodName === normalizedItemName) {
                    matchedUuid = typeof good === "object" ? good.uuid : undefined;
                    // Check if item is in stock (if presentNumber is available)
                    if (typeof good === "object" && good.presentNumber !== undefined && good.presentNumber <= 0) {
                        return false;
                    }
                    return true;
                }
                return false;
            });

            const enrichedItem = { ...item, vendingGoodUuid: matchedUuid };

            if (isAvailable) {
                available.push(enrichedItem);
            } else {
                others.push(enrichedItem);
            }
        });

        // Deduplicate
        const uniqueAvailable = Array.from(
            new Map(available.map((item) => [item.heading, item])).values()
        );

        const availableNames = new Set(uniqueAvailable.map((item) => item.heading));
        const uniqueOthers = Array.from(
            new Map(
                others
                    .filter((item) => !availableNames.has(item.heading))
                    .map((item) => [item.heading, item])
            ).values()
        );

        const totalAvailableCount = processedShelves.length > 0
            ? processedShelves.reduce((acc, shelf) => acc + shelf.spots.filter((s: any) => s.enrichedItem !== null && s.presentNumber > 0).length, 0)
            : uniqueAvailable.length;

        return {
            availableItems: processedShelves.length > 0 ? [] : uniqueAvailable,
            otherItems: uniqueOthers,
            shelfData: processedShelves,
            totalAvailableCount
        };
    }, [foodData, machineGoods, machineShelves]);

    const handleCardClick = (item: FoodItem) => {
        setSelectedItem(item);
        setIsSheetOpen(true);
    };

    // --- UPDATED: confirmFunc now resets the new 'cart' state ---
    const confirmFunc = () => {
        setOpenDialouge(false);
        setCart([]); // Reset the cart
        setToaster(true);
        setTimeout(() => {
            setToaster(false);
        }, 2000);
    };

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = sessionStorage.getItem("authToken");
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL || ""}/api/vending/menu/ORDER_NOW/`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `token ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();

                // 1. Create a map of "Item Name" -> "First Valid Image URL"
                const imageMap: Record<string, string> = {};

                data.menus?.forEach((menu: any) => {
                    menu.items?.forEach((it: any) => {
                        if (it.image_url && !imageMap[it.name]) {
                            imageMap[it.name] = it.image_url;
                        }
                    });
                });

                // Transform items from the API structure
                const allItems: FoodItem[] = [];

                data.menus?.forEach((menu: any) => {
                    menu.items?.forEach((it: any) => {
                        allItems.push({
                            imgSrc:
                                imageMap[it.name] ||
                                it.image_url ||
                                "/images/placeholder_food.png",
                            heading: it.name,
                            imgAlt: `food-${it.id}`,
                            description: it.description,
                            price: `AED ${parseFloat(it.price).toFixed(2)}`,
                            id: it.id,
                        });
                    });
                });

                console.log(
                    "📋 All Menu Items (Before Deduplication):",
                    JSON.stringify(allItems, null, 2)
                );
                console.log(`📊 Fetched ${allItems.length} items.`);

                setFoodData(allItems);
            } catch (err: any) {
                console.log("Menu fetch error:", err);
                setError("Failed to load menu .");
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    useEffect(() => {
        if (initialCart && initialCart.length > 0 && cart.length === 0) {
            setCart(initialCart);
        }
    }, [initialCart]);

    useEffect(() => {
        orderNowMenuFunc(cart);
    }, [cart]);

    // --- Original scroll effect (no change) ---
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 120);
                    ticking = false;
                });
                ticking = true;
            }
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // --- UPDATED: Master function to handle all cart logic ---
    const handleQuantityChange = (
        e: React.MouseEvent,
        item: FoodItem,
        delta: number
    ) => {
        e.stopPropagation();

        // Calculate total available stock for this item across all slots
        let totalAvailable = 0;
        if (shelfData && shelfData.length > 0) {
            shelfData.forEach((shelf: any) => {
                shelf.spots.forEach((spot: any) => {
                    if (spot.enrichedItem && normalizeName(spot.enrichedItem.heading) === normalizeName(item.heading)) {
                        totalAvailable += spot.presentNumber;
                    }
                });
            });
        } else if (machineGoods) {
            // Fallback for non-shelf view if needed
            const normalizedItemName = normalizeName(item.heading);
            machineGoods.forEach((good: any) => {
                const rawName = typeof good === "string" ? good : good?.goodsName || "";
                if (normalizeName(rawName) === normalizedItemName) {
                    totalAvailable += (good.presentNumber || 1); // Fallback to 1 if presentNumber missing
                }
            });
        } else {
            // If no machine data, use item's own availableQuantity if present, else default
            totalAvailable = (item as any).availableQuantity ?? 3;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.imgAlt === item.imgAlt);
            let newCart: SelectedFoodItem[];

            if (existingItem) {
                const newQuantity = existingItem.quantity + delta;
                if (newQuantity <= 0) {
                    newCart = prevCart.filter((i) => i.imgAlt !== item.imgAlt);
                } else if (newQuantity > totalAvailable) {
                    // Limit to total available stock
                    newCart = prevCart;
                } else {
                    newCart = prevCart.map((i) =>
                        i.imgAlt === item.imgAlt ? { ...i, quantity: newQuantity } : i
                    );
                }
            } else if (delta > 0) {
                if (delta > totalAvailable) {
                    newCart = prevCart;
                } else {
                    newCart = [...prevCart, { ...item, quantity: delta }];
                }
            } else {
                newCart = prevCart;
            }

            // Sync with parent state if provided
            if (orderNowMenuFunc) {
                orderNowMenuFunc(newCart);
            }
            console.log(
                "🛒 Updated Cart with Good UUIDs:",
                JSON.stringify(newCart, null, 2)
            );
            return newCart;
        });
    };

    return (
        <div className="w-full">
            <main className="md:pt-0 pt-6">
                {/* --- Sticky Header (Desktop) --- */}
                <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md py-4 mb-8 hidden md:block border border-gray-100 shadow-md rounded-[20px] px-8 transition-all duration-300">
                    <div className="flex flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <h2 className="text-[24px] font-bold text-[#054A86] mb-1">
                                Choose Your Meal
                            </h2>
                            <p className="text-[#545563] text-[14px] leading-[20px] font-[400] tracking-[0.1px]">
                                Choose your meal from our daily menu of {totalAvailableCount} chef-prepared meals
                            </p>
                            {machineGoods === null && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-3 h-3 border-2 border-[#054A86] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-[12px] text-[#054A86] font-medium">
                                        Checking availability...
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[13px] text-gray-400 font-bold uppercase tracking-wider">
                                    {totalMeals === 0 ? "No selected meals" : `${totalMeals} Selected`}
                                </p>
                                <p className="text-[22px] font-bold text-[#054A86]">
                                    Total: {totalMeals} Meals
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {cart.length > 0 && (
                                    <Button
                                        className="bg-white hover:bg-gray-50 text-[#545563] border border-[#C7C8D2] rounded-[12px] px-6 h-[48px]"
                                        onClick={() => setOpenDialouge(true)}>
                                        Reset
                                    </Button>
                                )}
                                {cart.length > 0 ? (
                                    <Button
                                        className="bg-[#054A86] hover:bg-[#054A86]/90 text-white rounded-[12px] px-8 h-[48px] font-bold shadow-lg shadow-[#054A86]/20 transition-all active:scale-[0.98]"
                                        onClick={() => handleConfirmStep()}>
                                        Confirm and review
                                    </Button>
                                ) : (
                                    <Button
                                        className="bg-[#F7F7F9] text-[#C7C8D2] rounded-[12px] px-8 h-[48px] font-bold cursor-not-allowed"
                                        disabled>
                                        Confirm and review
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Static Header (Mobile) --- */}
                <div className="md:hidden mb-6 px-1">
                    <h2 className="text-[22px] font-bold text-[#054A86] mb-1">
                        Choose Your Meal
                    </h2>
                    <p className="text-[#545563] text-[14px] leading-[20px]">
                        Choose your meal from our daily menu of {totalAvailableCount} chef-prepared meals
                    </p>
                    {machineGoods === null && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 border-2 border-[#054A86] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[12px] text-[#054A86] font-medium">
                                Checking availability...
                            </span>
                        </div>
                    )}
                </div>

                <div className="w-full pb-[160px] md:pb-0">
                    {loading && (
                        <div className="grid grid-cols-12 md:flex md:gap-[24px] gap-[12px] flex-wrap">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="col-span-12 md:w-[320px] h-[400px]">
                                    <Shrimmer />
                                </div>
                            ))}
                        </div>
                    )}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && !error && (
                        <>
                            {/* Shelf-wise Menu Section */}
                            {shelfData.length > 0 ? (
                                <div className="space-y-12">
                                    {shelfData.map((shelf: any) => (
                                        <div key={shelf.shelfIndex} className="bg-gray-50/50 rounded-[24px] p-6 md:p-8 border border-gray-100">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-2 h-8 bg-[#054A86] rounded-full"></div>
                                                <h3 className="text-[24px] font-bold text-[#054A86]">{shelf.shelfName}</h3>
                                            </div>
                                            <div className="grid grid-cols-12 md:flex md:gap-[24px] gap-[12px] flex-wrap">
                                                {shelf.spots.filter((spot: any) => spot.enrichedItem !== null).map((spot: any, index: number) => {
                                                    const data = spot.enrichedItem;
                                                    const itemInCart = cart.find(
                                                        (item) => item.imgAlt === data.imgAlt
                                                    );
                                                    const isSoldOut = spot.presentNumber <= 0;

                                                    return (
                                                        <div key={index} className="relative">
                                                            <div className="absolute -top-2 -left-2 z-10 bg-[#054A86] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                                Spot {spot.arrivalName}
                                                            </div>
                                                            <div className={isSoldOut ? "opacity-60 grayscale-[0.5]" : ""}>
                                                                <MenuCard
                                                                    data={data}
                                                                    itemInCart={itemInCart}
                                                                    handleCardClick={handleCardClick}
                                                                    handleQuantityChange={handleQuantityChange}
                                                                />
                                                            </div>
                                                            {isSoldOut && (
                                                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                                                    <div className="bg-red-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg transform -rotate-12">
                                                                        SOLD OUT
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {!isSoldOut && spot.presentNumber < 5 && (
                                                                <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                                    Only {spot.presentNumber} left
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                machineGoods !== null && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="bg-gray-50 rounded-full p-6 mb-4">
                                            <X className="w-12 h-12 text-gray-300" />
                                        </div>
                                        <h3 className="text-[20px] font-bold text-[#2B2B43] mb-2">No Items Available</h3>
                                        <p className="text-[#83859C] max-w-[300px]">
                                            Sorry, there are no items currently available at this location.
                                        </p>
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>

                {/* --- Sticky Footer (Mobile) --- */}
                <div className="fixed bottom-[98px] left-4 right-4 z-40 md:hidden">
                    <div className="bg-white p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] rounded-[24px] border border-gray-100">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-end px-1">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">
                                        {totalMeals === 0 ? "No selected meals" : `${totalMeals} Selected`}
                                    </span>
                                    <span className="text-[22px] font-bold text-[#054A86]">
                                        Total: {totalMeals} Meals
                                    </span>
                                </div>
                                {cart.length > 0 && (
                                    <button
                                        className="text-[#545563] text-[14px] font-bold underline decoration-2 underline-offset-4 hover:text-[#054A86] transition-colors"
                                        onClick={() => setOpenDialouge(true)}>
                                        Reset
                                    </button>
                                )}
                            </div>
                            {cart.length > 0 ? (
                                <Button
                                    className="bg-[#054A86] hover:bg-[#054A86]/90 text-white w-full py-7 rounded-[16px] text-[18px] font-bold shadow-lg shadow-[#054A86]/30 transition-all active:scale-[0.98]"
                                    onClick={() => handleConfirmStep()}>
                                    Confirm and review
                                </Button>
                            ) : (
                                <Button
                                    className="bg-[#F7F7F9] text-[#C7C8D2] w-full py-7 rounded-[16px] text-[18px] font-bold cursor-not-allowed"
                                    disabled>
                                    Confirm and review
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Sheet */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            className="fixed inset-0 z-50 flex justify-end bg-black/75 "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", stiffness: 250, damping: 30 }}
                                className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
                                <div className="flex items-center justify-between pb-[40px] md:pb-[16px]">
                                    <h2 className="text-[28px] leading-[36px] font-[700]">
                                        {selectedItem.heading}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="p-2 rounded-full hover:bg-gray-100">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <img
                                    src={selectedItem.imgSrc}
                                    alt={selectedItem.imgAlt}
                                    className="w-full object-cover h-60 md:h-[343px] rounded-[16px]"
                                />

                                <div className="flex-1 p-5 space-y-4">
                                    <p className="text-gray-600 text-sm">
                                        {selectedItem.description}
                                    </p>
                                    <h3 className="text-[24px] leading-[32px] font-[700] tracking-[0.1px]">
                                        {selectedItem.price}
                                    </h3>
                                    {selectedItem.offer && (
                                        <div className="md:pb-[24px]">
                                            <img src="/images/icons/offertag.svg" alt="offer" />
                                            <p className="py-3 px-[18px]">{selectedItem.offer}</p>
                                        </div>
                                    )}
                                    {selectedItem.terms && (
                                        <div>
                                            <Link
                                                className="text-[#056AC1] text-[16px] leading-[24px] font-[400] tracking-[0.1px] underline"
                                                to={selectedItem.terms}>
                                                Terms & conditions Apply
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="md:p-4 flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedItem) {
                                                handleQuantityChange(
                                                    { stopPropagation: () => { } } as React.MouseEvent,
                                                    selectedItem,
                                                    1
                                                );
                                            }
                                            setSelectedItem(null);
                                        }}
                                        className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium ">
                                        + Add
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reset Dialogue */}
                <AnimatePresence>
                    {openDialouge && (
                        <>
                            {/* Desktop Dialogue */}
                            <motion.div
                                className="fixed hidden inset-0 bg-black/75 md:flex items-center justify-center z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}>
                                <motion.div
                                    className="bg-white px-4 py-5 rounded-lg shadow-lg max-w-[394px]"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 0.2 }}>
                                    <div className="text-lg font-bold mb-2 gap-3 flex">
                                        <img src="/images/icons/info_icon.svg" alt="info" />
                                        <h3>Reset Menu Selection?</h3>
                                    </div>
                                    <p className="text-[#545563] mb-8">
                                        Are you sure you want to reset your menu selection?
                                    </p>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => setOpenDialouge(false)}
                                            className="px-4 py-2 bg-neutral-white border border-[neutral/gray dark] rounded-[8px] hover:bg-gray-300">
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => confirmFunc()}
                                            className="px-4 py-2 bg-[#054A86] text-white rounded-lg hover:bg-[#054A86]">
                                            Confirm
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Mobile Dialogue */}
                            <motion.div
                                className="fixed md:hidden inset-0 z-50 flex justify-end bg-black/75 "
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}>
                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ type: "spring", stiffness: 250, damping: 30 }}
                                    className="bg-white w-full md:px-8 md:py-4 px-[15px] py-6 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
                                    <div className="flex items-center gap-4 pb-[24px] md:pb-[16px]">
                                        <img src="/images/icons/info_icon.svg" alt="alert" />
                                        <h2 className="text-[28px] leading-[36px] font-[700]">
                                            Reset Menu Selection?
                                        </h2>
                                    </div>
                                    <div className="flex-1 py-0 ">
                                        <p className="text-gray-600 text-[16px] leading-[24px] font-[400] tracking-[0.1px]">
                                            Are you sure you want to reset your menu selection?
                                        </p>
                                    </div>
                                    <div className="md:p-4 flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => setOpenDialouge(false)}
                                            className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
                                            Close
                                        </button>
                                        <button
                                            onClick={() => confirmFunc()}
                                            className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium ">
                                            Confirm
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Toaster */}
                {toaster && (
                    <div className="fixed top-[104px] left-1/2 transform -translate-x-1/2 max-w-[540px] w-full h-[52px] bg-[#E8F9F1] rounded-[16px] shadow-[0px_4px_10px_rgba(232,249,241,0.6)] flex items-center px-4 gap-3 z-50">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0">
                            <path
                                d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                                fill="#34C759"
                            />
                            <path
                                d="M14 6L8.5 11.5L6 9"
                                stroke="white"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="flex-grow whitespace-nowrap text-[#2B2B43] font-medium text-sm">
                            Menu selections have been successfully reset.
                        </span>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Menu;
