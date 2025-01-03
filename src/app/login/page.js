'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ApiService from "@/lib/ApiServiceFunction";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";

const roles = [
  "Process Administrator",
  "Pharmacovigilance Scientist",
  "Senior Pharmacovigilance Scientist",
  "Drug Safety Physician",
  "Manager",
  "Super-Admin"
];

const permissions = [
  "Admin Panel",
  "Worklists",
  "Duplicate Search",
  "Reconciliation",
  "Intake/Triage",
  "Data Entry",
  "Quality Review",
  "Case final review",
  "Medical review",
  "Audit Data"
];

export default function LoginPage() {
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [password, setPassword] = useState('');

  // Common states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const alreadyReloaded = localStorage.getItem('page_reloaded');
  
    if (token && !alreadyReloaded) {
      localStorage.setItem('page_reloaded', 'true'); // Set flag to avoid repeated reloads
      window.location.reload();
    } else if (!token) {
      localStorage.removeItem('page_reloaded'); // Reset flag if token is missing
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await ApiService.post(`${ApiEndPoints?.login}`, {
        email: loginEmail,
        password: loginPassword,
      });

      const data = await response.data;

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        window.location.reload();
      } else {
        throw new Error();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
console.log("token", localStorage.getItem("access_token"));
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await ApiService.post(`${ApiEndPoints?.signup}`, {
        email,
        username,
        full_name: fullName,
        role,
        permissions: selectedPermissions,
        password,
      });

      const data = await response.data;

      if (data.success) {
        // Redirect to login tab or show success message
        window.location.reload();
      } else {
        throw new Error();
      }
    } catch (error) {
      setError("An unexpected error occurred during signup. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center h-full bg-white">
              <img
                src="/images/HAROM Logo-Photoroom.png"
                alt="HAROM Logo"
                className="w-auto h-auto max-h-[200px] object-contain"
              />
            </div>
            <div className="p-6">
              <CardHeader className="text-center px-0">
                <CardTitle className="text-[#2961b0] text-2xl font-bold">
                  Harom Safety Suite v1.0
                </CardTitle>
              </CardHeader>
              
              <Tabs defaultValue="login" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button className="w-full" type="submit" disabled={loading}>
                      {loading ? "Loading..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullname">Full Name</Label>
                      <Input
                        id="signup-fullname"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-role">Role</Label>
                      <Select value={role} onValueChange={setRole} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={`permission-${permission}`}
                              checked={selectedPermissions.includes(permission)}
                              onCheckedChange={(checked) => {
                                setSelectedPermissions(
                                  checked
                                    ? [...selectedPermissions, permission]
                                    : selectedPermissions.filter((p) => p !== permission)
                                )
                              }}
                            />
                            <Label htmlFor={`permission-${permission}`} className="text-sm">
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Choose a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button className="w-full" type="submit" disabled={loading}>
                      {loading ? "Loading..." : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Welcome to HAROM Safety Suite
                  <br />
                  © 2025 HAROM Solutions. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

