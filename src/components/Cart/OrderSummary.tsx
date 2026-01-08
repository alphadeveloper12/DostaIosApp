// src/components/cart/OrderSummary.tsx
import React from "react";
import { Button } from "@/pages/catering/components/ui/button";

interface OrderSummaryProps {
    subtotal: number;
    vat: number;
    discount: number;
    total: number;

    // Newer API-style props
    coupon?: string;
    setCoupon?: (coupon: string) => void;

    onCheckout?: () => void;
    loading?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    subtotal,
    vat,
    discount,
    total,
    coupon = "",
    setCoupon,
    onCheckout,
    loading = false,
}) => {
    const isCouponApplied = coupon.trim().toUpperCase() === "DOSTA25";

    return (
        <div className="bg-white rounded-lg shadow-md md:p-6 p-4 sticky top-8">
            <h2 className="text-[28px] leading-[36px] font-[700] text-[#2B2B43] mb-4">
                Order Summary
            </h2>

            {/* Coupon Code */}
            <div className="mb-6">
                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon code
                </label>

                <div className="relative">
                    <input
                        type="text"
                        id="coupon"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon?.(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {isCouponApplied && (
                        <img
                            src="/images/icons/round_tick.svg"
                            alt="tick"
                            className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2"
                        />
                    )}
                </div>
            </div>

            {/* Price Details */}
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-[#545563]">Subtotal</span>
                    <span className="font-medium">AED{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-[#545563]">VAT</span>
                    <span className="font-medium">AED{vat.toFixed(2)}</span>
                </div>

                {isCouponApplied && (
                    <div className="flex justify-between text-[#056AC1]">
                        <span>Discount (coupon)</span>
                        <span className="font-medium">- AED{discount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                <span className="text-[16px] leading-[24px] text-[#2B2B43] font-[400]">
                    Total <span>(VAT incl.)</span>
                </span>
                <span className="text-[#054A86]">AED{total.toFixed(2)}</span>
            </div>

            <Button
                className="w-full bg-[#054A86] hover:bg-[#054A86] text-neutral-white font-bold py-3 rounded-md mt-5 flex items-center justify-center gap-2"
                onClick={onCheckout}
                disabled={loading || !onCheckout}
                title={!onCheckout ? "No checkout handler provided" : undefined}
            >
                {loading ? (
                    <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Processing...
                    </>
                ) : (
                    "Proceed to checkout"
                )}
            </Button>
        </div>
    );
};

export default OrderSummary;
