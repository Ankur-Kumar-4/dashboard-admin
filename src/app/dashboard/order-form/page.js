'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ApiService from '@/lib/ApiServiceFunction'
import ApiEndPoints from '@/lib/ApiServiceEndpoint'

export default function OrderForm() {
  const [formData, setFormData] = useState({
    date: '',
    patient_name: '',
    mobile_no: '',
    address: '',
    pincode: '',
    medicines: [{ name: '', mrp: '', qty: 1 }],
    shipping_charges: '',
    amount: 0,
    discount: '',
    total_amount: 0,
    enquiry_made_on: new Date().toISOString().split('T')[0],
    payment_made_on: new Date().toISOString().split('T')[0],
    payment_reconciliation_status: '',
  })

  const calculateTotals = (medicines, shipping, discount) => {
    const subtotal = medicines.reduce((sum, med) => {
      const mrp = parseFloat(med.mrp) || 0
      const qty = parseFloat(med.qty) || 0
      return sum + (mrp * qty)
    }, 0)
    
    const shippingValue = parseFloat(shipping) || 0
    const discountValue = parseFloat(discount) || 0
    const total = subtotal + shippingValue - discountValue
    
    setFormData(prev => ({
      ...prev,
      amount: subtotal,
      total_amount: total
    }))
  }

  const handleMedicineChange = (index, field, value) => {
    // Prevent negative numbers for mrp and qty
    if ((field === 'mrp' || field === 'qty') && value < 0) {
      return
    }

    const updatedMedicines = [...formData.medicines]
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [field]: value
    }
    setFormData(prev => ({ ...prev, medicines: updatedMedicines }))
    calculateTotals(updatedMedicines, formData.shipping_charges, formData.discount)
  }

  const handleNumberInput = (field, value) => {
    // Prevent negative numbers
    if (value < 0) {
      return
    }

    setFormData(prev => {
      const newState = { ...prev, [field]: value }
      calculateTotals(prev.medicines, field === 'shipping_charges' ? value : prev.shipping_charges, field === 'discount' ? value : prev.discount)
      return newState
    })
  }

  const addMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', mrp: '', qty: '' }],
    }))
  }

  const removeMedicine = index => {
    const updatedMedicines = formData.medicines.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, medicines: updatedMedicines }))
    calculateTotals(updatedMedicines, formData.shipping_charges, formData.discount)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await ApiService.post(`${ApiEndPoints?.createorder}`, formData)
      const data = await response.data
      console.log(data)
    } catch (error) {
      console.error(error)
    }
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
                    min="0"
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
                    min="0"
                    required
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

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                value={formData.discount}
                onChange={e => handleNumberInput('discount', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enquiry_made_on">Enquiry Date</Label>
              <Input
                id="enquiry_made_on"
                type="date"
                value={formData.enquiry_made_on}
                onChange={e =>
                  setFormData(prev => ({ ...prev, enquiry_made_on: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_made_on">Payment Date</Label>
              <Input
                id="payment_made_on"
                type="date"
                value={formData.payment_made_on}
                onChange={e =>
                  setFormData(prev => ({ ...prev, payment_made_on: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_reconciliation_status">Payment Status</Label>
              <Input
                id="payment_reconciliation_status"
                type="text"
                value={formData.payment_reconciliation_status}
                onChange={e =>
                  setFormData(prev => ({ ...prev, payment_reconciliation_status: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_charges">Shipping Charges</Label>
              <Input
                id="shipping_charges"
                type="number"
                min="0"
                value={formData.shipping_charges}
                onChange={e => handleNumberInput('shipping_charges', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{(parseFloat(formData.amount) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>₹{(parseFloat(formData.shipping_charges) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <span>₹{(parseFloat(formData.discount) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{(parseFloat(formData.total_amount) || 0).toFixed(2)}</span>
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