import prisma from "../config/prisma.js";

export const createProperty = async (req, res) => {
  const { title, description, price, location } = req.body;

  const hostId = req.user.id;

  if (req.user.role !== "HOST") {
    return res.status(403).json({ error: "Forbidden: Only hosts can create properties" });
  }

  try {
    const images = req.files ? req.files.map(file => file.filename) : [];

    const property = await prisma.property.create({
      data: { title, description, price, location,image, hostId },
    });
    res.json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProperties = async (req, res) => {
  const properties = await prisma.property.findMany();
  res.json(properties);
};
