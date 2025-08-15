import ChartPie from "./charts/PieChart";
import AnimatedCounter from "../../../components/animation/AnimatedCounter";
import React from "react";
import { TotalBalanceBoxProps } from "#/types";
import PlaidLink from "@/app/(auth)/plaid-link/PlaidLink";

const TotalBalanceBox = ({
  totalBanks,
  totalCurrentBalance,
  accounts,
  user,
}: TotalBalanceBoxProps): React.JSX.Element => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <ChartPie accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex w-full justify-between">
          <h2 className="header-2"> Bank Accounts: {totalBanks}</h2>
          <PlaidLink user={user} variant="totalBalanceBox" />
        </div>
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
