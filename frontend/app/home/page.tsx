'use client';
import { Calendar, MapPin, Search, User } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import router from "next/router";
import { useRouter } from "next/navigation";

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
  const [role, setRole] = useState('RENTER'); 
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 

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

  useEffect(() => {
    const savedRole = localStorage.getItem('role') || 'RENTER'; 
    setRole(savedRole); 
  }, []); 
  
  const handleRoleChange = async (newRole: string) => {
    setLoading(true);
    
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('User is not authenticated.');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/user/change-role', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({ role: newRole }),
      });
  
      const data = await response.json();
      console.log(data);  // Log the response for debugging
  
      if (response.ok) {
        localStorage.setItem('role', newRole)
        setRole(newRole);
        console.log(JSON.stringify({ role: newRole }),)
        alert(data.message);  // Success message from the backend
      } else {
        alert(`Error: ${data.error || 'Role change failed'}`);
      }
    } catch (error) {
      console.error("Error changing role:", error);
      alert('Failed to change role');
    } finally {
      setLoading(false);
    }
  };
  

  

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100">
      <Navbar />

      <div className="py-16">
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Find Your Perfect Stay
            </h2>

               {/* Role Switching Section */}
               <div className="space-x-4 mb-8">
              <button
                onClick={() => handleRoleChange('RENTER')}
                disabled={loading}
                className="px-8 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-xl"
              >
                {loading && role === 'RENTER' ? 'Switching...' : ' RENTER'}
              </button>
              <button
                onClick={() => handleRoleChange('HOST')}
                disabled={loading}
                className="px-8 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-xl"
              >
                {loading && role === 'HOST' ? 'Switching...' : 'HOST'}
              </button>
            </div>

            {/* Loading State */}
            {loading && <p className="text-gray-700 font-semibold">Updating your role...</p>}

            {/* Conditional Render for 'Host' Role */}
            {role === 'HOST' && (
              <div className="mt-8 mb-12">
                <Link
                  href="/list"
                  className="px-6 py-3 text-white font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  Create Property
                </Link>
              </div>
            )}

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


