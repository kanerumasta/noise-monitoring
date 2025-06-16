import { ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
import React, { Dispatch, Fragment, SetStateAction } from "react";

interface SortOptionsProps {
  sortField: "timestamp" | "soundLevel" | "duration" | "nodes";
  setSortField: Dispatch<
    SetStateAction<"timestamp" | "soundLevel" | "duration" | "nodes">
  >;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
}

const SortOptions = ({
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: SortOptionsProps) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(
      e.target.value as "timestamp" | "soundLevel" | "duration" | "nodes"
    );
  };

  return (
    <Fragment>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort By
        </label>
        <select
          id="sort"
          value={sortField}
          onChange={handleSortChange}
          className="px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          <option value="timestamp" className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            Date & Time
          </option>
          <option value="nodes" className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            Nodes
          </option>
          <option value="soundLevel" className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5" />
            Sound Level
          </option>
          <option value="duration" className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5" />
            Duration
          </option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </Fragment>
  );
};

export default SortOptions;
