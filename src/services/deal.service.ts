import type { UUID } from "node:crypto";
import pool from "../config/database.js";
import { type CreateDealRequest } from "../module/CreateDealRequest.js";
import { AppError } from "../errors/AppError.js";
import type { CreateChatRoomRequest } from "../module/CreateChatRoomRequest.js";
import { ChatRoomStatus } from "../module/Enum.js";

export async function CreateChatRoom(request: CreateChatRoomRequest): Promise<UUID> {
    const { BuyerId, SellerId } = request;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const room = await client.query(
            `INSERT INTO ct.chat_rooms (buyer_id, seller_id, status)
             VALUES ($1, $2, $3) RETURNING id`,
            [BuyerId, SellerId, ChatRoomStatus.ACTIVE]
        );

        const chatRoomId = room.rows[0].id;

        await client.query(
            `INSERT INTO ct.chat_room_members
                (chat_room_id, user_id, last_read_at)
            VALUES ($1, $2, NOW()),
                   ($1, $3, NOW())`,
            [chatRoomId, BuyerId, SellerId]
        );

        await client.query("COMMIT");

        return chatRoomId;

    } catch (err) {
        await client.query("ROLLBACK");
        throw new AppError("ไม่สามารถสร้างห้องแชทได้ กรุณาลองใหม่อีกครั้ง" + err, 500);
    } finally {
        client.release();
    }
}

export async function CreateDeal(request: CreateDealRequest) {
    const { ChatRoomId, BuyerId, SellerId, Title, Description, Amount, Status } = request;

    const createDeal = await pool.query(
        "INSERT INTO ct.deals (chat_room_id, buyer_id, seller_id, title, description, amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [ChatRoomId, BuyerId, SellerId, Title, Description, Amount, Status]
    );

    const dealIdValue = createDeal.rows[0].id;

    return dealIdValue;
}