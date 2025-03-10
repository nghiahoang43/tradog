"use client";

import OrderPanel from "./order-panel";
import { OrderTable } from "./order-table";
import { PortfolioChart } from "./portfolio-chart";

const DashboardPage = () => {
  return (
    <div className="flex gap-x-6 flex-col lg:flex-row gap-y-6">
      <div className="lg:w-2/3 flex flex-col w-full gap-y-6">
        <PortfolioChart />
        <OrderTable />
      </div>
      <div className="lg:w-1/3">
        <OrderPanel />
      </div>
    </div>
  );
};

export default DashboardPage;
