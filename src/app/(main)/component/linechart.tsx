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

interface CampaignAnalysisProps {
  clicksData: Array<{
    clicks: number;
    inserted_date: string;
  }>;
  impressionsData: Array<{
    impressions: number;
    inserted_date: string;
  }>;
}

const CampaignAnalysis: React.FC<CampaignAnalysisProps> = ({ clicksData, impressionsData }) => {
  type GraphKey = "Impressions" | "Clicks";
  const [activeTab, setActiveTab] = useState<GraphKey>("Impressions");

  // Transform data into the required format
  const formattedClicksData = clicksData.map(item => item.clicks);
  const formattedImpressionsData = impressionsData.map(item => item.impressions);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  };

  const dates = activeTab === "Clicks" 
    ? clicksData.map(item => formatDate(item.inserted_date))
    : impressionsData.map(item => formatDate(item.inserted_date));

  const graphData: Record<GraphKey, number[]> = {
    Impressions: formattedImpressionsData.length > 0 
      ? formattedImpressionsData 
      : [5, 7, 10, 6, 12, 15, 14, 10],
    Clicks: formattedClicksData.length > 0 
      ? formattedClicksData 
      : [1.8, 3.2, 7.0, 4.0, 7.1, 8.3, 8.7],
  };

  const options: ApexOptions = {
    chart: {
      id: "campaign-analysis",
      toolbar: { show: false },
    },
    xaxis: {
      categories: dates.length > 0 ? dates : [
        "Apr-2023", "May-2023", "Jun-2023", "Jul-2023",
        "Aug-2023", "Sep-2023", "Oct-2023", "Nov-2023",
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
    yaxis: {
      labels: {
        formatter: function(value) {
          if (value >= 1000000) {
            return `${(value/1000000).toFixed(1)}M`;
          }
          return value >= 1000 ? `${(value/1000).toFixed(1)}K` : value.toString();
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value.toLocaleString();
        }
      }
    }
  };

  const series = [
    {
      name: activeTab,
      data: graphData[activeTab],
    },
  ];

  return (
    <>
    {/* // <div className="rounded-lg bg-white p-4 shadow-md"> */}
      <h2 className="mb-2 text-xl font-bold">Campaign Analysis</h2>
      <div className="mb-2 flex space-x-2">
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
    {/* // </div> */}
    </>
  );
};

export default CampaignAnalysis;
