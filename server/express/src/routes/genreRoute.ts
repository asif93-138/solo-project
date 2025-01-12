import { Router } from "express";
import { addGenre, getAllGenres } from "../controllers/genreController";

const router = Router();

router.post("/", addGenre);
router.get("/", getAllGenres);

export default router;
