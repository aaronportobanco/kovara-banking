import HeaderBox from "@/components/layout/HeaderBox";
import TotalBalanceBox from "@/components/layout/TotalBalanceBox";
import React from "react";

const Home = () => {
  // Simulating a logged-in user
  // In a real application, you would fetch this data from an API or use a global state management solution
  const loggedIn = { firstName: "Aaron", lastName: "Portobanco" };
  const user = loggedIn.firstName + " " + loggedIn.lastName;

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting" // type can be "title" or "greeting"
            title="Welcome back,"
            subtext="Acces and manage your bank account easily and securely."
            user={user ? user : "Guest"}
          />
        </header>
        <TotalBalanceBox accounts={[]} totalBanks={2} totalCurrentBalance={1243.45} />
      </div>
    </section>
  );
};

export default Home;
