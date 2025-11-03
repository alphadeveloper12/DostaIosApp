import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Shrimmer from "../ui/Shrimmer";
import LazyLoad from "../ui/LazyLoad";

const baseUrl = import.meta.env.VITE_API_URL;

interface Payment {
 id: number;
 masked_card: string;
 expiration: string;
 cardholder_name: string;
}

export default function PaymentSettings() {
 const [payments, setPayments] = useState<Payment[]>([]);
 const [loading, setLoading] = useState(true);
 const [newPayment, setNewPayment] = useState({
  card_number: "",
  expiration: "",
  cvc: "",
  cardholder_name: "",
 });

 const authToken = sessionStorage.getItem("authToken");

 // Fetch payment methods
 const fetchPayments = async () => {
  try {
   const response = await axios.get(`${baseUrl}/api/payment-methods/`, {
    headers: { Authorization: `Token ${authToken}` },
   });
   setPayments(response.data);
   setLoading(false);
  } catch (error) {
   console.error("Failed to fetch payments:", error);
   setLoading(false);
  }
 };

 useEffect(() => {
  if (!authToken) return;
  fetchPayments();
 }, []);

 // Format card number as XXXX-XXXX-XXXX-XXXX
 const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16); // Keep only digits, max 16
  return digits.replace(/(\d{4})(?=\d)/g, "$1-"); // Add dashes every 4 digits
 };

 // Format expiration as MM/YYYY
 const formatExpiration = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 6); // Max 6 digits: MMYYYY
  if (digits.length < 3) return digits; // Not enough to add slash
  return digits.replace(/^(\d{2})(\d{0,4})/, "$1/$2"); // Insert slash after MM
 };

 // Restrict CVC to 3 numeric digits
 const formatCVC = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 3);
 };

 // Handle input changes
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "card_number") {
   setNewPayment({ ...newPayment, card_number: formatCardNumber(value) });
  } else if (name === "expiration") {
   setNewPayment({ ...newPayment, expiration: formatExpiration(value) });
  } else if (name === "cvc") {
   setNewPayment({ ...newPayment, cvc: formatCVC(value) });
  } else {
   setNewPayment({ ...newPayment, [name]: value });
  }
 };

 // Add new payment method
 const handleAddPayment = async () => {
  try {
   // Remove dashes from card_number before sending to API
   const payload = {
    ...newPayment,
    card_number: newPayment.card_number.replace(/-/g, ""),
   };

   await axios.post(`${baseUrl}/api/payment-methods/`, payload, {
    headers: { Authorization: `Token ${authToken}` },
   });

   setNewPayment({
    card_number: "",
    expiration: "",
    cvc: "",
    cardholder_name: "",
   });

   fetchPayments(); // Refresh list
  } catch (error) {
   console.error("Failed to add payment method:", error);
  }
 };

 if (loading) return <Shrimmer></Shrimmer>;

 return (
  <LazyLoad>
   <div className="space-y-2">
    <h1 className="text-[20px] leading-[28px] font-[600] tracking-[0.1px] text-neutral-black">
     Payment method
    </h1>

    {/* Connected Payment Methods */}
    <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm">
     <h2 className="text-lg font-semibold mb-6 text-foreground">
      Connected payment methods
     </h2>

     <div className="flex flex-wrap items-center md:flex-row gap-4">
      {payments.length === 0 && <p>No saved payment methods.</p>}
      {payments.map((card) => (
       <div
        key={card.id}
        className="h-[88px] w-[228px] border border-[#C7C8D2] rounded-[8px] p-[12px]">
        <h3 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-black pb-[2px]">
         {card.masked_card}
        </h3>
        <p className="text-neutral-gray text-[12px] font-[400] leading-[16px] pb-2">
         {card.expiration}
        </p>
        <div className="flex justify-between items-center">
         <p className="text-[14px] font-[400] leading-[20px] text-neutral-gray-dark">
          {card.cardholder_name}
         </p>
        </div>
       </div>
      ))}
     </div>
    </section>

    {/* New Payment Method */}
    <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm">
     <h2 className="text-lg font-semibold mb-6 text-foreground">
      New payment method
     </h2>

     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="space-y-2 md:col-span-2">
       <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
        Card number
       </label>
       <input
        type="text"
        name="card_number"
        value={newPayment.card_number}
        onChange={handleChange}
        placeholder="XXXX-XXXX-XXXX-XXXX"
        className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
       />
      </div>

      <div className="space-y-2">
       <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
        Expiration
       </label>
       <input
        type="text"
        name="expiration"
        value={newPayment.expiration}
        onChange={handleChange}
        placeholder="MM/YYYY"
        className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
       />
      </div>

      <div className="space-y-2">
       <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
        CVC
       </label>
       <input
        type="text"
        name="cvc"
        value={newPayment.cvc}
        onChange={handleChange}
        placeholder="XXX"
        className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
       />
      </div>

      <div className="space-y-2 md:col-span-4">
       <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
        Cardholder
       </label>
       <input
        type="text"
        name="cardholder_name"
        value={newPayment.cardholder_name}
        onChange={handleChange}
        placeholder="Enter name on card"
        className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
       />
      </div>
     </div>

     <div className="gap-4 py-5 px-4 flex justify-end">
      <Button
       variant="outline"
       className="w-full sm:w-auto"
       onClick={handleAddPayment}>
       Add new payment method
      </Button>
     </div>
    </section>
   </div>
  </LazyLoad>
 );
}
