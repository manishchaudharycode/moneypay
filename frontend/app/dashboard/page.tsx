"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@base-ui/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SendMoney } from "@/components/send";
import { api } from "@/lib/api";
import { Account } from "@/components/account";
import { UserAccountCard } from "@/components/userAccountCard";

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

interface AccountType {
  id: string;
  image: string;
  accountNumber: string;
  bankName: string;
  branch: string;
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Balance Card */}
        <Skeleton className="h-32 w-full rounded-xl" />

        {/* Accounts */}
        <div className="flex gap-4">
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              className="h-48 w-80 flex-shrink-0 rounded-xl"
            />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[500px] rounded-xl" />
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");
  const [accounts, setAccounts] = useState<AccountType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();

      try {
        const [userRes, usersRes, accountsRes] = await Promise.all([
          api.get("/user/me"),
          api.get("/user/bulk"),
          api.get("/account/all"),
        ]);

        setName(userRes.data.user);
        setUsers(usersRes.data.users);
        setAccounts(accountsRes.data.accounts);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }

      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 3000 - elapsed);

      setTimeout(() => {
        setLoading(false);
      }, remaining);
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

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

            <Button>{name?.name}</Button>

            <Button onClick={handleLogOut}>Logout</Button>
          </div>
        </header>
        <div className="ml-240"><Account /></div>
        <div className="flex gap-4 overflow-x-auto px-2">
          {accounts.map((account) => (
            <UserAccountCard
              key={account.id}
              id={account.id}
              image={account.image}
              bankName={account.bankName}
              branch={account.branch}
              accountNumber={account.accountNumber}
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Users */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>

              <Input
                className="mt-2 w-full rounded-xl border p-2"
                placeholder="Search user..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </CardHeader>

            <CardContent className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <SendMoney name={user.name} to={user.id} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Recent payment activity.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="py-3">Transaction</th>
                      <th className="py-3">User</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3">
                          <div className="font-medium">
                            {transaction.id}
                          </div>
                          <div className="text-muted-foreground">
                            {transaction.date}
                          </div>
                        </td>

                        <td>{transaction.user}</td>
                        <td>{transaction.type}</td>
                        <td className="font-medium">
                          {transaction.amount}
                        </td>

                        <td>
                          <span className="rounded border px-2 py-1 text-xs">
                            {transaction.status}
                          </span>
                        </td>

                        <td>
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