"use client";

import { Input } from "@/components/ui/input";
import { transferMoney } from "@/lib/https";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";

interface error {
  response: {
    data: {
      error: {
        message: string;
      };
    };
  };
}

export default function PayPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const userId = params.get("userId");

  const sendMoney = async () => {
    try {
      if (!userId) {
        toast.error("Invalid QR Code");
        return;
      }

      const parsedAmount = Number(amount);

      if (!parsedAmount || parsedAmount <= 0) {
        toast.error("Enter a valid amount");
        return;
      }

      setLoading(true);

      const res = await transferMoney(userId, parsedAmount);

      toast.success("Money sent successfully");

      console.log(res?.data);
      setAmount("");
    } catch (error: error | unknown) {
      toast.error(error?.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
        {/* Recipient */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center">
            <User className="h-8 w-8 text-violet-600" />
          </div>

          <h2 className="text-lg font-semibold">Pay User</h2>

          <p className="text-sm text-muted-foreground">User ID: {userId}</p>
        </div>

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
          disabled={loading}
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
