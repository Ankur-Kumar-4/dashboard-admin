"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ApiService from "@/lib/ApiServiceFunction";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";
import Select from "react-select";
import { toast } from "@/hooks/use-toast";

export default function OrderForm() {

  const [formData, setFormData] = useState({
    date: "",
    patient_name: "",
    mobile_no: "",
    address: "",
    pincode: "",
    medicines: [{ name: "", mrp: "", qty: "" }],
    shipping_charges: "0",
    amount: 0,
    discount: "0",
    total_amount: 0,
    enquiry_made_on: new Date().toISOString().split("T")[0],
    payment_made_on: new Date().toISOString().split("T")[0],
    payment_reconciliation_status: "",
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [medOptions, setMedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotals = (medicines, shipping, discount) => {
    const subtotal = medicines.reduce((sum, med) => {
      const mrp = parseFloat(med.mrp) || 0;
      const qty = parseFloat(med.qty) || 0;
      return sum + mrp * qty;
    }, 0);

    const shippingValue = parseFloat(shipping) || 0;
    const discountValue = parseFloat(discount) || 0;
    const total = subtotal + shippingValue - discountValue;

    setFormData((prev) => ({
      ...prev,
      amount: subtotal,
      total_amount: total,
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    if ((field === "mrp" || field === "qty") && parseFloat(value) < 0) {
      return;
    }

    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, medicines: updatedMedicines }));
    calculateTotals(
      updatedMedicines,
      formData.shipping_charges,
      formData.discount
    );

    setErrors((prev) => ({
      ...prev,
      [`medicine_${index}_${field}`]: '',
    }));
  };

  const handleNumberInput = (field, value) => {
    if (parseFloat(value) < 0) {
      return;
    }

    setFormData((prev) => {
      const newState = { ...prev, [field]: value };
      calculateTotals(
        prev.medicines,
        field === "shipping_charges" ? value : prev.shipping_charges,
        field === "discount" ? value : prev.discount
      );
      return newState;
    });

    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const addMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: "", mrp: "", qty: "" }],
    }));
  };

  const removeMedicine = (index) => {
    const updatedMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, medicines: updatedMedicines }));
    calculateTotals(
      updatedMedicines,
      formData.shipping_charges,
      formData.discount
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_name.trim()) newErrors.patient_name = "Patient Name is required";
    if (!formData.mobile_no.trim()) newErrors.mobile_no = "Mobile Number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

    formData.medicines.forEach((medicine, index) => {
      if (!medicine.name) newErrors[`medicine_${index}_name`] = "Medicine Name is required";
      if (!medicine.qty) newErrors[`medicine_${index}_qty`] = "Quantity is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ApiService.post(
        ApiEndPoints?.createorder,
        formData
      );
      console.log(response.data.detail);
      toast({
        title: "Success",
        description:"Order created successfully",
      });
    } catch (error) {
      console.log(error?.response?.data);
      toast({
        title: "Error",
        description: error?.response?.data?.detail,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMedicines = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get(ApiEndPoints?.getproducts);
      if (response && response.data) {
        const transformedOptions = response.data.map((item) => ({
          value: item.name,
          label: item.name,
        }));
        setMedOptions(transformedOptions);
        setMedicines(response.data);
      }
    } catch (error) {
      console.error("getMedicines error:", error.message);
      toast({
        title: "Error",
        description: "Failed to fetch medicines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMedicinePrice = (med, index) => {
    if (!med) return;
    const price = medicines?.find((item) => item.name === med.value)?.price;
    setFormData((prev) => {
      const updatedMedicines = [...prev.medicines];
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        name: med.label,
        mrp: price || "",
      };
      return { ...prev, medicines: updatedMedicines };
    });
    calculateTotals(
      formData.medicines,
      formData.shipping_charges,
      formData.discount
    );

    setErrors((prev) => ({ ...prev, [`medicine_${index}_name`]: '' }));
  };
  const getPermission = async () => {
    try {
        
      const response = await ApiService.get(`${ApiEndPoints?.getpermission}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = response.data;
      setFormData((prev) => ({
        ...prev,
        remarks: data.full_name,
      }));
      console.log(data.full_name);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
  
    }
  };
  useEffect(() => {
    getPermission();
    getMedicines();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name</Label>
              <Input
                id="patient_name"
                value={formData.patient_name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    patient_name: e.target.value,
                  }));
                  setErrors((prev) => ({ ...prev, patient_name: '' }));
                }}
              />
              {errors.patient_name && <p className="text-red-500 text-sm mt-1">{errors.patient_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile_no">Mobile Number</Label>
              <Input
                id="mobile_no"
                value={formData.mobile_no}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    mobile_no: e.target.value,
                  }));
                  setErrors((prev) => ({ ...prev, mobile_no: '' }));
                }}
              />
              {errors.mobile_no && <p className="text-red-500 text-sm mt-1">{errors.mobile_no}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, address: e.target.value }));
                  setErrors((prev) => ({ ...prev, address: '' }));
                }}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, pincode: e.target.value }));
                  setErrors((prev) => ({ ...prev, pincode: '' }));
                }}
              />
              {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Medicines</h3>
              <Button
                type="button"
                onClick={addMedicine}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            {formData.medicines.map((medicine, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4"
              >
                <div className="space-y-2">
                  <Label htmlFor={`medicine-name-${index}`}>
                    Medicine Name
                  </Label>
                  <Select
                    inputId={`medicine-name-${index}`}
                    isClearable
                    isLoading={loading}
                    options={medOptions}
                    value={
                      medicine.name
                        ? { value: medicine.name, label: medicine.name }
                        : null
                    }
                    onChange={(value) => getMedicinePrice(value, index)}
                    placeholder="Type study drug"
                  />
                  {errors[`medicine_${index}_name`] && <p className="text-red-500 text-sm mt-1">{errors[`medicine_${index}_name`]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`medicine-mrp-${index}`}>MRP</Label>
                  <Input
                    id={`medicine-mrp-${index}`}
                    type="number"
                    min="0"
                    disabled
                    value={medicine.mrp}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`medicine-qty-${index}`}>Quantity</Label>
                  <Input
                    id={`medicine-qty-${index}`}
                    type="number"
                    min="0"
                    value={medicine.qty}
                    onChange={(e) =>
                      handleMedicineChange(index, "qty", e.target.value)
                    }
                  />
                  {errors[`medicine_${index}_qty`] && <p className="text-red-500 text-sm mt-1">{errors[`medicine_${index}_qty`]}</p>}
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
                onChange={(e) => handleNumberInput("discount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enquiry_made_on">Enquiry Date</Label>
              <Input
                id="enquiry_made_on"
                type="date"
                value={formData.enquiry_made_on}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    enquiry_made_on: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_made_on">Payment Date</Label>
              <Input
                id="payment_made_on"
                type="date"
                value={formData.payment_made_on}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payment_made_on: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_reconciliation_status">
              Payment Reconciliation Status
              </Label>
              <Input
                id="payment_reconciliation_status"
                type="text"
                value={formData.payment_reconciliation_status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payment_reconciliation_status: e.target.value,
                  }))
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
                onChange={(e) =>
                  handleNumberInput("shipping_charges", e.target.value)
                }
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
              <span>
                ₹{(parseFloat(formData.shipping_charges) || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <span>₹{(parseFloat(formData.discount) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>
                ₹{(parseFloat(formData.total_amount) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Order"}
        </Button>
      </div>
    </form>
  );
}

