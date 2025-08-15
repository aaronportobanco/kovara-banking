import React, { JSX } from "react";
import HeaderBox from "../components/HeaderBox";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { redirect } from "next/navigation";
import { getAccounts } from "@/services/actions/bank.actions";
import { Account } from "#/types";
import CardBanks from "../components/rightSidebar/CardBanks";

const MyBanksPage = async (): Promise<JSX.Element> => {
  const loggedIn = await getLoggedInUser();

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

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox title="My Banks" subtext="Manage your bank accounts" />
        <div className="space-y-4">
          <h2 className="header-2">Your Connected Cards</h2>
          <div className="flex flex-wrap gap-5">
            {accounts &&
              accountsData.map((a: Account) => (
                <CardBanks
                  key={a.id}
                  account={a}
                  userName={`${loggedIn.firstName} ${loggedIn.lastName}`}
                  userId={loggedIn.$id}
                  showSpendingProgress={true}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanksPage;
