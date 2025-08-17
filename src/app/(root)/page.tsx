import { getLoggedInUser } from "@/services/actions/user.actions";
import HeaderBox from "./transactions-history/components/HeaderBox";
import TotalBalanceBox from "./components/TotalBalanceBox";
import RightSidebar from "./components/rightSidebar/RightSidebar";
import React, { JSX } from "react";
import { redirect } from "next/navigation";
import { Account, Bank, SearchParamProps } from "#/types";
import { getAccount, getAccounts } from "@/services/actions/bank.actions";
import RecentTransactions from "./components/RecentTransactions";
import { formatAmount } from "@/lib/utils";

const Home = async ({ searchParams }: SearchParamProps): Promise<JSX.Element> => {
  const params = (await searchParams) as Record<string, string | string[] | undefined>;
  const id = params?.id;
  const page = params?.page;

  const loggedIn = await getLoggedInUser();
  const currentPage = Number(page as string) || 1;

  // If the user is not logged in, redirect to the sign-in page
  if (!loggedIn) {
    redirect("/sign-in");
  }

  // Fetch accounts for the logged-in user
  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts) {
    redirect("/sign-in");
  }

  const accountsData = accounts.data;

  // Check if user has any accounts
  if (!accountsData || accountsData.length === 0) {
    redirect("/connect-bank");
  }

  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // Ensure we have a valid appwriteItemId
  if (!appwriteItemId) {
    redirect("/connect-bank");
  }

  const account = await getAccount({ appwriteItemId });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome back,"
            subtext="Access and manage your bank account easily and securely."
            user={loggedIn?.firstName || "Guest"}
          />
        </header>
        <TotalBalanceBox
          accounts={accountsData}
          totalBanks={accounts.totalBanks}
          totalCurrentBalance={formatAmount(accounts.totalCurrentBalance || 0)}
          user={loggedIn}
        />
        <RecentTransactions
          accounts={accountsData}
          transactions={account.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <RightSidebar
        user={loggedIn}
        transactions={account?.transactions || []}
        banks={accountsData.slice(0, 2) as (Bank & Account)[]}
      />
    </section>
  );
};

export default Home;
