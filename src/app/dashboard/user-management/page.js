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
  const [isEditUser, setIsEditUser] = useState(false)
  const [tableData, setTableData] = useState([]);

  const getOrders = async () => {
    try {
      const response = await ApiService.get(`${ApiEndPoints?.getusers}`);

      const data = await response.data;
      console.log(data);

      setTableData([data]);
    } catch (error) {
      setError(
        "An unexpected error occurred during signup. Please try again later."
      );
    } finally {

    }
  };
useEffect(() => {
  getOrders();
}, []);
  const handleNewUserSubmit  = async(userData) => {
    try {
      console.log(userData,"userData");
      const response = await ApiService.post(`${ApiEndPoints?.signup}`, {
      userData
      });

      const data = await response.data;
      console.log(data);
     
    } catch (error) {
      console.error(error);
    } finally {
      
    }
  }
  
  return (
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
      <Card>
        <UserTable searchQuery={searchQuery} tableData={tableData} setIsEditUser={setIsEditUser} isEditUser={isEditUser} />
      </Card>
      <CreateUser
        isEditUser={isEditUser}
        isOpen={isNewUserFormOpen || isEditUser}
        onClose={() =>{setIsEditUser(false); setIsNewUserFormOpen(false)}}
        onSubmit={handleNewUserSubmit}
      />
      
    </div>
  )
}

