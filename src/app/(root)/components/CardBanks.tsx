"use client";

import React from "react";
import Link from "next/link";
import { formatAmount } from "@/lib/utils";
import Image from "next/image";
import { CreditCardProps } from "#/types";
import Copy from "./Copy";
import { useMonthlySpending } from "@/hooks/useMonthlySpending";
import SpendingProgress from "../my-banks/components/SpendingProgress";

const CardBanks: React.FC<CreditCardProps> = ({
  account,
  userName,
  showBalance = true,
  userId,
  showSpendingProgress = true,
}) => {
  const { monthlyFinancials, loading, error } = useMonthlySpending({
    userId: userId || "",
    enabled: showSpendingProgress && !!userId,
  });

  // Calculate spending for this specific account
  const monthlySpending = monthlyFinancials?.totalExpenses || 0;

  // Use current balance - spending as the "limit" for demonstration
  const cardLimit = account.currentBalance - monthlySpending;

  return (
    <div>
      <Link href={`transactions-history/?id=${account.appwriteItemId}`} className="bank-card">
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 font-semibold text-white">{account.name}</h1>
            <p className="font-black text-white font-ibm-plex-serif">
              {formatAmount(account.currentBalance || 0)}
            </p>
          </div>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">{userName}</h1>
              <h2 className="text-12 font-semibold text-white">●● / ●●</h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span className="text-16">{account?.mask}</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image src="/icons/Paypass.svg" alt="Pay Bank Icon" width={20} height={24} />
          <Image
            src="/icons/mastercard.svg"
            alt="Mastercard Icon"
            width={45}
            height={32}
            className="ml-5"
          />
        </div>
        <Image
          src="/icons/lines.png"
          alt="Lines Background"
          width={316}
          height={190}
          className="absolute top-0 left-0"
        />
      </Link>

      {/* COPY CARD NUMBERS */}
      {showBalance && <Copy title={account.sharableId} />}

      {/* SPENDING PROGRESS BAR */}
      {showSpendingProgress && userId && (
        <div className="mt-3 max-w-[320px]">
          <SpendingProgress
            monthlySpending={monthlySpending}
            cardLimit={cardLimit}
            loading={loading}
            error={error}
          />
        </div>
      )}
    </div>
  );
};

export default CardBanks;
