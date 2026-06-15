"use client";

import Image from "next/image";
import { UpdateAccount } from "./updateAccount";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import { TotalBalance } from "./balance";

interface UserAccountCardProps {
  accountId: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  icon: string;
  id: string;
}

export function UserAccountCard({
  bankName,
  accountNumber,
  icon,
  branch,
  id,
}: UserAccountCardProps) {
  const [showBalance, setShowBalance] = useState(false);

  const maskedAccountNumber =
    accountNumber.length > 4
      ? `${"X".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`
      : accountNumber;

  return (
    <div className="flex w-max p-4">
      <div className="relative max-w-sm rounded-3xl border bg-slate-900 p-12">
        <div className="absolute right-3 top-3 flex items-center gap-3">
          {showBalance ? (
            <IconEyeOff
              stroke={2}
              onClick={() => setShowBalance(false)}
              className="cursor-pointer rounded-2xl bg-neutral-600 p-1"
            />
          ) : (
            <>
              <IconEye
                stroke={2}
                onClick={() => setShowBalance(true)}
                className="cursor-pointer rounded-2xl bg-neutral-600 p-1"
              />
              <UpdateAccount
                accountId={id}
                bankName={bankName}
                branch={branch}
                accountNumber={accountNumber}
                icon={icon}
              />
            </>
          )}
        </div>

        {showBalance ? (
          <TotalBalance showDetails={true} accountNumber={accountNumber} />
        ) : (
          <>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-neutral-500">
                <Image
                  src={icon}
                  alt={bankName}
                  width={60}
                  height={60}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="text-sm text-white">
                <p className="font-semibold">{bankName}</p>
                <p className="text-gray-300">{branch}</p>
              </div>
            </div>

            <div className="mt-6 pt-4">
              <h3 className="font-mono text-2xl font-bold tracking-widest text-white">
                {maskedAccountNumber}
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
