import Genre from "../models/Genre";
import { Request, Response } from "express";

// // Route: Insert a single genre
// app.post("/genres", async (req: Request, res: Response) => {
// try {
//     const genre = await Genre.create(req.body);
//     res.status(201).json(genre);
// } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create genre" });
// }
// });

export const addGenre = async (req: Request, res: Response) => {
    try {
        const genre = await Genre.create(req.body);
        res.status(201).json(genre);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create genre" });
    }
}

// // Route: Read all genres
// app.get("/genres", async (req: Request, res: Response) => {
//   try {
//     const genres = await Genre.findAll();
//     res.status(200).json(genres);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch genres" });
//   }
// });

export const getAllGenres = async (req: Request, res: Response) => {
    try {
        const genres = await Genre.findAll();
        res.status(200).json(genres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch genres" });
    }
}