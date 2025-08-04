"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PlaidLinkProps } from "#/types";
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { createLinkToken } from "@/services/actions/plaid";

const PlaidLink: React.FC<PlaidLinkProps> = ({ user, variant }) => {
  const [token, setToken] = useState("");

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_Token: string) => {
      //await exchangePublicToken(public_token: public_token, user);
    },
    [user],
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
        <Button>Connect Bank</Button>
      ) : (
        <Button>Connect Bank</Button>
      )}
    </>
  );
};

export default PlaidLink;
