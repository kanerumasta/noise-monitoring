// app/page.tsx
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Papa from "papaparse";
import path from "path";
import fs from "fs/promises";

// Define data types for better type safety
interface EventSummaryData {
  node: string;
  total_events: number;
  shortbursts: number; // Added as it's used in calculations
  sustained: number; // Added as it's used in calculations
}

interface PeakHourData {
  hour: number;
  count: number;
}

interface HourlyAvgData {
  location: string;
  [hour: string]: number | string; // For hourly values (0-23)
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

// Updated SummaryData interface to match summary_report.csv
interface SummaryData {
  total_events: number;
  total_shortbursts: number;
  total_sustained: number;
  node_most_shortbursts: string;
  most_shortbursts_count: number;
  node_highest_avg_shortburst_db: string;
  highest_avg_shortburst_db: number;
  top_shortburst_hours: string; // Changed to string to match CSV
  node_highest_avg_sustained_db: string;
  highest_avg_sustained_db: number;
  top_sustained_hours: string; // Changed to string to match CSV
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

// Helper function to read and parse CSV
async function parseCsv<T>(filename: string): Promise<T[]> {
  const filePath = path.join(process.cwd(), "public", "output", filename); // Assuming CSVs are in public/output
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            console.error(`CSV parsing errors in ${filename}:`, results.errors);
            reject(new Error(`CSV parsing errors in ${filename}`));
          }
          resolve(results.data as T[]);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.warn(`File not found: ${filename}. Returning empty array.`);
    } else {
      console.error(`Error reading or parsing ${filename}:`, error);
    }
    return [];
  }
}

export default async function HomePage() {
  // Fetch and parse all CSV data, including summary_report.csv and heatmap data
  const [
    eventsSummaryData,
    shortburstPeakData,
    sustainedPeakData,
    heatmapData, // Add heatmap data
    hourlyAvgData,
    tierDistData,
    summaryReportData, // Read summary_report.csv content
  ] = await Promise.all([
    parseCsv<EventSummaryData>("1_events_summary.csv"),
    parseCsv<PeakHourData>("2_shortburst_peak_hours.csv"),
    parseCsv<PeakHourData>("3_sustained_peak_hours.csv"),
    parseCsv<HeatmapData>("4_heatmap.csv"), // Parse heatmap data
    parseCsv<HourlyAvgData>("5_avg_sound_level_location_hour.csv"),
    parseCsv<TierDistData>("6_noise_tier_distribution.csv"),
    parseCsv<SummaryData>("summary_report.csv"), // Parse summary_report.csv
  ]);

  // Use the first row of summaryReportData as the main summary object
  // If the CSV is empty, provide default values or handle the error
  const dashboardSummary: SummaryData = summaryReportData[0] || {
    total_events: 0,
    total_shortbursts: 0,
    total_sustained: 0,
    node_most_shortbursts: "N/A",
    most_shortbursts_count: 0,
    node_highest_avg_shortburst_db: "N/A",
    highest_avg_shortburst_db: 0,
    top_shortburst_hours: "",
    node_highest_avg_sustained_db: "N/A",
    highest_avg_sustained_db: 0,
    top_sustained_hours: "",
    noisiest_location: "N/A",
    highest_location_avg_db: 0,
    quietest_location: "N/A",
    lowest_location_avg_db: 0,
    overall_noisiest_hour: 0,
    overall_highest_hourly_avg_db: 0,
    total_normal_tier: 0,
    total_tier_1: 0,
    total_tier_2: 0,
    total_tier_3: 0,
    node_most_tier3_events: "N/A",
    most_tier3_events_count: 0,
    noisiest_day: 0,
    noisiest_hour: 0,
    max_soundLevel_heatmap: 0,
  };

  // Combine shortburstPeak and sustainedPeak into a single peakHours array
  const combinedPeakHoursMap = new Map<number, number>();

  shortburstPeakData.forEach((item) => {
    combinedPeakHoursMap.set(
      item.hour,
      (combinedPeakHoursMap.get(item.hour) || 0) + item.count
    );
  });

  sustainedPeakData.forEach((item) => {
    combinedPeakHoursMap.set(
      item.hour,
      (combinedPeakHoursMap.get(item.hour) || 0) + item.count
    );
  });

  const combinedPeakHours = Array.from(combinedPeakHoursMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour - b.hour);

  return (
    <AnalyticsDashboard
      summary={dashboardSummary}
      eventsSummary={eventsSummaryData}
      peakHours={combinedPeakHours}
      hourlyAvg={hourlyAvgData}
      tierDist={tierDistData}
      heatmapData={heatmapData} // Pass heatmap data to the dashboard
    />
  );
}
