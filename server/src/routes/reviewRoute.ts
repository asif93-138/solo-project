import { Router } from "express";
import { addReview, deleteReviewById, updateReviewById } from "../controllers/reviewController";

const router = Router();

router.post("/", addReview);
router.put("/:id", updateReviewById);
router.delete("/:id", deleteReviewById);

export default router;
