import React, { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RightBar = () => {
  const steps = [1, 2, 3];
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Flags and error states
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Password validation
  const validatePassword = () => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Email validation
  const validateEmail = (val: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

  // Previous step
  const handlePrevious = () => {
    setApiError("");
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Send OTP
  const sendOtpRequest = async () => {
    setApiError("");
    try {
      setLoading(true);
      await axios.post(`${baseURL}/api/send-otp/`, { phoneNumber });
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to send OTP.";
      setApiError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle direct signup (no 2FA)
  const handleSignup = async () => {
    setApiError("");
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/api/signup/`, {
        email,
        password,
        phone_number: phoneNumber,
        two_factor_enabled: false,
      });

      // ✅ Save token and authenticate user
      sessionStorage.setItem("authToken", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (error: any) {
      console.error("Signup failed details:", error);
      let errorMsg = "Signup failed. Please try again.";

      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") errorMsg = data;
        else if (data.email) errorMsg = Array.isArray(data.email) ? data.email[0] : data.email;
        else if (data.phone_number) errorMsg = Array.isArray(data.phone_number) ? data.phone_number[0] : data.phone_number;
        else if (data.message) errorMsg = data.message;
        else if (data.error) errorMsg = data.error;
        else if (data.detail) errorMsg = data.detail;
      }

      setApiError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP + signup (2FA)
  const handleOtpVerificationAndSignup = async () => {
    setApiError("");
    try {
      setLoading(true);

      // Step 1: verify OTP
      const verifyRes = await axios.post(`${baseURL}/api/verify-otp/`, {
        email,
        otp,
      });

      if (verifyRes.status === 200) {
        // Step 2: complete signup
        const res = await axios.post(`${baseURL}/api/signup/`, {
          email,
          password,
          phone_number: phoneNumber,
          two_factor_enabled: true,
        });

        // ✅ Save token and authenticate user
        sessionStorage.setItem("authToken", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/");
      } else {
        setApiError("Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("OTP/Signup failed details:", error);
      let errorMsg = "Verification failed. Please try again.";

      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") errorMsg = data;
        else if (data.otp) errorMsg = Array.isArray(data.otp) ? data.otp[0] : data.otp;
        else if (data.message) errorMsg = data.message;
        else if (data.error) errorMsg = data.error;
        else if (data.detail) errorMsg = data.detail;
      }

      setApiError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Go to next step handler
  const handleNext = async () => {
    setApiError("");

    try {
      if (currentStep === 1) {
        setEmailError("");
        setPasswordError("");

        if (!validateEmail(email)) {
          setEmailError("Please enter a valid email address.");
          return;
        }

        if (password !== confirmPassword) {
          setPasswordError("Passwords do not match.");
          return;
        }

        if (!validatePassword()) {
          setPasswordError(
            "Password must be at least 8 characters, include one uppercase letter, one special character, and one number."
          );
          return;
        }

        setCurrentStep(2);
        return;
      }

      if (currentStep === 2) {
        setPhoneError("");

        if (!phoneNumber.trim()) {
          setPhoneError("Phone number is required.");
          return;
        }

        if (is2FAEnabled) {
          await sendOtpRequest();
          setIsOtpSent(true);
          setCurrentStep(3);
        } else {
          await handleSignup();
        }

        return;
      }

      if (currentStep === 3) {
        await handleOtpVerificationAndSignup();
        return;
      }
    } catch (error) {
      // apiError already set inside specific handlers
      console.error("Error in flow:", error);
    }
  };

  // Step rendering
  const RenderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h1 className="text-[2.5rem] md:font-[700] font-[800] pb-2">
              Personal details
            </h1>
            <p className="text-neutral-gray-dark pb-4">
              Enter your data that you will use for entering.
            </p>

            {/* Email */}
            <div className="flex flex-col pb-7">
              <label className="text-[12px] text-neutral-gray-dark leading-[16px] font-[600] mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                  if (apiError) setApiError("");
                }}
                className={`w-full max-w-[21.875rem] py-[10px] px-3 border ${emailError ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col pb-7">
              <label className="text-[12px] text-neutral-gray-dark leading-[16px] font-[600] mb-1">
                Password
              </label>
              <div className="relative w-full max-w-[21.875rem]">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="min. 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                    if (apiError) setApiError("");
                  }}
                  className="w-full py-[10px] px-3 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col pb-7">
              <label className="text-[12px] text-neutral-gray-dark leading-[16px] font-[600] mb-1">
                Confirm Password
              </label>
              <div className="relative w-full max-w-[21.875rem]">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="min. 8 characters"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                    if (apiError) setApiError("");
                  }}
                  className="w-full py-[10px] px-3 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h1 className="text-[2.5rem] md:font-[700] font-[800] pb-3">
              Additional info
            </h1>
            <p className="text-neutral-gray-dark pb-7">
              Enter your data that you will use for entering.
            </p>

            {/* Phone number */}
            <div className="flex flex-col pb-7">
              <label className="text-[12px] leading-[16px] text-neutral-gray-dark font-[600] mb-1">
                Phone number
              </label>
              <input
                type="text"
                placeholder="+971 050 123 4567"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (phoneError) setPhoneError("");
                  if (apiError) setApiError("");
                }}
                className={`w-full max-w-[21.875rem] py-[10px] px-3 border ${phoneError ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            {/* 2FA */}
            <div className="flex items-center gap-3 pb-7">
              <input
                type="checkbox"
                checked={is2FAEnabled}
                onChange={() => setIs2FAEnabled(!is2FAEnabled)}
                className="h-[1.25rem] w-[1.25rem]"
              />
              <span>Turn on 2-factor authentication</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h1 className="text-[2.5rem] md:font-[700] font-[800] pb-3">
              Confirmation
            </h1>
            <p className="text-neutral-gray-dark pb-2">
              Enter your security code that we sent to your phone
            </p>

            <div className="flex flex-col pb-4">
              <label className="text-[12px] leading-[16px] text-neutral-gray-dark font-[600] mb-1">
                Confirmation code
              </label>
              <input
                type="text"
                placeholder="XXX - XXX - XXX"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (apiError) setApiError("");
                }}
                className="w-full max-w-[21.875rem] py-2 px-3 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center gap-3 pb-4">
              <input type="checkbox" className="h-[1.25rem] w-[1.25rem]" />
              <span>Remember this device</span>
            </div>

            {!isOtpSent && (
              <p className="text-xs text-gray-500">
                Didn’t receive a code? Go back and resend OTP.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="bg-white w-full lg:w-[57.64%] h-screen overflow-y-auto">
      <div className="min-h-full px-[15px] lg:pl-[7.8125rem] pt-6 pb-8 flex md:items-center items-start justify-center lg:justify-start">
        <div className="flex flex-col justify-between w-full max-w-[25rem] lg:min-h-full py-4">
          <Link to={"/"}>
            <img
              src="/images/nav/dosta_blue.svg"
              height={28}
              width={158}
              className="pb-[44px] md:hidden"
              alt="Dosta"
            />
          </Link>

          {/* Progress Steps */}
          <div className="w-full flex items-start max-md:justify-between md:gap-3 mb-8 relative">
            {steps.map((step, index) => {
              const isCompleted = step < currentStep;
              const isActive = step === currentStep;

              return (
                <div key={step} className="flex flex-col items-start relative">
                  {/* Top Row: Circle + Connector */}
                  <div className="flex items-center">
                    {/* Circle */}
                    <div
                      className={`w-3 h-3 rounded-full flex items-center justify-center
                        ${isCompleted
                          ? "bg-green-500"
                          : isActive
                            ? "bg-[#054A86]"
                            : "bg-gray-300"
                        }`}
                    >
                      {isCompleted && <Check size={10} color="#fff" />}
                    </div>

                    {/* Connector */}
                    {index < steps.length - 1 && (
                      <div
                        className={`w-[5rem] md:w-[7rem] h-[2px] ml-3 ${isCompleted ? "bg-green-500" : "bg-gray-300"
                          }`}
                      />
                    )}
                  </div>

                  {/* Label Below */}
                  <span
                    className={`mt-3 text-[16px] font-[700] leading-[24px] tracking-[0.1px]
                      ${isActive
                        ? "text-[#054A86]"
                        : isCompleted
                          ? "text-black"
                          : "text-gray-500"
                      }`}
                  >
                    {index === 0 ? (
                      <>
                        Personal <br /> Details
                      </>
                    ) : index === 1 ? (
                      <>
                        Additional <br /> Info
                      </>
                    ) : (
                      <>Confirmation</>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="flex-grow flex flex-col justify-center">
            {RenderStep()}

            <div className="flex flex-col gap-3 mt-6">
              <button
                className="w-full bg-[#054A86] text-white py-3 rounded-md font-[700] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Processing..." : currentStep === 3 ? "Verify & Continue" : "Continue"}
              </button>

              <button
                className={`w-full border ${currentStep === 1
                  ? "opacity-20 cursor-not-allowed"
                  : "border-gray-300"
                  } py-2 rounded-md font-[700] text-gray-700`}
                onClick={handlePrevious}
                disabled={currentStep === 1 || loading}
              >
                Back
              </button>

              {/* Global API Error Message Display (below Continue button) */}
              {apiError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm text-center">
                  {apiError}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to={"/signin"} className="text-[#056AC1] underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightBar;
