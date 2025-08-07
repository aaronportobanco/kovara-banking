import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Account, RecentTransactionsProps } from "#/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { JSX } from "react";
import BankTabItem from "./BankTabItem";
import BankInfo from "./BankInfo";

const RecentTransactions = ({
  accounts,
  page,
  transactions,
  appwriteItemId,
}: RecentTransactionsProps): JSX.Element => {
  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h4 className="recent-transactions-label">Recent Transactions</h4>
        <Button variant="outline">
          <Link
            href={`/transactions-history/?id=${appwriteItemId}`}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            View All
          </Link>
        </Button>
      </header>
      <Tabs defaultValue={appwriteItemId} className="w-full">
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
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
