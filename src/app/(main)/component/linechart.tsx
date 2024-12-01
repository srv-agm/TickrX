import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Import the Chart dynamically with correct props
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
}) as React.FC<{
  options: ApexOptions;
  series: { name: string; data: number[] }[];
  type: string;
  height: number;
}>;

const CampaignAnalysis: React.FC = () => {
  type GraphKey = "Impressions" | "Clicks";

  const [activeTab, setActiveTab] = useState<GraphKey>("Impressions");

  const graphData: Record<GraphKey, number[]> = {
    Impressions: [5, 7, 10, 6, 12, 15, 14, 10, 8, 6, 8, 5, 6, 11, 9, 7],
    Clicks: [
      1.8, 3.2, 7.0, 4.0, 7.1, 8.3, 8.7, 7.7, 5.4, 3.5, 4.7, 1.7, 4.0, 7.1, 5.4,
      3.3,
    ],
  };

  const options: ApexOptions = {
    chart: {
      id: "campaign-analysis",
      toolbar: { show: false },
    },
    xaxis: {
      categories: [
        "Apr-2023",
        "May-2023",
        "Jun-2023",
        "Jul-2023",
        "Aug-2023",
        "Sep-2023",
        "Oct-2023",
        "Nov-2023",
        "Dec-2023",
        "Jan-2024",
        "Feb-2024",
        "Mar-2024",
        "Apr-2024",
        "May-2024",
        "Jun-2024",
        "Aug-2024",
      ],
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 4,
    },
    title: {
      text: activeTab,
      align: "center",
    },
  };

  const series = [
    {
      name: activeTab,
      data: graphData[activeTab],
    },
  ];

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Campaign Analysis</h2>
      <div className="mb-4 flex space-x-2">
        {(Object.keys(graphData) as GraphKey[]).map((tab) => (
          <button
            key={tab}
            className={`rounded px-4 py-2 ${
              activeTab === tab ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
};

export default CampaignAnalysis;
