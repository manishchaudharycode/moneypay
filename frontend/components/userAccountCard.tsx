"use client";

interface UserAccountCardProps {
  username: string;
  accountNumber: string;
  bankName: string;
}

export function UserAccountCard({
  username,
  accountNumber,
  bankName,
}: UserAccountCardProps) {
  const maskedAccountNumber =
    accountNumber.length > 4
      ? `${"X".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`
      : accountNumber;

  return (
    <div className="w-full max-w-md rounded-3xl border bg-neutral-900 p-10 shadow-lg transition-all hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-500 text-xl font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-xl font-semibold text-white">
          {username}
        </h2>
      </div>

      <div className="mt-6 text-xl text-white">
        <p>{bankName}</p>
      </div>

      <div className="mt-6 border-t border-neutral-700 pt-4">
        <h3 className="font-mono text-2xl font-bold tracking-widest text-white">
          {maskedAccountNumber}
        </h3>
      </div>
    </div>
  );
}