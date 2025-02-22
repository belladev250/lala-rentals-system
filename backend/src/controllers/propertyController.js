import prisma from "../config/prisma.js";

export const createProperty = async (req, res) => {
  const { title, description, price, location } = req.body;

  const hostId = req.user.id;

  // if (req.user.role !== "HOST") {
  //   return res.status(403).json({ error: "Forbidden: Only hosts can create properties" });
  // }

  try {
    const images = req.files ? req.files.map(file => file.filename) : [];

    const property = await prisma.property.create({
      data: { title, description, price, location,images, hostId },
    });
    res.json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany();

    const propertiesWithFullImageUrls = properties.map(property => {
      const imageUrls = property.images.map(image => `/uploads/${image}`); 
      return { ...property, images: imageUrls };
    });

    res.json(propertiesWithFullImageUrls);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id: id },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const imageUrls = property.images.map(image => `/uploads/${image}`);
    const propertyWithFullImageUrls = { ...property, images: imageUrls };

    res.json(propertyWithFullImageUrls);
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


