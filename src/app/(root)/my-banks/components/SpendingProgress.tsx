"use client";

import React from "react";
import { formatAmount } from "@/lib/utils";
import { Progress } from "@/app/components/ui/progress";
import { SpendingProgressProps } from "#/types";

const SpendingProgress: React.FC<SpendingProgressProps> = ({
  monthlySpending,
  cardLimit,
  loading,
  error,
}) => {
  // Calculate the spending percentage relative to the card limit
  const spendingPercentage = cardLimit > 0 ? Math.min((monthlySpending / cardLimit) * 100, 100) : 0;

  // Determine progress bar color based on spending level
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-gradient-to-r from-[#0179fe] to-[#4893ff]";
  };

  // Determine text color for spending amount
  const getTextColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-[#475467]";
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-2 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 p-2 bg-red-50 rounded">Unable to load spending data</div>
    );
  }

  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative w-full">
      {/* Header with spending amount */}
      <div className="box-border content-stretch flex flex-row gap-4 items-start justify-between leading-[0] not-italic p-0 relative shrink-0 text-[14px] text-left w-full">
        <div className="font-medium relative shrink-0 text-[#344054]">
          <p className="block leading-[20px]">Spending this month</p>
        </div>
        <div
          className={`font-normal relative shrink-0 text-nowrap ${getTextColor(spendingPercentage)}`}
        >
          <p className="block leading-[20px] whitespace-pre">{formatAmount(monthlySpending)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0 w-full">
        <div className="relative w-full">
          <Progress
            value={spendingPercentage}
            className="h-2 w-full bg-[#eaecf0] rounded-lg"
            indicatorClassName={`h-2 rounded transition-all duration-300 ${getProgressColor(spendingPercentage)}`}
          />
        </div>
      </div>

      {/* Additional info: percentage and limit */}
      <div className="flex justify-between items-center w-full text-xs text-[#475467]">
        <span>{spendingPercentage.toFixed(1)}% of limit used</span>
        <span>Remaining: {formatAmount(cardLimit)}</span>
      </div>

      {/* Warning message for high spending */}
      {spendingPercentage >= 70 && (
        <div
          className={`text-xs p-2 rounded-md w-full ${
            spendingPercentage >= 90
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-orange-50 text-orange-700 border border-orange-200"
          }`}
        >
          {spendingPercentage >= 90
            ? "⚠️ Critical: You've used over 90% of your limit this month"
            : "⚠️ Warning: You've used over 70% of your limit this month"}
        </div>
      )}
    </div>
  );
};

export default SpendingProgress;
