"use client";
import React, { useState, useEffect } from "react";
import CampaignAnalysis from "../../component/linechart";
interface CardProps {
  title: string;
  value: string;
}

const Card: React.FC<CardProps> = ({ title, value }) => {
  return (
    <div className="flex-1 rounded-lg bg-white px-4 py-6 text-center shadow-md">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <p className="mt-2 text-xl font-bold text-black">{value}</p>
    </div>
  );
};

const BarGraph: React.FC = () => {
  const data = [
    { label: "Aspect Ratio", percentage: 74 },
    { label: "Brand Early", percentage: 95 },
    { label: "Safe Zones", percentage: 72 },
    { label: "Sound On", percentage: 95 },
    { label: "Supers Present", percentage: 65 },
    { label: "Video Length", percentage: 76 },
  ];

  return (
    // <div className="rounded-lg bg-white p-4 shadow-md">
    <>
      <h3 className="mb-4 text-lg font-bold">
        Adoption Rate by Creative Guideline
      </h3>
      <div>
        {data.map((item, index) => (
          <div key={index} className="mb-3 flex items-center">
            <span className="w-1/3 text-sm text-gray-600">{item.label}</span>
            <div className="relative h-4 w-2/3 rounded-full bg-gray-200">
              <div
                className="h-4 rounded-full bg-teal-500"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm text-gray-600">
              {item.percentage}%
            </span>
          </div>
        ))}
        {/* </div> */}
      </div>
    </>
  );
};

// Update interface to match actual API response
interface SummaryApiItem {
  title: string;
  value: string;
}

// Add utility function to format numbers
const formatLargeNumber = (value: string): string => {
  // Remove commas and convert to number
  const num = parseFloat(value.replace(/,/g, ""));

  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  } else {
    return num.toLocaleString();
  }
};

const CardWithGraph: React.FC = () => {
  const [cardData, setCardData] = React.useState<SummaryApiItem[]>([
    { title: "Creative Quality Score", value: "0%" },
    { title: "Impressions", value: "0" },
    { title: "Clicks", value: "0" },
    { title: "CTR %", value: "0%" },
  ]);

  const [tableData, setTableData] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "https://ticker_plus.mfilterit.net/Summary",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SummaryApiItem[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API");
        }

        // Format the data
        const formattedData = data.map((item) => {
          if (item.title === "Impressions" || item.title === "Clicks") {
            return {
              ...item,
              value: formatLargeNumber(item.value),
            };
          }
          return item;
        });

        setCardData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching data",
        );
        setCardData([
          { title: "Creative Quality Score", value: "0%" },
          { title: "Impressions", value: "0" },
          { title: "Clicks", value: "0" },
          { title: "CTR %", value: "0%" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#f6f0e4] p-4">
      <div className="mb-6 flex gap-[10px]">
        {cardData.map((card, index) => (
          <Card key={index} title={card.title} value={card.value} />
        ))}
      </div>
      <div className="mb-4 w-full rounded-lg bg-white p-4 shadow-md">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left text-sm font-semibold text-gray-600">
                  Creative ID
                </th>
                <th className="p-2 text-left text-sm font-semibold text-gray-600">
                  Impressions
                </th>
                <th className="p-2 text-left text-sm font-semibold text-gray-600">
                  Clicks
                </th>
                <th className="p-2 text-left text-sm font-semibold text-gray-600">
                  CTR
                </th>
                <th className="p-2 text-left text-sm font-semibold text-gray-600">
                  Compliance Score
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 text-sm">{row.creativeId}</td>
                  <td className="p-2 text-sm">{row.impressions}</td>
                  <td className="p-2 text-sm">{row.clicks}</td>
                  <td className="p-2 text-sm">{row.ctr}</td>
                  <td className="p-2 text-sm">{row.complianceScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="h-[400px] flex-1 rounded-lg bg-white p-4 shadow-md">
          <CampaignAnalysis />
        </div>
        <div className="h-[400px] flex-1 rounded-lg bg-white p-4 shadow-md">
          <BarGraph />
        </div>
      </div>
    </div>
  );
};

export default CardWithGraph;
