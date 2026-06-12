"use client";

import { useState } from "react";
import Image from "next/image";
import { banksData } from "@/lib/data/bank";

interface Bank {
  name: string;
  ifsc: string;
  icon: string;
}

interface BankGroup {
  title: string;
  category: string;
  content: Bank[];
}

interface BanksProps {
  banksData: BankGroup[];
  onSelect?: (bank: Bank) => void;
}

export function Banks({
  banksData,
  onSelect,
}: BanksProps) {
  const [selectedBank, setSelectedBank] =
    useState<Bank | null>(null);

  const handleSelect = (bank: Bank) => {
    setSelectedBank(bank);

    if (onSelect) {
      onSelect(bank);
    }
  };

  return (
    <div className="space-y-6">
      {banksData.map((group) => (
        <div key={group.category}>
          <h3 className="mb-3 text-lg font-semibold">
            {group.title}
          </h3>

          <div className="space-y-2">
            {group.content.map((bank) => (
              <button
                key={`${group.category}-${bank.ifsc}`}
                onClick={() => handleSelect(bank)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition hover:bg-gray-50 ${
                  selectedBank?.ifsc === bank.ifsc
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={bank.icon}
                  alt={bank.name}
                  className="h-8 w-8 object-contain"
                />

                <div>
                  <div className="font-medium">
                    {bank.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    IFSC Prefix: {bank.ifsc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}