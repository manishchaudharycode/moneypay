import { Router } from "express";
import { verify } from "jsonwebtoken";
import { prisma, secret } from "../config/config";

const accountRouter = Router();

accountRouter.use(async (req, res, next) => {
  const token = req.header("authorization") || "";
  try {
    const user = verify(token, secret) as { id: string };
    if (user) {
      res.set("usrId", user.id);
      next();
    } else {
      res.status(403).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Invalid and expired token",
    });
  }
});

accountRouter.get("/balance", async (req, res) => {
  try {
    const userId = req.get("userId");
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User Id not found in request ",
      });
    }
    const user = await prisma.account.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        balance: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Balance not found user",
      });
    }
    return res.status(200).json({
      success: true,
      balance: user.balance,
      userDetails: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error feching balance",
    });
  }
});

accountRouter.post("/transfer", async (req, res) => {
  const { amount, to } = req.body;
  try {
    await prisma.$transaction(async (prisma) => {
      // sender account
      const account = await prisma.account.findUnique({
        where: { userId: req.userId },
      });
      if (!account) {
        res.json({
          message: "sender account not found",
        });
      }
      if (account!.balance < amount) {
        return res.status(401).json({
          success: true,
          message: "Insufficient balance",
        });
      }
      //receive account
      const receiverAccount = await prisma.account.findUnique({
        where: {
          userId: to,
        },
      });
      if (!receiverAccount) {
        return res.status(401).json({
          message: "Invalid account",
        });
      }

      //deduct money from sender
      await prisma.account.update({
        where: { userId: req.userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Add money to receiver
      await prisma.account.update({
        where: { userId: to },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const transaction = await prisma.transaction.create({
        data: {
          amount,
          // accountId: account!.id,
          senderId: account!.userId,
          recieverId: receiverAccount.id!,
        },
        include: { sender: true, reciever: true },
      });
      console.log(
        "Sender:",
        transaction.sender!.name,
        "Receiver:",
        transaction.reciever.name,
      );

      return res.status(200).json({
        success: true,
        message: " Transfer successfully",
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "server error",
    });
  }
});

export default accountRouter;
