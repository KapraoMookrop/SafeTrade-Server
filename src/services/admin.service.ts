import path from 'path';
import pool from '../config/database.js';
import { AppError } from '../errors/AppError.js';
import type { SellerData } from '../module/SellerData.js';

export async function getSellerVerification(): Promise<SellerData[]> {
    const sql = await pool.query(
        `SELECT user_id, id_card_url, selfie_url, status, bank_id, bank_number
         FROM ct.seller_verifications`
    );

    if (sql.rowCount === 0) {
        return [] as SellerData[];
    }

    const result = sql.rows.map((seller) => ({
        SellerId: seller.user_id,
        BankId: seller.bank_id,
        BankNumber: seller.bank_number,
        IdCardImageUrl: seller.id_card_url,
        SelfieImageUrl: seller.selfie_url
    } as SellerData));

    return result
}

export async function getIdCardImagePath(sellerId: string): Promise<string> {
    const result = await pool.query(
        `SELECT id_card_url FROM ct.seller_verifications WHERE user_id = $1`,
        [sellerId]
    );

    if (result.rowCount === 0) {
        throw new AppError('ไม่พบรูปบัตรประชาชน', 404);
    }

    return path.join(process.cwd(), 'storage', result.rows[0].id_card_url);
}

export async function getSelfieImagePath(sellerId: string): Promise<string> {
    const result = await pool.query(
        `SELECT selfie_url FROM ct.seller_verifications WHERE user_id = $1`,
        [sellerId]
    );

    if (result.rowCount === 0) {
        throw new AppError('ไม่พบรูป selfie', 404);
    }

    return path.join(process.cwd(), 'storage', result.rows[0].selfie_url);
}