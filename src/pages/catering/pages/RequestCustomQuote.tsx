import { ChevronLeft, Mail, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import Header from "../components/layout/Header";
import BreadCrumb from "@/components/home/BreadCrumb";

const RequestCustomQuote = () => {
 const navigate = useNavigate();

 // existing + added
 const [sendTo, setSendTo] = useState("registered");
 const [otherEmail, setOtherEmail] = useState("");
 const [submitted, setSubmitted] = useState(false);

 // NEW: validate email & compute submit availability
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 const isEmailValid = useMemo(
  () => (sendTo === "other" ? emailRegex.test(otherEmail.trim()) : true),
  [sendTo, otherEmail]
 );
 const canSubmit = isEmailValid; // registered option is always valid

 const selectedEmail =
  sendTo === "other" && otherEmail?.trim()
   ? otherEmail.trim()
   : "[email address]";

 return (
  <div className="min-h-screen flex flex-col">
   <Header />

   <main className="flex-1 bg-background">
    <div className="bg-neutral-white">
     <div className="main-container !py-6">
      <BreadCrumb />

      <h1 className="md:text-4xl font-bold text-primary text-[28px]">
       {!submitted && "Catering Service Confirmation"}
       {submitted && "Confirmation Message"}
      </h1>
     </div>
    </div>

    <div className="main-container px-2 !py-6 pb-24">
     <div className="rounded-2xl border border-[#EDEEF2] bg-white p-6">
      <div className="flex items-start justify-between gap-6 w-full flex-col">
       {/* ===================== FORM SECTION ===================== */}
       {!submitted && (
        <div className="flex flex-col gap-6">
         <h3 className="text-[24px] font-bold leading-8 text-#2B2B43">
          Request Your Custom Quote
         </h3>
         <h4 className="text-xl text-[#545563] font-semibold">
          Let us know what you need and we’ll send a quote straight to your
          inbox.
         </h4>

         <p className="text-base text-[#545563] font-normal">
          Fill out the form below with your specific requirements. You can
          choose to receive your quote at the email registered to your account
          or send it to another address. We’ll get back to you within 24–48
          hours.
         </p>

         <form>
          {/* Radio options */}
          <fieldset
           onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.name === "send_to") {
             setSendTo(target.value);
            }
           }}>
           <legend className="sr-only">Where should we send your quote?</legend>

           <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
             <input
              type="radio"
              name="send_to"
              value="registered"
              className="h-4 w-4 accent-[#054A86]"
              defaultChecked
             />
             <span className="text-base text-[#2B2B43] font-normal">
              Email registered to your account
             </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
             <input
              type="radio"
              name="send_to"
              value="other"
              className="h-4 w-4 accent-[#054A86]"
             />
             <span className="text-base text-[#2B2B43] font-normal">
              Send to a different email address
             </span>
            </label>

            {sendTo === "other" && (
             <div className="mt-2">
              <div className="relative w-full max-w-md">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A2B6]" />
               <input
                type="email"
                value={otherEmail}
                onChange={(e) => setOtherEmail(e.target.value)}
                placeholder="johnsmith@mail.com"
                className="w-full rounded-lg border border-[#C7C8D2] pl-9 pr-3 py-3 leading-[18px] text-sm focus:border-[#054A86] focus:outline-none"
               />
               {/* Optional tiny helper */}
               {otherEmail && !isEmailValid && (
                <p className="mt-1 text-xs text-red-600">
                 Enter a valid email.
                </p>
               )}
              </div>
             </div>
            )}
           </div>
          </fieldset>

          {/* Special instructions */}
          <div className="mt-6">
           <label
            htmlFor="instructions"
            className="block font-semibold text-xl mb-5">
            Special Instructions:
           </label>
           <textarea
            id="instructions"
            rows={1}
            placeholder="Placeholder"
            className="w-full rounded-lg border border-[#C7C8D2] px-3 py-3 text-sm resize-y leading[16px] focus:outline-none focus:ring-2  focus:border-[#2B2B43]"
           />
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
           <button
            type="button"
            onClick={() => canSubmit && setSubmitted(true)}
            disabled={!canSubmit}
            className={`inline-flex items-center rounded-md px-4 py-3 text-sm font-bold transition-colors shadow-sm
                          ${
                           canSubmit
                            ? "bg-[#0A3B79] text-white hover:bg-[#092f61] cursor-pointer"
                            : "bg-[#F7F7F9] text-[#C7C8D2] cursor-not-allowed"
                          }`}>
            Submit Request
           </button>
          </div>
         </form>
        </div>
       )}

       {/* ===================== SUCCESS SECTION ===================== */}
       {submitted && (
        <div className="w-full p-[20px] sm:p-[70px]">
         <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-4">
           <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#1ABF70] text-white ring-[#1ABF70]">
            <svg
             width="120"
             height="20"
             viewBox="0 0 20 20"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
             <path
              d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
             />
            </svg>
           </span>{" "}
           <h4 className="text-2xl font-bold text-[#545563]">
            Thanks for your request!
           </h4>
          </div>
          <p className="text-xl font-semibold text-[#545563]">
           We’ve received your details and will send your custom quote to{" "}
           {sendTo === "other"
            ? otherEmail || "[email address]"
            : "[email address] "}
           shortly.
          </p>

          <div className="mt-2 flex items-center gap-3">
           <button
            className="px-4 py-3 bg-white leading-[18x] text-sm font-bold text-[#054A86] border border-[#054A86] rounded-md hover:text-white hover:bg-[#0A3B79]"
            onClick={() => navigate("/")}>
            DOSTA Home
           </button>
           <Button
            className="px-4 py-3 text-sm h-[44px] font-bold leading-5 text-white bg-[#0A3B79] hover:bg-[#092f61]"
            style={{ boxShadow: "0px 8px 20px 0px #4E60FF29" }}
            onClick={() => {
             setSubmitted(false);
             setSendTo("registered");
             setOtherEmail("");
            }}>
            Start Another Event
           </Button>
          </div>
         </div>
        </div>
       )}
       {/* ===================== /SUCCESS SECTION ===================== */}
      </div>
     </div>
    </div>
   </main>

   <Footer />
  </div>
 );
};

export default RequestCustomQuote;
