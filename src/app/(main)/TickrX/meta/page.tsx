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

// Update the BarGraph props interface
interface BarGraphProps {
  data: Array<{
    Question_Heading: string;
    complaince_percentage: number;
  }>;
}

const BarGraph: React.FC<BarGraphProps> = ({ data = [] }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="mb-4 text-lg font-bold">
        Adoption Rate by Creative
      </h3>
      <div className="overflow-y-auto flex-1">
        {data.map((item, index) => (
          <div key={index} className="mb-3 flex items-center">
            <span className="w-1/3 text-sm text-gray-600">
              {item.Question_Heading}
            </span>
            <div className="relative h-4 w-2/3 rounded-full bg-gray-200">
              <div
                className="h-4 rounded-full bg-teal-500"
                style={{ width: `${item.complaince_percentage}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm text-gray-600">
              {item.complaince_percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
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
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  } else {
    return num.toLocaleString();
  }
};

// Add this interface near your other interfaces at the top
interface TableRow {
  creative_id: number;
  Question_Heading: string;
  impressions: number;
  Clicks: number;
  CTR: number;
  complaince_percentage: number;
  creative_recommendation: string;
}

const CardWithGraph: React.FC = () => {
  const [cardData, setCardData] = React.useState<SummaryApiItem[]>([
    { title: "Creative Quality Score", value: "0%" },
    { title: "Impressions", value: "0" },
    { title: "Clicks", value: "0" },
    { title: "CTR %", value: "0%" },
  ]);

  // Update the tableData state type
  const [tableData, setTableData] = React.useState<{
    data: TableRow[];
  }>({
    data: [],
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [clicksData, setClicksData] = React.useState<Array<{
    clicks: number;
    inserted_date: string;
  }>>([]);
  const [impressionsData, setImpressionsData] = React.useState<Array<{
    impressions: number;
    inserted_date: string;
  }>>([]);

  // Add state for adoption rate data
  const [adoptionRateData, setAdoptionRateData] = useState<Array<{
    Question_Heading: string;
    complaince_percentage: number;
  }>>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Update Promise.all to include adoption rate API
        const [summaryResponse, creativeResponse, clicksResponse, impressionsResponse, adoptionResponse] = await Promise.all([
          fetch("https://ticker_plus.mfilterit.net/platformDashSummary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filter: "Facebook" }),
          }),
          fetch("https://ticker_plus.mfilterit.net/platformcreativeSummary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filter: "Facebook" }),
          }),
          fetch("https://ticker_plus.mfilterit.net/facebook_click_graph"),
          fetch("https://ticker_plus.mfilterit.net/facebook_impressions_graph"),
          fetch("https://ticker_plus.mfilterit.net/facebook_adoption_rate_summary")
        ]);

        if (!summaryResponse.ok || !creativeResponse.ok || !clicksResponse.ok || !impressionsResponse.ok || !adoptionResponse.ok) {
          throw new Error(`HTTP error!`);
        }

        const [summaryData, creativeData, clicksData, impressionsData, adoptionData] = await Promise.all([
          summaryResponse.json(),
          creativeResponse.json(),
          clicksResponse.json(),
          impressionsResponse.json(),
          adoptionResponse.json()
        ]);

        // Handle existing data
        const formattedSummaryData = summaryData.map((item: any) => {
          if (item.title === "Impressions" || item.title === "Clicks") {
            return { ...item, value: formatLargeNumber(item.value) };
          }
          return item;
        });

        setCardData(formattedSummaryData);
        setTableData(creativeData);
        setClicksData(clicksData.data);
        setImpressionsData(impressionsData.data);
        setAdoptionRateData(adoptionData.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching data"
        );
        setCardData([
          { title: "Creative Quality Score", value: "0%" },
          { title: "Impressions", value: "0" },
          { title: "Clicks", value: "0" },
          { title: "CTR %", value: "0%" },
        ]);
        setTableData({ data: [] });
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

  console.log(tableData.data, "asdasdasdasdasdasdad");

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
                  Question Heading
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
                  Compliance %
                </th>
                <th className="p-2 text-left text-sm font-semibold text-gray-600">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.data?.map((row: TableRow, index: number) => (
                <tr key={index} className="border-b">
                  <td className="p-2 text-sm">{row.creative_id}</td>
                  <td className="p-2 text-sm">{row.Question_Heading}</td>
                  <td className="p-2 text-sm">{row.impressions}</td>
                  <td className="p-2 text-sm">{row.Clicks}</td>
                  <td className="p-2 text-sm">{(row.CTR * 100).toFixed(2)}%</td>
                  <td className="p-2 text-sm">{row.complaince_percentage}%</td>
                  <td className="p-2 text-sm">{row.creative_recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="h-[400px] flex-1 rounded-lg bg-white p-4 shadow-md">
          <CampaignAnalysis 
            clicksData={clicksData}
            impressionsData={impressionsData}
          />
        </div>
        <div className="h-[400px] flex-1 rounded-lg bg-white p-4 shadow-md">
          <BarGraph data={adoptionRateData} />
        </div>
      </div>
    </div>
  );
};

export default CardWithGraph;
