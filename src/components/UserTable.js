'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'

export default function UserTable({ searchQuery = '', tableData = [] }) {
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
  const filteredAndSortedUsers = Array.isArray(tableData) ? [...tableData]
    .filter(user => 
      Object.values(user).some(value => 
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0
      
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    }) : []
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => sortData('email')}
            >
              Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Username</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => sortData('full_name')}
            >
              Full Name {sortConfig.key === 'full_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Disabled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user, index) => (
            <TableRow key={user.username || index}>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>{user.username || 'N/A'}</TableCell>
              <TableCell>{user.full_name || 'N/A'}</TableCell>
              <TableCell>
                <Switch 
                  checked={user.disabled || false}
                />
              </TableCell>
         
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}