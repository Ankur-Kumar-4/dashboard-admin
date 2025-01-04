"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileUser, Package, User, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";
import ApiService from "@/lib/ApiServiceFunction";

const menuItems = [
  //   { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: "Orders", href: "/dashboard/orders" },
  { icon: FileUser, label: "Order Form", href: "/dashboard/order-form" },
  { icon: Users, label: "User Management", href: "/dashboard/user-management" },
];
const handleLogout = async () => {
  try {
    const response = await ApiService.post(ApiEndPoints.logout, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    localStorage.removeItem("access_token");
    window.location.href = "/";
  } catch (error) {
    console.error(error);
  }
};

export default function TopNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <span className="text-2xl font-bold text-gray-900">My App</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex items-center ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="!h-6 !w-6 cursor-pointer" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
