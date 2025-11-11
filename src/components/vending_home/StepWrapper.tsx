import React from "react";
import { Check } from "lucide-react";
import { Button } from "../ui/button"; // Adjust path as needed

type StepStatus = "completed" | "active" | "pending";

interface StepWrapperProps {
  id: number;
  title: string;
  subtitle?: string;
  activeStep: number;
  maxCompleted: number;
  onEdit: () => void;
  children?: React.ReactNode;
  // Add props for the "Save Plan" button if needed
  // showSavePlan?: boolean;
  // onSavePlan?: () => void;
}

export const StepWrapper: React.FC<StepWrapperProps> = ({
  id,
  title,
  subtitle,
  activeStep,
  maxCompleted,
  onEdit,
  children,
}) => {
  const getStatus = (): StepStatus => {
    if (id === activeStep) return "active";
    if (id <= maxCompleted) return "completed";
    return "pending";
  };

  const status = getStatus();

  // If the step is pending, don't render it at all
  if (status === "pending") {
    return null;
  }

  return (
    <div
      className={`w-full border rounded-[16px] transition-all ${
        status === "active"
          ? "border-[#EDEEF2] bg-white shadow-lg"
          : "border-[#EDEEF2] bg-white"
      }`}
    >
      <div className="py-[20px] md:px-[24px] px-3">
        <div className="flex flex-row justify-between max-md:gap-4">
          <div className="flex gap-4">
            <div
              className={`md:h-[32px] h-[26px] w-[26px] md:w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-all ${
                status === "completed"
                  ? "bg-[#10B981] text-white"
                  : "bg-[#054A86] text-white"
                // No pending status, as we return null
              }`}
            >
              {status === "completed" ? <Check className="w-4 h-4" /> : id}
            </div>
            <div className="flex-1">
              <h2
                className={`text-[18px] leading-[24px] md:text-[24px] md:leading-[32px] font-[700] tracking-[0.1px] text-[#545563]`}
              >
                {title}
              </h2>
              {subtitle && status === "completed" && (
                <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
                  {subtitle}
                </h4>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 gap-1">
            {/* You can add the Save Plan button logic here if needed */}
            {/* {showSavePlan && ( ... )} */}

            {status === "completed" && (
              <Button
                onClick={onEdit}
                className="border md:text-[14px] py-[6px]! px-3! text-[12px] leading-[18px] hover:bg-[#054A86] hover:text-white md:leading-[20px] font-[700] tracking-[0.3px] border-[#545563] rounded-[8px] bg-transparent text-[#545563] md:mt-0"
              >
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Step Content */}
        {status === "active" && children && (
          <div className="mt-4 pl-0">{children}</div>
        )}
      </div>
    </div>
  );
};