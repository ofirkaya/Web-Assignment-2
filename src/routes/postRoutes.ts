import express, { Router } from "express";
import postController from "../controllers/postController";

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Post management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - message
 *         - sender
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB id
 *         message:
 *           type: string
 *           description: Post message text
 *         sender:
 *           type: string
 *           description: User id (ObjectId) of the sender
 *       example:
 *         _id: "65a1f0f3a9c2b2a1c1234567"
 *         message: "Hello from my first post!"
 *         sender: "65a1f0f3a9c2b2a1c7654321"
 *
 *     PostCreate:
 *       type: object
 *       required:
 *         - message
 *         - sender
 *       properties:
 *         message:
 *           type: string
 *         sender:
 *           type: string
 *       example:
 *         message: "Hello from my first post!"
 *         sender: "65a1f0f3a9c2b2a1c7654321"
 *
 *     PostUpdate:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: "Updated post message"
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", postController.get.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id (ObjectId)
 *     responses:
 *       200:
 *         description: Post found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.get("/:id", postController.getById.bind(postController));

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostCreate'
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 */
router.post("/", postController.post.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdate'
 *     responses:
 *       200:
 *         description: Post updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.put("/:id", postController.put.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id (ObjectId)
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */
router.delete("/:id", postController.delete.bind(postController));

export default router;
