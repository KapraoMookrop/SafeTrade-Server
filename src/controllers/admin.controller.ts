import { type NextFunction, type Request, type Response } from "express";
import * as adminService from "../services/admin.service.js";

export async function getSellerVerification(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getSellerVerification();

    res.json(data);

  } catch (error) {
    next(error);
  }
}

export async function getIdCardImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { sellerId } = req.params;

    const filePath = await adminService.getIdCardImagePath(sellerId as string);

    res.setHeader('Cache-Control', 'no-store'); 
    res.sendFile(filePath);

  } catch (error) {
    next(error);
  }
}

export async function getSelfieImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { sellerId } = req.params;

    const filePath = await adminService.getSelfieImagePath(sellerId as string);

    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(filePath);

  } catch (error) {
    next(error);
  }
}