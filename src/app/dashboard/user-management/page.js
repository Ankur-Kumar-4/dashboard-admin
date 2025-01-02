'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import UserTable from '@/components/UserTable'

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* <div className="flex flex-col sm:flex-row gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Configure User-Groups
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Configure New User
          </Button>
        </div> */}
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
        <UserTable searchQuery={searchQuery} />
      </Card>
    </div>
  )
}

