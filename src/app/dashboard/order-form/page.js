'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function OrderForm() {
  const [formData, setFormData] = useState({
    patient_name: '',
    mobile_no: '',
    address: '',
    pincode: '',
    medicines: [{ name: '', mrp: 0, qty: 1 }],
    shipping_charges: 0,
    amount: 0,
    discount: 0,
    total_amount: 0,
  })

  const calculateTotals = (medicines, shipping, discount) => {
    const subtotal = medicines.reduce((sum, med) => sum + med.mrp * med.qty, 0)
    const total = subtotal + shipping - discount
    setFormData(prev => ({
      ...prev,
      amount: subtotal,
      total_amount: total,
    }))
  }

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...formData.medicines]
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [field]: field === 'name' ? value : Number(value),
    }
    setFormData(prev => ({ ...prev, medicines: updatedMedicines }))
    calculateTotals(updatedMedicines, formData.shipping_charges, formData.discount)
  }

  const addMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', mrp: 0, qty: 1 }],
    }))
  }

  const removeMedicine = index => {
    const updatedMedicines = formData.medicines.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, medicines: updatedMedicines }))
    calculateTotals(updatedMedicines, formData.shipping_charges, formData.discount)
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(formData)
    // Here you would typically send the data to your API
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name</Label>
              <Input
                id="patient_name"
                required
                value={formData.patient_name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, patient_name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile_no">Mobile Number</Label>
              <Input
                id="mobile_no"
                required
                value={formData.mobile_no}
                onChange={e =>
                  setFormData(prev => ({ ...prev, mobile_no: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={e =>
                  setFormData(prev => ({ ...prev, address: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                required
                value={formData.pincode}
                onChange={e =>
                  setFormData(prev => ({ ...prev, pincode: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Medicines</h3>
              <Button type="button" onClick={addMedicine} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>
            
            {formData.medicines.map((medicine, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4">
                <div className="space-y-2">
                  <Label htmlFor={`medicine-name-${index}`}>Medicine Name</Label>
                  <Input
                    id={`medicine-name-${index}`}
                    required
                    value={medicine.name}
                    onChange={e => handleMedicineChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`medicine-mrp-${index}`}>MRP</Label>
                  <Input
                    id={`medicine-mrp-${index}`}
                    type="number"
                    required
                    value={medicine.mrp}
                    onChange={e => handleMedicineChange(index, 'mrp', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`medicine-qty-${index}`}>Quantity</Label>
                  <Input
                    id={`medicine-qty-${index}`}
                    type="number"
                    required
                    min="1"
                    value={medicine.qty}
                    onChange={e => handleMedicineChange(index, 'qty', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeMedicine(index)}
                  disabled={formData.medicines.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals and Submission */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add other input fields here as required */}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{formData.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>₹{formData.shipping_charges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <span>₹{formData.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{formData.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Submit Order
        </Button>
      </div>
    </form>
  )
}
