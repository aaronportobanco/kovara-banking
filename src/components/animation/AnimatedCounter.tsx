"use client";
import { JSX } from "react";
import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number | string }): JSX.Element => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount.replace(/[$,]/g, "")) : amount;

  return (
    <div className="w-full">
      <CountUp end={numericAmount} decimal={"."} prefix={"$"} decimals={2} />
    </div>
  );
};

export default AnimatedCounter;
