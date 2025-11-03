import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import ForgetPassword from "./ForgetPassword";
import { Button } from "../ui/button";

const SignInForm = ({ onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showForgetForm, setForgetForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;

        // ✅ Use consistent key for token
        if (keepLoggedIn) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }

        // ✅ Redirect to home page after successful login
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.data) {
        setErrorMsg(
          error.response.data.detail ||
            error.response.data.message ||
            "Invalid email or password."
        );
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const SignInFormComponent = () => (
    <div className="md:w-[45%] w-[100%] bg-white px-4 sm:px-10 md:px-12 lg:px-14 pt-20 flex flex-col">
      <div className="w-full max-w-sm mx-auto">
        <Link to={"/"}>
          <img
            src="/images/nav/logo.svg"
            alt="Logo"
            className="mb-[50px] h-[24px]"
          />
        </Link>

        <h1 className="text-[60px] font-bold tracking-tight text-[#2B2B43]">
          Sign in
        </h1>
        <p className="mt-3 text-base font-normal text-[#545563]">
          Sign in with your data that you entered during your registration.
        </p>

        {/* Email */}
        <div className="space-y-1 mt-7">
          <label htmlFor="email" className="text-xs font-semibold text-[#545563]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-lg border h-11 border-[#C7C8D2] px-3 py-2 text-sm shadow-sm focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mt-6 space-y-1">
          <label htmlFor="password" className="text-xs font-semibold text-[#545563]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min. 8 characters"
              className="w-full rounded-lg border h-11 border-[#C7C8D2] px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Keep logged in */}
        <label className="mt-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="h-5 w-5 accent-[#0A3B79] cursor-pointer"
          />
          <span className="text-[#2B2B43] text-base font-normal">
            Keep me logged in
          </span>
        </label>

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-3 text-sm text-red-600 font-medium">{errorMsg}</div>
        )}

        {/* Login Button */}
        <Button
          variant="default"
          onClick={handleLogin}
          disabled={loading}
          className="mt-5 w-full h-11 font-bold"
          style={{ boxShadow: "0px 8px 20px 0px #4E60FF29" }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Forgot Password */}
        <div className="mt-6 text-center">
          <button
            className="text-sm font-bold text-[#054A86] hover:underline"
            onClick={() => setForgetForm(true)}
          >
            Forgot password
          </button>
        </div>
      </div>

      <div className="mt-[70px] font-bold text-sm text-[#545563] text-center">
        Don’t have an account?{" "}
        <button
          className="underline font-bold text-[#056AC1]"
          onClick={() => navigate("/signup")}
        >
          Create an account
        </button>
      </div>

      {onBack && (
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-sm text-slate-600 hover:text-slate-800 underline"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );

  return !showForgetForm ? (
    <SignInFormComponent />
  ) : (
    <ForgetPassword onBack={() => setForgetForm(false)} />
  );
};

export default SignInForm;
