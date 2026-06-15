"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { Banks } from "./bank";
import { IBANK } from "@/types/types";
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

interface UpdateAccountProps {
  accountId: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  icon: string;
  onSelect: (bank: IBANK) => void;
}
function UpdateAccountSkeleton() {
  return (
    <div className="space-y-5">
      {/* Bank Card Skeleton */}
      <div className="rounded-2xl border p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-xl" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* Input 1 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Input 2 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Button */}
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

export function UpdateAccount({
  accountId,
  bankName,
  branch,
  accountNumber,
  icon,
}: UpdateAccountProps) {
  const [open, setOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  const [selectedBank, setSelectedBank] = useState<IBANK | null>({
    bankName,
    branch,
    icon,
  } as IBANK);
  const [accountNo, setAccountNo] = useState(accountNumber);
  const [reAccountNo, setReAccountNo] = useState(accountNumber);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleOpenChange = async (value: boolean) => {
    setOpen(value);

    if (value) {
      setDialogLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setDialogLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError("");

    if (!selectedBank) {
      setError("Please select a bank");
      return;
    }

    if (accountNo.length !== 12) {
      setError("Account number must be 12 digits");
      return;
    }

    if (accountNo !== reAccountNo) {
      setError("Account numbers do not match");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/account/${accountId}`, {
        bankName: selectedBank.bankName,
        branch: selectedBank.branch,
        icon: selectedBank.icon,
        accountNumber: accountNo, // fixed
      });

      alert("Account updated successfully");

      window.location.reload();
    } catch (error) {
      console.error(error);
      setError("Failed to update account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button variant="outline">Update Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Account</DialogTitle>
        </DialogHeader>
        {dialogLoading ? (
          <UpdateAccountSkeleton />
        ) : (
          <>
            {selectedBank && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Bank</h4>
                <div className="relative flex items-center gap-4 rounded-2xl border p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                    <Image
                      src={selectedBank.icon}
                      alt={selectedBank.bankName}
                      width={60}
                      height={60}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{selectedBank.bankName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBank.branch}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBank(null)}
                    className="absolute right-3 top-3"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {!selectedBank && (
              <Banks onSelect={(bank) => setSelectedBank(bank)} />
            )}
            {selectedBank && (
              <FieldGroup>
                <Field>
                  <Label htmlFor="account-number">Account Number</Label>

                  <Input
                    id="account-number"
                    value={accountNo}
                    maxLength={12}
                    onChange={(e) =>
                      setAccountNo(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </Field>

                <Field>
                  <Label htmlFor="re-account-number">
                    Confirm Account Number
                  </Label>

                  <Input
                    id="re-account-number"
                    value={reAccountNo}
                    maxLength={12}
                    onChange={(e) =>
                      setReAccountNo(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </Field>

                {error && <p className="text-sm text-red-500">{error}</p>}
              </FieldGroup>
            )}

            <DialogFooter>
              <Button
                onClick={handleUpdate}
                disabled={loading || !selectedBank}
                className="w-full"
              >
                {loading ? "Updating..." : "Update Account"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
