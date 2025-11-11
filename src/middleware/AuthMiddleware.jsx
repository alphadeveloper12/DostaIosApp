import { Navigate, Outlet } from "react-router-dom";

const GuestMiddleware = () => {
  const authToken =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  // ✅ if token exists → redirect to home
  if (!authToken) {
    return <Navigate to="/signup" replace />;
  }

  // ✅ otherwise allow visiting guest routes
  return <Outlet />;
};

export default GuestMiddleware;
