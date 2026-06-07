import { Router } from "express";
import { authMiddleware } from "../middleware/userMiddleware";
import * as QRCode from "qrcode";
import { prisma} from "../config/config";

const qrRoute = Router()

qrRoute.get("/my-qr", authMiddleware, async (req, res) => {
  try {
    const amount = req.query.amount || "100";

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        name: true,
        upiID: true,
      },
    });

    if (!user?.upiID) {
      return res.status(400).json({
        success: false,
        message: "UPI ID not found",
      });
    }

    const upiUrl = `upi://pay?pa=${user.upiID}&pn=${encodeURIComponent(
      user.name
    )}&am=${amount}&cu=INR`;

    const qrCode = await QRCode.toDataURL(upiUrl);

    return res.json({
      success: true,
      qrCode,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "QR not generate this code",
    });
  }
});


export default qrRoute