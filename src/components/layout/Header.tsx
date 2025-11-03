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
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
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
              <Link to="/" className="text-[16px] font-[700]">Services</Link>
              <Link to="/" className="text-[16px] font-[700]">Portfolio</Link>
              <Link to="/" className="text-[16px] font-[700]">About us</Link>
              <Link to="/" className="text-[16px] font-[700]">Request a quote</Link>
            </div>
          </div>

          {/* Right side (Desktop) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 relative">
            <select className="text-[16px] font-[700] bg-transparent text-neutral-white cursor-pointer outline-none">
              <option value="en">En</option>
              <option value="ar">Ar</option>
              <option value="cn">Cn</option>
            </select>

            <span className="h-[32px] w-[1px] bg-neutral-gray-light"></span>

            {/* ✅ Auth Menu */}
            {isLoggedIn ? (
              <button
                onClick={toggleDropdown}
                className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] bg-neutral-gray rounded-[12px] flex items-center justify-center"
              >
                <img src="/images/nav/user.svg" alt="user" />
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="text-[16px] font-[700] text-neutral-white"
              >
                Login
              </button>
            )}

            {isDropdownOpen && isLoggedIn && (
              <div className="absolute top-16 right-0 w-[256px] bg-white rounded-[16px] shadow-lg py-[10px]">
                <div className="hover:bg-primary-light py-[8px] px-[16px] rounded-t-[4px]">
                  <Link to="/orders">My Orders</Link>
                </div>
                <div className="hover:bg-primary-light py-[8px] px-[16px]">
                  <Link to="/settings">Account Settings</Link>
                </div>
                <div
                  onClick={handleLogout}
                  className="hover:bg-primary-light py-[8px] px-[16px] rounded-b-[4px] cursor-pointer"
                >
                  Logout
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-neutral-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-gray-lightest py-4">
            <nav className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[14px] font-[600] text-neutral-white">Language</span>
                <select className="text-[14px] font-[700] bg-transparent text-neutral-white border border-neutral-gray-lightest rounded px-2 py-1">
                  <option value="en">En</option>
                  <option value="ar">Ar</option>
                  <option value="cn">Cn</option>
                </select>
              </div>

              <div className="h-[1px] bg-[#EDEEF2]" />

              <div className="flex flex-col items-start text-neutral-gray-lightest gap-[24px] px-2">
                <Link to="/" className="text-[16px] font-[700]">Services</Link>
                <Link to="/" className="text-[16px] font-[700]">Portfolio</Link>
                <Link to="/" className="text-[16px] font-[700]">About us</Link>
                <Link to="/" className="text-[16px] font-[700]">Request a quote</Link>
              </div>

              <div className="h-[1px] bg-[#EDEEF2]" />

              <div className="flex justify-between items-center px-2">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="text-[14px] font-[700] text-red-600"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="text-[14px] font-[700] text-neutral-white"
                  >
                    Login
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
