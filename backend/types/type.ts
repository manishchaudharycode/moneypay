import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;  
      accountNumber?: string
      branch: string
    }
  }
}

