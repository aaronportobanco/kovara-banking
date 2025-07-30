import { getLoggedInUser } from "@/services/actions/user.actions";
import HeaderBox from "./components/HeaderBox";
import TotalBalanceBox from "./components/TotalBalanceBox";
import RightSidebar from "./components/rightSidebar/RightSidebar";
import React from "react";
import { redirect } from "next/navigation";

const Home = async () => {
  const loggedIn = await getLoggedInUser();

  // If the user is not logged in, redirect to the sign-in page
  if (!loggedIn) {
    redirect("/sign-in");
  }

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting" // type can be "title" or "greeting"
            title="Welcome back,"
            subtext="Acces and manage your bank account easily and securely."
            user={loggedIn?.name || "Guest"} // Fallback to "Guest" if firstName is not available
          />
        </header>
        <TotalBalanceBox accounts={[]} totalBanks={2} totalCurrentBalance={1243.45} />
      </div>
      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 1000 }, { currentBalance: 2000 }]}
      />
    </section>
  );
};

export default Home;
