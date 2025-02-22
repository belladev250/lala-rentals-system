'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from "../components/ui/card";
import Image from 'next/image';

const AuthForm = () => {

  console.log('AuthForm component rendered');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to get query params

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('Token in URL:', token);

    if (token) {
      console.log('Token found in URL, saving to localStorage...');
      localStorage.setItem('token', token);
      console.log('AuthToken set:', localStorage.getItem('token'));
      router.push('/home');
    } else {
      console.log('No token found in URL');
    }
  }, [searchParams, router]);
  
  
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    const clientId = '846305130816-ic6e44qe27j4nbbhq09frb2cji1kh83t.apps.googleusercontent.com';

    if (!clientId) {
      setError('Google Client ID is not configured');
      setIsLoading(false);
      return;
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', 'http://localhost:5000/api/auth/callback');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'openid profile email');
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    window.location.href = authUrl.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign In with Google</h2>
            {error && <p className="mt-2 text-red-600">{error}</p>}
          </div>
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors mb-6 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="mr-2">Loading...</span>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <Image
                  src="/google.png"
                  alt="Google Logo"
                  width={26}
                  height={26}
                  className="rounded-full"
                />
                Continue with Google
              </>
            )}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
