import { useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface DateSelectionProps {
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  isTodaySelected: boolean;
  setIsTodaySelected: React.Dispatch<React.SetStateAction<boolean>>;
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const DateSelection = ({
  selectedDate,
  setSelectedDate,
  isTodaySelected,
  setIsTodaySelected,
  showDatePicker,
  setShowDatePicker,
}: DateSelectionProps) => {
  const handleTodayClick = () => {
    setIsTodaySelected(!isTodaySelected);
    if (isTodaySelected) {
      setSelectedDate(new Date()); // Select today's date
    } else {
      setSelectedDate(null); // Deselect the date (reset)
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTodaySelected(false); // Disable "Today" selection if custom date is chosen
    setSelectedDate(new Date(e.target.value)); // Set the selected custom date
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Today Button */}
      <button
        onClick={handleTodayClick}
        className={`px-4 py-2 text-sm font-medium rounded-lg border ${
          isTodaySelected
            ? "bg-[#103A5E] text-white border-[#103A5E]"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
      >
        Today
      </button>

      {/* Custom Date Button */}
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <CalendarIcon className="h-5 w-5" />
        Custom Date
      </button>

      {/* Custom Date Picker */}
      {showDatePicker && (
        <div className="absolute mt-12 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <input
            type="date"
            value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
            min={format(subDays(new Date(), 6), "yyyy-MM-dd")}
            max={format(new Date(), "yyyy-MM-dd")}
            onChange={handleCustomDateChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default DateSelection;
