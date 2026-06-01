"use client";

import { Button } from "@/components/ui/button";
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
import { useState } from "react";


export function SendMoney({ to, name }: { to: string; name: string }) {
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    try {
      const response = await api.post("/account/transfer", {
        to,
        amount: Number(amount),
      });

      alert("Money sent successfully");
    window.location.href = "/dashboard";
      console.log(response.data);
      
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger >
          <Button variant="outline">Pay now</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="">Send Money</DialogTitle>
          </DialogHeader>
          <FieldGroup className="mt-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <Field>
              <Label className="mt-5">Amount (in Rs)</Label>
              <Input
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                id="amount"
                placeholder="Enter amount"
                type="number"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              onClick={handleTransfer}
              type="submit"
              className="mr-30 w-25 p-5 text-xl mt-5"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
