"use client";

import { useState } from "react";
import Image from "next/image";

import { IBANK } from "@/types/types";

const banks: IBANK[] = [
  {
    id: 1,
    bankName: "State Bank of India",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-image.svg",
    branch: "Delhi Main Branch",
  },
  {
    id: 2,
    bankName: "HDFC Bank",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
    branch: "Mumbai Central Branch",
  },
  {
    id: 3,
    bankName: "ICICI Bank",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
    branch: "Bangalore Tech Park",
  },
  {
    id: 4,
    bankName: "Axis Bank",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg",
    branch: "Noida Sector 18",
  },
];

interface BanksProps {
  onSelect: (bank: IBANK) => void;
}

export function Banks({ onSelect }: BanksProps) {
  const [selectedBank, setSelectedBank] = useState<IBANK | null>(null);

  const handleSelect = (bank: IBANK) => {
    setSelectedBank(bank);
    onSelect?.(bank);
  };

  return (
    <div className="space-y-2">
      {banks.map((bank) => {
        const isSelected = selectedBank?.id === bank.id;

        return (
          <button
            type="button"
            key={bank.id}
            onClick={() => handleSelect(bank)}
            className={`flex items-center w-full gap-4 rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md hover:scale-[1.01]
              ${
                isSelected
                  ? "border-primary bg-primary/10 ring-2 ring-primary"
                  : "border-border bg-secondary hover:bg-secondary/80"
              }`}
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-sm">
              <Image
                src={bank.image}
                alt={bank.bankName}
                width={60}
                height={60}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <h4 className="text-base font-semibold">{bank.bankName}</h4>
              <p className="text-sm text-muted-foreground">{bank.branch}</p>

              {isSelected && (
                <span className="mt-2 w-fit rounded-full bg-primary px-3 py-1 text-xs text-white">
                  Selected
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
