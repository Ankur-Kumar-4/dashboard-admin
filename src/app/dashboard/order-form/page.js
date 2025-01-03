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
import ApiService from '@/lib/ApiServiceFunction'
import ApiEndPoints from '@/lib/ApiServiceEndpoint'

export default function OrderForm() {
  const [formData, setFormData] = useState({
    date: '',
    patient_name: '',
    mobile_no: '',
    address: '',
    pincode: '',
    medicines: [{ name: '', mrp: 0, qty: 1 }],
    shipping_charges: 0,
    amount: 0,
    discount: 0,
    total_amount: 0,
    enquiry_made_on: '',
    payment_made_on: '',
    mode_of_payment: '',
    payment_reconciliation_status: '',
    dispatch_status: '',
    received_status: '',
    through: '',
    awb_docket_no: '',
    missing_product_during_dispatch: '',
    remarks: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await ApiService.post(`${ApiEndPoints?.createorder}`, formData);
      const data = await response.data;
      console.log(data);
    } catch (error) {
      console.error(error);
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
         
          {/* Financial Information */}


          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              type="number"
              value={formData.discount}
              onChange={e =>
                setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))
              }
            />
          </div>


          {/* Order Tracking */}
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

          {/* Payment and Shipping Status */}
          {/* <div className="space-y-2">
            <Label htmlFor="mode_of_payment">Payment Mode</Label>
            <Select 
              value={formData.mode_of_payment}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, mode_of_payment: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="netbanking">Net Banking</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
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
          {/* <div className="space-y-2">
            <Label htmlFor="dispatch_status">Dispatch Status</Label>
            <Select
              value={formData.dispatch_status}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, dispatch_status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dispatch status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="received_status">Received Status</Label>
            <Select
              value={formData.received_status}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, received_status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select received status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="not_received">Not Received</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Shipping Details */}
          {/* <div className="space-y-2">
            <Label htmlFor="through">Shipping Method</Label>
            <Input
              id="through"
              value={formData.through}
              onChange={e =>
                setFormData(prev => ({ ...prev, through: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awb_docket_no">AWB/Docket Number</Label>
            <Input
              id="awb_docket_no"
              value={formData.awb_docket_no}
              onChange={e =>
                setFormData(prev => ({ ...prev, awb_docket_no: e.target.value }))
              }
            />
          </div> */}

          {/* Additional Information */}
          {/* <div className="space-y-2 md:col-span-2">
            <Label htmlFor="missing_product_during_dispatch">Missing Products</Label>
            <Input
              id="missing_product_during_dispatch"
              value={formData.missing_product_during_dispatch}
              onChange={e =>
                setFormData(prev => ({ ...prev, missing_product_during_dispatch: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={formData.remarks}
              onChange={e =>
                setFormData(prev => ({ ...prev, remarks: e.target.value }))
              }
            />
          </div> */}
        </div>
        </CardContent>
      </Card>
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
