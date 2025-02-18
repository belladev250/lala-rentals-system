import prisma from "../config/prisma.js";

export const createBooking = async (req, res) => {
  const { propertyId, checkIn, checkOut } = req.body;
  const renterId = req.user.id;

  const booking = await prisma.booking.create({
    data: { renterId, propertyId, checkIn, checkOut },
  });

  res.json(booking);
};
