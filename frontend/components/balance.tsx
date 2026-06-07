"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export function TotalBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

 const getBalance = async () => {
  const response = await api.get("/account/balance");
  return response.data;
};

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
    return (
      <div className="rounded-xl border p-6">
        Loading balance...
      </div>
    );
  }

  return (
    <div className="p-6 text-white  shadow-lg">
      <p className="text-2xl opacity-90 mb-6 ">
        Total Balance
      </p>

      <h2 className=" text-2xl font-bold">
        ₹{balance.toLocaleString("en-IN")}
      </h2>
    </div>
  );
}