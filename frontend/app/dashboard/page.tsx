"use client"

import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

const stats = [
  { label: "Balance", value: "$12,480.00" },
  { label: "Received", value: "$8,245.50" },
  { label: "Sent", value: "$3,910.25" },
  { label: "Pending", value: "$420.00" },
];

const users = [
  { name: "Aarav Sharma", email: "aarav@example.com", status: "Active" },
  { name: "Priya Mehta", email: "priya@example.com", status: "Active" },
  { name: "Rohan Das", email: "rohan@example.com", status: "Pending" },
];

const transactions = [
  {
    id: "TXN-1001",
    user: "Aarav Sharma",
    type: "Received",
    amount: "+$1,250.00",
    date: "May 18, 2026",
    status: "Completed",
  },
  {
    id: "TXN-1002",
    user: "Priya Mehta",
    type: "Sent",
    amount: "-$320.00",
    date: "May 17, 2026",
    status: "Completed",
  },
  {
    id: "TXN-1003",
    user: "Rohan Das",
    type: "Payment",
    amount: "$420.00",
    date: "May 16, 2026",
    status: "Pending",
  },
  {
    id: "TXN-1004",
    user: "Neha Patel",
    type: "Received",
    amount: "+$780.50",
    date: "May 15, 2026",
    status: "Completed",
  },
];
type User = {
  id: string;
  name: string;
  email: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(() => {
    const savedData = localStorage.getItem("profileData");
    return savedData ? JSON.parse(savedData) : null;
  });;
  const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")?.split(" ")[1]}`,
          },
        }
      );

      setUser(response.data.user);
      localStorage.setItem("profileData", JSON.stringify(response.data.user));
        setLoading(false);
    } catch (error) {
      console.error("User fetch failed:", error);
    }
  };

  fetchUser();
}, []);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-xl font-semibold">
              MoneyPay
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Dashboard overview for users and transactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
            <Button>{user?.name}</Button>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-0">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>People connected to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between gap-4 rounded-md border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                      {user.status}
                    </span>
                    <Button size="sm">Pay now</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent payment activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b text-muted-foreground">
                    <tr>
                      <th className="py-3 pr-4 font-medium">Transaction</th>
                      <th className="py-3 pr-4 font-medium">User</th>
                      <th className="py-3 pr-4 font-medium">Type</th>
                      <th className="py-3 pr-4 font-medium">Amount</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b last:border-b-0">
                        <td className="py-3 pr-4">
                          <div className="font-medium">{transaction.id}</div>
                          <div className="text-muted-foreground">
                            {transaction.date}
                          </div>
                        </td>
                        <td className="py-3 pr-4">{transaction.user}</td>
                        <td className="py-3 pr-4">{transaction.type}</td>
                        <td className="py-3 pr-4 font-medium">
                          {transaction.amount}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <Button size="sm" variant="outline">
                            Pay now
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
