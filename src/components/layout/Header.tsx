import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const [isLoggedIn, setIsLoggedIn] = useState(false);

 const navigate = useNavigate();

 // ✅ Check login state on mount + when token changes
 useEffect(() => {
  const checkAuth = () => {
   const token =
    localStorage.getItem("authToken") || (sessionStorage.getItem("authToken") || localStorage.getItem("authToken"));
   setIsLoggedIn(!!token);
  };
  checkAuth();
  window.addEventListener("storage", checkAuth);
  return () => window.removeEventListener("storage", checkAuth);
 }, []);

 const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
 const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

 const handleLoginClick = () => navigate("/signin");

 const handleLogout = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  localStorage.removeItem("orderProgress");
  localStorage.removeItem("selectedLocation"); // Clear selected location
  setIsLoggedIn(false);
  navigate("/signin");
 };

 return (
  <header className="bg-primary-dark sticky top-0 z-50">
   <div className="main-container">
    <div className="flex items-center justify-between h-16">
     {/* Logo + Links */}
     <div className="flex items-center gap-[40px]">
      <Link to="/" className="flex-shrink-0">
       <img
        src="/images/nav/logo.svg"
        alt="logo"
        className="h-[24px] w-[135px] sm:h-[24px] sm:w-[141px]"
       />
      </Link>

      <div className="hidden lg:flex items-center text-neutral-gray-lightest gap-[24px]">
       <Link to="/services" className="text-[16px] font-[700]">
        Services
       </Link>
       {/* <Link to="/portfolio" className="text-[16px] font-[700]">
        Portfolio
       </Link> */}
       <Link to="/about-us" className="text-[16px] font-[700]">
        About us
       </Link>
       <Link
        to="/catering/request-custom-quote"
        className="text-[16px] font-[700]">
        Request a quote
       </Link>
      </div>
     </div>

     {/* Right side (Desktop) */}
     <div className="hidden md:flex items-center gap-4 lg:gap-6 relative">
      <select
       defaultValue={document.cookie.includes("googtrans=/en/ar") ? "ar" : "en"}
       onChange={(e) => {
        const lang = e.target.value;
        if (lang === "en") {
         document.cookie =
          "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        } else {
         document.cookie = `googtrans=/en/${lang}; path=/`;
        }
        window.location.reload();
       }}
       className="text-[16px] font-[700] bg-transparent text-neutral-white  cursor-pointer outline-none">
       <option value="en" className="text-black cursor-pointer">
        En
       </option>
       <option value="ar" className="text-black cursor-pointer">
        {" "}
        Ar
       </option>
      </select>

      <span className="h-[32px] w-[1px] bg-neutral-gray-light"></span>

      {/* ✅ Auth Menu */}
      {isLoggedIn ? (
       <button
        onClick={toggleDropdown}
        className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] bg-neutral-gray rounded-[24px] flex items-center justify-center">
        <img src="/images/nav/user_profile.svg" alt="user" />
       </button>
      ) : (
       <button
        onClick={handleLoginClick}
        className="text-[16px] font-[700] text-neutral-white">
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
     {/* user icon */}
     <div className="flex gap-4 items-center md:hidden">
      <div>
       {isLoggedIn ? (
        <button
         onClick={toggleDropdown}
         className="w-[48px] h-[48px] lg:w-[48px] lg:h-[48px] bg-neutral-gray rounded-[24px] flex items-center justify-center">
         <img src="/images/nav/user_profile.svg" alt="user" className="" />
        </button>
       ) : (
        <button
         onClick={handleLoginClick}
         className="text-[16px] font-[700] text-neutral-white">
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
      <div className="h-8 w-[1px] md:hidden bg-neutral-white"></div>
      {/* search icon */}
      <button
       onClick={toggleMobileMenu}
       className="md:hidden text-neutral-white">
       {isMobileMenuOpen ? (
        <X size={24} />
       ) : (
        <img src="/images/nav/searchbox.svg" alt="user" />
       )}
      </button>
     </div>
    </div>

    {isMobileMenuOpen && (
     <div className="fixed inset-0 bg-neutral-white z-50 md:hidden flex flex-col justify-start p-5">
      {/* Header */}
      <div className=" h-full ">
       <div className="flex justify-between items-center mb-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
         <img
          src="/images/nav/dosta_blue.svg"
          alt="Dosta"
          className="h-6 w-auto"
         />
        </div>

        {/* Close Button (Dummy Icon) */}
        <button onClick={() => setIsMobileMenuOpen(false)}>
         <img
          src="/images/nav/crossbox.svg"
          alt="close"
          className="h-8 w-8 bg-gray-100 rounded-xl "
         />
        </button>
       </div>

       {/* Menu Items */}
       <div className="flex flex-col items-center justify-center flex-grow gap-6 pt-[68px]">
        <Link
         to="/vending-home/my-orders"
         className="text-[24px] leading-[32px] font-[700] tracking-[0.1px] text-neutral-black">
         My Orders
        </Link>

        <Link
         to="/settings"
         className="text-[24px] leading-[32px] font-[700] tracking-[0.1px] text-neutral-black">
         Account Settings
        </Link>

        <button
         onClick={() => {
          const isArabic = document.cookie.includes("googtrans=/en/ar");
          if (isArabic) {
           document.cookie =
            "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } else {
           document.cookie = "googtrans=/en/ar; path=/";
          }
          window.location.reload();
         }}
         className="text-[24px] leading-[32px] font-[700] tracking-[0.1px] text-neutral-black">
         {document.cookie.includes("googtrans=/en/ar") ? "English" : "العربية"}
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
