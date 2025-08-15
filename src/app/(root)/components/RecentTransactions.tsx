import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Account, RecentTransactionsProps } from "#/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { JSX } from "react";
import BankTabItem from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import Pagination from "./Pagination";
import { ChevronRight } from "lucide-react";

const RecentTransactions = ({
  accounts,
  page,
  transactions,
  appwriteItemId,
}: RecentTransactionsProps): JSX.Element => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const indexLastTransaction = page * rowsPerPage;
  const indexFirstTransaction = indexLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(indexFirstTransaction, indexLastTransaction);
  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h3 className="recent-transactions-label">Recent Transactions</h3>
        <Button variant="ghost">
          <Link
            href={`/transactions-history/?id=${appwriteItemId}`}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            View All
          </Link>
          <ChevronRight />
        </Button>
      </header>
      <Tabs defaultValue={appwriteItemId}>
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId} asChild>
              <BankTabItem key={account.id} account={account} appwriteItemId={appwriteItemId} />
            </TabsTrigger>
          ))}
        </TabsList>
        {accounts.map((account: Account) => (
          <TabsContent key={account.id} value={account.appwriteItemId} className="space-y-4">
            <BankInfo account={account} appwriteItemId={appwriteItemId} type="full" />
            <TransactionsTable transactions={currentTransactions} />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination page={page} totalPages={totalPages} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
