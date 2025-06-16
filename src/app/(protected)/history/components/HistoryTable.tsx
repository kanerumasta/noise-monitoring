import { TNoiseRecordWithNode } from "@/schemas/node_schemas";
import React from "react";
import { formatDuration, getNoiseLevelStyle } from "../helpers";
import { format } from "date-fns";
import { getTierLevel } from "@/lib/helpers";

interface HistoryTableProps {
  data: TNoiseRecordWithNode[];
  isLoading: boolean;
}

// Helper function to format the noise type display
const formatNoiseType = (type: string): string => {
  switch (type) {
    case "shortburst":
      return "Short Burst";
    case "sustained":
      return "Sustained";
    default:
      return type;
  }
};

export const HistoryTable = ({ data, isLoading }: HistoryTableProps) => {
  if (isLoading) return <div>Loading....</div>;
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-[#103A5E]">
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Node ID
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Node Name
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Coordinates
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Average Noise (dB)
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Time Recorded
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Noise Alert Level
          </th>

          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Duration
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Type
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((record) => (
          <tr key={record.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 uppercase whitespace-nowrap text-sm font-medium text-gray-900">
              {record.node.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {record.node.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {record.node.coords.latitude.toFixed(6)},{" "}
              {record.node.coords.longitude.toFixed(6)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {Math.ceil(record.soundLevel)} dB
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {record.timestamp &&
                format(record.timestamp.toDate(), "MMM dd, yyyy hh:mm:ss a")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getNoiseLevelStyle(getTierLevel(record.soundLevel)).bg
                } ${getNoiseLevelStyle(getTierLevel(record.soundLevel)).text}`}
              >
                {getTierLevel(record.soundLevel)}
              </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDuration(record.duration / 1000)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatNoiseType(record.type)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;
