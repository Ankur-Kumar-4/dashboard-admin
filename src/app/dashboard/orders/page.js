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
import PDFGenerator from '@/components/pdfGenerate/PdfGenerator';
import MedicineTable from "@/components/OrderTable";


const OrdersTable = () => {
  // const [sorting, setSorting] = React.useState([]);
  // const [columnFilters, setColumnFilters] = React.useState([]);
  // const [columnVisibility, setColumnVisibility] = React.useState({});
  // const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState([]);
  const maxMedicines = data.length > 0 
    ? Math.max(...data.map((order) => 
        order.medicines ? order.medicines.length : 0
      ), 0) 
    : 0;

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
            {Array(maxMedicines)
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
        return (
          <div className="font-medium text-right">₹{amount.toFixed(2)}</div>
        );
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
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState("");


  const getOrders = async (filterParams = {}) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`; // Convert yyyy-MM-dd to dd-MM-yyyy
      };
  
      // Get today's date in yyyy-MM-dd format
      const today = new Date().toISOString().split("T")[0];
  
      const params = new URLSearchParams();
      // Use today's date as default for fromDate
      params.append("from_date", formatDate(filterParams.fromDate || today));
      // Append to_date only if it exists
      if (filterParams.toDate) params.append("to_date", formatDate(filterParams.toDate));
  
      const response = await ApiService.get(
        `${ApiEndPoints?.getorders}?${params.toString()}`,
        {}
      );
      const data = response.data;
      console.log(data);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    getOrders(); // Fetch default orders on mount with today's from_date
  }, []);
  
  const handleFilter = () => {
    getOrders({ fromDate, toDate }); // Fetch filtered orders
  };
  
  // const table = useReactTable({
  //   data,
  //   columns,
  //   onSortingChange: setSorting,
  //   onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onColumnVisibilityChange: setColumnVisibility,
  //   onRowSelectionChange: setRowSelection,
  //   state: {
  //     sorting,
  //     columnFilters,
  //     columnVisibility,
  //     rowSelection,
  //   },
  // });
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="mx-auto w-[95vw]">
      <div className="flex items-center w-80 gap-4 mb-4">
    <Input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      placeholder="From Date"
    />
    <Input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      placeholder="To Date"
    />
    <Button onClick={handleFilter}>Find</Button>
    <PDFGenerator data={data} />
  </div>
      {/* rest of the code to display orders */}


        {/* <Input
          placeholder="Filter patients..."
          value={table.getColumn("patientName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("patientName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}

      {/* <Card className="mb-4">
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
      </Card> */}

<MedicineTable data={data} getOrders={getOrders}/>



     
    </div>
  );
};

export default OrdersTable;
