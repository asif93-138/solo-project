// import RR from "../models/Ratings&Reviews";
import { Request, Response } from "express";
import db from "../models";

const RR = db.RR;

export const addReview = async (req: Request, res: Response) => {
    try {
        const rr = await RR.create(req.body);
        res.status(201).json(rr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create review" });
    }
}

export const updateReviewById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const rr = await RR.findByPk(id);

        if (!rr) {
            res.status(404).json({ error: "Review not found" });
            return;
        }

        await rr.update(updatedData);

        res.status(200).json(rr);
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ error: "Failed to update review" });
    }
}

