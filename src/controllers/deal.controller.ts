import { type NextFunction, type Request, type Response } from "express";
import * as dealService from "../services/deal.service.js";

export async function CreateChatRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await dealService.CreateChatRoom(req.body);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function CreateDeal(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await dealService.CreateDeal(req.body);
    res.json(users);
  } catch (error) {
    next(error);
  }
}