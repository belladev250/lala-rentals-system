'use client';
import { Calendar, MapPin, Search, User } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

// Define the Property interface
interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  images: string[];
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  // Fetch properties data from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/properties");
        const data = await response.json();
        setFeaturedProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100">
      <Navbar />

      <div className="py-16">
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Find Your Perfect Stay
            </h2>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>Dates</span>
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <User className="h-5 w-5 text-gray-400" />
                    <span>Guests</span>
                  </button>

                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">Featured Properties</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.length > 0 ? (
            featuredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={`http://localhost:5000${property.images[0]}`}  // Corrected image syntax
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.title}
                  </h4>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">${property.price}</span>
                      <span className="text-gray-600"> /night</span>
                    </div>
                    <Link href={`/property/${property.id}`}  className="text-purple-600 hover:text-purple-700 font-semibold">
                      View Details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-600">No featured properties available</div>
          )}
        </div>
      </div>
    </div>
  );
}
