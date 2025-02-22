"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from '../../components/ui/card';
import Navbar from '../../components/Navbar';

const EditPropertyPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [images, setImages] = useState<File[]>([]);

    const [property, setProperty] = useState({
        title: '',
        location: '',
        price: '',
        description: '',
        images: [],
    });

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

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setProperty((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(property),
            });
            if (response.ok) {
                router.push('/home');
            } else {
                console.error("Error updating property");
            }
        } catch (error) {
            console.error("Error updating property:", error);
        }
    };

    return (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 min-h-screen">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={property.title}
                                onChange={handleChange}
                                placeholder="Title"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="location"
                                value={property.location}
                                onChange={handleChange}
                                placeholder="Location"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                value={property.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <textarea
                                name="description"
                                value={property.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="w-full p-2 border rounded"
                                required
                            />

             {images.map((img, idx) => {
    console.log("Image URL:", URL.createObjectURL(img));
    return (
        <div key={idx} className="relative">
            <img
                src={URL.createObjectURL(img)}
                alt={`Upload ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg"
            />
          
        </div>
    );
})}

                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded w-full"
                            >
                                Update Property
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default EditPropertyPage;
