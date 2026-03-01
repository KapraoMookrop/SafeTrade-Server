import { type NextFunction, type Request, type Response } from "express";
import * as dealService from "../services/deal.service.js";

export async function GetMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await dealService.getMessages(req.body.chatRoomId, req.body.cursor);
    res.json(users);
  } catch (error) {
    next(error);
  }
}