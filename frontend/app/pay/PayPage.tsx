"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";
import { api } from "@/lib/api";

interface Account {
  _id: string;
  image: string;
  accountNumber: string;
  bankName: string;
  branch: string;
}

export default function PayPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const params = useSearchParams();
  const userId = params.get("userId");

  useEffect(() => {
    (async () => {
      try {
        setLoadingAccounts(true);
        const res = await api.get("/account/all");
        setAccounts(res.data.accounts || []);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoadingAccounts(false);
      }
    })();
  }, []);

  const sendMoney = async () => {
    try {
      if (!userId) {
        toast.error("Invalid QR Code");
        return;
      }

      if (!selectedAccount) {
        toast.error("Please select an account to pay from");
        return;
      }

      const parsedAmount = Number(amount);

      if (!parsedAmount || parsedAmount <= 0) {
        toast.error("Enter a valid amount");
        return;
      }

      setLoading(true);

      await api.post("/account/transfer", {
        fromAccountId: selectedAccount._id,
        to: userId,
        amount: parsedAmount,
      });

      toast.success("Money sent successfully");

      setAmount("");
      setSelectedAccount(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bgflex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl shadow-lg p-6">
        {/* Recipient */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="h-16 w-16 rounded-full flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>

          <h2 className="text-lg font-semibold">Pay User</h2>

          <p className="text-sm text-muted-foreground">User ID: {userId}</p>
        </div>

        {/* Accounts list */}
        <div className="mb-4">
          <label className="text-sm font-medium">
            Select account to pay from
          </label>

          <div className="flex gap-3 overflow-x-auto py-3 hide-scrollbar mt-3">
            {loadingAccounts ? (
              <div className="text-sm text-muted-foreground">
                Loading accounts...
              </div>
            ) : accounts.length > 0 ? (
              accounts.map((acc) => (
                <div
                  key={acc._id}
                  onClick={() => setSelectedAccount(acc)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all ${
                    selectedAccount?._id === acc._id
                      ? "ring-2 ring-violet-400"
                      : ""
                  }`}
                >
                  <p className="font-medium">{acc.bankName}</p>
                  <p className="text-sm text-muted-foreground">
                    {acc.accountNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">{acc.branch}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No accounts found
              </div>
            )}
          </div>
        </div>

        {/* Selected account details */}
        {selectedAccount && (
          <div className="rounded-lg border p-4 mb-4">
            <p className="font-medium">{selectedAccount.bankName}</p>

            <p className="text-sm text-muted-foreground">
              {selectedAccount.accountNumber}
            </p>

            <p className="text-sm text-muted-foreground">
              {selectedAccount.branch}
            </p>
          </div>
        )}

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>

          <div className="flex items-center border rounded-xl px-4 h-14">
            <span className="text-2xl font-semibold mr-2">₹</span>

            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="border-0 shadow-none text-2xl focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={sendMoney}
          disabled={loading || !selectedAccount}
          className="w-full mt-6 h-12 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Secure payment
        </p>
      </div>
    </div>
  );
}
