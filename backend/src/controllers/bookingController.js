import { body, validationResult } from "express-validator";
import prisma from "../config/prisma.js";

export const createBooking = async (req, res) => {
  // Validate the request body
  await body('propertyId').isString().notEmpty().run(req);
  await body('checkIn').isISO8601().toDate().run(req);
  await body('checkOut').isISO8601().toDate().custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.checkIn)) {
      throw new Error('checkOut must be after checkIn date');
    }
    return true;
  }).run(req);
  await body('status').isIn(['PENDING', 'CONFIRMED', 'CANCELED']).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { propertyId, checkIn, checkOut, status } = req.body;
  const renterId = req.user.id;

  try {
    // Check if the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // Check if the property is available for the requested dates
    const existingBookings = await prisma.booking.findMany({
      where: {
        propertyId: propertyId,
        OR: [
          {
            checkIn: { lt: checkOut, gte: checkIn } // Booking starts before requested checkOut, but after checkIn
          },
          {
            checkOut: { lte: checkOut, gt: checkIn } // Booking ends after requested checkIn, but before checkOut
          }
        ]
      }
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "The property is not available for the selected dates." });
    }

    // Create the new booking
    const booking = await prisma.booking.create({
      data: { renterId, propertyId, checkIn, checkOut, status },
    });

    res.status(201).json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the booking." });
  }
};
