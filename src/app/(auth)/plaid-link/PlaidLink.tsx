"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PlaidLinkProps } from "#/types";
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { createLinkToken, exchangePublicToken } from "@/services/actions/plaid";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button onClick={() => open()} variant="ghost" className="plaidlink-ghost">
          <Image src="/icons/connect-bank.svg" alt="Connect Bank" width={24} height={24} />
          <p className=" hidden text-base font-semibold text-black-2 xl:block">Connect bank</p>
        </Button>
      ) : (
        <Button onClick={() => open()} className="plaidlink-default">
          <Image src="/icons/connect-bank.svg" alt="Connect Bank" width={24} height={24} />
          <p className="text-base font-semibold text-black-2 ">Connect bank</p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
