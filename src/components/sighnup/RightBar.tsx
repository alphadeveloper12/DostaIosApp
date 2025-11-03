import { Check } from "lucide-react";
import React, { useState } from "react";
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

  // Flags and error states
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const baseURL = "http://127.0.0.1:8000";
  console.log("API Base URL:", baseURL);
  const navigate = useNavigate();

  // Password validation
  const validatePassword = () => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Go to next step handler
  const handleNext = async () => {
    try {
      if (currentStep === 1) {
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
        setPasswordError("");
        setCurrentStep(2);
      } else if (currentStep === 2) {
        if (is2FAEnabled) {
          // Send OTP
          await sendOtpRequest();
          setIsOtpSent(true);
          setCurrentStep(3);
        } else {
          // Direct signup (no OTP)
          await handleSignup();
        }
      } else if (currentStep === 3) {
        await handleOtpVerificationAndSignup();
      }
    } catch (error) {
      console.error("Error in flow:", error);
    }
  };

  // Previous step
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Send OTP
  const sendOtpRequest = async () => {
    try {
      setLoading(true);
      await axios.post(`${baseURL}/api/send-otp/`, { phoneNumber });
      setLoading(false);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setLoading(false);
    }
  };

  // Handle direct signup (no 2FA)
  // Handle direct signup (no 2FA)
  const handleSignup = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/api/signup/`, {
        email,
        password,
        phone_number: phoneNumber,
        two_factor_enabled: false,
      });

      // ✅ Save token and authenticate user
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setLoading(false);
      navigate("/"); // redirect to home
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error);
      setLoading(false);
    }
  };

  // Verify OTP + signup (2FA)
  const handleOtpVerificationAndSignup = async () => {
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
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/"); // redirect home
      } else {
        console.error("OTP verification failed:", verifyRes.data);
      }

      setLoading(false);
    } catch (error) {
      console.error(
        "OTP verification or signup failed:",
        error.response?.data || error
      );
      setLoading(false);
    }
  };

  // Step rendering
  const RenderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h1 className="text-[2.5rem] font-[700] pb-2">Personal details</h1>
            <p className="text-neutral-gray-dark pb-4">
              Enter your data that you will use for entering.
            </p>
            {/* Email */}
            <div className="flex flex-col pb-4">
              <label className="text-sm font-[600] mb-2">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full max-w-[21.875rem] py-2 px-3 border border-gray-300 rounded-md"
              />
            </div>
            {/* Password */}
            <div className="flex flex-col pb-4">
              <label className="text-sm font-[600] mb-2">Password</label>
              <input
                type="password"
                placeholder="min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full max-w-[21.875rem] py-2 px-3 border border-gray-300 rounded-md"
              />
            </div>
            {/* Confirm password */}
            <div className="flex flex-col pb-4">
              <label className="text-sm font-[600] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="min. 8 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full max-w-[21.875rem] py-2 px-3 border border-gray-300 rounded-md"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h1 className="text-[2.5rem] font-[700] pb-2">Additional info</h1>
            <p className="text-neutral-gray-dark pb-4">
              Enter your additional information
            </p>

            {/* Phone number */}
            <div className="flex flex-col pb-4">
              <label className="text-sm font-[600] mb-2">Phone number</label>
              <input
                type="text"
                placeholder="(217) 555-0113"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full max-w-[21.875rem] py-2 px-3 border border-gray-300 rounded-md"
              />
            </div>

            {/* 2FA */}
            <div className="flex items-center gap-3 pb-4">
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
            <h1 className="text-[2.5rem] font-[700] pb-2">Confirmation</h1>
            <p className="text-neutral-gray-dark pb-4">
              Enter your security code that we sent to your phone
            </p>

            <div className="flex flex-col pb-4">
              <label className="text-sm font-[600] mb-2">
                Confirmation code
              </label>
              <input
                type="text"
                placeholder="XXX - XXX - XXX"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full max-w-[21.875rem] py-2 px-3 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center gap-3 pb-4">
              <input type="checkbox" className="h-[1.25rem] w-[1.25rem]" />
              <span>Remember this device</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="bg-white w-full lg:w-[57.64%] h-screen overflow-y-auto">
      <div className="min-h-full px-6 lg:pl-[7.8125rem] pt-10 pb-8 flex items-center justify-center lg:justify-start">
        <div className="flex flex-col justify-between w-full max-w-[25rem] lg:min-h-full py-4">
          {/* Progress steps */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            {steps.map((step, index) => {
              const isCompleted = step < currentStep;
              const isActive = step === currentStep;
              return (
                <div
                  key={step}
                  className="flex items-center justify-center gap-[0.75rem]"
                >
                  <div
                    className={`w-[0.75rem] h-[0.75rem] rounded-full flex items-center justify-center
                      ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                          ? "bg-[#054A86]"
                          : "bg-gray-300"
                      }`}
                  >
                    {isCompleted && <Check size={12} color="#fff" />}
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`h-[0.0625rem] w-[6rem] ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="flex-grow flex flex-col justify-center">
            {RenderStep()}
            <div className="flex flex-col gap-3 mt-6">
              <button
                className="w-full bg-[#054A86] text-white py-2 rounded-md font-[700]"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Processing..." : "Continue"}
              </button>

              <button
                className="w-full border border-gray-300 py-2 rounded-md font-[700] text-gray-700"
                onClick={handlePrevious}
              >
                Back
              </button>
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
