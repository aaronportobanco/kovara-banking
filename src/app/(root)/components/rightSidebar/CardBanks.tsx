import React from "react";
import Link from "next/link";
import { formatAmount } from "@/lib/utils";
import Image from "next/image";

const CardBanks = ({
  account,
  userName,
  showBalance = true,
}: CreditCardProps) => {
  return (
    <div>
      <Link href="/" className="bank-card">
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 font-semibold text-white">
              {account.name ? account.name : "Bank Name"}
            </h1>
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
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16"> $1234</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image
            src="/icons/Paypass.svg"
            alt="Pay Bank Icon"
            width={20}
            height={24}
          />
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
    </div>
  );
};

export default CardBanks;
