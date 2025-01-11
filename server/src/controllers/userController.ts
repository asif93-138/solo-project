import User from "../models/Users";
import { Request, Response } from "express";

export const signUpWithLogin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email is already in use" });
      return;
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(200).json(user);
      return;
    } else {
      res.status(404).json({ error: "User not found" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
    return;
  }
};
