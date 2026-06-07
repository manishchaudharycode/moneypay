"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { UserAccountCard } from "./userAccountCard";

interface Account {
  _id: string;
  image: string;
  accountNumber: string;
  bankName: string;
  branch: string;
}

function AccountCardSkeleton() {
  return (
    <div className="min-w-[320px] rounded-xl border p-4">
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-52" />
      </div>
    </div>
  );
}

export function SendMoney({ to, name }: { to: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/account/all");
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogChange = async (value: boolean) => {
    setOpen(value);

    if (value) {
      await fetchAccounts();
    } else {
      setSelectedAccount(null);
      setAmount("");
    }
  };

  const handleTransfer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedAccount) {
      alert("Please select an account");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setSending(true);

      await api.post("/account/transfer", {
        fromAccountId: selectedAccount._id,
        to,
        amount: Number(amount),
      });

      alert("Money sent successfully");

      setOpen(false);
      setSelectedAccount(null);
      setAmount("");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Transfer failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger>
        <Button variant="outline">Pay now</Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl ">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-5">
          <div className="flex gap-4 overflow-x-auto py-5 ">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <AccountCardSkeleton key={index} />
              ))
            ) : accounts.length > 0 ? (
              accounts.map((account) => (
                <div
                  key={account._id}
                  onClick={() => setSelectedAccount(account)}
                  className={`cursor-pointer rounded-xl transition-all ${
                    selectedAccount?._id === account._id
                      ? ""
                      : ""
                  }`}
                >
                  <UserAccountCard
                    id={account._id}
                    image={account.image}
                    bankName={account.bankName}
                    branch={account.branch}
                    accountNumber={account.accountNumber}
                  />
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No accounts found
              </div>
            )}
          </div>
          {selectedAccount && (
            <div className="rounded-lg border p-4">
              <p className="font-medium">{selectedAccount.bankName}</p>

              <p className="text-sm text-muted-foreground">
                {selectedAccount.accountNumber}
              </p>

              <p className="text-sm text-muted-foreground">
                {selectedAccount.branch}
              </p>
            </div>
          )}
          {loading ? (
            <>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <Skeleton className="h-12 w-12 rounded-full" /> 
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-muted-foreground">Recipient</p>
                </div>
              </div>

              <Field>
                <Label htmlFor="amount">Amount (₹)</Label>

                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Field>

              <DialogFooter>
                <Button
                  onClick={handleTransfer}
                  disabled={sending || !selectedAccount}
                  className="w-full"
                >
                  {sending ? "Transferring..." : "Transfer Money"}
                </Button>
              </DialogFooter>
            </>
          )}
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
