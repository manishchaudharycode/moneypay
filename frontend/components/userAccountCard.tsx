"use client";

import Image from "next/image";
import { UpdateAccount } from "./updateAccount";

interface UserAccountCardProps {
  bankName: string;
  branch: string;
  accountNumber: string;
  image: string;
  id: string;
}

export function UserAccountCard({
  bankName,
  accountNumber,
  image,
  branch,
  id,
}: UserAccountCardProps) {
  const maskedAccountNumber =
    accountNumber.length > 4
      ? `${"X".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`
      : accountNumber;

      console.log(id);

  return (
    <div className="flex w-max p-4">
      <div className="relative max-w-sm rounded-3xl border bg-slate-900 p-12">
        <div className="absolute right-3 top-3">
          <UpdateAccount
            accountId={id}
            bankName={bankName}
            branch={branch}
            accountNumber={accountNumber}
            image={image}
          />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-neutral-500">
            <Image
              src={image}
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
      </div>
    </div>
  );
}