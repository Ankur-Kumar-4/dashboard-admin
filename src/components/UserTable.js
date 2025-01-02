'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'

// Sample data matching the image
const initialUsers = [
  {
    firstName: 'Ankur',
    lastName: 'Kumar',
    userName: 'ankurk001',
    email: 'kumarankur20047@gmail.com',
    phoneNumber: '+918252784609',
    isActive: true,
    role: 'Pharmacovigilance Scientist'
  },
  {
    firstName: 'string',
    lastName: 'string',
    userName: 'strings002',
    email: 'user@example.com',
    phoneNumber: 'string',
    isActive: true,
    role: 'Process Administrator'
  },
  {
    firstName: 'string',
    lastName: 'string',
    userName: 'strings003',
    email: 'user1@example.com',
    phoneNumber: 'string',
    isActive: true,
    role: 'Manager'
  },
  {
    firstName: 'string',
    lastName: 'string',
    userName: 'strings005',
    email: 'user3@example.com',
    phoneNumber: 'string',
    isActive: true,
    role: 'Manager'
  },
  {
    firstName: 'Manthan',
    lastName: 'Chaudhari',
    userName: 'manthanc008',
    email: 'chaudharimanthan05@gmail.com',
    phoneNumber: '+919687220233',
    isActive: true,
    role: 'Process Administrator'
  },
  {
    firstName: 'a',
    lastName: 'k',
    userName: 'ak009',
    email: 'a@gmail.com',
    phoneNumber: '+911111111',
    isActive: true,
    role: 'Manager'
  },
  {
    firstName: 'Ansh',
    lastName: 'Rajput',
    userName: 'anshr007',
    email: 'ansh@gmail.com',
    phoneNumber: '+911221113',
    isActive: true,
    role: 'Admin Panel'
  }
]

export default function UserTable({ searchQuery = '' }) {
  const [users, setUsers] = useState(initialUsers)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Sort function
  const sortData = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Filter and sort users
  const filteredAndSortedUsers = [...users]
    .filter(user => 
      Object.values(user).some(value => 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

  const handleToggleActive = (index) => {
    const newUsers = [...users]
    newUsers[index].isActive = !newUsers[index].isActive
    setUsers(newUsers)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => sortData('firstName')}
            >
              First Name {sortConfig.key === 'firstName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => sortData('lastName')}
            >
              Last Name {sortConfig.key === 'lastName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>is Active</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user, index) => (
            <TableRow key={user.userName}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>
                <Switch 
                  checked={user.isActive}
                  onCheckedChange={() => handleToggleActive(index)}
                />
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

