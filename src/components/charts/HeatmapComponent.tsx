"use client";

import React, { useEffect, useState } from "react";

interface HeatmapData {
  location: string;
  weekday: number;
  hour: number;
  event_count: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  title: string;
  maxValue?: number;
}

const HeatmapComponent: React.FC<HeatmapProps> = ({
  data,
  title,
  maxValue,
}) => {
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hourLabels = Array.from({ length: 24 }, (_, i) =>
    i === 0 ? "12am" : i === 12 ? "12pm" : i > 12 ? `${i - 12}pm` : `${i}am`
  );

  // Process data into a 2D array for the heatmap
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [maxDataValue, setMaxDataValue] = useState<number>(0);

  useEffect(() => {
    if (!data.length) return;

    // Initialize 2D array with zeros (7 days x 24 hours)
    const processedData = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));

    // Fill in data values
    let max = maxValue || 0;
    data.forEach((item) => {
      if (
        item.weekday >= 0 &&
        item.weekday < 7 &&
        item.hour >= 0 &&
        item.hour < 24
      ) {
        processedData[item.weekday][item.hour] = item.event_count;
        if (item.event_count > max) {
          max = item.event_count;
        }
      }
    });

    setHeatmapData(processedData);
    setMaxDataValue(max);
  }, [data, maxValue]);

  // Get color based on value intensity
  const getColor = (value: number) => {
    if (maxDataValue === 0) return "rgb(240, 240, 240)";

    const intensity = Math.min(value / maxDataValue, 1);

    // Color scale from light blue to dark red
    if (intensity < 0.25) {
      return `rgba(173, 216, 230, ${0.3 + intensity * 0.7})`; // Light blue
    } else if (intensity < 0.5) {
      return `rgba(255, 255, 0, ${0.3 + (intensity - 0.25) * 0.7})`; // Yellow
    } else if (intensity < 0.75) {
      return `rgba(255, 165, 0, ${0.3 + (intensity - 0.5) * 0.7})`; // Orange
    } else {
      return `rgba(255, 0, 0, ${0.3 + (intensity - 0.75) * 0.7})`; // Red
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
      
      {/* Scrollable container with fixed height */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ minHeight: "300px", maxHeight: "400px" }}>
        {/* Header with day labels - stays fixed */}
        <div className="flex bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm">
          <div className="w-16 flex-shrink-0"></div> {/* Empty corner cell */}
          {weekdayLabels.map((day, idx) => (
            <div
              key={idx}
              className="flex-1 text-center text-sm font-medium text-gray-700 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-w-[600px]">
            {/* Hour rows */}
            {hourLabels.map((hour, hourIdx) => (
              <div key={hourIdx} className="flex h-10">
                <div className="w-16 text-xs text-right pr-2 flex items-center justify-end text-gray-600 sticky left-0 bg-white z-10 border-r border-gray-100">
                  {hour}
                </div>
                {weekdayLabels.map((_, dayIdx) => {
                  const value = heatmapData[dayIdx]?.[hourIdx] || 0;
                  return (
                    <div
                      key={dayIdx}
                      className="flex-1 border border-white flex items-center justify-center text-xs font-medium"
                      style={{ backgroundColor: getColor(value) }}
                      title={`${weekdayLabels[dayIdx]} ${hour}: ${value} events`}
                    >
                      {value > 0 ? value : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend - stays at the bottom */}
      <div className="mt-4 flex justify-center items-center text-xs text-gray-600 pt-2 border-t border-gray-200">
        <div className="flex items-center mr-4">
          <div
            className="w-3 h-3 mr-1"
            style={{ backgroundColor: getColor(0) }}
          ></div>
          <span>Low</span>
        </div>
        <div className="flex items-center mr-4">
          <div
            className="w-3 h-3 mr-1"
            style={{ backgroundColor: getColor(maxDataValue * 0.33) }}
          ></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center mr-4">
          <div
            className="w-3 h-3 mr-1"
            style={{ backgroundColor: getColor(maxDataValue * 0.66) }}
          ></div>
          <span>High</span>
        </div>
        <div className="flex items-center">
          <div
            className="w-3 h-3 mr-1"
            style={{ backgroundColor: getColor(maxDataValue) }}
          ></div>
          <span>Very High</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapComponent;
