import { Router } from "express";
import { uploadImage } from "../controllers/uploadController";
import fs from 'fs';

const router = Router();

router.post("/", uploadImage);
router.delete("/", (req, res) => {
    fs.unlinkSync("C:\\Users\\WIN 10\\solo-project\\server\\express\\uploads" + "\\" + req.body.fileName);
    res.send("deleted!");
});

export default router;
