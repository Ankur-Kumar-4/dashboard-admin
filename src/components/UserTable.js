"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCcw ,Loader2} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ApiService from "@/lib/ApiServiceFunction";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserTable({
  searchQuery = "",
  tableData = [],
  getUsers,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    current_password: "",
    new_password: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { toast } = useToast()

  // Handle input changes for reset password
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData({
      ...resetPasswordData,
      [name]: value,
    });
  };

  // Reset Password submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const { new_password } = resetPasswordData;
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No authentication token found",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await ApiService.put(`https://2v4hkr6hho5fsiqqq75ct2rzim0fcprd.lambda-url.us-east-1.on.aws/users/${userId}/reset-password?password_reset=${new_password}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast({
        title: "Success",
        description: "Password reset successfully!",
        variant: "default",
      });
      setIsLoading(false);
      setIsOpen(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      console.log(error);
    }

    setResetPasswordData({ current_password: "", new_password: "" });
    setIsOpen(false);
  };

  // Sorting logic
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const [editUserData, setEditUserData] = useState({});
  const handleEditUser = async (e) => {
    e.preventDefault();
  
    const { email, username, full_name, disabled, role } = editUserData;
  
    if (!email || !username || !full_name) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
  
    const formattedData = {
      email: email.trim(),
      username: username.trim(),
      full_name: full_name.trim(),
      disabled: !!disabled,
      role: role.trim(),
    };

  
    try {
      setIsLoading(true);
      const response = await ApiService.put(
        `https://2v4hkr6hho5fsiqqq75ct2rzim0fcprd.lambda-url.us-east-1.on.aws/users/${userId}/update-details`, formattedData

      );
  

        toast({
          title: "Success",
          description: "User updated successfully!",
          variant: "default",
        });
        setIsOpen2(false);
        getUsers();
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({ title: "An unexpected error occurred. Please try again.", variant: "destructive" });
      setIsLoading(false);
    }
  };
  
  const handleRoleChange = (value) => {
    setEditUserData(prev => ({ ...prev, role: value }))
  }
  // Filter and sort users
  const filteredAndSortedUsers = Array.isArray(tableData)
    ? [...tableData]
        .filter((user) =>
          Object.values(user).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
        .sort((a, b) => {
          if (!sortConfig.key) return 0;

          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];

          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        })
    : [];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => sortData("email")}
            >
              Email{" "}
              {sortConfig.key === "email" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Username</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => sortData("full_name")}
            >
              Full Name{" "}
              {sortConfig.key === "full_name" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Disabled</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
  {filteredAndSortedUsers.map((user) => (
    <TableRow key={user._id}>
      <TableCell>{user?.email || "N/A"}</TableCell>
      <TableCell>{user?.username || "N/A"}</TableCell>
      <TableCell>{user?.role || "N/A"}</TableCell>
      <TableCell>{user?.full_name || "N/A"}</TableCell>
      <TableCell>
        <Switch checked={user?.disabled || false} />
      </TableCell>
      <TableCell className="flex gap-5">
        <Pencil
          onClick={() => {
            setIsOpen2(true);
            setEditUserData(user);
            setUserId(user._id);
            console.log(user._id);
          }}
          className="hover:text-blue-500 cursor-pointer"
          size={16}
        />
        <Trash2 className="hover:text-red-500 cursor-pointer" size={16} />
        <RefreshCcw
          onClick={() => {
            setIsOpen(true);
            setUserId(user._id);
          }}
          className="hover:text-green-500 cursor-pointer"
          size={16}
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* <div className="space-y-2">
              <Label htmlFor="current_password">current Password</Label>
              <Input
                id="current_password"
                name="current_password"
                type="password"
                required
                value={resetPasswordData.current_password}
                onChange={handleInputChange}
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                name="new_password"
                type="password"
                required
                value={resetPasswordData.new_password}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </Button>
              ) : (
                <Button type="submit">Update User</Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={editUserData?.email}
          onChange={handleEditInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          value={editUserData.username}
          onChange={handleEditInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          required
          value={editUserData.full_name}
          onChange={handleEditInputChange}
        />
      </div>
      <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" value={editUserData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Order Book">Order Book</SelectItem>
                <SelectItem value="Management Team">Management Team</SelectItem>
                <SelectItem value="Delivery Agent">Delivery Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled</Label>
        <input
          id="disabled"
          name="disabled"
          type="checkbox"
          className="w-4 ms-2 translate-y-[2px]"
          checked={editUserData.disabled}
          onChange={(e) =>
            setEditUserData((prevData) => ({
              ...prevData,
              disabled: e.target.checked,
            }))
          }
        />
      </div>
      <DialogFooter>
        <Button type="button" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        {isLoading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </Button>
        ) : (
          <Button type="submit">Update User</Button>
        )}
      </DialogFooter>
    </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
