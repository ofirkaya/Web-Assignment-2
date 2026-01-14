import express, { Router } from "express";
import commentController from "../controllers/commentController";

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Comment management
 */

/**
 * @swagger
 * /comment:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get("/", commentController.get.bind(commentController));

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comment by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment found
 *       404:
 *         description: Comment not found
 */
router.get("/:id", commentController.getById.bind(commentController));

/**
 * @swagger
 * /comment:
 *   post:
 *     tags: [Comments]
 *     summary: Create a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - postId
 *               - content
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Invalid input
 */
router.post("/", commentController.post.bind(commentController));

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     tags: [Comments]
 *     summary: Update a comment by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Comment updated
 *       404:
 *         description: Comment not found
 */
router.put("/:id", commentController.put.bind(commentController));

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 */
router.delete("/:id", commentController.delete.bind(commentController));

export default router;
