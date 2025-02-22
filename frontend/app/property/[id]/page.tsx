'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Users, Calendar } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import Navbar from '../../components/Navbar';
import { useParams, useRouter } from 'next/navigation';

interface Property {
    id: number;
    title: string;
    location: string;
    price: number;
    images: string[];
    description: string;
}

const PropertyDetails = () => {
    const { id } = useParams(); 
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
  
    useEffect(() => {
        if (id) {
            const fetchProperty = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/properties/${id}`);
                    const data = await response.json();
                    setProperty(data);
                } catch (error) {
                    console.error("Error fetching property details:", error);
                }
            };
            fetchProperty();
        }
    }, [id]);

    if (!property) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={() => router.back()} className="flex items-center text-purple-600 mb-6">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to properties
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 mr-1" />
                                {property.location}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {property.images?.[0] && (
                                <img
                                    src={`http://localhost:5000${property.images[0]}`}
                                    alt="Main"
                                    className="col-span-2 row-span-2 rounded-lg w-full h-full object-cover"
                                />
                            )}
                            {property.images?.slice(1).map((img, idx) => (
                                img && (
                                    <img
                                        key={idx}
                                        src={`http://localhost:5000${img}`}
                                        alt={`View ${idx + 1}`}
                                        className="rounded-lg w-full h-48 object-cover"
                                    />
                                )
                            ))}
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Description</h2>
                            <p className="text-gray-600">{property.description}</p>
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
