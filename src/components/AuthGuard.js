'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login"); // Redirect to login if no token is found
    } else {
      setIsAuthenticated(true); // User is authenticated
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Prevent rendering until authentication is checked
  }

  return <>{children}</>;
};

export default AuthGuard;