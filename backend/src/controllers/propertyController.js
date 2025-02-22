import prisma from "../config/prisma.js";

export const createProperty = async (req, res) => {
  const { title, description, price, location } = req.body;

  const hostId = req.user.id;

  

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


export const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id:id },
      
    }
  );

  console.log(property); 

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // if (property.hostId !== req.user.id) {
    //   return res.status(403).json({ error: "Forbidden: Only the host who created this property can delete it" });
    // }

    await prisma.property.delete({
      where: { id:id },
    });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location } = req.body;

  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // if (property.hostId !== req.user.id) {
    //   return res.status(403).json({ error: "Forbidden: Only the host who created this property can update it" });
    // }

    const images = req.files ? req.files.map(file => file.filename) : [];

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { title, description, price, location, images },
    });

    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


