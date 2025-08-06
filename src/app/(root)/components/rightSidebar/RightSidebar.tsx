import React from "react";
import Link from "next/link";
import CardBanks from "./CardBanks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RightSidebarProps } from "#/types";

const RightSidebar = ({ user, banks }: RightSidebarProps): React.JSX.Element => {
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <aside className="right-sidebar">
      {/* FIRST SECTION */}
      <section className="flex flex-col pb-5">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">{name.charAt(0)}</span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{name}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </section>
      {/* SECOND SECTION */}
      <section className="banks">
        <div className="flex w-full justify-between items-center">
          <h2 className="font-semibold text-gray-900 text-base">My Banks</h2>
          <Button variant="ghost">
            <Plus />
            <Link href="#">Add Bank</Link>
          </Button>
        </div>
        {/* BANK CARDS */}
        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <CardBanks
                key={banks[0].$id}
                account={banks[0]}
                userName={name}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <CardBanks
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={name}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
