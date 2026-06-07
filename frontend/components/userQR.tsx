"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import qr from "qrcode";

export default function QRCode({ userId }: { userId: string }) {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    qr.toDataURL(`${
    process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"
    }/pay?userId=${userId}`, (err, url) => {
      console.log(err);
      console.log(url);
      if (!err) setQrCode(url);
    });
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">UPI QR Code</h2>
      {qrCode ? (
        <Image
          src={qrCode}
          alt="UPI QR Code"
          width={250}
          height={250}
          className="border rounded-lg"
        />
      ) : (
        <p>QR Code not available</p>
      )}
    </div>
  );
}
