import { Router } from "express";
import { addReview, updateReviewById } from "../controllers/reviewController";

const router = Router();

router.post("/", addReview);
router.put("/:id", updateReviewById);

export default router;
