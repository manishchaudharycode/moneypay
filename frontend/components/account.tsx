"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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

import { Banks } from "./bank";
import { api } from "@/lib/api";
import { IBANK } from "@/types/types";

function AccountSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-xl" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function Account() {
  const [open, setOpen] = useState(false);
  const [dialogLoading, setDialogLoading] =
    useState(false);

  const [selectedBank, setSelectedBank] =
    useState<IBANK | null>(null);

  const [accountNumber, setAccountNumber] =
    useState("");

  const [reAccountNumber, setReAccountNumber] =
    useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleOpenChange = async (
    value: boolean
  ) => {
    setOpen(value);

    if (value) {
      setDialogLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      setDialogLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setError("");

    if (!selectedBank) {
      setError("Please select a bank");
      return;
    }

    if (accountNumber.length !== 12) {
      setError(
        "Account number must be 12 digits"
      );
      return;
    }

    if (accountNumber !== reAccountNumber) {
      setError(
        "Account numbers do not match"
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/account", {
        bankName: selectedBank.bankName,
        branch: selectedBank.branch,
        image: selectedBank.image,
        accountNumber,
      });

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setError(
        "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger >
        <Button
          variant="outline"
          className="h-12 rounded-xl px-6 text-base"
        >
          Add Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add Account
          </DialogTitle>
        </DialogHeader>

        {dialogLoading ? (
          <AccountSkeleton />
        ) : (
          <>
            {selectedBank && (
              <div className="space-y-2">
                <h4 className="font-medium">
                  Selected Bank
                </h4>

                <div className="relative flex items-center gap-4 rounded-2xl border p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                    <Image
                      src={selectedBank.image}
                      alt={
                        selectedBank.bankName
                      }
                      width={60}
                      height={60}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {
                        selectedBank.bankName
                      }
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {
                        selectedBank.branch
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedBank(null)
                    }
                    className="absolute right-3 top-3"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {!selectedBank && (
              <Banks
                onSelect={(bank) =>
                  setSelectedBank(bank)
                }
              />
            )}

            {selectedBank && (
              <FieldGroup>
                <Field>
                  <Label htmlFor="account-number">
                    Account Number
                  </Label>

                  <Input
                    id="account-number"
                    type="text"
                    maxLength={12}
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter 12 digit account number"
                  />
                </Field>

                <Field>
                  <Label htmlFor="re-account-number">
                    Confirm Account Number
                  </Label>

                  <Input
                    id="re-account-number"
                    type="text"
                    maxLength={12}
                    value={reAccountNumber}
                    onChange={(e) =>
                      setReAccountNumber(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Re-enter account number"
                  />
                </Field>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}
              </FieldGroup>
            )}

            <DialogFooter>
              <Button
                onClick={
                  handleCreateAccount
                }
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? "Creating..."
                  : "Add Account"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}