"use client";
import React from "react";
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
    <div className="rounded-lg bg-white p-4 shadow-md">
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
      </div>
    </div>
  );
};

const CardWithGraph: React.FC = () => {
  const cards = [
    { title: "Creative Quality Score", value: "78.01%" },
    { title: "Impressions", value: "8,719" },
    { title: "Clicks", value: "64.05%" },
    { title: "CTR %", value: "$4.89M" },
  ];

  return (
    <div className="bg-[#f6f0e4] p-4">
      <div className="mb-6 flex gap-[10px]">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} value={card.value} />
        ))}
      </div>
      <CampaignAnalysis />
      <hr/>
      <hr/>
      <hr/>
      <hr/>
      <BarGraph />
    </div>
  );
};

export default CardWithGraph;
