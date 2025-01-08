import { Request, Response } from "express";
import { upload } from "../middlewares/multerConfig";

export const uploadImage = (req: Request, res: Response) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.status(500).send("Error uploading file.");
        }
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
        res.status(200).json({
            message: "File uploaded successfully!",
            filePath: `/uploads/${req.file.filename}`,
        });
    });
};
