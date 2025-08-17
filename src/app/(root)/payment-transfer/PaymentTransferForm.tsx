"use client";

import FormFieldInput from "@/app/(auth)/components/FormFieldInput";
import { Button } from "@/app/components/ui/button";
import { Form, FormDescription, FormLabel } from "@/app/components/ui/form";
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
import TextAreaInput from "./components/TextAreaInput";
import { Separator } from "@/app/components/ui/separator";

const PaymentTransferForm: React.FC<PaymentTransferFormProps> = ({ accounts }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // Debug: Log all available accounts to understand the data structure
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      "🔍 DEBUG - All available accounts:",
      accounts.map(acc => ({
        appwriteItemId: acc.appwriteItemId,
        sharableId: acc.sharableId,
        id: acc.id,
        name: acc.name,
      })),
    );
  }, [accounts]);

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
      // eslint-disable-next-line no-console
      console.log("🔍 DEBUG - Original sharableId:", data.sharableId);
      const receiverAccountId = decryptId(data.sharableId);
      // eslint-disable-next-line no-console
      console.log("🔍 DEBUG - Decrypted accountId:", receiverAccountId);

      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      // eslint-disable-next-line no-console
      console.log("🔍 DEBUG - Found receiverBank:", receiverBank);

      const senderBank = await getBank({ documentId: data.senderBank });
      // eslint-disable-next-line no-console
      console.log("🔍 DEBUG - Found senderBank:", senderBank);

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
          note: data.note,
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
    <section className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="payment-transfer_form-details">
            <h2 className="text-base font-semibold text-gray-900">Transfer details</h2>
            <p className="text-sm font-normal text-gray-600">
              Enter the bank account details of the recipient
            </p>
          </div>
          <Separator orientation="horizontal" className="w-full h-px bg-gray-300 my-4" />
          <div className="payment-transfer_form-item pb-6 pt-5">
            <div className="payment-transfer_form-content">
              <FormLabel className="text-14 font-semibold text-gray-700">
                Select Source Bank
              </FormLabel>
              <FormDescription className="text-12 font-normal text-gray-600">
                Select the bank account you want to transfer funds from
              </FormDescription>
            </div>
            <div className="flex w-full flex-col">
              <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full" />
            </div>
          </div>

          <Separator orientation="horizontal" className="w-full h-px bg-gray-300 my-4" />
          <div className="payment-transfer_form-item pb-6 pt-5">
            <div className="payment-transfer_form-content">
              <FormLabel className="text-14 font-semibold text-gray-700">
                {" "}
                Transfer Note (Optional)
              </FormLabel>
              <FormDescription className="text-12 font-normal text-gray-600">
                Please provide any additional information or instructions related to the transfer
              </FormDescription>
            </div>

            <div className="flex w-full flex-col">
              {" "}
              <TextAreaInput
                control={form.control}
                name="note"
                type="text"
                rows={4}
                maxLength={200}
                autoComplete="on"
                placeholder="Write a short note here"
              />
            </div>
          </div>

          <div className="payment-transfer_form-details">
            <h2 className="text-base font-semibold text-gray-900">Bank account details</h2>
            <p className="text-sm font-normal text-gray-600">
              Enter the bank account details of the recipient
            </p>
          </div>

          <Separator orientation="horizontal" className="w-full h-px bg-gray-300 my-4" />
          <div className="payment-transfer_form-item py-5">
            <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
              {" "}
              Recipient&apos;s Email Address
            </FormLabel>
            <div className="flex w-full flex-col">
              {" "}
              <FormFieldInput
                control={form.control}
                name="email"
                type="email"
                autoComplete="on"
                placeholder="Enter your email"
                description="e.g. user@gmail.com"
              />
            </div>
          </div>

          <Separator orientation="horizontal" className="w-full h-px bg-gray-300 my-4" />
          <div className="payment-transfer_form-item pb-5 pt-6">
            <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
              {" "}
              Receiver&apos;s Plaid Sharable Id{" "}
            </FormLabel>
            <div className="flex w-full flex-col">
              {" "}
              <FormFieldInput
                control={form.control}
                name="sharableId"
                type="text"
                minLength={8}
                autoComplete="on"
                placeholder="Enter the public account number"
              />
            </div>
          </div>

          <Separator orientation="horizontal" className="w-full h-px bg-gray-300 my-4" />
          <div className="payment-transfer_form-item py-5">
            <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
              {" "}
              Amount
            </FormLabel>
            <div className="flex w-full flex-col">
              {" "}
              <FormFieldInput
                control={form.control}
                name="amount"
                type="number"
                minLength={1}
                autoComplete="on"
                placeholder="Enter amount e.g. 100"
              />
            </div>
          </div>
          <div className="payment-transfer_btn-box">
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || isLoading}
              className="payment-transfer_btn"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Sending..." : "Transfer funds"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default PaymentTransferForm;
