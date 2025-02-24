// Home.tsx
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './components/AuthContext';
import AuthForm from './components/Auth';

export default function Home() {
  const router = useRouter();
  const { token } = useAuth(); 

  // useEffect(() => {
  //   if (!token) {
  //     console.log("No token found. Redirecting to login...");
  //     router.push('/list'); // Example redirect to login page
  //   }
  // }, [token, router]);

  return (
    <main className="p-4">
      <AuthForm />
    </main>
  );
}
