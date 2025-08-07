/* eslint-disable @typescript-eslint/naming-convention */
"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { cn, formUrlQuery } from "@/lib/utils";
import { BankTabItemProps } from "#/types";
import { JSX } from "react";

const BankTabItem = ({ account, appwriteItemId }: BankTabItemProps): JSX.Element => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <button
      onClick={handleBankChange}
      className={cn(`banktab-item`, {
        "border-blue-600": isActive,
      })}
    >
      <p
        className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`, {
          "text-blue-600": isActive,
        })}
      >
        {account.name}
      </p>
    </button>
  );
};

export default BankTabItem;
