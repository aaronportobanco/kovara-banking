import ChartPie from "./charts/PieChart";
import AnimatedCounter from "../../../components/animation/AnimatedCounter";
import React from "react";
import { TotalBalanceBoxProps } from "#/types";

const TotalBalanceBox = ({
  totalBanks,
  totalCurrentBalance,
  accounts,
}: TotalBalanceBoxProps): React.JSX.Element => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <ChartPie accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2"> Bank Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
