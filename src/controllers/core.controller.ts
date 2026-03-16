import e, { type NextFunction, type Request, type Response } from "express";
import * as coreService from "../services/core.service.js";
import { Verify2FAType } from "../module/Enum.js";

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
        res.json({ message: "ยืนยันอีเมลสำเร็จ" });
    } catch (error) {
        next(error);
    }
}

export async function Enable2FA(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, email } = (req as any).user;
        const result = await coreService.Enable2FA(userId, email);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function Disable2FA(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = (req as any).user;
        await coreService.Disable2FA(userId);
        res.json({ message: "ปิดการใช้งานการยืนยันตัวตนแบบสองชั้นสำเร็จ" });
    } catch (error) {
        next(error);
    }
}

export async function Verify2FA(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, type, email } = req.body;
        const result = await coreService.Verify2FA(email, token, type);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function SendForgotPasswordEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        await coreService.SendForgotPasswordEmail(email);
        res.json({ message: "ส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ กรุณาตรวจสอบอีเมลของคุณ" });
    } catch (error) {
        console.error("Error in SendForgotPasswordEmail controller:", error);
        next(error);
    }
}

export async function ChangePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, newPassword } = req.body;
        await coreService.ChangePassword(token, newPassword);
        res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    } catch (error) {
        console.error("Error in ChangePassword controller:", error);
        next(error);
    }
}

export async function SendMailDeleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        await coreService.SendMailDeleteAccount(email);
        res.json({ message: "ส่งอีเมลยืนยันการลบบัญชีสำเร็จ กรุณาตรวจสอบอีเมลของคุณ" });
    } catch (error) {
        console.error("Error in SendMailDeleteAccount controller:", error);
        next(error);
    }
}

export async function DeleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        await coreService.DeleteAccount(token);
        res.json({ message: "ลบบัญชีสำเร็จ" });
    } catch (error) {
        console.error("Error in DeleteAccount controller:", error);
        next(error);
    }
}