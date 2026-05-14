import { Router } from "express";
import { signinValidation, signupValidation } from "../validation";
import bcrypt from "bcryptjs";
import jwt, { verify } from "jsonwebtoken";
import { prisma, secret } from "../config/config";

const userRouter = Router();

// userRouter.use("/", async (req, res, next) => {
//   const path = req.url;
//   if (path.includes("/signup") || path.includes("/signin")) {
//     return next();
//   }
//   const token = req.header("authorization") || "";
//   if (!token) {
//     return res.status(403).json({
//       msg: "token required",
//     });
//   }

//   try {
//     const user = verify(token, secret) as { id: string };
//     if (user) {
//       res.set("userId", user.id);
//       next();
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Invalid or expired token ",
//     });
//   }
// });

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const validation = signupValidation.safeParse({ email, password, name });
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "validation error",
        error: validation.error,
      });
    }

    const userExist = await prisma.user.findUnique({
      where: { email },
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

    const hashedPassword = await bcrypt.hash(password, 10);
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

    const data = { id: user.id, email: user.email, name: user.name };
    const token = await jwt.sign(data, secret as string, {
      expiresIn: "1d",
    });
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error during  user creation",
    });
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

userRouter.get("/bulk", async (req, res) => {
  try {
    const filter = (req.query.filter as string) || "";

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: filter, mode: "insensitive" } },
          { email: { contains: filter, mode: "insensitive" } },
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

userRouter.get("/me", async (req, res) => {
  try {
    const userId = req.get("userId");
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
});

userRouter.put("/update", async (req, res) => {
  try {
    const userId = req.get("userId");
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
});

export default userRouter;
