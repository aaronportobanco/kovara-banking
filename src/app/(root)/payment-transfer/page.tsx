import React from "react";
import HeaderBox from "../transactions-history/components/HeaderBox";
import PaymentTransferForm from "./PaymentTransferForm";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { getAccounts } from "@/services/actions/bank.actions";
import { redirect } from "next/navigation";

const PaymentTransferPage = async (): Promise<React.ReactElement> => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect("/sign-in");

  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });

  if (!accounts) return <div>No accounts found</div>;

  const accountsData = accounts?.data;

  return (
    <section className="payment-transfer">
      <HeaderBox title="Payment Transfer" subtext="Transfer money between accounts" />
      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default PaymentTransferPage;
