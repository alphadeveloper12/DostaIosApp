import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import Shrimmer from "../ui/Shrimmer";
import LazyLoad from "../ui/LazyLoad";

export default function AccountSettings() {
 const [profile, setProfile] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [updating, setUpdating] = useState(false);
 const [checkedNotifications, setCheckedNotifications] = useState<string[]>([]);
 const navigate = useNavigate();

 // ✅ Base API URL
 const baseUrl = import.meta.env.VITE_API_URL;

 // ✅ Get Auth Token (checks both storages)
 const getAuthToken = () =>
  sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

 // ✅ Fetch profile data on mount
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
    setCheckedNotifications(data.email_notifications || []);
   } catch (error) {
    console.error("Error fetching profile:", error);
   } finally {
    setLoading(false);
   }
  };

  fetchProfile();
 }, [navigate, baseUrl]);

 // ✅ Handle updates
 const handleSave = async () => {
  const token = getAuthToken();
  if (!token) return;

  setUpdating(true);
  try {
   const response = await fetch(`${baseUrl}/api/profile/`, {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
     Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
     full_name: profile.full_name,
     company: profile.company,
     email_notifications: checkedNotifications,
    }),
   });

   if (!response.ok) throw new Error("Update failed");
   const updatedData = await response.json();
   setProfile(updatedData);
   alert("Profile updated successfully!");
  } catch (error) {
   console.error(error);
   alert("Failed to update profile.");
  } finally {
   setUpdating(false);
  }
 };

 // ✅ Handle logout
 const handleLogout = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  navigate("/signin");
 };

 if (loading) return <Shrimmer></Shrimmer>;

 return (
  <LazyLoad>
   <div className="md:space-y-2 space-y-6 ">
    <h1 className="text-[20px] leading-[28px] font-[600] tracking-[0.1px] text-neutral-black">
     Account
    </h1>
    <div className="border border-[#EDEEF2] px-4 pt-6  md:p-0 rounded-[16px]">
     {/* Personal Information Section */}
     <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm">
      <h2 className="text-lg md:font-semibold md:mb-6 mb-4 font-[700] text-foreground">
       Personal information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {/* Full Name */}
       <div className="md:space-y-2 space-y-1">
        <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem]">
         Full name
        </label>
        <input
         type="text"
         placeholder={profile.full_name || "Full name"}
         value={profile.full_name || ""}
         onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
         className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-neutral-gray-light rounded-[0.5rem]"
        />
       </div>

       {/* Company */}
       <div className="md:space-y-2 space-y-1">
        <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem]">
         Company
        </label>
        <input
         type="text"
         placeholder="Company name"
         value={profile.company || ""}
         onChange={(e) => setProfile({ ...profile, company: e.target.value })}
         className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem]"
        />
       </div>

       {/* Email (readonly) */}
       <div className="md:space-y-2 space-y-1">
        <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem]">
         Email
        </label>
        <input
         type="email"
         readOnly
         value={profile.user_email || ""}
         className="w-full py-[0.625rem] px-[0.75rem] bg-[#F8F8FA] cursor-not-allowed border border-[#C7C8D2] rounded-[0.5rem]"
        />
       </div>

       {/* Phone (readonly) */}
       <div className="md:space-y-2 space-y-1">
        <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem]">
         Phone number
        </label>
        <input
         type="text"
         readOnly
         value={profile.phone_number || ""}
         className="w-full py-[0.625rem] px-[0.75rem] bg-[#F8F8FA] cursor-not-allowed border border-[#C7C8D2] rounded-[0.5rem]"
        />
       </div>
      </div>
     </section>

     {/* Email Notifications Section */}
     <section className="bg-neutral-white pt-[68px] sm:p-8 shadow-sm">
      <h2 className="text-lg font-semibold md:mb-6 mb-4 text-foreground">
       Email notifications
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">
       {[
        "New deals",
        "Password changes",
        "New restaurants",
        "Special offers",
        "Order statuses",
        "Newsletter",
       ].map((label, i) => {
        const id = label.toLowerCase().replace(/\s+/g, "_");
        const isChecked = checkedNotifications.includes(label);

        return (
         <div key={i} className="flex items-center space-x-3 ">
          <Checkbox
           id={id}
           checked={isChecked}
           onCheckedChange={(checked) => {
            setCheckedNotifications((prev) =>
             checked ? [...prev, label] : prev.filter((item) => item !== label)
            );
           }}
          />
          <label
           htmlFor={id}
           className="text-sm font-medium text-foreground leading-none cursor-pointer">
           {label}
          </label>
         </div>
        );
       })}
      </div>
     </section>

     {/* Footer Buttons */}
     <div className="flex flex-col sm:flex-row gap-4 justify-between items-center py-5 px-4">
      <Button
       onClick={handleLogout}
       className="w-full text-[#FF5C60] sm:w-auto bg-transparent border border-[#FF5C60] hover:bg-transparent hover:text-[#FF5C60] hover:border-[#FF5C60] focus:outline-none">
       Log out
      </Button>

      <div className="flex  gap-3 w-full sm:w-auto">
       <Button
        variant="outline"
        className="w-full sm:w-auto border border-neutral-gray-lightest"
        onClick={() => window.location.reload()}>
        Discard changes
       </Button>
       <Button
        disabled={updating}
        onClick={handleSave}
        className="w-full sm:w-auto bg-primary hover:bg-primary/90">
        {updating ? "Saving..." : "Save changes"}
       </Button>
      </div>
     </div>
    </div>
   </div>
  </LazyLoad>
 );
}
