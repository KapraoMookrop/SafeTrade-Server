import { type NextFunction, type Request, type Response } from "express";
import * as chatService from "../services/chat.service.js";

export async function GetMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await chatService.GetMessages(req.body, (req as any).user.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function SendMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await chatService.SendMessages(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function MarkAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await chatService.MarkAsRead(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function GetAllChatRooms(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const result = await chatService.GetAllChatRooms(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}