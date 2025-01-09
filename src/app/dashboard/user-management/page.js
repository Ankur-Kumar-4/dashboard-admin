'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import UserTable from '@/components/UserTable'
import CreateUser from '@/components/CreateUser'
import ApiService from '@/lib/ApiServiceFunction'
import ApiEndPoints from '@/lib/ApiServiceEndpoint'
export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isNewUserFormOpen, setIsNewUserFormOpen] = useState(false)
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState("");


  const getUsers = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.get(`${ApiEndPoints?.getusers}`);

      const data = await response.data;
      console.log(data);

      setTableData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getPermission = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.get(`${ApiEndPoints?.getpermission}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = response.data;
      setPermissions(data.role);
      console.log(data.role);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
useEffect(() => {
  getPermission();
  getUsers();
}, []);
  const handleNewUserSubmit  = async(userData) => {
    try {
      console.log(userData,"userData");
      const response = await ApiService.post(`${ApiEndPoints?.signup}`, {
      ...userData
      });

      const data = await response.data;
      console.log(data);
     
    } catch (error) {
      console.error(error);
    } finally {
      
    }
  }
  
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center mt-10">
          <svg
            className="animate-spin h-16 w-16 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <>
          {permissions === "Admin" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsNewUserFormOpen(true)}
                  >
                    Configure New User
                  </Button>
                </div>
                <div className="w-full sm:w-[300px]">
                  <Input
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {!isLoading ? (
                <Card>
                  <UserTable
                    searchQuery={searchQuery}
                    tableData={tableData}
                    getUsers={getUsers}
                  />
                </Card>
              ) : (
                <div className="flex items-center justify-center mt-10">
                  <svg
                    className="animate-spin h-16 w-16 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              <CreateUser
                isOpen={isNewUserFormOpen}
                onClose={() => setIsNewUserFormOpen(false)}
                onSubmit={handleNewUserSubmit}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center mt-10">
              <svg
                className="animate-spin h-16 w-16 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </>
      )}
    </>
  );
}


