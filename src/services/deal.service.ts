import type { UUID } from "node:crypto";
import pool from "../config/database.js";
import { type CreateDealRequest } from "../module/CreateDealRequest.js";
import { DealStatus } from "../module/Enum.js";

export async function CreateChatRoom(request: CreateDealRequest): Promise<UUID> {
    const { BuyerId, SellerId } = request;

    const createChatRoom = await pool.query(
        "INSERT INTO ct.chat_rooms (buyer_id, seller_id) VALUES ($1, $2) RETURNING id",
        [BuyerId, SellerId]
    );

    const chatRoomIdValue = createChatRoom.rows[0].id;

    return chatRoomIdValue;
}

export async function getMessages(chatRoomId: string, cursor?: string) {

    console.log(`Fetching messages for chatRoomId: ${chatRoomId} with cursor: ${cursor}`);
    const PAGE_SIZE = 20;

    const params: any[] = [chatRoomId];
    let cursorCondition = "";

    if (cursor) {
        cursorCondition = `AND created_at < $2`;
        params.push(cursor);
    }

    console.log(`SELECT * FROM ct.view_chat_room_messages
                                    WHERE chat_room_id = $1
                                    ${cursorCondition}
                                    ORDER BY created_at DESC
                                    LIMIT ${PAGE_SIZE}` + ` with params: ${params}`);


    const result = await pool.query(`SELECT *
                                        FROM ct.view_chat_room_messages
                                    WHERE chat_room_id = $1
                                    ${cursorCondition}
                                    ORDER BY created_at DESC
                                    LIMIT ${PAGE_SIZE}`, params);

    const messages = result.rows.reverse();

    return {messages,
            nextCursor: messages.length > 0 ? messages[0].created_at : null,
            hasMore: messages.length === PAGE_SIZE
    };
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