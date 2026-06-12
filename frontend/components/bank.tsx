"use client"

import { useState } from "react";

interface Bank {
  name: string;
  ifsc: string;
  icon: string;
  website: string;
}

interface BankGroup {
  title: string;
  category: string;
  content: Bank[];
}
interface BanksProps {
  banksData?: BankGroup[];
  onSelect: (bank: Bank) => void;
}

export function Banks({
  banksData = [],
  onSelect,
}: BanksProps) {
  const [selectedBank, setSelectedBank] =
    useState<Bank | null>(null);

  const handleSelect = (bank: Bank) => {
    setSelectedBank(bank);
    onSelect(bank);
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
                key={bank.ifsc}
                onClick={() => handleSelect(bank)}
              >
                {bank.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}