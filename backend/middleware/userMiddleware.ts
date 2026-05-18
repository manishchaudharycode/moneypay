import jwt from "jsonwebtoken";
import { secret } from "../config/config";
import type { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const path = req.path;

  // Skip auth for signup/signin
  if (
    path.includes("/signup") ||
    path.includes("/signin")
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      msg: "Token required",
    });
  }

  const token = authHeader.split(" ")[1];

 console.log("Token = ",token)

  if (!token) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      secret as string
    ) as any;

   console.log( "Decoded =",decoded);

    req.userId = decoded.id;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};