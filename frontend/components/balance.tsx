"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

interface TotalBalanceProps {
  showDetails: boolean;
  accountNumber: string;
}
export function TotalBalance({
  showDetails,
  accountNumber,
}: TotalBalanceProps) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getBalance = async () => {
    const response = await api.get("/account/balance");
    return response.data;
  };

  const maskedAccountNumber =
    accountNumber.length > 4
      ? `${"X".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`
      : accountNumber;
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await getBalance();

        setBalance(data.balance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return <div className="rounded-xl border p-6">Loading balance...</div>;
  }

  return (
    <div className="p-12">
      <div className="flex gap-2 font-semibold">
        <p>Balance:</p>
        <h2 className="text-2xl font-bold">
          ₹{balance.toLocaleString("en-IN")}
        </h2>
      </div>

      <div className=" flex gap-2 font-semibold">
        <p>Acc.Number:</p>
        <h2 className="text-2xl font-bold">{maskedAccountNumber}</h2>
      </div>
    </div>
  );
}
