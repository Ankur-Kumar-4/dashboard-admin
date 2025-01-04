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

export function EditOrderDialog({ isOpen, onOpenChange, order, onSubmit }) {
  const [formData, setFormData] = useState(order || {});

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    setFormData((prev) => ({ ...prev, medicines: updatedMedicines }));
  };

  const handleAddMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [...(prev.medicines || []), { name: "", mrp: 0, qty: 0 }],
    }));
  };

  const handleRemoveMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
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
                  value={formData.date}
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
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  value={formData.total_amount}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dispatch_status">Dispatch Status</Label>
                <Input
                  id="dispatch_status"
                  name="dispatch_status"
                  value={formData.dispatch_status}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="received_status">Received Status</Label>
                <Input
                  id="received_status"
                  name="received_status"
                  value={formData.received_status}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="through">Through</Label>
                <Input
                  id="through"
                  name="through"
                  value={formData.through}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="awb_docket_no">AWB/Docket No.</Label>
                <Input
                  id="awb_docket_no"
                  name="awb_docket_no"
                  value={formData.awb_docket_no}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="missing_product_during_dispatch">Missing Product During Dispatch</Label>
              <Input
                id="missing_product_during_dispatch"
                name="missing_product_during_dispatch"
                value={formData.missing_product_during_dispatch}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

