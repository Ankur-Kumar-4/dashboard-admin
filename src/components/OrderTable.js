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
import {EditOrderDialog }from "@/components/EditOrderDialog";

export default function OrderTable({ data, getOrders }) {
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [receivedStatus, setReceivedStatus] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

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
    return `${month}-${day}-${year}`;
  };

  const handleDelete = async () => {
   try {
    const response = await ApiService.delete(`${ApiEndPoints?.deleteOrder}/${orderId}`);
    toast({ title: "Order deleted successfully!", variant: "success" });
    setIsDeleteDialogOpen(false);
    getOrders();
   } catch (error) {
    toast({ title: "Error deleting order", variant: "destructive" });
   }
  };
  const handleOrderStatusSubmit = async (orderId, status) => {
    try {
      const response = await ApiService.put(`${ApiEndPoints?.updateOrderStatus}/${orderId}`,{ status });
      toast({ title: "Order status updated successfully!", variant: "success" });
      setIsOpenStatus(false);
      getOrders();
    } catch (error) {
      setIsOpenStatus(false);
      toast({ title: "Error updating order status", variant: "destructive" });
    }
  };
  const handleEdit = (order) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (updatedOrder) => {
    try {
      const response = await ApiService.put(`${ApiEndPoints?.updateOrder}/${updatedOrder.id}`, updatedOrder);
      toast({ title: "Order updated successfully!", variant: "success" });
      setIsEditDialogOpen(false);
      getOrders();
    } catch (error) {
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
              >Field No.</TableHead>
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
                  left: "556px",
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
                  left: "755px",
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
                      <DropdownMenuItem onClick={() => handleEdit(order)}>Edit Order</DropdownMenuItem>
                      <DropdownMenuItem onClick={() =>{ setIsOpenStatus(true); setOrderId(order.id)}}>Delivery Agent</DropdownMenuItem>
                      <DropdownMenuItem>Management Team</DropdownMenuItem>
                      <DropdownMenuItem onClick={() =>{ setIsDeleteDialogOpen(true); setOrderId(order.id)}}>Delete</DropdownMenuItem>
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
                    left: "556px",
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
                    left: "755px",
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
<TableCell className="text-xs min-w-[100px]">
  {order.received_status}
</TableCell>
<TableCell className="text-xs min-w-[100px]">
  {order.through}
</TableCell>
<TableCell className="text-xs min-w-[100px]">
  {order.awb_docket_no}
</TableCell>
<TableCell className="text-xs min-w-[100px]">
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
          <form
  onSubmit={(e) => {
    e.preventDefault(); // Prevent page reload
    handleOrderStatusSubmit(orderId, {
      dispatch_status: dispatchStatus,
      received_status: receivedStatus,
    });
  }}
>
  <div className="grid gap-4 py-4">
    <div className="grid grid-cols-1 items-center gap-4">
      <Label htmlFor="dispatchStatus" className="text-left">
        Dispatch Status
      </Label>
      <Input
        name="dispatch_status"
        value={dispatchStatus}
        onChange={(e) => setDispatchStatus(e.target.value)} // Use onChange
      />
    </div>
    <div className="grid grid-cols-1 items-center gap-4">
      <Label htmlFor="receivedStatus" className="text-left">
        Received Status
      </Label>
      <Input
        name="received_status"
        value={receivedStatus}
        onChange={(e) => setReceivedStatus(e.target.value)} // Use onChange
      />
    </div>
  </div>

  <DialogFooter>
    <Button type="submit">Submit</Button>
  </DialogFooter>
</form>

        </DialogContent>
      </Dialog>
      <EditOrderDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        order={editingOrder}
        onSubmit={handleEditSubmit}
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
            <Button
              variant="destructive"
              onClick={() => handleDelete()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
