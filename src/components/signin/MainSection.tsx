import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Slider from "./Slider";
import SignInForm from "./SigninForm";
// ---------- Small inline icons ----------
const AppleIcon = (props) => (
 <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
  <path
   d="M16.365 12.89c-.03-3.01 2.463-4.45 2.576-4.521-1.403-2.051-3.586-2.332-4.35-2.366-1.85-.189-3.604 1.091-4.544 1.091-.954 0-2.396-1.067-3.95-1.037-2.032.03-3.905 1.184-4.949 3.008-2.103 3.641-.536 9.009 1.511 11.962 1 1.446 2.19 3.07 3.748 3.01 1.52-.06 2.093-.974 3.936-.974 1.827 0 2.37.974 3.963.944 1.64-.03 2.681-1.476 3.686-2.929 1.168-1.667 1.65-3.29 1.674-3.375-.036-.017-3.214-1.233-3.25-4.713zM13.6 3.844c.834-1.01 1.394-2.42 1.24-3.844-1.2.048-2.646.8-3.503 1.81-.772.892-1.44 2.324-1.262 3.694 1.334.103 2.69-.67 3.525-1.66z"
   fill="currentColor"
  />
 </svg>
);

const GoogleIcon = (props) => (
 <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <path
   d="M3.02388 16.4312L6.38721 13.8593C6.1949 13.2751 6.09091 12.6503 6.09091 12.0003C6.09091 11.3503 6.1949 10.7254 6.38721 10.1413L3.02388 7.56934C2.36791 8.90299 2 10.4066 2 12.0003C2 13.594 2.36791 15.0976 3.02388 16.4312Z"
   fill="#FBBC05"
  />
  <path
   d="M6.38677 10.141C7.16276 7.78407 9.37681 6.09091 11.9996 6.09091C13.4086 6.09091 14.6814 6.59091 15.6814 7.40909L18.5905 4.5C16.8177 2.95455 14.545 2 11.9996 2C8.04779 2 4.65001 4.2621 3.02344 7.56906L6.38677 10.141Z"
   fill="#EA4335"
  />
  <path
   d="M11.9999 21.9999C8.04707 21.9999 4.6485 19.7366 3.02246 16.4281L6.38442 13.8506C7.15795 16.2119 9.37411 17.909 11.9999 17.909C13.2848 17.909 14.4233 17.6064 15.3249 17.0374L18.5179 19.5094C16.77 21.1346 14.439 21.9999 11.9999 21.9999Z"
   fill="#34A853"
  />
  <path
   d="M12 10.1816H21.3182C21.4545 10.7725 21.5455 11.4089 21.5455 11.9998C21.5455 15.2591 20.3531 17.803 18.5179 19.5093L15.325 17.0373C16.369 16.3785 17.0953 15.3624 17.3636 14.0453H12V10.1816Z"
   fill="#4285F4"
  />
 </svg>
);

const EmailIcon = (props) => (
 <svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <path
   d="M3.33366 3.33301H16.667C17.5837 3.33301 18.3337 4.08301 18.3337 4.99967V14.9997C18.3337 15.9163 17.5837 16.6663 16.667 16.6663H3.33366C2.41699 16.6663 1.66699 15.9163 1.66699 14.9997V4.99967C1.66699 4.08301 2.41699 3.33301 3.33366 3.33301Z"
   stroke="#2B2B43"
   stroke-width="1.5"
   stroke-linecap="round"
   stroke-linejoin="round"
  />
  <path
   d="M18.3337 5L10.0003 10.8333L1.66699 5"
   stroke="#2B2B43"
   stroke-width="1.5"
   stroke-linecap="round"
   stroke-linejoin="round"
  />
 </svg>
);

// ---------- Left column (auth panel) ----------
const MainSection = () => {
 const [showEmailForm, setShowEmailForm] = useState(false);

 const AuthPanel = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleContinue = () => {
   if (window.innerWidth > 768) {
    // Desktop → existing behavior
    navigate("/dashboard");
    return;
   }

   // Mobile logic only
   if (!selectedMethod) return;
   if (selectedMethod === "email") setShowEmailForm(true);
   else navigate(`/signin/${selectedMethod}`);
  };

  return (
   <div className="md:w-[45%] w-full h-screen max-h-[100vh] bg-white px-[15px] sm:px-10 md:px-12 lg:px-14 pt-6 pb-3 flex flex-col overflow-y-auto scrollbar-hide">
    <div className="max-w-sm w-full mx-auto flex flex-col h-full md:justify-start justify-between pb-[32px]">
     <div>
      <Link to={"/"}>
       <img src="/images/nav/dosta_blue.svg" alt="dosta" />
      </Link>

      <h1 className="text-[60px] font-[700] leading-[82px] text-[#2B2B43] pt-[68px]">
       Sign in
      </h1>

      <p className="mt-4 text-base font-[400] text-[#545563]">
       By clicking Sign in with email, Google, or Apple, you agree to Dosta’s{" "}
       <a className="underline font-bold text-[#056AC1]" href="#">
        Terms of Use
       </a>{" "}
       and{" "}
       <a className="underline text-[#056AC1] font-bold" href="#">
        Privacy Policy
       </a>
       .
      </p>

      <div className="pt-8 space-y-5">
       {/* Email */}
       <Button
        variant="whitebg"
        size="xlg"
        className={`w-full justify-start gap-3 max-md:px-[16px] md:py-5 ${
         selectedMethod === "email"
          ? "border border-blue-400 "
          : "border border-neutral-gray-lightest"
        }`}
        onClick={() =>
         window.innerWidth <= 768
          ? setSelectedMethod("email")
          : setShowEmailForm(true)
        }>
        <EmailIcon />
        <span>Sign in with email</span>
       </Button>

       {/* Apple */}
       <Button
        variant="whitebg"
        size="xlg"
        className={`w-full justify-start gap-3 max-md:px-[16px] md:py-5 ${
         window.innerWidth <= 768 && selectedMethod === "apple"
          ? "border border-blue-400"
          : "border border-neutral-gray-lightest"
        }`}
        onClick={() =>
         window.innerWidth <= 768
          ? setSelectedMethod("apple")
          : navigate("/signin/apple")
        }>
        <AppleIcon className="text-slate-900" />
        <span>Continue with Apple</span>
       </Button>

       {/* Google */}
       <Button
        variant="whitebg"
        size="xlg"
        className={`w-full justify-start gap-3 max-md:px-[16px] md:py-5 ${
         window.innerWidth <= 768 && selectedMethod === "google"
          ? "border border-blue-400"
          : "border border-neutral-gray-lightest"
        }`}
        onClick={() =>
         window.innerWidth <= 768
          ? setSelectedMethod("google")
          : navigate("/signin/google")
        }>
        <GoogleIcon />
        <span>Continue with Google</span>
       </Button>
      </div>

      {/* Continue button */}
      <Button
       variant="default"
       className="mt-5 w-full h-11 font-bold"
       style={{ boxShadow: "0px 8px 20px 0px #4E60FF29" }}
       onClick={handleContinue}>
       Continue
      </Button>
     </div>

     {/* 👇 Mobile only fixed bottom text */}
     <div className="font-bold text-sm text-[#545563] text-center pt-[20px]">
      Don’t have an account?{" "}
      <button
       className="underline font-bold text-[#056AC1]"
       onClick={() => navigate("/signup")}>
       Create an account
      </button>
     </div>
    </div>
   </div>
  );
 };
 // ---------- Main section wrapper ----------
 return (
  <section className="w-full mx-auto px-0 md:px-4 lg:px-0 mx-w-[1110px] height-[100vh]">
   <div className="overflow-hidden bg-white">
    <div className="flex  lg:flex-row">
     {!showEmailForm ? (
      <AuthPanel />
     ) : (
      <SignInForm onBack={() => setShowEmailForm(false)} />
     )}
     <Slider />
    </div>
   </div>
  </section>
 );
};

export default MainSection;
