import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type SignUpDataRequest } from "../module/SignUpDataRequest.js";
import { KycStatus, UserStatus, UserRole } from "../module/Enum.js";
import type { UUID } from "node:crypto";
import { ENV } from "../config/env.js";
import { type LoginResponseData } from "../module/LoginResponseData.js";
import { AppError } from "../errors/AppError.js";
import * as Core from "./core.service.js";
import type { UserLoginDataRequest } from "../module/UserLoginDataRequest.js";
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { ApplySellerRequestData } from "../module/ApplySellerRequestData.js";

export async function SignUp(request: SignUpDataRequest): Promise<UUID> {
  const { FullName, Email, Password, Phone, AddressInfo, ProvinceId, DistrictId, SubDistrictId, ZipCode } = request;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingPhone = await client.query("SELECT id FROM ct.users WHERE phone = $1", [Phone]);
    if (existingPhone.rows.length > 0) {
      throw new AppError("เบอร์โทรศัพท์นี้ถูกลงทะเบียนกับระบบแล้ว", 409);
    }

    const existingEmail = await client.query("SELECT id FROM ct.users WHERE email = $1", [Email]);
    if (existingEmail.rows.length > 0) {
      throw new AppError("อีเมลนี้ถูกลงทะเบียนกับระบบแล้ว", 409);
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const insertUserResult = await client.query(
      `INSERT INTO ct.users 
      (full_name, email, password_hash, phone, role, kyc_status, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, verify_token`,
      [FullName, Email, hashedPassword, Phone, UserRole.BUYER, KycStatus.PENDING, UserStatus.PENDING_VERIFICATION]
    );

    await client.query(
      `INSERT INTO ct.user_addresses 
      (user_id, full_name, phone, address_info, province_id, district_id, sub_district_id, zip_code, is_default) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [insertUserResult.rows[0].id, FullName, Phone, AddressInfo, ProvinceId, DistrictId, SubDistrictId, ZipCode, true]
    );

    await Core.SendVerifyEmail(Email, insertUserResult.rows[0].verify_token);

    await client.query("COMMIT");

    return insertUserResult.rows[0].id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw new AppError(error as string, 500);
  } finally {
    client.release();
  }
}

export async function Login(request: UserLoginDataRequest): Promise<LoginResponseData> {
  const { Email, Password } = request
  const result = await pool.query(
    "SELECT id, email, full_name, password_hash, phone, role, kyc_status, status, twofa_enabled, twofa_secret FROM ct.users WHERE email = $1",
    [Email]
  );

  if (result.rows.length === 0) {
    throw new AppError("อีเมลนี้ยังไม่ได้ลงทะเบียนกับระบบ", 404);
  }

  const user = result.rows[0];


  if (user.status === UserStatus.PENDING_VERIFICATION) {
    throw new AppError("บัญชีของคุณกำลังรอการยืนยันตัวตน กรุณาเช็คอีเมลที่ได้ลงทะเบียนไว้กับระบบ", 403);
  }

  const isPasswordValid = await bcrypt.compare(Password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError("รหัสผ่านไม่ถูกต้อง", 401);
  }

  if (user.twofa_enabled) {
    return {
      IsEnabled2FA: true,
    } as LoginResponseData;
  }

  const loginResponseData = await Core.SignJWT(user);

  return loginResponseData;
}

export async function CheckAlreadyExistsEmail(email: string): Promise<boolean> {
  const result = await pool.query("SELECT id FROM ct.users WHERE email = $1", [email]);

  if (result.rows.length > 0) {
    throw new AppError("อีเมลนี้ถูกลงทะเบียนกับระบบแล้ว", 409);
  }

  return false;
}

export async function ApplySeller(userId: string, request: ApplySellerRequestData) {
  const { IdCardImage, SelfieImage, BankId, BankNumber } = request;
  try {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const relativeDir = `verifications/${dateString}`;
    const uploadDir = path.join(process.cwd(), 'storage', relativeDir);

    await fs.mkdir(uploadDir, { recursive: true });

    const idCardFileName = `id_${userId}_${uuidv4()}${path.extname(IdCardImage.originalname)}`;
    const selfieFileName = `selfie_${userId}_${uuidv4()}${path.extname(SelfieImage.originalname)}`;

    await fs.rename(IdCardImage.path, path.join(uploadDir, idCardFileName));
    await fs.rename(SelfieImage.path, path.join(uploadDir, selfieFileName));

    const idCardPathForDb = path.join(relativeDir, idCardFileName);
    const selfiePathForDb = path.join(relativeDir, selfieFileName);

    await pool.query(
      `INSERT INTO ct.seller_verifications 
      (user_id, id_card_url, selfie_url, status, bank_id, bank_number) 
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, idCardPathForDb, selfiePathForDb, KycStatus.PENDING, BankId, BankNumber]
    );

  } catch (error) {
    throw new AppError(`เกิดข้อผิดพลาดในการส่งคำขอ: ${error}`, 500);
  }
}