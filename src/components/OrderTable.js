"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import ApiService from "@/lib/ApiServiceFunction";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EditOrderDialog } from "@/components/EditOrderDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function OrderTable({ data, getOrders,permissions }) {
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formState, setFormState] = useState({
    dispatch_status: "",
    received_status: "delivered", // Default selected value
    enquiry_date: "",
    through: "", // Additional field for dispatched status
    awb_docket_no: "", // Additional field for dispatched status
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleRadioChange = (value) => {
    setFormState((prev) => ({
      ...prev,
      received_status: value,
    }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(data?.length / itemsPerPage) || 1;

  const orders = data || [];
  const maxMedicines =
    orders?.length > 0
      ? orders.reduce(
          (max, order) =>
            Math.max(max, order.medicines ? order.medicines.length : 0),
          0
        )
      : 0;

  const paginatedData = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.delete(
        `${ApiEndPoints?.deleteOrder}/${orderId}`
      );
      toast({ title: "Order deleted successfully!", variant: "success" });
      setIsDeleteDialogOpen(false);
      getOrders();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Error deleting order", variant: "destructive" });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const { dispatch_status, received_status, enquiry_date, through, awb_docket_no } = formState;

    // Build the status object
    const status = {
      dispatch_status: dispatch_status,
      received_status:
        received_status === "estimated"
          ? `Estimated Delivery Date ${enquiry_date}`
          : `Delivered On ${enquiry_date}`,
      enquiry_date: enquiry_date,
      ...(dispatch_status === "dispatched" && { through, awb_docket_no: awb_docket_no }),
    };

    try {
      setIsLoading(true);
     const response = await ApiService.put(
        `${ApiEndPoints?.updateOrderStatus}/${orderId}`,
        status
      );
      toast({
        title: "Order status updated successfully!",
        variant: "success",
      });
      setIsOpenStatus(false);
      getOrders(); // Refresh the order list
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsOpenStatus(false);
      toast({
        title: "Error updating order status",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };


  const handleEditSubmit = async (updatedOrder) => {
    try {
      setIsLoading(true);
      const response = await ApiService.put(
        `${ApiEndPoints?.updateOrder}/${updatedOrder.id}`,
        updatedOrder
      );
      toast({ title: "Order updated successfully!", variant: "success" });
      setIsEditDialogOpen(false);
      setIsLoading(false);
      getOrders();
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Error updating order", variant: "destructive" });
    }
  };

  return (
    <div className="w-full relative rounded-md border">
      <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader className="sticky top-0 z-30">
            <TableRow>
              {/* Fixed columns */}
              <TableHead
                className="sticky left-0 bg-green-600 text-white border-r z-50"
                style={{
                  position: "sticky",
                  left: 0,
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "30px",
                }}
                rowSpan={2}
              ></TableHead>
              <TableHead
                className="sticky left-0 bg-green-600 text-white border-r z-50"
                style={{
                  position: "sticky",
                  left: "52px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "30px",
                }}
                rowSpan={2}
              >
                Bill No.
              </TableHead>
              <TableHead
                className="sticky left-0 bg-green-600 text-white border-r z-50"
                style={{
                  position: "sticky",
                  left: "252px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "85px",
                }}
                rowSpan={2}
              >
                Date
              </TableHead>
              <TableHead
                className="sticky left-[200px] bg-green-600 text-white border-r z-50"
                style={{
                  position: "sticky",
                  left: "337px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "120px",
                }}
                rowSpan={2}
              >
                Patient Name
              </TableHead>
              <TableHead
                className="sticky left-[320px] bg-green-600 text-white border-r z-50"
                style={{
                  position: "sticky",
                  left: "457px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "90px",
                }}
                rowSpan={2}
              >
                Mobile No.
              </TableHead>
              <TableHead
                className="sticky left-[400px] bg-green-600 text-white border-r z-50"
                style={{
                  position: "sticky",
                  left: "547px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "120px",
                }}
                rowSpan={2}
              >
                Address
              </TableHead>
              <TableHead
                className="sticky left-[600px] bg-green-600 text-white border-r z-50"
                style={{
                  position: "sticky",
                  left: "747px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "80px",
                }}
                rowSpan={2}
              >
                Pincode
              </TableHead>

              {/* Scrollable columns */}
              <TableHead className="bg-green-600 text-white border-r pl-4 ml-60">
                <div className="flex gap-2">
                  {Array.from({ length: maxMedicines }).map((_, index) => (
                    <div
                      key={`medicine-${index}`}
                      className="min-w-[240px] text-center border-l"
                    >
                      Medicine {index + 1}
                      <div className="flex border-t mt-1">
                        <div className="flex-1 px-1 border-r text-xs">Name</div>
                        <div className="flex-1 px-1 border-r text-xs">MRP</div>
                        <div className="flex-1 px-1 text-xs">Qty</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TableHead>

              {/* Regular columns */}
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Shipping Charges
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Amount
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Discount
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Total Amount
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Enquiry Made on
              </TableHead>

              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Payment Made On
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Mode Of Payment
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                PAYMENT RECONCILATION STATUS
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Dispatch Status
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Recieved status
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Through
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                AWB / Docket No
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Missing Product During Dispatch
              </TableHead>
              <TableHead className="bg-green-600 text-white" rowSpan={2}>
                Remarks
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((order, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {/* Fixed columns */}
                <TableCell
                  className="sticky left-0 bg-blue-50 border-r z-30"
                  style={{
                    position: "sticky",
                    left: 0,
                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                    minWidth: "30px",
                  }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {permissions === "Delivery Agent" ? (
                        ""
                      ) : (
                        <DropdownMenuItem onClick={() => {setIsEditDialogOpen(true);setEditingOrder(order)}}>
                          Edit Order
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setIsOpenStatus(true);
                          setOrderId(order.id);
                        }}
                      >
                        Update Delivery Status
                      </DropdownMenuItem>
                     
                      {permissions === "Delivery Agent" ? (
                        ""
                      ) : (
                   
                      <DropdownMenuItem
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                          setOrderId(order.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell
                  className="sticky left-0 bg-blue-50 border-r z-30"
                  style={{
                    position: "sticky",
                    left: "52px",
                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                    minWidth: "200px",
                  }}
                >
                  {order.id}
                </TableCell>
                <TableCell
                  className="sticky left-0 bg-blue-50 border-r z-30"
                  style={{
                    position: "sticky",
                    left: "252px",
                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                    minWidth: "80px",
                  }}
                >
                  {formatDate(order.date)}
                </TableCell>
                <TableCell
                  className="sticky left-[80px] bg-blue-50 border-r z-30"
                  style={{
                    position: "sticky",
                    left: "337px",
                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                    minWidth: "120px",
                  }}
                >
                  {order.patient_name}
                </TableCell>
                <TableCell
                  className="sticky left-[200px] bg-blue-50 border-r z-30"
                  style={{
                    position: "sticky",
                    left: "457px",
                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                    minWidth: "90px",
                  }}
                >
                  {order.mobile_no}
                </TableCell>
                <TableCell
                  className="sticky left-[300px] bg-blue-50 border-r z-30"
                  style={{
                    position: "sticky",
                    left: "547px",
                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                    minWidth: "200px",
                  }}
                >
                  {order.address}
                </TableCell>
                <TableCell
                  className="sticky left-[600px] bg-blue-50 border-r z-30"
                  style={{
                    position: "sticky",
                    left: "747px",
                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                    minWidth: "80px",
                  }}
                >
                  {order.pincode}
                </TableCell>

                {/* Scrollable columns */}
                <TableCell className="bg-white ml-60 p-0 border-r pl-4">
                  <div className="flex gap-2">
                    {Array.from({ length: maxMedicines }).map((_, idx) => {
                      const medicine = order.medicines[idx] || {
                        name: "",
                        mrp: 0,
                        qty: 0,
                      };
                      return (
                        <div
                          key={`medicine-${idx}`}
                          className="min-w-[240px] flex border-l"
                        >
                          <div className="flex-1 p-1 text-center border-r text-xs">
                            {medicine.name}
                          </div>
                          <div className="flex-1 p-1 text-center border-r text-xs">
                            {medicine.mrp ? `₹${medicine.mrp}` : ""}
                          </div>
                          <div className="flex-1 p-1 text-center text-xs">
                            {medicine.qty || ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TableCell>

                {/* Regular cells */}
                <TableCell className="text-center text-xs min-w-[100px]">
                  ₹{order.shipping_charges}
                </TableCell>
                <TableCell className="text-center text-xs min-w-[100px]">
                  ₹{order.amount}
                </TableCell>
                <TableCell className="text-center text-xs min-w-[100px]">
                  ₹{order.discount}
                </TableCell>
                <TableCell className="text-center text-xs min-w-[100px]">
                  ₹{order.total_amount}
                </TableCell>
                <TableCell className="text-xs min-w-[100px]">
                  {order.enquiry_made_on}
                </TableCell>

                <TableCell className="text-xs min-w-[100px]">
                  {order.payment_made_on}
                </TableCell>
                <TableCell className="text-xs min-w-[100px]">
                  {order.mode_of_payment}
                </TableCell>
                <TableCell className="text-xs min-w-[100px]">
                  {order.payment_reconciliation_status}
                </TableCell>
                <TableCell className="text-xs min-w-[100px]">
                  {order.dispatch_status}
                </TableCell>
                <TableCell className="text-xs min-w-[120px]">
                  {order.received_status}
                </TableCell>
                <TableCell className="text-xs min-w-[100px]">
                  {order.through}
                </TableCell>
                <TableCell className="text-xs min-w-[120px]">
                  {order.awb_docket_no}
                </TableCell>
                <TableCell className="text-xs min-w-[130px]">
                  {order.missing_product_during_dispatch}
                </TableCell>
                <TableCell className="text-xs min-w-[100px]">
                  {order.remarks}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4 px-4 py-2 bg-gray-100">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          size="sm"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <Dialog open={isOpenStatus} onOpenChange={setIsOpenStatus}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
  <div className="grid gap-4 py-4">
    {/* Dispatch Status */}
    <div className="grid grid-cols-1 items-center gap-4">
      <Label htmlFor="dispatch_status" className="text-left">
        Dispatch Status
      </Label>
      <Select
        name="dispatch_status"
        value={formState.dispatch_status}
        onValueChange={(value) => handleSelectChange("dispatch_status", value)}
        className="rounded-md border border-input px-3 py-2 w-full"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Preparing</SelectItem>
          <SelectItem value="dispatched">Dispatched</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Additional Fields for Dispatched Status */}
    {formState.dispatch_status === "dispatched" && (
      <>
        <div className="space-y-2">
          <Label htmlFor="through">Through</Label>
          <Input
            id="through"
            name="through"
            type="text"
            value={formState.through}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="awb_docket_no">AWB / Docket No.</Label>
          <Input
            id="awb_docket_no"
            name="awb_docket_no"
            type="text"
            value={formState.awb_docket_no}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 w-full"
          />
        </div>
      </>
    )}

    {/* Received Status */}
    <div className="grid grid-cols-1 items-center gap-4">
      <Label htmlFor="received_status" className="text-left">
        Received Status
      </Label>
    </div>
    <RadioGroup
      value={formState.received_status}
      onValueChange={handleRadioChange}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="delivered" id="delivered" />
        <Label htmlFor="delivered">Delivered</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="estimated" id="estimated" />
        <Label htmlFor="estimated">Estimated</Label>
      </div>
      <Input
        id="enquiry_date"
        name="enquiry_date"
        type="date"
        value={formState.enquiry_date}
        onChange={handleInputChange}
      />
    </RadioGroup>



  </div>
  <DialogFooter>
    <Button type="submit">{isLoading ? "Submitting..." : "Submit"}</Button>
  </DialogFooter>
</form>
  
        </DialogContent>
      </Dialog>
      <EditOrderDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        order={editingOrder}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete()}>
              {isLoading ? "Deleting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
