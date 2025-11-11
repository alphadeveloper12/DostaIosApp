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

const queryClient = new QueryClient();

const App = () => (
 <QueryClientProvider client={queryClient}>
  <TooltipProvider>
   <Toaster />
   <Sonner />
   <BrowserRouter>
    <Routes>
     {/* Public Routes */}
     <Route path="/" element={<Index />} />
     <Route path="/vending-home" element={<VendingHome />} />
     <Route path="/vending-home/menu" element={<VendingMenu />} />
     <Route path="/vending-home/order-now" element={<OrderNow />} />
     <Route path="/vending-home/cart" element={<CartPage />} />
     <Route element={<AuthMiddleware />}>
      <Route path="/vending-home/my-orders" element={<MyOrders />} />
     </Route>
     <Route path="/catering" element={<CateringHome />} />
     <Route path="/catering/plan" element={<CateringPlan />} />
     <Route path="/catering/confirmation" element={<CateringConfirmation />} />
     <Route
      path="/catering/request-custom-quote"
      element={<RequestCustomQuote />}
     />

     {/* Guest Routes (Only for unauthenticated users) */}
     <Route element={<GuestMiddleware />}>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
     </Route>

     {/* Protected Routes (Only for authenticated users) */}
     <Route element={<AuthMiddleware />}>
      <Route path="/settings" element={<Settings />} />
     </Route>

     {/* Fallback Route */}
     <Route path="*" element={<NotFound />} />
    </Routes>
   </BrowserRouter>
  </TooltipProvider>
 </QueryClientProvider>
);

export default App;
