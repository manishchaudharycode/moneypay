"use client";

import { Input } from "@/components/ui/input";
import { transferMoney } from "@/lib/https";
import { Button } from "@base-ui/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PayPage() {
  const [amount, setAmout] = useState<number>(0);
  const params = useSearchParams();
  const userId = params.get("userId");

  const sendMoney = async () => {
    let res;
    if (userId) {
      res = await transferMoney(userId!, amount);
    }
    console.log(res?.data);
  };

  return (
    <div>
      <Input
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmout(parseInt(e.target.value))}
      />
      <Button onClick={sendMoney}>Send</Button>
    </div>
  );
}
