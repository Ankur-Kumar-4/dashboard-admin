'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter from next/navigation

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Check if the token exists in localStorage

    if (token) {
      router.push('/dashboard/user-management'); // Redirect to dashboard if token is present
    } else {
      router.push('/login'); // Redirect to login if no token is found
    }
  }, [router]);

  // No UI to render, it will redirect automatically based on the token
  return null;
}
