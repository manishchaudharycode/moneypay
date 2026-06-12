import { Router } from "express";
import { prisma } from "../config/config";
import { authMiddleware } from "../middleware/userMiddleware";

const accountRouter = Router();
accountRouter.use(authMiddleware);

accountRouter.post("/transfer", async (req, res) => {
  const { amount, to } = req.body;

  try {
    if (!amount || !to) {
      return res.status(400).json({
        success: false,
        message: "Amount and recipient ID are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const senderAccount = await tx.account.findFirst({
        where: { userId: req.userId },
      });

      if (!senderAccount) {
        throw new Error("Sender account not found");
      }

      if (senderAccount.balance < amount) {
        throw new Error("Insufficient balance");
      }
      const receiverAccount = await tx.account.findFirst({
        where: { userId: to },
      });

      if (!receiverAccount) {
        throw new Error("Receiver account not found");
      }
      await tx.account.update({
        where: { accountNumber: senderAccount.accountNumber },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      await tx.account.update({
        where: { accountNumber: receiverAccount.accountNumber },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      const transaction = await tx.transaction.create({
        data: {
          amount,
          senderId: senderAccount.userId,
          recieverId: receiverAccount.userId,
        },
        include: { sender: true, reciever: true }, // Fixed typo
      });

      console.log(
        "Transfer - Sender:",
        transaction.sender.name,
        "Receiver:",
        transaction.reciever.name,
      );

      return transaction;
    });

    return res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: result,
    });
  } catch (error) {
    console.error(error);

    const message = error instanceof Error ? error.message : "Server error";

    return res.status(400).json({
      success: false,
      message,
    });
  }
});

accountRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const { bankName, branch, image, accountNumber } = req.body;

    if (!bankName || !branch || !image || !accountNumber) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    const existingAccount = await prisma.account.findUnique({
      where: {
        accountNumber,
      },
    });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Account already exists",
      });
    }
    const account = await prisma.account.create({
      data: {
        bankName,
        branch,
        accountNumber,
        image,
        userId,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: account,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

accountRouter.get("/test", (req, res) => {
  res.json({ message: "working" });
});

accountRouter.get("/:accountNumber", async (req, res) => {
  const { accountNumber } = req.params;
  try {
    const account = await prisma.account.findFirst({
      where: { accountNumber },
    });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }
    return res.status(200).json({ success: true, data: account });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

accountRouter.put("/:accountId", async (req, res) => {
  try {
    const userId = req.userId;
    const { accountId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { bankName, branch, image, accountNumber } = req.body;
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }
    if (accountNumber && accountNumber !== account.accountNumber) {
      const existingAccount = await prisma.account.findFirst({
        where: {
          accountNumber,
          NOT: {
            id: account.id,
          },
        },
      });

      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: "Account number already exists",
        });
      }
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        ...(bankName !== undefined && { bankName }),
        ...(branch !== undefined && { branch }),
        ...(image !== undefined && { image }),
        ...(accountNumber !== undefined && { accountNumber }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    console.error("Update Account Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

accountRouter.get("/all", async (req, res) => {
  const userId = req.userId;
  try {
    const allAccs = await prisma.account.findMany({ where: { userId } });

    const mappedRes = allAccs.map((acc) => ({
      id: acc.id,
      name: acc.bankName,
      branch: acc.branch,
      accountNumber: "**** **** " + acc.accountNumber.slice(8, 12),
      image: acc.image,
    }));

    return res.json({
      success: true,
      message: "All Acc",
      accounts: mappedRes,
    });
  } catch (error) {}
});

accountRouter.get("/detail/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const accountId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const account = await prisma.account.findFirst({
      where: { id: accountId! },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: account.id,
        accountNumber: account.accountNumber,
        balance: account.balance,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

accountRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const account = await prisma.account.findFirst({
      where: { userId },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    await prisma.account.delete({
      where: { id: id as string },
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

accountRouter.get("/transactions", async (req, res) => {
  const userId = req.userId;
  try {
    const transactions = await prisma.transaction.findMany({
      where: { senderId: userId },
      include: { sender: true, reciever: true },
    });
    const mappedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount,
      sender: transaction.sender.name,
      reciever: transaction.reciever.name,
      date: transaction.createdAt,
    }));
    return res
      .status(200)
      .json({
        success: true,
        message: "Transactions fetched successfully",
        transactions: mappedTransactions,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

accountRouter.get("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(id) },
      include: { sender: true, reciever: true },
    });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Transaction fetched successfully",
        transaction: transaction,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default accountRouter;
