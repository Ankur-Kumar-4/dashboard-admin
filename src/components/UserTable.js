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
import { Pencil, Trash2, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
export default function UserTable({ searchQuery = "", tableData = [] , setIsEditUser, isEditUser}) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sort function
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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



    const handelResetPassword = async(e) => {
      setIsOpen(false)
    }
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
            <TableHead>Disabled</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user, index) => (
            <TableRow key={user.username || index}>
              <TableCell>{user.email || "N/A"}</TableCell>
              <TableCell>{user.username || "N/A"}</TableCell>
              <TableCell>{user.full_name || "N/A"}</TableCell>
              <TableCell>
                <Switch checked={user.disabled || false} />
              </TableCell>
              <TableCell className="flex gap-5">
                <div className="relative group inline-block">
                  <Pencil
                    onClick={() => setIsEditUser(true)}
                    className="hover:text-blue-500 cursor-pointer"
                    size={16}
                  />
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit
                  </span>
                </div>

                <div className="relative group inline-block">
                  <Trash2
                    className="hover:text-red-500 cursor-pointer"
                    size={16}
                  />
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Delete
                  </span>
                </div>

                <div className="relative group inline-block">
                  <RefreshCcw
                    className="hover:text-red-500 cursor-pointer"
                    size={16}
                    onClick={() => setIsOpen(true)}
                  />
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Reset Password
                  </span>
                </div>
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
          <form onSubmit={handelResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">New Password</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              // value={userData.email}
              // onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Confirm Password</Label>
            <Input
              id="username"
              name="username"
              required
              // value={userData.username}
              // onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
