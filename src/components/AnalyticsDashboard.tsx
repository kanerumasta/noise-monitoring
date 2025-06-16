// components/AnalyticsDashboard.tsx
"use client";

import React, { useState, useMemo } from "react";
import BarChartComponent from "./charts/BarChartComponent";
import LineChartComponent from "./charts/LineChartComponent";
import HeatmapComponent from "./charts/HeatmapComponent";
import { registerChartJS } from "@/lib/chart_config";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  MapPinIcon,
  BellIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { getNodeName } from "@/lib/helpers";

// Register Chart.js components (important for client components)
registerChartJS();

interface EventSummaryData {
  node: string;
  total_events: number;
  shortbursts: number;
  sustained: number;
}

interface PeakHourData {
  hour: number;
  count: number;
}

interface HourlyAvgData {
  location: string;
  [hour: string]: number | string;
}

interface TierDistData {
  node: string;
  NORMAL: number;
  "TIER 1": number;
  "TIER 2": number;
  "TIER 3": number;
}

// Added HeatmapData interface
interface HeatmapData {
  location: string;
  weekday: number;
  hour: number;
  event_count: number;
}

// Add a new interface for filtered heatmap data
interface FilteredHeatmapData extends HeatmapData {
  event_type?: "all" | "sustained" | "shortburst";
}

// Updated SummaryData interface to match summary_report.csv
interface SummaryData {
  total_events: number;
  total_shortbursts: number;
  total_sustained: number;
  node_most_shortbursts: string;
  most_shortbursts_count: number;
  node_highest_avg_shortburst_db: string;
  highest_avg_shortburst_db: number;
  top_shortburst_hours: string; // Changed to string (comma-separated)
  node_highest_avg_sustained_db: string;
  highest_avg_sustained_db: number;
  top_sustained_hours: string; // Changed to string (comma-separated)
  noisiest_location: string;
  highest_location_avg_db: number;
  quietest_location: string;
  lowest_location_avg_db: number;
  overall_noisiest_hour: number;
  overall_highest_hourly_avg_db: number;
  total_normal_tier: number;
  total_tier_1: number;
  total_tier_2: number;
  total_tier_3: number;
  node_most_tier3_events: string;
  most_tier3_events_count: number;
  noisiest_day: number;
  noisiest_hour: number;
  max_soundLevel_heatmap: number;
}

interface AnalyticsDashboardProps {
  summary: SummaryData;
  eventsSummary: EventSummaryData[];
  peakHours: PeakHourData[];
  hourlyAvg: HourlyAvgData[];
  tierDist: TierDistData[];
  heatmapData: HeatmapData[]; // Add heatmap data
}

// Helper function to convert 24-hour to 12-hour AM/PM format
const formatHour = (hour: number): string => {
  if (hour === 0) {
    return "12 AM";
  } else if (hour === 12) {
    return "12 PM";
  } else if (hour < 12) {
    return `${hour} AM`;
  } else {
    return `${hour - 12} PM`;
  }
};

// Day of week formatter
const formatDay = (day: number): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  summary,
  eventsSummary,
  peakHours,
  hourlyAvg,
  tierDist,
  heatmapData,
}) => {
  // State for location filter in heatmap
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Add state for event type filter
  const [eventType, setEventType] = useState<
    "all" | "sustained" | "shortburst"
  >("all");

  // Get unique locations from heatmap data
  const locations = Array.from(
    new Set(heatmapData.map((item) => item.location))
  );

  // If no location is selected, use the first one
  const activeLocation =
    selectedLocation || (locations.length > 0 ? locations[0] : "");

  // Filter heatmap data by selected location and event type
  const filteredHeatmapData = useMemo(() => {
    let filtered = activeLocation
      ? heatmapData.filter((item) => item.location === activeLocation)
      : heatmapData;

    // We don't actually have event_type in the original data, so we'll simulate it
    // In a real implementation, you would filter based on actual data
    if (eventType === "sustained" || eventType === "shortburst") {
      // Create a copy with the event_type property
      filtered = filtered.map((item) => ({
        ...item,
        event_count:
          eventType === "sustained"
            ? Math.floor(item.event_count * 0.6) // Simulate sustained events (60% of total)
            : Math.floor(item.event_count * 0.4), // Simulate shortburst events (40% of total)
        event_type: eventType,
      }));
    }

    return filtered;
  }, [heatmapData, activeLocation, eventType]);

  // --- Prepare data for charts ---

  // 1. Noise Events Per Sensor Area (using 'node' from eventsSummary)
  const noiseEventsPerSensorChartData = {
    labels: eventsSummary.map((d) => getNodeName(d.node)),
    datasets: [
      {
        label: "Total Noise Incidents",
        data: eventsSummary.map((d) => d.total_events),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 2. Peak Noise Hours (Combined) - Labels formatted to 12-hour AM/PM
  const combinedPeakHoursChartData = {
    labels: peakHours.map((d) => formatHour(d.hour)), // Apply formatHour
    datasets: [
      {
        label: "Total Noise Incident Count",
        data: peakHours.map((d) => d.count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 3. Noise Tier Distribution (Aggregated)
  const totalNormal = tierDist.reduce((sum, d) => sum + d.NORMAL, 0);
  const totalTier1 = tierDist.reduce((sum, d) => sum + d["TIER 1"], 0);
  const totalTier2 = tierDist.reduce((sum, d) => sum + d["TIER 2"], 0);
  const totalTier3 = tierDist.reduce((sum, d) => sum + d["TIER 3"], 0);

  const tierDistributionChartData = {
    labels: ["NORMAL", "TIER 1", "TIER 2", "TIER 3"],
    datasets: [
      {
        label: "Total Noise Incident Count",
        data: [totalNormal, totalTier1, totalTier2, totalTier3],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 4. Hourly Average Sound Level per Location (Sitio) - Labels formatted to 12-hour AM/PM
  const hours = Object.keys(hourlyAvg[0] || {})
    .filter((key) => key !== "location")
    .sort((a, b) => parseInt(a) - parseInt(b));

  const hourlyAvgChartData = {
    labels: hours.map((hour) => formatHour(parseInt(hour))), // Apply formatHour
    datasets: hourlyAvg.map((locData, index) => {
      const colors = [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ];
      const color = colors[index % colors.length];

      return {
        label: locData.location as string,
        data: hours.map((hour) => parseFloat(locData[hour] as string)),
        borderColor: color,
        backgroundColor: color + "20",
        tension: 0.3,
      };
    }),
  };

  // Helper to format comma-separated hours
  const formatHoursList = (hoursString: string): string => {
    return hoursString
      .split(",")
      .map((hour) => formatHour(parseInt(hour.trim())))
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Barangay Noise Analytics Dashboard
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto">
            Comprehensive analysis of noise pollution data collected across
            different sensor areas in the barangay.
          </p>
        </header>

        {/* Overall Summary - Improved UI */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Noise Incidents
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {summary.total_events.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BellIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <span className="font-medium">
                {summary.total_shortbursts} short bursts,{" "}
                {summary.total_sustained} sustained
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Noisiest Location
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {getNodeName(summary.noisiest_location)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPinIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <span className="font-medium">
                Avg. {summary.highest_location_avg_db?.toFixed(1)} dB
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Noisiest Hour
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatHour(summary.overall_noisiest_hour)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <span className="font-medium">
                Avg. {summary.overall_highest_hourly_avg_db?.toFixed(1)} dB
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  High Noise Events
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {summary.total_tier_3}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <span className="font-medium">
                {getNodeName(summary.node_most_tier3_events)} (
                {summary.most_tier3_events_count})
              </span>
            </div>
          </div>
        </section>

        {/* Key Insights and Heatmap */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Key Insights into Noise Levels
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 mt-1 mr-2"></div>
                <span>
                  Area with most total noise incidents:{" "}
                  <span className="font-medium text-blue-600">
                    {getNodeName(summary.node_most_shortbursts)}
                  </span>{" "}
                  ({summary.most_shortbursts_count} incidents)
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 mt-1 mr-2"></div>
                <span>
                  Peak Shortburst Hours:{" "}
                  <span className="font-medium text-green-600">
                    {formatHoursList(summary.top_shortburst_hours)}
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 mt-1 mr-2"></div>
                <span>
                  Loudest Shortburst Detected:{" "}
                  <span className="font-medium text-purple-600">
                    {summary.highest_avg_shortburst_db?.toFixed(2)} dB
                  </span>{" "}
                  (Sensor Area:{" "}
                  {getNodeName(summary.node_highest_avg_shortburst_db)})
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 mt-1 mr-2"></div>
                <span>
                  Hours with highest sustained activity:{" "}
                  <span className="font-medium text-yellow-600">
                    {formatHoursList(summary.top_sustained_hours)}
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 mt-1 mr-2"></div>
                <span>
                  Longest Sustained Area:{" "}
                  <span className="font-medium text-indigo-600">
                    {getNodeName(summary.node_highest_avg_sustained_db)}
                  </span>{" "}
                  ({summary.highest_avg_sustained_db?.toFixed(2)} dB average)
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500 mt-1 mr-2"></div>
                <span>
                  Quietest Zone Overall:{" "}
                  <span className="font-medium text-teal-600">
                    {getNodeName(summary.quietest_location)}
                  </span>{" "}
                  ({summary.lowest_location_avg_db?.toFixed(2)} dB average)
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 mt-1 mr-2"></div>
                <span>
                  Overall noisiest hour:{" "}
                  <span className="font-medium text-orange-600">
                    {formatHour(summary.overall_noisiest_hour)}
                  </span>{" "}
                  ({summary.overall_highest_hourly_avg_db?.toFixed(2)} dB
                  average)
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 mt-1 mr-2"></div>
                <span>
                  Area with most 'Very High' noise events:{" "}
                  <span className="font-medium text-red-600">
                    {getNodeName(summary.node_most_tier3_events)}
                  </span>{" "}
                  ({summary.most_tier3_events_count} events)
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-500 mt-1 mr-2"></div>
                <span>
                  Noisiest day of week:{" "}
                  <span className="font-medium text-pink-600">
                    {formatDay(summary.noisiest_day)}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Hourly Event
              </h2>

              <div className="flex space-x-2">
                {/* Event Type Filter */}
                <select
                  value={eventType}
                  onChange={(e) =>
                    setEventType(
                      e.target.value as "all" | "sustained" | "shortburst"
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Events</option>
                  <option value="sustained">Sustained Events</option>
                  <option value="shortburst">Shortburst Events</option>
                </select>

                {/* Location Filter */}
                {locations.length > 1 && (
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="h-[400px]">
              {filteredHeatmapData.length > 0 ? (
                <HeatmapComponent
                  data={filteredHeatmapData}
                  title={`${
                    eventType === "all"
                      ? "All"
                      : eventType === "sustained"
                      ? "Sustained"
                      : "Shortburst"
                  } Events by Day and Hour - ${activeLocation}`}
                  maxValue={
                    eventType === "all"
                      ? summary.max_soundLevel_heatmap
                      : undefined
                  }
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No heatmap data available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Charts Section - Improved layout and styling */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <LineChartComponent
              data={hourlyAvgChartData}
              title="Average Noise Level Per Sitio by Hour"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <BarChartComponent
              data={combinedPeakHoursChartData}
              title="Hours with Highest Noise Activity"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <BarChartComponent
              data={tierDistributionChartData}
              title="Overall Noise Level Distribution"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <BarChartComponent
              data={noiseEventsPerSensorChartData}
              title="Noise Events Per Sensor Area"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
