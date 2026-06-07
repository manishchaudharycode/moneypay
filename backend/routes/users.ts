import { Router } from "express";
import { signinValidation, signupValidation } from "../validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import QRCode from "qrcode"
import { prisma, secret } from "../config/config";
import { authMiddleware } from "../middleware/userMiddleware";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // console.log(password)

    const validation = signupValidation.safeParse({ email, password, name });
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "validation error",
        error: validation.error,
      });
    }
    console.log(validation);
    const userExist = await prisma.user.findUnique({
      where: { email: email },
      select: {
        email: true,
        id: true,
        name: true,
      },
    });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "user already exists",
      });
    }
    // console.log(userExist);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    console.log(user);

    const data = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(data, secret as string, {
      expiresIn: "24d",
    });
    console.log(token);
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = signinValidation.safeParse({ email, password });
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "validation error",
        error: validation.error,
      });
    }
    console.log(validation);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        id: true,
        name: true,
        password: true,
      },
    });
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "user not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "password does not match ",
      });
    }
    const data = { id: user.id, email: user.email, name: user.name };
    const token = await jwt.sign(data, secret as string);

    return res.status(200).json({
      success: true,
      message: "user signed in successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error signin",
    });
  }
});


userRouter.get("/bulk", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const filter = (req.query.filter as string) || "";
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: filter, mode: "insensitive" } },
          { email: { contains: filter, mode: "insensitive" } },
        ],
        NOT: [
          {
            id: userId,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: "users fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error ",
    });
  }
});

userRouter.get("/me", authMiddleware, async (req, res) => {
  const userId = req.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  return res.status(200).json({
    success: true,
    user,
  });
});

userRouter.put("/update", authMiddleware, async (req: any, res) => {
  const userId = req.userId;

  console.log("USER ID =", userId);

  const { name, email } = req.body;

  console.log("Name =", name, "Email = ", email);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
    },
  });
  console.log("UpdateUser = ", updatedUser);

  return res.status(200).json({
    success: true,
    message: "user updated successfully",
    user: updatedUser,
  });
});

export default userRouter;
