"use client";
import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import ApiService from "@/lib/ApiServiceFunction";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";

const data = [
  {
    date: "2024-01-02",
    patientName: "John Doe",
    mobileNo: "1234567890",
    address: "123 Main St",
    pincode: "12345",
    medicines: [
      { name: "Medicine A", mrp: 100, qty: 2 },
      { name: "Medicine B", mrp: 150, qty: 1 },
      { name: "Medicine C", mrp: 200, qty: 3 },
      { name: "Medicine D", mrp: 120, qty: 1 },
    ],
    shippingCharges: 50,
    amount: 350,
    discount: 20,
    totalAmount: 380,
    modeOfPayment: "Cash",
    dispatchStatus: "Delivered",
    enquiryMadeOn: "2024-01-01",
    paymentMadeOn: "2024-01-02",
    paymentReconciliationStatus: "Completed",
    receivedStatus: "Delivered",
    through: "Courier",
    awbDocketNo: "AWB123456",
    missingProductDuringDispatch: "None",
    remarks: "Delivered on time",
  },
  {
    date: "2024-01-02",
    patientName: "John Doe",
    mobileNo: "1234567890",
    address: "123 Main St",
    pincode: "12345",
    medicines: [
      { name: "Medicine A", mrp: 100, qty: 2 },
      { name: "Medicine B", mrp: 150, qty: 1 },
      { name: "Medicine C", mrp: 200, qty: 3 },
      { name: "Medicine D", mrp: 120, qty: 1 },
    ],
    shippingCharges: 50,
    amount: 350,
    discount: 20,
    totalAmount: 380,
    modeOfPayment: "Cash",
    dispatchStatus: "Delivered",
    enquiryMadeOn: "2024-01-01",
    paymentMadeOn: "2024-01-02",
    paymentReconciliationStatus: "Completed",
    receivedStatus: "Delivered",
    through: "Courier",
    awbDocketNo: "AWB123456",
    missingProductDuringDispatch: "None",
    remarks: "Delivered on time",
  },
  {
    date: "2024-01-02",
    patientName: "John Doe",
    mobileNo: "1234567890",
    address: "123 Main Sfdgfdgdfgdfgdfgd dsfmdsf hsdjfh",
    pincode: "12345",
    medicines: [
      { name: "Medicine ", mrp: 100, qty: 2 },
      { name: "Medicine ", mrp: 150, qty: 1 },
      { name: "Medicine ", mrp: 200, qty: 3 },
      { name: "Medicine ", mrp: 120, qty: 1 },
    ],
    shippingCharges: 50,
    amount: 350,
    discount: 20,
    totalAmount: 380,
    modeOfPayment: "Cash",
    dispatchStatus: "Delivered",
    enquiryMadeOn: "2024-01-01",
    paymentMadeOn: "2024-01-02",
    paymentReconciliationStatus: "Completed",
    receivedStatus: "Delivered",
    through: "Courier",
    awbDocketNo: "AWB123456",
    missingProductDuringDispatch: "None",
    remarks: "Delivered on time",
  },
];

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
  },
  {
    accessorKey: "mobileNo",
    header: "Mobile No.",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "pincode",
    header: "Pincode",
  },
  {
    accessorKey: "medicines",
    header: () => (
      <div className="w-full">
        <div className="flex">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="min-w-[200px]">
                <div className="bg-green-500 text-white p-2 text-center border border-gray-300">
                  Medicine {idx + 1}
                </div>
                <div className="grid grid-cols-3">
                  <div className="text-sm border border-gray-300 bg-green-500 text-white p-2">
                    <div className="font-medium">Name</div>
                  </div>
                  <div className="text-sm border border-gray-300 bg-green-500 text-white p-2">
                    <div className="font-medium">MRP</div>
                  </div>
                  <div className="text-sm border border-gray-300 bg-green-500 text-white p-2">
                    <div className="font-medium">Qty</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const medicines = row.getValue("medicines");
      return (
        <div className="w-full">
          <div className="flex">
            {medicines.map((med, idx) => (
              <div key={idx} className="min-w-[200px]">
                <div className="grid grid-cols-3 text-center">
                  <div className="text-sm border-gray-800">
                    <div>{med.name}</div>
                  </div>
                  <div className="text-sm border-gray-800">
                    <div>₹{med.mrp}</div>
                  </div>
                  <div className="text-sm border-gray-800">
                    <div>{med.qty}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "shippingCharges",
    header: "Shipping Charges",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("shippingCharges"));
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("discount"));
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return <div className="font-medium text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "modeOfPayment",
    header: "Mode of Payment",
  },
  {
    accessorKey: "dispatchStatus",
    header: "Dispatch Status",
  },
  {
    accessorKey: "receivedStatus",
    header: "Received Status",
  },
  {
    accessorKey: "through",
    header: "Through",
  },
  {
    accessorKey: "awbDocketNo",
    header: "AWB/Docket No",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
];

const OrdersTable = () => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);

  const getOrders = async () => {
    try {
      const response = await ApiService.get(`${ApiEndPoints?.getorders}`, {});

      const data = await response.data;
      console.log(data);

      setData(data);
    } catch (error) {
      setError(
        "An unexpected error occurred during signup. Please try again later."
      );
    } finally {

    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="mx-auto py-5 w-[95vw]">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter patients..."
          value={table.getColumn("patientName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("patientName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="text-sm font-semibold mb-2">Show/Hide Columns</div>
          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
              isExpanded ? "" : "max-h-8 overflow-hidden"
            }`}
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    id={column.id}
                  />
                  <label
                    htmlFor={column.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                  </label>
                </div>
              ))}
          </div>
          <button
            className="text-blue-500 mt-2 text-sm font-medium"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <div className="flex">
          {/* Fixed columns container */}
          <div className="w-auto">
            <Table>
              <TableHeader className="h-[77.5px]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.slice(0, 6).map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length
                  ? table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row
                          .getVisibleCells()
                          .slice(0, 6)
                          .map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </div>

          {/* Scrollable columns container */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.slice(6).map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length
                  ? table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row
                          .getVisibleCells()
                          .slice(6)
                          .map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
