import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { lazy, Suspense, useEffect } from "react";
import { fetchCartData } from "./redux/slices/cartSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";

import AuthMiddleware from "./middleware/AuthMiddleware";
import GuestMiddleware from "./middleware/GuestMiddleware";
import ScrollToTop from "./components/home/ScrollToTop";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const SignIn = lazy(() => import("./pages/SignIn"));
const VendingHome = lazy(() => import("./pages/VendingHome"));
const CateringHome = lazy(() => import("./pages/catering/pages/Index"));
const CateringPlan = lazy(() => import("./pages/catering/pages/Catering"));
const CateringConfirmation = lazy(() => import("./pages/catering/pages/CateringConfirmation"));
const RequestCustomQuote = lazy(() => import("./pages/catering/pages/RequestCustomQuote"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Signup = lazy(() => import("./pages/Signup"));
const Settings = lazy(() => import("./pages/Settings"));
const VendingMenu = lazy(() => import("./pages/VendingMenu"));
const OrderNow = lazy(() => import("./components/vending_home/OrderNow"));
const CartPage = lazy(() => import("./pages/CartPage"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const ReportBug = lazy(() => import("./pages/ReportBug"));
const Faqs = lazy(() => import("./pages/Faqs"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const TradeLicenses = lazy(() => import("./pages/TradeLicenses"));

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID =
    "760692328304-hiu23pr6oq24ptkq3iiqqcm8k8rn639i.apps.googleusercontent.com";

// Loading Fallback
const PageLoader = () => (
    <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#054A86] border-t-transparent"></div>
    </div>
);

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

                    <Suspense fallback={<PageLoader />}>
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
                    </Suspense>

                    <GlobalCartSync />
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    </GoogleOAuthProvider>
);

export default App;
