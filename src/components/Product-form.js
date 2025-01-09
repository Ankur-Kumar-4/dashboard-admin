'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProductForm({ onSubmit, onCancel, initialData }) {
  const [name, setName] = useState(initialData?.name || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setPrice(initialData.price.toString())
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(initialData 
      ? { ...initialData, name, price: parseFloat(price) }
      : { name, price: parseFloat(price) }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input 
          id="price" 
          type="number" 
          step="0.01" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          {initialData ? 'Update' : 'Add'} Product
        </Button>
      </div>
    </form>
  )
}

