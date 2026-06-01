"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@base-ui/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
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
interface Account {
  id: number;
  name: string;
  accountNumber: string;
  bankName: string;
}

export default function DashboardPage() {
  const [name, setName] = useState<User | null>();
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("/account/all");
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me");
        setName(response.data.user);
      } catch (error) {
        console.error("User fetch failed:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/bulk");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };
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
        <div className="">
          <Account></Account>
        </div>
        <div className="grid gap-4">
          {loading ? (
            <p>Loading accounts...</p>
          ) : (
            <div className="grid gap-4">
              {accounts?.map((account) => (
                <UserAccountCard
                  key={account.id}
                  username={account.name}
                  accountNumber={account.accountNumber}
                  bankName={account.bankName}
                />
              ))}
            </div>
          )}
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <div>
                <Input
                  className="w-75 p-1 mt-1 rounded-xl"
                  placeholder="user"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                ></Input>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-20 rounded-md border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <SendMoney name={user.name} to={user.id} />
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
                      <tr
                        key={transaction.id}
                        className="border-b last:border-b-0"
                      >
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
