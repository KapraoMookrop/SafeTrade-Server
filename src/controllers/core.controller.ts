import { type NextFunction, type Request, type Response } from "express";
import * as coreService from "../services/core.service.js";

export async function GetProvinces(req: Request, res: Response, next: NextFunction) {
    try {
        const provinces = await coreService.GetProvinces();
        res.json(provinces);
    } catch (error) {
        next(error);
    }
}

export async function GetDistricts(req: Request, res: Response, next: NextFunction) {
    try {
        const { provinceId } = req.query;
        const districts = await coreService.GetDistricts(provinceId as string);
        res.json(districts);
    } catch (error) {
        next(error);
    }
}

export async function GetSubDistricts(req: Request, res: Response, next: NextFunction) {
    try {
        const { districtId } = req.query;
        const subDistricts = await coreService.GetSubDistricts(districtId as string);
        res.json(subDistricts);
    } catch (error) {
        next(error);
    }
}

export async function VerifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { verifyToken } = req.query;
    await coreService.VerifyEmail(verifyToken as string);
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
}
