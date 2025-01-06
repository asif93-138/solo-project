import { Router } from "express";
import { addReview, updateReviewByID } from "../controllers/reviewController";

const router = Router();

router.post("/", addReview);
router.put("/:id", updateReviewByID);

export default router;
