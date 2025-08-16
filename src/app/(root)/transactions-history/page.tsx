import React, { JSX } from "react";
import HeaderBox from "../components/HeaderBox";
import { SearchParamProps } from "#/types";
import { redirect } from "next/navigation";
import { getAccount, getAccounts } from "@/services/actions/bank.actions";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { formatAmount } from "@/lib/utils";
import TransactionsTable from "../components/TransactionsTable";
import Pagination from "../components/Pagination";

const TransactionsHistoryPage = async ({
  searchParams,
}: SearchParamProps): Promise<JSX.Element> => {
  const id = searchParams?.id;
  const page = searchParams?.page;

  const loggedIn = await getLoggedInUser();
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
  if (!account) {
    redirect("/connect-bank");
  }

  // Parse page parameter and provide default value
  const currentPage = parseInt(Array.isArray(page) ? page[0] : page || "1", 10) || 1;

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);
  const indexLastTransaction = currentPage * rowsPerPage;
  const indexFirstTransaction = indexLastTransaction - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    indexFirstTransaction,
    indexLastTransaction,
  );

  return (
    <section className="transactions">
      <header className="transactions-header">
        <HeaderBox title="Transaction History" subtext="View your past transactions" />
      </header>
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">{account.data?.name}</h2>
            <p className="text-sm text-blue-25">{account.data?.officialName}</p>
            <p className="text-sm font-semibold tracking-tight text-white">
              ●●●● ●●●● ●●●●{account.data?.mask}
            </p>
          </div>
          <div className="transactions-account-balance">
            {" "}
            <p className="text-sm">Current balance</p>
            <p className="text-2xl text-center font-bold">
              {formatAmount(account.data?.currentBalance)}
            </p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions} />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination page={currentPage} totalPages={totalPages} />
            </div>
          )}{" "}
        </section>
      </div>
    </section>
  );
};

export default TransactionsHistoryPage;
