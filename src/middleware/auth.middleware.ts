import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "คุณยังไม่ได้เข้าสู่ระบบ" });
    return;
  }

  jwt.verify(token, ENV.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(401).json({ message: "กรุณาเข้าสู่ระบบอีกครั้ง" });
      return;
    }
    
    (req as any).user = user;
    next();
  });
};