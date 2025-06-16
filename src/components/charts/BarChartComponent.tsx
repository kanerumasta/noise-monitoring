// components/charts/BarChartComponent.tsx
'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { registerChartJS } from '@/lib/chart_config';

registerChartJS(); // Register Chart.js components once

interface BarChartProps {
  data: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string | string[]; borderColor?: string | string[]; borderWidth?: number; }[] };
  title: string;
}

const BarChartComponent: React.FC<BarChartProps> = ({ data, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-80">
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChartComponent;
