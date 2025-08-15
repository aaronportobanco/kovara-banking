import { Transaction, TransactionTableProps } from "#/types";
import React, { JSX } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
const TransactionsTable = ({ transactions }: TransactionTableProps): JSX.Element => {
  return (
    <section>
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2 font-bold">Transaction</TableHead>
            <TableHead className="px-2 font-bold">Amount</TableHead>
            <TableHead className="px-2 font-bold">Status</TableHead>
            <TableHead className="px-2 font-bold">Date</TableHead>
            <TableHead className="px-2 max-md:hidden font-bold">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden font-bold">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.date));
            const amount = formatAmount(t.amount);

            // Check is credit or debit card
            const isDebitCard = t.type === "debit";
            const isCreditCard = t.type === "credit";

            // Generate display name for transaction
            const getTransactionDisplayName = (transaction: Transaction): string => {
              // If transaction has a name (from Plaid), use it
              if (transaction.name && transaction.name.trim()) {
                return removeSpecialCharacters(transaction.name);
              }

              // For internal transfers, create a descriptive name
              if (transaction.category === "transfer") {
                if (transaction.note && transaction.note.trim()) {
                  return `Transfer: ${transaction.note}`;
                }
                return `Transfer to ${transaction.email || "recipient"}`;
              }

              // Fallback for other transactions
              return "Transaction";
            };

            return (
              <TableRow
                key={t.id}
                className={`${isDebitCard || amount[0] === "-" ? "bg-red-50" : "bg-success-50"} hover:bg-none border-b-inherit`}
              >
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xs truncate font-semibold text-[#344054]">
                      {getTransactionDisplayName(t)}
                    </h1>
                  </div>
                </TableCell>

                <TableCell
                  className={`pl-2 text-xs pr-10 font-semibold ${
                    isDebitCard || amount[0] === "-" ? "text-[#f04438]" : "text-[#039855]"
                  }`}
                >
                  {isDebitCard ? `-${amount}` : isCreditCard ? `+ ${amount}` : amount}
                </TableCell>

                <TableCell className="pl-2 pr-10">
                  <CategoryBadge category={status} />
                </TableCell>

                <TableCell className="min-w-32 text-xs pl-2 pr-10">
                  {formatDateTime(new Date(t.date)).dateTime}
                </TableCell>

                <TableCell className="pl-2 pr-10 text-xs capitalize min-w-20">
                  {t.paymentChannel}
                </TableCell>

                <TableCell className="pl-2 pr-10 max-md:hidden">
                  <CategoryBadge category={t.category || "default"} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default TransactionsTable;
