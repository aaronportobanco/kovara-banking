import HeaderBox from "@/components/layout/HeaderBox";
import React from "react";

const Home = () => {
  const loggedIn = {firstName: "Aaron", lastName: "Portobanco"};
  const user = loggedIn.firstName + " " + loggedIn.lastName;

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="title"
            title={`Welcome, ${loggedIn.firstName}`}
            subtext="Your account balance is $10,000"
            user={user ? user : "Guest"}
          />
        </header>
      </div>
    </section>
  );
};

export default Home;
