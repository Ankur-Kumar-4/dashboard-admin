import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from 'lucide-react';

export function EditOrderDialog({ isOpen, onOpenChange, order, onSubmit, isLoading }) {
  const [formData, setFormData] = useState(order || {});

  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        discount: order.discount || 0
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      if (['shipping_charges', 'discount'].includes(name)) {
        updatedData.total_amount = calculateTotalAmount(updatedData);
      }
      return updatedData;
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    setFormData((prev) => {
      const updatedData = { ...prev, medicines: updatedMedicines };
      updatedData.total_amount = calculateTotalAmount(updatedData);
      return updatedData;
    });
  };

  const handleAddMedicine = () => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        medicines: [...(prev.medicines || []), { name: "", mrp: 0, qty: 0 }],
      };
      updatedData.total_amount = calculateTotalAmount(updatedData);
      return updatedData;
    });
  };

  const handleRemoveMedicine = (index) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        medicines: prev.medicines.filter((_, i) => i !== index),
      };
      updatedData.total_amount = calculateTotalAmount(updatedData);
      return updatedData;
    });
  };

  const calculateSubtotal = (medicines) => {
    return medicines?.reduce((total, medicine) => {
      return total + (Number(medicine.mrp) * Number(medicine.qty));
    }, 0) || 0;
  };

  const calculateDiscountAmount = (data) => {
    const subtotal = calculateSubtotal(data.medicines);
    const discountPercentage = Number(data.discount) || 0;
    return (subtotal * discountPercentage) / 100;
  };

  const calculateTotalAmount = (data) => {
    const subtotal = calculateSubtotal(data.medicines);
    const shippingCharges = Number(data.shipping_charges) || 0;
    const discountAmount = calculateDiscountAmount(data);
    return subtotal + shippingCharges - discountAmount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] overflow-auto h-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date ? formData.date.split('T')[0] : ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="patient_name">Patient Name</Label>
                <Input
                  id="patient_name"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile_no">Mobile No.</Label>
                <Input
                  id="mobile_no"
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Medicines</Label>
              {formData.medicines?.map((medicine, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 mt-2 items-center">
                  <Input
                    placeholder="Name"
                    value={medicine.name}
                    onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="MRP"
                    value={medicine.mrp}
                    onChange={(e) => handleMedicineChange(index, "mrp", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={medicine.qty}
                    onChange={(e) => handleMedicineChange(index, "qty", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveMedicine(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleAddMedicine}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Medicine
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipping_charges">Shipping Charges</Label>
                <Input
                  id="shipping_charges"
                  name="shipping_charges"
                  type="number"
                  value={formData.shipping_charges}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enquiry_made_on">Enquiry Made On</Label>
                <Input
                  id="enquiry_made_on"
                  name="enquiry_made_on"
                  type="date"
                  value={formData.enquiry_made_on}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="payment_made_on">Payment Made On</Label>
                <Input
                  id="payment_made_on"
                  name="payment_made_on"
                  type="date"
                  value={formData.payment_made_on}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mode_of_payment">Mode of Payment</Label>
                <Input
                  id="mode_of_payment"
                  name="mode_of_payment"
                  value={formData.mode_of_payment}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="payment_reconciliation_status">Payment Reconciliation Status</Label>
                <Input
                  id="payment_reconciliation_status"
                  name="payment_reconciliation_status"
                  value={formData.payment_reconciliation_status}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal(formData.medicines).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>₹{(Number(formData.shipping_charges) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount ({formData.discount}%):</span>
                <span>₹{calculateDiscountAmount(formData).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{calculateTotalAmount(formData).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

