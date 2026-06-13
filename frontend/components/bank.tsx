"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2 } from "lucide-react";

import { Bank, getIndianBanks } from "@/lib/bank";
import { Input } from "@/components/ui/input";

interface BanksProps {
  onSelect?: (bank: Bank) => void;
}

export function Banks({ onSelect }: BanksProps) {
  const [selectedBank, setSelectedBank] = React.useState<Bank | null>(null);
  const [query, setQuery] = React.useState("");
  const banks = React.useMemo(() => getIndianBanks(), []);
  const filteredBanks = React.useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return banks;

    return banks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(q) ||
        bank.ifsc.toLowerCase().includes(q),
    );
  }, [banks, query]);

  const handleSelect = (bank: Bank) => {
    setSelectedBank(bank);
    onSelect?.(bank);
  };

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search bank..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 pl-10"
        />
      </div>
      <motion.div layout className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {filteredBanks.slice(0, 8).map((bank) => {
            const selected = selectedBank?.ifsc === bank.ifsc;
            return (
              <motion.button
                key={bank.ifsc}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(bank)}
                className={`
                  group relative flex w-full items-center gap-4
                  rounded-2xl border p-4 text-left
                  transition-all
                  ${
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/30 hover:shadow-md"
                  }
                `}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Image
                    src={bank.icon}
                    alt={bank.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{bank.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    IFSC Prefix: {bank.ifsc}
                  </p>
                </div>
                <AnimatePresence>
                  {selected && (
                    <motion.div>
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>
      {filteredBanks.length === 0 && (
        <motion.div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">No banks found.</p>
        </motion.div>
      )}
    </div>
  );
}
