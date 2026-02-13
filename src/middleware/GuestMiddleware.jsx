import { Navigate, Outlet } from "react-router-dom";

const GuestMiddleware = () => {
  const authToken =
    localStorage.getItem("authToken") || (sessionStorage.getItem("authToken") || localStorage.getItem("authToken"));

  // ✅ if token exists → redirect to home
  if (authToken) {
    return <Navigate to="/" replace />;
  }

  // ✅ otherwise allow visiting guest routes
  return <Outlet />;
};

export default GuestMiddleware;
