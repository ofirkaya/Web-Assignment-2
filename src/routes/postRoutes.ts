import express, { Router } from "express";
import postController from "../controllers/postController";

const router: Router = express.Router();

router.get("/", postController.get.bind(postController));

router.get("/:id", postController.getById.bind(postController));

router.post("/", postController.post.bind(postController));

router.put("/:id", postController.put.bind(postController));

export default router;
