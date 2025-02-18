
import express from 'express';
import { googleSignIn } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Google login
 *     description: Authenticate a user using Google OAuth.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google OAuth token
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Unauthorized
 */

router.post('/google-signin', googleSignIn);

export default router;
