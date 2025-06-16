// components/charts/LineChartComponent.tsx
'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { registerChartJS } from '@/lib/chart_config';

registerChartJS();

interface LineChartProps {
  data: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension?: number; }[] };
  title: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({ data, title }) => {
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
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Sound Level (dB)',
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-96">
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChartComponent;
