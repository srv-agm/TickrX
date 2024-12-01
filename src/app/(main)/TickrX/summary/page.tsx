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

  // Add table data
  const tableData = [
    {
      creativeId: "CRV-001",
      impressions: "2,345",
      clicks: "125",
      ctr: "5.33%",
      complianceScore: "85%"
    },
    {
      creativeId: "CRV-002",
      impressions: "3,678",
      clicks: "198",
      ctr: "5.38%",
      complianceScore: "92%"
    },
    {
      creativeId: "CRV-003",
      impressions: "1,987",
      clicks: "87",
      ctr: "4.38%",
      complianceScore: "78%"
    },
    {
      creativeId: "CRV-001",
      impressions: "2,345",
      clicks: "125",
      ctr: "5.33%",
      complianceScore: "85%"
    },
    {
      creativeId: "CRV-002",
      impressions: "3,678",
      clicks: "198",
      ctr: "5.38%",
      complianceScore: "92%"
    },
    {
      creativeId: "CRV-003",
      impressions: "1,987",
      clicks: "87",
      ctr: "4.38%",
      complianceScore: "78%"
    },
    {
      creativeId: "CRV-001",
      impressions: "2,345",
      clicks: "125",
      ctr: "5.33%",
      complianceScore: "85%"
    },
    {
      creativeId: "CRV-002",
      impressions: "3,678",
      clicks: "198",
      ctr: "5.38%",
      complianceScore: "92%"
    },
    {
      creativeId: "CRV-003",
      impressions: "1,987",
      clicks: "87",
      ctr: "4.38%",
      complianceScore: "78%"
    },
    {
      creativeId: "CRV-001",
      impressions: "2,345",
      clicks: "125",
      ctr: "5.33%",
      complianceScore: "85%"
    },
    {
      creativeId: "CRV-002",
      impressions: "3,678",
      clicks: "198",
      ctr: "5.38%",
      complianceScore: "92%"
    },
    {
      creativeId: "CRV-003",
      impressions: "1,987",
      clicks: "87",
      ctr: "4.38%",
      complianceScore: "78%"
    },
  ];

  return (
    <div className="bg-[#f6f0e4] p-4">
      <div className="mb-6 flex gap-[10px]">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} value={card.value} />
        ))}
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <CampaignAnalysis />
        </div>
        <div className="w-1/2 rounded-lg bg-white p-4 shadow-md">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left text-sm font-semibold text-gray-600">Creative ID</th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-600">Impressions</th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-600">Clicks</th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-600">CTR</th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-600">Compliance Score</th>
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
      </div>
      <hr/>
      <hr/>
      <hr/>
      <hr/>
      <BarGraph />
    </div>
  );
};

export default CardWithGraph;
