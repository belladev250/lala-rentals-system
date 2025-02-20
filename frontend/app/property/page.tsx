'use client';
import React from 'react';
import { ArrowLeft, MapPin, Users, Bed, Bath, Home, Calendar, Star } from "lucide-react";
import { Card, CardContent } from '../components/ui/card';


const PropertyDetails = () => {
  const property = {
    id: 1,
    title: "Luxury Beachfront Villa",
    location: "Malibu, CA",
    price: 299,
    rating: 4.9,
    reviews: 128,
    beds: 4,
    baths: 3,
    guests: 8,
    sqft: 2500,
    description: "Experience luxury living in this stunning beachfront villa. Featuring panoramic ocean views, a private pool, and direct beach access, this property offers the perfect escape for those seeking premium accommodation.",
    amenities: ["Pool", "Beach Access", "WiFi", "Kitchen", "Parking", "Air Conditioning"],
    images: [
      "/api/placeholder/800/500",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ]
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 min-h-screen">
   
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => window.history.back()} className="flex items-center text-purple-600 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-1" />
                {property.location}
              </div>
              <div className="flex items-center text-yellow-500">
                <Star className="h-5 w-5 mr-1 fill-current" />
                <span>{property.rating}</span>
                <span className="text-gray-600 ml-1">({property.reviews} reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <img src={property.images[0]} alt="Main" className="col-span-2 row-span-2 rounded-lg w-full h-full object-cover" />
              {property.images.slice(1).map((img, idx) => (
                <img key={idx} src={img} alt={`View ${idx + 1}`} className="rounded-lg w-full h-48 object-cover" />
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-semibold">{property.guests}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-2">
                <Bed className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold">{property.beds}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-2">
                <Bath className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-semibold">{property.baths}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="font-semibold">{property.sqft}</p>
                </div>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">{property.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-600">
                    <div className="h-2 w-2 bg-purple-600 rounded-full" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-3xl font-bold text-purple-600">${property.price}</span>
                    <span className="text-gray-600"> /night</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                    <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span>Select dates</span>
                    </button>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span>Add guests</span>
                    </button>
                  </div>
                </div>

                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  Reserve Now
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;