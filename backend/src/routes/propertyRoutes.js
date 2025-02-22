import express from "express";
import { createProperty, getAllProperties,getPropertyById ,deleteProperty,updateProperty } from "../controllers/propertyController.js";
import { authenticateUser } from "../middlewares/authmiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a property
 *     description: Hosts can create property listings.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("", authenticateUser, upload.array("images", 4), createProperty);



/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     description: Renters can view all available properties.
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.delete('/:id', deleteProperty);
router.put('/:id', updateProperty); // 'images' is the key for the files


export default router;
