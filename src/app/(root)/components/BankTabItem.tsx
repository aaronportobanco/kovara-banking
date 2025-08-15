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
      className={cn("banktab-item", {
        "banktab-item-active": isActive,
      })}
    >
      <p
        className={cn("banktab-item-text line-clamp-1 flex-1", {
          "banktab-item-text-active": isActive,
          "banktab-item-text-inactive": !isActive,
        })}
      >
        {account.name}
      </p>
    </button>
  );
};

export default BankTabItem;
