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

interface BarGraphProps {
  data: Array<{
    Question_Heading: string;
    complaince_percentage: number;
  }>;
}

const BarGraph: React.FC<BarGraphProps> = ({ data = [] }) => {
  return (
    <>
      <h3 className="mb-4 text-lg font-bold">
        Adoption Rate by Creative
      </h3>
      <div>
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
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  } else {
    return num.toLocaleString();
  }
};

// Add interfaces for both API responses
interface ClicksApiResponse {
  data: Array<{
    clicks: number;
    inserted_date: string;
  }>;
  message: string;
}

interface ImpressionsApiResponse {
  data: Array<{
    impressions: number;
    inserted_date: string;
  }>;
  message: string;
}

// Add interface for adoption rate API response
interface AdoptionRateItem {
  Question_Heading: string;
  complaince_percentage: number;
}

interface AdoptionRateResponse {
  data: AdoptionRateItem[];
  message: string;
}

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
  const [clicksData, setClicksData] = React.useState<ClicksApiResponse['data']>([]);
  const [impressionsData, setImpressionsData] = React.useState<ImpressionsApiResponse['data']>([]);
  const [adoptionRateData, setAdoptionRateData] = useState<AdoptionRateItem[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all APIs in parallel
        const [summaryResponse, clicksResponse, impressionsResponse, adoptionResponse] = await Promise.all([
          fetch("https://ticker_plus.mfilterit.net/Summary", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("https://ticker_plus.mfilterit.net/overall_clicks_graph", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("https://ticker_plus.mfilterit.net/overall_impressions_graph", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("https://ticker_plus.mfilterit.net/adoption_rate_summary", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
        ]);

        if (!summaryResponse.ok || !clicksResponse.ok || !impressionsResponse.ok || !adoptionResponse.ok) {
          throw new Error(`HTTP error!`);
        }

        const [summaryData, clicksResponseData, impressionsResponseData, adoptionResponseData] = await Promise.all([
          summaryResponse.json(),
          clicksResponse.json() as Promise<ClicksApiResponse>,
          impressionsResponse.json() as Promise<ImpressionsApiResponse>,
          adoptionResponse.json() as Promise<AdoptionRateResponse>
        ]);

        const formattedData = summaryData.map((item: SummaryApiItem) => {
          if (item.title === "Impressions" || item.title === "Clicks") {
            return { ...item, value: formatLargeNumber(item.value) };
          }
          return item;
        });

        setCardData(formattedData);
        setClicksData(clicksResponseData.data);
        setImpressionsData(impressionsResponseData.data);
        setAdoptionRateData(adoptionResponseData.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "An error occurred while fetching data");
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
