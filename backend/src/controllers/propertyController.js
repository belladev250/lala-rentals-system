import prisma from "../config/prisma.js";

export const createProperty = async (req, res) => {
  const { title, description, price, location } = req.body;

  const hostId = req.user.id;

  const property = await prisma.property.create({
    data: { title, description, price, location, hostId },
  });

  res.json(property);
  console.log( "daaaaaaaaaaaaaaaata ",property)
};

export const getAllProperties = async (req, res) => {
  const properties = await prisma.property.findMany();
  res.json(properties);
};
