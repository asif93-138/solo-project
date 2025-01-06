import { Router } from "express";
import { addReview, getReviewByID, updateReviewByID } from "../controllers/reviewController";

const router = Router();

router.post("/", addReview);
router.get("/:id", getReviewByID);
router.put("/:id", updateReviewByID);

export default router;
