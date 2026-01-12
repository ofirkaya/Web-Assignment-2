import express, { Router } from "express";
import commentController from "../controllers/commentController";

const router: Router = express.Router();

router.get("/", commentController.get.bind(commentController));

router.get("/:id", commentController.getById.bind(commentController));

router.post("/", commentController.post.bind(commentController));

router.put("/:id", commentController.put.bind(commentController));

router.delete("/:id", commentController.delete.bind(commentController));

export default router;
