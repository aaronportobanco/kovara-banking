import HeaderBox from "./components/HeaderBox";
import TotalBalanceBox from "./components/TotalBalanceBox";
import RightSidebar from "./components/rightSidebar/RightSidebar";
import React from "react";

const Home = () => {
  // Simulating a logged-in user
  // In a real application, you would fetch this data from an API or use a global state management solution
  const loggedIn = {
    firstName: "Aaron",
    lastName: "Portobanco",
    email: "aaron@example.com",
  };
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
        <TotalBalanceBox
          accounts={[]}
          totalBanks={2}
          totalCurrentBalance={1243.45}
        />
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
