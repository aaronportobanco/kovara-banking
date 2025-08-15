"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PlaidLinkProps } from "#/types";
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { createLinkToken, exchangePublicToken } from "@/services/actions/plaid";
import { useRouter } from "next/navigation";
import { CreditCard, Plus } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const PlaidLink: React.FC<PlaidLinkProps> = ({ user, variant }) => {
  const router = useRouter();

  const [token, setToken] = useState("");

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async (public_Token: string) => {
      await exchangePublicToken({ publicToken: public_Token, user });
      router.push("/");
    },
    [user, router],
  );

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };
    getLinkToken();
  }, [user]);

  const config: PlaidLinkOptions = {
    onSuccess,
    token,
  };

  const { open, ready } = usePlaidLink(config);
  return (
    <>
      {variant === "primary" ? (
        <Button className="plaidlink-primary" onClick={() => open()} disabled={!ready}>
          <CreditCard />
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          variant="ghost"
          className="plaidlink-ghost"
        >
          <CreditCard />
          <p className=" hidden text-base font-semibold text-black-2 xl:block">Connect bank</p>
        </Button>
      ) : variant === "rightSidebar" ? (
        <Button variant="ghost" onClick={() => open()} disabled={!ready}>
          <Plus />
          Add Bank
        </Button>
      ) : variant === "sidebar" ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton onClick={() => open()} disabled={!ready}>
              <CreditCard />
              <span>Connect Bank Account</span>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">Connect Bank Account</TooltipContent>
        </Tooltip>
      ) : (
        <SidebarMenuButton onClick={() => open()}>
          <CreditCard />
          <p>Connect bank account</p>
        </SidebarMenuButton>
      )}
    </>
  );
};

export default PlaidLink;
