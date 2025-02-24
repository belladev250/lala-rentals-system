'use client'

import React, { useState } from 'react';
import { MapPin, Upload, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card'; 
import Navbar from '../components/Navbar';
import {useRouter} from 'next/navigation';

interface FormDataType {
  title: string;
  location: string;
  price: string;
  description: string;
}



const PropertyCreationForm = () => {
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    location: '',
    price: '',
    description: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [priceError, setPriceError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  const validatePrice = (value: string): boolean => {
    if (!value) return false;
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      // Allow empty string or numbers with up to 2 decimal places
      const regex = /^\d*\.?\d{0,2}$/;
      if (value === '' || regex.test(value)) {
        setFormData({ ...formData, [name]: value });
        setPriceError(validatePrice(value) ? '' : 'Please enter a valid price');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePrice(formData.price)) {
      setPriceError('Please enter a valid price');
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('location', formData.location);
      formDataObj.append('price', formData.price); // Ensure it's a valid number
      formDataObj.append('description', formData.description);

      images.forEach(image => {
        formDataObj.append('images', image);
      });

      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property');
      }

      const data = await response.json();
      console.log('Property created successfully:', data);

      setSuccessMessage('Property created successfully!');
      setTimeout(() => {
        router.push('/home'); 
      }, 2000);

      setFormData({
        title: '',
        location: '',
        price: '',
        description: '',
      });
      setImages([]);
      setPriceError('');
    } catch (error) {
      console.error('Error creating property:', error);
      alert(error instanceof Error ? error.message : 'Failed to create property');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Property Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="p-6">

            {successMessage && (
                  <div className="text-green-600 bg-green-100 p-4 rounded-lg mb-4">
                    {successMessage}
                  </div>
                )}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Enter property title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter property location"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${priceError ? 'border-red-500' : ''}`}
                      placeholder="Enter price"
                      required
                    />
                    {priceError && (
                      <p className="text-red-500 text-sm mt-1">{priceError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    
                    placeholder="Describe your property"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {images.map((img, idx) => (
    <div key={idx} className="relative">
      <img
        src={URL.createObjectURL(img)} // Use object URL to display image
        alt={`Upload ${idx + 1}`}
        className="w-full h-24 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={() => removeImage(idx)}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ))}
  
  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-purple-600">
    <Upload className="h-8 w-8 text-gray-400" />
    <span className="mt-2 text-sm text-gray-600">Upload Image</span>
    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
  </label>
</div>


                  
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Create Property Listing
                  </button>
                </div>

                
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
};

export default PropertyCreationForm;
