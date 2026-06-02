import { Router } from "express";
import { prisma } from "../config/config";
import { authMiddleware } from "../middleware/userMiddleware";

const accountRouter = Router();
accountRouter.use(authMiddleware);

accountRouter.get("/balance", async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request",
      });
    }
    
    const user = await prisma.account.findFirst({
      where: { userId },
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
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      balance: user.balance,
      userDetails: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching balance",
    });
  }
});

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

accountRouter.post("", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const { bankName, branch, image, accountNumber,  } = req.body;

    if (!bankName || !branch || !image || !accountNumber ) {
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

accountRouter.put("/update", async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const { bankName, branch, image, accountNumber, } = req.body;

    const account = await prisma.account.findFirst({
      where: { userId },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    const updatedAccount = await prisma.account.update({
      where: { accountNumber: account.accountNumber },
      data: {
        ...(bankName && { bankName }),
        ...(branch && { branch }),
        ...(image && { image }),
        ...(accountNumber && { accountNumber }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

accountRouter.get("/all", async (req, res) => {
  const userId = req.userId;
  console.log("hi");
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

accountRouter.get("/:id", authMiddleware, async (req, res) => {
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

accountRouter.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

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
      where: { accountNumber: account.accountNumber },
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

export default accountRouter;
