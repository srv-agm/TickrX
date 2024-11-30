"use client";
import Home from "../components/mf/login/home";
import FormCard from "@/components/mf/login/card";

export default function HomePage() {
  return (
    <>
      <Home
        InfoText="
        Campaign Performance Analytics :
Key Metrics: Impressions, Clicks, Conversions.
Multi-Channel Overview: Google, Facebook, and more.
Interactive Visualizations: Graphs, Pie Charts, and Heatmaps.
Custom Filters: Date Range, Campaign Type, Creative Assets.
Alerts: Notifications for underperformance with quick actions."
        logoSize="w-52"
        logoUrl="https://infringementportalcontent.mfilterit.com/images/media/logos/mfilterit-white-logo.png"
      >
        <FormCard />
      </Home>
    </>
  );
}
