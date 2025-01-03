'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function NewUserForm({ isOpen, onClose, onSubmit ,isEditUser }) {
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    full_name: '',
    role: '',
    permissions: [],
    password: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value) => {
    setUserData(prev => ({ ...prev, role: value }))
  }

  const handlePermissionChange = (permission) => {
    setUserData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(userData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditUser ? 'Edit User' : 'Create New User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              required
              value={userData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              required
              value={userData.full_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" value={userData.role} onValueChange={handleRoleChange}>
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
          {/* <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="flex items-center space-x-2">
              {['read', 'write', 'delete'].map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={userData.permissions.includes(permission)}
                    onCheckedChange={() => handlePermissionChange(permission)}
                  />
                  <Label htmlFor={permission}>{permission.charAt(0).toUpperCase() + permission.slice(1)}</Label>
                </div>
              ))}
            </div>
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={userData.password}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button type="submit">{isEditUser ? 'Update User' : 'Create User'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

