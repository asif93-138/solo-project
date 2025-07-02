import { Router } from "express";
import {
  checkTitle,
  createMovie,
  deleteMovie,
  editMovie,
  getAllMovies,
  getMovieById,
  getMovieByUserId
} from "../controllers/movieController";

const router = Router();

router.get("/", getAllMovies);
router.get("/title", checkTitle);
router.post("/", createMovie);
router.get("/:id", getMovieById);
router.get("/user/:id", getMovieByUserId);
router.put("/:id", editMovie);
router.delete("/:id", deleteMovie);

export default router;
