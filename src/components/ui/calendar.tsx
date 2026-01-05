import React, { useState } from "react";
import {
 ChevronLeft,
 ChevronRight,
 ChevronUp,
 ChevronDown,
 X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DateTimePicker = ({ isOpen, onClose, onConfirm }) => {
 const [selectedDate, setSelectedDate] = useState(null);
 const [currentMonth, setCurrentMonth] = useState(new Date());
 const [hour, setHour] = useState(8);
 const [minute, setMinute] = useState(0);

 const [period, setPeriod] = useState("PM");

 const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
 ];

 const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

 const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
   days.push({
    day: prevMonthLastDay - i,
    isCurrentMonth: false,
    date: new Date(year, month - 1, prevMonthLastDay - i),
   });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
   days.push({
    day: i,
    isCurrentMonth: true,
    date: new Date(year, month, i),
   });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
   days.push({
    day: i,
    isCurrentMonth: false,
    date: new Date(year, month + 1, i),
   });
  }

  return days;
 };

 const handlePrevMonth = () => {
  setCurrentMonth(
   new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
  );
 };

 const handleNextMonth = () => {
  setCurrentMonth(
   new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
  );
 };

 const handleDateClick = (date) => {
  setSelectedDate(date);
 };

 const isSameDay = (date1, date2) => {
  return (
   date1.getDate() === date2.getDate() &&
   date1.getMonth() === date2.getMonth() &&
   date1.getFullYear() === date2.getFullYear()
  );
 };

 const incrementHour = () => {
  setHour((prev) => (prev === 12 ? 1 : prev + 1));
 };

 const decrementHour = () => {
  setHour((prev) => (prev === 1 ? 12 : prev - 1));
 };

 const incrementMinute = () => {
  setMinute((prev) => (prev === 59 ? 0 : prev + 1));
 };

 const decrementMinute = () => {
  setMinute((prev) => (prev === 0 ? 59 : prev - 1));
 };

 const togglePeriod = () => {
  setPeriod((prev) => (prev === "AM" ? "PM" : "AM"));
 };

 const handleConfirm = () => {
  const finalDate = new Date(selectedDate);
  let finalHour = hour;
  if (period === "PM" && hour !== 12) finalHour += 12;
  if (period === "AM" && hour === 12) finalHour = 0;

  finalDate.setHours(finalHour, minute, 0, 0);

  // Format the date as requested: 08, November, 2025 - 08:00 PM
  const day = finalDate.getDate().toString().padStart(2, "0");
  const monthName = monthNames[finalDate.getMonth()];
  const year = finalDate.getFullYear();
  const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
   .toString()
   .padStart(2, "0")} ${period}`;
  const formattedDateTime = `${day}, ${monthName}, ${year} - ${formattedTime}`;

  console.log("Selected Date & Time:", finalDate);
  onConfirm(formattedDateTime, finalDate);
  onClose();
 };

 if (!isOpen) return null;

 const days = getDaysInMonth(currentMonth);

 return (
  <div
   className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-end h-full"
   style={{ zIndex: 1000 }}>
   {/* Main White Panel */}
   <div
    className="bg-white shadow-xl w-full max-w-md h-full rounded-none overflow-y-auto"
    style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e0 transparent" }} // optional for better scrollbar look
   >
    {/* Header */}
    <div
     className="flex items-center justify-between"
     style={{ margin: "16px 32px" }}>
     <h2 className="text-lg font-semibold text-gray-800">
      Select Date and Time
     </h2>
     <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      <X size={20} />
     </button>
    </div>

    {/* Calendar */}
    <div>
     <div
      style={{
       borderRadius: "12px",
       boxShadow: "0px 0px 20px 4px #BFBFBF40",
       padding: "36px 38px",
       margin: "32px",
      }}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
       <button
        onClick={handlePrevMonth}
        className="p-1 hover:bg-gray-100 rounded">
        <ChevronLeft size={20} />
       </button>
       <span className="font-medium text-gray-700">
        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
       </span>
       <button
        onClick={handleNextMonth}
        className="p-1 hover:bg-gray-100 rounded">
        <ChevronRight size={20} />
       </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
       {daysOfWeek.map((day, i) => (
        <div key={i} className="text-center text-sm font-medium text-gray-500">
         {day}
        </div>
       ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
       {days.map((dayObj, i) => (
        <button
         key={i}
         onClick={() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize to start of day
          const isPast = dayObj.date < today;
          if (dayObj.isCurrentMonth && !isPast) {
           handleDateClick(dayObj.date);
          }
         }}
         disabled={
          !dayObj.isCurrentMonth ||
          (() => {
           const today = new Date();
           today.setHours(0, 0, 0, 0);
           return dayObj.date < today;
          })()
         }
         className={`
                aspect-square flex items-center justify-center rounded-full text-sm
                ${
                 !dayObj.isCurrentMonth ||
                 (() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return dayObj.date < today;
                 })()
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 cursor-pointer hover:bg-gray-100"
                }
                ${
                 selectedDate &&
                 isSameDay(dayObj.date, selectedDate) &&
                 dayObj.isCurrentMonth
                  ? "bg-[#054A86] text-white font-semibold hover:bg-[#054A86]"
                  : ""
                }
              `}>
         {dayObj.day}
        </button>
       ))}
      </div>
     </div>

     {/* Time Picker */}
     <div
      style={{
       borderRadius: "12px",
       boxShadow: "0px 0px 20px 4px #BFBFBF40",
       padding: "25px 0",
       margin: "32px",
      }}>
      <div className="flex items-center justify-center gap-4">
       {/* Hour */}
       <div className="flex flex-col items-center">
        <button
         onClick={incrementHour}
         className="p-1 hover:bg-gray-100 rounded">
         <ChevronUp size={20} />
        </button>
        <div className="text-2xl font-semibold w-12 text-center">
         {hour.toString().padStart(2, "0")}
        </div>
        <button
         onClick={decrementHour}
         className="p-1 hover:bg-gray-100 rounded">
         <ChevronDown size={20} />
        </button>
       </div>

       <span className="text-2xl font-semibold">:</span>

       {/* Minute */}
       <div className="flex flex-col items-center">
        <button
         onClick={incrementMinute}
         className="p-1 hover:bg-gray-100 rounded">
         <ChevronUp size={20} />
        </button>
        <div className="text-2xl font-semibold w-12 text-center">
         {minute.toString().padStart(2, "0")}
        </div>
        <button
         onClick={decrementMinute}
         className="p-1 hover:bg-gray-100 rounded">
         <ChevronDown size={20} />
        </button>
       </div>

       {/* AM/PM */}
       <div className="flex flex-col items-center">
        <button
         onClick={togglePeriod}
         className="p-1 hover:bg-gray-100 rounded">
         <ChevronUp size={20} />
        </button>
        <div className="text-2xl font-semibold w-12 text-center">{period}</div>
        <button
         onClick={togglePeriod}
         className="p-1 hover:bg-gray-100 rounded">
         <ChevronDown size={20} />
        </button>
       </div>
      </div>
     </div>
    </div>

    {/* Footer Buttons */}
    <div
     className="flex gap-3 bg-white sticky bottom-0"
     style={{
      boxShadow: "",
      padding: "32px",
     }}>
     <Button
      onClick={handleConfirm}
      disabled={!selectedDate}
      className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
       selectedDate
        ? "bg-[#054A86] text-white hover:bg-[#054A86]/70"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}>
      Confirm
     </Button>
     <Button
      onClick={onClose}
      className="flex-1 bg-white text-[#054A86] font-[14px] py-3 rounded-lg font-medium border border-[#054A86] hover:bg-gray-50 transition-colors">
      Close
     </Button>
    </div>
   </div>
  </div>
 );
};

export default DateTimePicker;
