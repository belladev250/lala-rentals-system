import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { authenticateUser } from "../middlewares/authmiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking
 *     description: Renters can book a property by specifying check-in and check-out dates.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid booking request
 */
router.post("/", authenticateUser, createBooking);

export default router;
