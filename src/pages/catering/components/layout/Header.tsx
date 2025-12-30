import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalCartItems } from "@/redux/slices/cartSlice";

const Header = () => {
 const totalCartItems = useSelector(selectTotalCartItems);
 console.log("total cart items ; ", totalCartItems);

 const path = useLocation();
 const [profile, setProfile] = useState<any>(null);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [isLoggedIn, setIsLoggedIn] = useState(false); // Add login state
 const navigate = useNavigate(); // Initialize navigate function
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const slug = "/" + path.pathname.split("/")[1]; // → "/vending-home"
 // ✅ Base API URL
 const baseUrl = import.meta.env.VITE_API_URL;

 // ✅ Get Auth Token (checks both storages)
 const getAuthToken = () =>
  sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
 useEffect(() => {
  const token = getAuthToken();
  if (!token) {
   navigate("/signin");
   return;
  }

  const fetchProfile = async () => {
   try {
    const response = await fetch(`${baseUrl}/api/profile/`, {
     headers: {
      Authorization: `Token ${token}`,
     },
    });

    if (!response.ok) throw new Error("Failed to fetch profile");
    const data = await response.json();
    setProfile(data);
   } catch (error) {
    console.error("Error fetching profile:", error);
   } finally {
   }
  };

  fetchProfile();
 }, [navigate, baseUrl]);

 {
  /* authentication user login or not  */
 }
 useEffect(() => {
  const checkAuth = () => {
   const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
   setIsLoggedIn(!!token);
  };
  checkAuth();
  window.addEventListener("storage", checkAuth);
  return () => window.removeEventListener("storage", checkAuth);
 }, []);
 {
  /* handle logout  */
 }
 const handleLogout = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  setIsLoggedIn(false);
  navigate("/signin");
 };
 const toggleMobileMenu = () => {
  setIsMobileMenuOpen(!isMobileMenuOpen);
 };
 const handleLoginClick = () => {
  navigate("/signin"); // Navigate to /signin when login is clicked
 };
 const capitalizeName = (name: string | null | undefined) => {
  if (!name || typeof name !== "string") return "";
  return name.split(" ").map(
   (part) => part.charAt(0).toUpperCase() // Capitalize the first letter and make the rest lowercase
  );
 };

 return (
  <header className="bg-neutral-white border-b border-neutral-gray-lightest sticky top-0 z-50">
   <div className="main-container mx-auto ">
    <div className="flex items-center justify-between h-16">
     {/* Logo */}
     <Link to="/" className="flex-shrink-0">
      {path.pathname === "/settings" ? (
       <img
        src={"/images/nav/dosta_blue.svg"}
        alt="logo"
        className="md:h-[24px] md:w-[135px] h-[24px] w-[110px]"
       />
      ) : (
       <img
        src={
         slug === "/vending-home"
          ? "/images/nav/vending_logo.svg"
          : "/images/nav/catering_logo.svg"
        }
        alt="logo"
        className="h-[20px] w-[180px] sm:h-[24px] sm:w-[241px]"
       />
      )}
     </Link>

     {/* Desktop Navigation */}
     <div className="hidden md:flex items-center gap-4 lg:gap-6 relative">
      {/* Language Selector */}
      <select className="text-[14px] lg:text-[16px] leading-[24px] tracking-[0.1px] font-[700] select-none outline-none text-neutral-black cursor-pointer hover:text-primary transition-colors bg-transparent">
       <option value="">En</option>
       <option value="">Ar</option>
       <option value="">Cn</option>
      </select>

      <span className="h-[32px] bg-[#EDEEF2] w-[1px]"></span>

      {/* Login Button or User Icon */}
      {isLoggedIn ? (
       <div className="flex items-center gap-2">
        <div className="flex items-center gap-4">
         <Link
          to="/vending-home/my-orders"
          className="text-neutral-black font-bold">
          My Order
         </Link>
         <Link
          to="/vending-home/cart"
          className="w-[40px] h-[40px] relative lg:w-[48px] lg:h-[48px]   rounded-[12px] lg:rounded-[16px] text-white flex items-center justify-center text-[12px] lg:text-[14px] font-[600] flex-shrink-0">
          <img
           src="/images/icons/inbox.svg"
           className="bg-neutral-gray-lightest p-3 rounded-xl w-12 h-12"
           alt="inbox"
          />
          {totalCartItems > 0 && (
           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalCartItems}
           </span>
          )}
         </Link>
        </div>
        <span className="p-[0.7px] border-neutral-gray-lightest border-2 rounded-[12px] lg:rounded-[16px]">
         <button
          className="w-[40px] h-[40px] relative lg:w-[48px] lg:h-[48px] bg-primary  rounded-[12px] lg:rounded-[16px] text-white flex items-center justify-center text-[12px] lg:text-[14px] font-[600] flex-shrink-0"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {profile ? (
           capitalizeName(profile.full_name)
          ) : (
           <img src="/images/nav/user.svg" alt="user" />
          )}
         </button>
        </span>
       </div>
      ) : (
       <button
        onClick={handleLoginClick} // Trigger navigation on click
        className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-gray-dark">
        Login
       </button>
      )}
      {isDropdownOpen && isLoggedIn && (
       <div className="absolute top-16 right-0 w-[256px] bg-white rounded-[16px] shadow-lg py-[10px]">
        <div className="hover:bg-primary-light py-[8px] px-[16px] rounded-t-[4px]">
         <Link to="/vending-home/my-orders">My Orders</Link>
        </div>
        <div className="hover:bg-primary-light py-[8px] px-[16px]">
         <Link to="/settings">Account Settings</Link>
        </div>
        <div
         onClick={handleLogout}
         className="hover:bg-primary-light py-[8px] px-[16px] rounded-b-[4px] cursor-pointer">
         Logout
        </div>
       </div>
      )}
     </div>

     {/* Mobile Menu Button */}
     {/* Notification Icon */}
     <div className="max-md:flex md:hidden max-md:items-center gap-4">
      <div className="relative md:hidden">
       <img
        src="/images/icons/inbox.svg"
        className="bg-neutral-gray-lightest p-3 rounded-xl w-12 h-12"
        alt="inbox"
       />
       {totalCartItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
         {totalCartItems}
        </span>
       )}
      </div>
      <span className="h-8 md:hidden w-[1px] bg-neutral-gray-lightest"></span>
      <button
       onClick={toggleMobileMenu}
       className="md:hidden py-2 text-neutral-black hover:text-primary transition-colors"
       aria-label="Toggle menu">
       {isMobileMenuOpen ? (
        <X size={24} />
       ) : (
        <img
         src={
          slug === "/settings"
           ? "/images/icons/hambg.svg"
           : "/images/nav/searchbox.svg"
         }
         alt="search icon"
        />
       )}
      </button>
     </div>
    </div>

    {/* Mobile Navigation Menu */}
    {isMobileMenuOpen && (
     <div className="fixed inset-0 bg-neutral-white z-50 md:hidden flex flex-col justify-start py-[18px] px-[15px]">
      {/* Header */}
      <div className=" h-full ">
       <div className="flex justify-between items-center mb-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
         <img
          src={
           slug === "/vending-home"
            ? "/images/icons/dosta_home_b.svg"
            : "/images/nav/dosta_blue.svg"
          }
          alt="Dosta"
          className="h-6 w-auto"
         />
         <span className="h-8 w-[1px] bg-[#054A86]"></span>
         <span className="text-[#054A86] text-[24px]"> VENDING</span>
        </div>

        {/* Close Button (Dummy Icon) */}
        <button onClick={() => setIsMobileMenuOpen(false)}>
         <img
          src="/images/nav/crossbox.svg"
          alt="close"
          className="h-11 w-11 bg-gray-100 rounded-xl "
         />
        </button>
       </div>

       {/* Menu Items */}
       <div className="flex flex-col items-center justify-center flex-grow gap-6 pt-[68px]">
        <Link
         to="/orders"
         className="text-[24px] leading-[32px] font-[700] tracking-[0.1px] text-neutral-black">
         My Orders
        </Link>

        <Link
         to="/account"
         className="text-[24px] leading-[32px] font-[700] tracking-[0.1px] text-neutral-black">
         Account Settings
        </Link>

        <button className="text-[24px] leading-[32px] font-[700] tracking-[0.1px] text-neutral-black">
         العربية
        </button>

        <button
         onClick={isLoggedIn ? handleLogout : handleLoginClick}
         className={`text-[24px] leading-[32px] font-[700] tracking-[0.1px] text-neutral-black
         }`}>
         {isLoggedIn ? "Logout" : "Login"}
        </button>
       </div>
      </div>

      {/* Bottom Search Bar */}
      <div className="w-full  ">
       <div className="border-t border-gray-200 mb-4"></div>

       <div className="flex items-center gap-2">
        <div className="flex items-center bg-neutral-gray-lightest rounded-xl px-4 py-3 flex-grow">
         <input
          type="text"
          placeholder="Search"
          className="bg-neutral-gray-lightest w-full text-[14px] outline-none"
         />
         <img src="/images/icons/search.svg" className="w-4 h-4" alt="search" />
        </div>

        {/* Notification Icon */}
        <div className="relative">
         <img
          src="/images/icons/inbox.svg"
          className="bg-neutral-gray-lightest p-3 rounded-xl w-10 h-10"
          alt="inbox"
         />
         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          4
         </span>
        </div>
       </div>
      </div>
     </div>
    )}
   </div>
  </header>
 );
};

export default Header;
