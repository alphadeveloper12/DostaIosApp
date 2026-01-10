import {
 Facebook,
 Instagram,
 Youtube,
 Linkedin,
 MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
 const footerSections = [
  {
   title: "Our Company",
   links: [
    { label: "About us", to: "/about-us" },
    { label: "Contact us", to: "/contact-us" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Cookies Policy", to: "/cookies-policy" },
    { label: "Refund Policy", to: "/refund-policy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Catering", to: "/catering" },
    { label: "Trade Licenses", to: "/trade-licenses" },
   ],
  },
  {
   title: "Help Center",
   links: [
    { label: "How it works", to: "/how-it-works" },
    { label: "Help center", to: "/help-center" },
    { label: "FAQ", to: "/faqs" },
    { label: "Report a bug", to: "/report-bug" },
   ],
  },
 ];

 const appBadges = [
  {
   src: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
   alt: "Download on App Store",
  },
  {
   src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
   alt: "Get it on Google Play",
  },
 ];

 const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Youtube, href: "#" },
  { icon: Linkedin, href: "#" },
 ];

 return (
  <footer className="bg-primary-dark text-white relative">
   <div className="px-4 sm:px-8 md:px-[165px] mx-auto py-12 max-w-[1440px]">
    {/* Top Footer */}
    <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-6 mb-8">
     {/* Left 2 sections grouped */}
     <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {footerSections.map((section, idx) => (
       <div key={idx}>
        <h3 className="font-semibold mb-4">{section.title}</h3>
        <ul className="space-y-2">
         {section.links.map((link, i) => (
          <li key={i}>
           <Link
            to={link.to}
            className="text-sm text-gray-400 hover:text-white transition-colors">
            {link.label}
           </Link>
          </li>
         ))}
        </ul>
       </div>
      ))}
     </div>

     {/* Mobile App Section (right side) */}
     <div className="md:col-span-2">
      <h3 className="font-semibold mb-4">Download our app</h3>
      <p className="text-sm text-gray-400 mb-4">
       Manage your deliveries from anywhere, anytime.
      </p>
      <div className="flex flex-col sm:flex-row justify-start gap-2">
       {appBadges.map((badge, idx) => (
        <img
         key={idx}
         src={badge.src}
         alt={badge.alt}
         className="h-10 w-auto"
        />
       ))}
      </div>
     </div>
    </div>

    {/* Bottom Footer */}
    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
     <p className="text-sm text-gray-400 flex flex-col sm:flex-row gap-2 sm:gap-[24px] text-center sm:text-left">
      <span className="text-gray-300">© DOSTA 2025</span>{" "}
      <span className="">العربية | English (US)</span>
     </p>

     {/* Social Icons */}
     <div className="flex items-center gap-4 w-full sm:w-auto justify-center md:justify-start md:w-[300px]">
      {socialLinks.map((social, idx) => (
       <a
        key={idx}
        href={social.href}
        className="text-gray-400 hover:text-white transition-colors">
        <social.icon className="w-5 h-5" />
       </a>
      ))}
     </div>

     {/* Chat Button */}
     <button className="absolute bottom-0 md:right-[165px] right-[16px] h-[44px] w-[88px] rounded-t-[8px]  bg-[#EE3123]  flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-20 gap-[8px]">
      <MessageCircle className="h-[16px] w-[16px] text-white" />
      <span>Chat</span>
     </button>
    </div>
   </div>
  </footer>
 );
};

export default Footer;
