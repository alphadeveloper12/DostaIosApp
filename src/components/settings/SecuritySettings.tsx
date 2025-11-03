import { Button } from "@/components/ui/button";

export default function SecuritySettings() {
  return (
    <div className="space-y-2">
      <h1 className="text-[20px] leading-[28px] font-[600] tracking-[0.1px] text-neutral-black">
        Security
      </h1>

      <div className="border border-[#EDEEF2] p-2 md:p-0 rounded-[16px]">
        {/* 2-Factor Authentication */}
        <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-foreground">
            2-factor authentication
          </h2>

          <div className="flex flex-col md:items-center md:flex-row md:justify-between gap-4">
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]"
              >
                Phone number
              </label>
              <input
                id="phone"
                type="number"
                placeholder="(123) 456-7891"
                className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
              />
            </div>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 md:mt-[30px]">
              Turn on
            </Button>
          </div>
        </section>

        {/* Change Password */}
        <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-foreground">
            Change password
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]"
              >
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]"
              >
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="gap-4 py-5 px-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-end sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto" disabled>
              Add new payment method
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
