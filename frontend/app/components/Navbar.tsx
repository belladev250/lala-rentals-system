'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <nav className='bg-white flex left-0 w-full p-8 justify-between shadow-md'>
      <div>
        <Link href="/home" className='text-3xl font-nunito font-ultrabold text-purple-600'>LALA</Link>
      </div>
      <ul className='flex space-x-10'>
        <Link href="/list">
          <li className='text-lg font-Nunito py-1 cursor-pointer '>List property</li>
        </Link>
        <button 
          onClick={handleLogout} 
          className='text-lg bg-purple-600 text-white py-1 px-3 rounded-md font-Nunito shadow-md'
        >
          Logout
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;
