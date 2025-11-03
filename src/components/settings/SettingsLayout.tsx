import { useEffect, useState } from "react";
import { User, MapPin, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/pages/catering/components/layout/Header";
import AccountSettings from "@/components/settings/AccountSettings";
import AddressSettings from "@/components/settings/AddressSettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import { useNavigate } from "react-router-dom";

interface NavItem {
  icon: typeof User;
  label: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    icon: User,
    label: "Account",
    description: "Personal information",
  },
  {
    icon: MapPin,
    label: "Address",
    description: "Shipping addresses",
  },
  {
    icon: CreditCard,
    label: "Payment method",
    description: "Connected credit cards",
  },
  {
    icon: Shield,
    label: "Security",
    description: "Password, 2FA",
  },
];

export default function SettingsLayout() {
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();

  // ✅ Check authentication on mount
  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      navigate("/signin");
    }
  }, [navigate]);

  // ✅ Tab switch logic
  const renderContent = () => {
    switch (tab) {
      case 1:
        return <AccountSettings />;
      case 2:
        return <AddressSettings />;
      case 3:
        return <PaymentSettings />;
      case 4:
        return <SecuritySettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-white">
      <Header />

      <div className="main-container !py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            <h2 className="text-[20px] leading-[28px] font-[600] text-neutral-black pb-[8px]">
              Settings
            </h2>

            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = tab === index + 1;
                return (
                  <button
                    key={index}
                    onClick={() => setTab(index + 1)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-[16px] transition-all text-left",
                      isActive
                        ? "bg-accent text-accent-foreground shadow-sm border border-[#054A86]"
                        : "border border-[#EDEEF2]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0",
                        isActive ? "bg-[#054A86]" : "bg-[#EDEEF2]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          isActive
                            ? "text-neutral-white"
                            : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div
                        className={cn(
                          "text-xs",
                          isActive
                            ? "text-accent-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 settings">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}
