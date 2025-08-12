"use client";

import FormFieldInput from "@/app/(auth)/components/FormFieldInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { transferSchema, TransferSchemaType } from "@/schemas/transferSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BankDropdown } from "./components/BankDropdown";
import { useRouter } from "next/navigation";
import { PaymentTransferFormProps } from "#/types";
import { decryptId } from "@/lib/utils";
import { getBank, getBankByAccountId } from "@/services/actions/bank.actions";
import { createTransfer } from "@/services/actions/dwolla.actions";
import { createTransaction } from "@/services/actions/transactions.actions";

const PaymentTransferForm: React.FC<PaymentTransferFormProps> = ({ accounts }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // Use the zodResolver to validate the form data against the schema
  const form = useForm<TransferSchemaType>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      email: "",
      senderBank: "",
      sharableId: "",
      note: "",
      amount: "",
    },
    mode: "onChange",
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  // This function will be called when the form is submitted and the data is valid
  const onSubmit = async (data: TransferSchemaType) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      const senderBank = await getBank({ documentId: data.senderBank });

      if (!receiverBank) {
        throw new Error("Receiver bank not found");
      }

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount.toString(),
      };
      // create transfer
      const transfer = await createTransfer(transferParams);

      // create transfer transaction
      if (transfer) {
        const transaction = {
          name: data.note,
          amount: data.amount,
          senderId: senderBank.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.$id,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
      // eslint-disable-next-line no-console
      console.log("Form submitted successfully", data);
      toast.success("Transfer successful!", {
        position: "top-center",
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error: ", error);
      toast.error("Submitting create transfer request failed", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };
  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormFieldInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="on"
              placeholder="Enter your email"
              description="e.g. user@gmail.com"
            />
            <FormFieldInput
              control={form.control}
              name="note"
              label="Note"
              type="text"
              maxLength={200}
              autoComplete="on"
              placeholder="Enter a note"
            />
            <FormFieldInput
              control={form.control}
              name="sharableId"
              label="Sharable ID"
              type="text"
              minLength={8}
              autoComplete="on"
              placeholder="Enter sharable ID"
            />
            <FormFieldInput
              control={form.control}
              name="senderBank"
              label="Sender Bank"
              type="text"
              minLength={4}
              autoComplete="on"
              placeholder="Enter sender bank"
            />
            <FormFieldInput
              control={form.control}
              name="amount"
              label="Amount"
              type="number"
              minLength={4}
              autoComplete="on"
              placeholder="Enter amount"
            />
            <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full" />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || isLoading}
              className="form-btn"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Sending..." : "Transfer founds"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default PaymentTransferForm;
