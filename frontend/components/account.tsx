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
import { useState } from "react";
import { Banks } from "./bank";
import { IBANK } from "@/types/types";
import Image from "next/image";
import { X } from "lucide-react";
import { api } from "@/lib/api";

export function Account() {
  const [accountNumber, setAccountNumber] = useState("");
  const [reAccountNumber, setReAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState<IBANK | null>(null);
  const [error, setError] = useState("");
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAccountNumber(value);
    setReAccountNumber(value);
  };
  const handleAccount = async () => {
    if (accountNumber.length < 12 || accountNumber.length > 12 ) {
      setError("Account number must be at least 12 digits");
      return 
      ;
    }
    // if (accountNumber.length > 12 ) {
    //   setError("Account number must be at least 12 digits");
    //   return 
    //   ;
    // }
     if (accountNumber !== reAccountNumber) {
      setError("Account numbers do not match");
      return;
    }

     
    try {

      const response = await api.post(
        "/account",
        {
          name: selectedBank?.name,
          branch: selectedBank?.branch,
          image: selectedBank?.image,
          accountNumber,
        },
        
      );
      window.location.href="/dashboard"
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger>
          <Button
            variant="outline"
            className=" ml-240 mb-5 h-12 px-6 text-base rounded-xl"
          >
            Add Account
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
          </DialogHeader>
          <div>
            {selectedBank && (
              <div>
                <h4>Selected Bank</h4>

                <button
                  type="button"
                  key={selectedBank.id}
                  className={
                    "flex items-center w-full gap-4 rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md hover:scale-[1.01] relative"
                  }
                >
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-sm">
                    <Image
                      src={selectedBank.image}
                      alt={selectedBank.name}
                      width={60}
                      height={60}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h4 className="text-base font-semibold">
                      {selectedBank.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBank.branch}
                    </p>
                  </div>
                  <div
                    onClick={() => setSelectedBank(null)}
                    className="absolute top-5 right-5"
                  >
                    <X className="size-4" />
                  </div>
                </button>
              </div>
            )}
          </div>
          {!selectedBank && (
            <Banks onSelect={(bank) => setSelectedBank(bank)} />
          )}
          {selectedBank && (
            <FieldGroup>
              <Field>
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  type="number"
                  min={12}
                  max={12}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </Field>

              <Field>
                <Label htmlFor="re-account-number">Re-Account Number</Label>
                <Input
                  id="re-account-number"
                  type="number"
                  min={12}
                  max={12}
                  value={reAccountNumber}
                  onChange={handleAccountChange}
                />
                {error && (
                  <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
                )}
              </Field>
            </FieldGroup>
          )}

          <DialogFooter>
            <Button onClick={handleAccount}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
