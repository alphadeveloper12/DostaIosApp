import React from "react";
import { Link, useLocation } from "react-router-dom";

const MobileFooterNav = () => {
 const location = useLocation();

 const navItems = [
  {
   href: "/",
   icon: "/images/icons/dosta_home.svg",
   label: "Dosta Home",
  },
  {
   href: "/services",
   icon: "/images/icons/services.svg",
   label: "Services",
  },
  {
   href: "/vending-home/my-orders",
   icon: "/images/icons/orders.svg",
   label: "My Orders",
  },
  {
   href: "/settings",
   icon: "/images/icons/settings.svg",
   label: "Settings",
  },
 ];

 return (
  <nav className="h-[82px] flex justify-between pt-[5px] bg-primary-dark w-full fixed px-4 md:hidden bottom-[-1px] z-40 text-white">
   {navItems.map((item) => {
    const isActive = location.pathname === item.href;

    return (
     <Link
      key={item.href}
      to={item.href}
      className="flex flex-col items-center justify-center gap-1 w-full relative">
      <img
       src={item.icon}
       alt={item.label}
       className="w-6 h-6 object-contain"
      />
      <span
       className={`text-[10px] ${
        isActive ? " border-b-2 " : ""
       } leading-[14px] font-bold relative`}>
       {item.label}
      </span>
     </Link>
    );
   })}
  </nav>
 );
};

export default MobileFooterNav;
