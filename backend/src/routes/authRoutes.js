
import express from 'express';

import {googleSignIn,googleAuthCallback } from '../controllers/authController.js'

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

router.post('/google', googleSignIn); 
router.get('/callback', googleAuthCallback); 

export default router;