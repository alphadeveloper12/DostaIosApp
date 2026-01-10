import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import VendingHome from "./pages/VendingHome";
import CateringHome from "./pages/catering/pages/Index";
import CateringPlan from "./pages/catering/pages/Catering";
import CateringConfirmation from "./pages/catering/pages/CateringConfirmation";
import RequestCustomQuote from "./pages/catering/pages/RequestCustomQuote";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import VendingMenu from "./pages/VendingMenu";
import OrderNow from "./components/vending_home/OrderNow";
import CartPage from "./pages/CartPage";
import MyOrders from "./pages/MyOrders";

import AuthMiddleware from "./middleware/AuthMiddleware";
import GuestMiddleware from "./middleware/GuestMiddleware";

import ScrollToTop from "./components/home/ScrollToTop";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import CookiesPolicy from "./pages/CookiesPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Terms from "./pages/Terms";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import HowItWorks from "./pages/HowItWorks";
import HelpCenter from "./pages/HelpCenter";
import ReportBug from "./pages/ReportBug";
import Faqs from "./pages/Faqs";
import ComingSoon from "./pages/ComingSoon";
import TradeLicenses from "./pages/TradeLicenses";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCartData } from "./redux/slices/cartSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID =
 "760692328304-hiu23pr6oq24ptkq3iiqqcm8k8rn639i.apps.googleusercontent.com";

// Helper component to sync cart globally from API
const GlobalCartSync = () => {
 const dispatch = useDispatch();

 useEffect(() => {
  // Fetch latest cart state from API on mount
  // @ts-ignore
  dispatch(fetchCartData());
 }, [dispatch]);

 return null;
};

const App = () => (
 <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  <QueryClientProvider client={queryClient}>
   <TooltipProvider>
    <Toaster />
    <Sonner />

    <BrowserRouter>
     <ScrollToTop />

     <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/vending-home" element={<VendingHome />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/cookies-policy" element={<CookiesPolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/report-bug" element={<ReportBug />} />
      <Route path="/faqs" element={<Faqs />} />
      <Route path="/trade-licenses" element={<TradeLicenses />} />

      {/* Vending */}
      <Route path="/vending-home/menu" element={<VendingMenu />} />
      <Route path="/vending-home/order-now" element={<OrderNow />} />
      <Route path="/vending-home/cart" element={<CartPage />} />
      <Route element={<AuthMiddleware />}>
       <Route path="/vending-home/my-orders" element={<MyOrders />} />
      </Route>

      {/* Catering */}
      <Route path="/catering" element={<CateringHome />} />
      <Route path="/catering/plan" element={<CateringPlan />} />
      <Route path="/catering/confirmation" element={<CateringConfirmation />} />
      <Route
       path="/catering/request-custom-quote"
       element={<RequestCustomQuote />}
      />

      {/* Guest Routes */}
      <Route element={<GuestMiddleware />}>
       <Route path="/signin" element={<SignIn />} />
       <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<AuthMiddleware />}>
       <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
     </Routes>

     <GlobalCartSync />
    </BrowserRouter>
   </TooltipProvider>
  </QueryClientProvider>
 </GoogleOAuthProvider>
);

export default App;
