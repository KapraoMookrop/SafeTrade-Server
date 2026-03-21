import { type NextFunction, type Request, type Response } from "express";
import * as chatService from "../services/chat.service.js";

export async function GetMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await chatService.GetMessages(req.body, (req as any).user.userId);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function SendMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await chatService.SendMessages(req.body);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function MarkAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await chatService.MarkAsRead(req.body);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function GetAllChatRooms(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await chatService.GetAllChatRooms(req.body.userId);
    res.json(users);
  } catch (error) {
    next(error);
  }
}