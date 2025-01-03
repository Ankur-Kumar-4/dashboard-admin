"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MedicineTable({ data = [] }) {
  // Find max number of medicines across all orders
  const maxMedicines = Math.max(...data.map((order) => order.medicines.length));

  return (
    <div className="w-full h-[500px] relative rounded-md border overflow-auto">
      <Table>
        <TableHeader className=" top-0 bg-white z-30">
          <TableRow>
            {/* Fixed columns */}
            <TableHead
              className="sticky left-0 bg-blue-100 border-r z-50"
              style={{
                position: "sticky",
                left: 0,
                boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                minWidth: "100px", // Use min-width for Date column
              }}
              rowSpan={2}
            >
              Date
            </TableHead>
            <TableHead
              className="sticky left-[100px] bg-blue-100 border-r z-50"
              style={{
                position: "sticky",
                left: "100px",
                boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                minWidth: "150px", // Use min-width for Patient Name column
              }}
              rowSpan={2}
            >
              Patient Name
            </TableHead>
            <TableHead
              className="sticky left-[250px] bg-blue-100 border-r z-50"
              style={{
                position: "sticky",
                left: "250px",
                boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                minWidth: "120px", // Use min-width for Mobile No. column
              }}
              rowSpan={2}
            >
              Mobile No.
            </TableHead>
            <TableHead
              className="sticky left-[370px] bg-blue-100 border-r z-50"
              style={{
                position: "sticky",
                left: "370px",
                boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                minWidth: "400px", // Use min-width for Address column
              }}
              rowSpan={2}
            >
              Address
            </TableHead>
            <TableHead
              className="sticky left-[770px] bg-blue-100 border-r z-50"
              style={{
                position: "sticky",
                left: "770px",
                boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                minWidth: "100px", // Use min-width for Pincode column
              }}
              rowSpan={2}
            >
              Pincode
            </TableHead>

            {/* Scrollable columns */}
            <TableHead className="bg-white border-r pl-4 ml-60">
              <div className="flex gap-4">
                {Array.from({ length: maxMedicines }).map((_, index) => (
                  <div
                    key={`medicine-${index}`}
                    className="min-w-[300px] text-center border-l"
                  >
                    Medicine {index + 1}
                    <div className="flex border-t mt-2">
                      <div className="flex-1 px-2 border-r">Name</div>
                      <div className="flex-1 px-2 border-r">MRP</div>
                      <div className="flex-1 px-2">Qty</div>
                    </div>
                  </div>
                ))}
              </div>
            </TableHead>

            {/* Regular columns */}
            <TableHead className="bg-white" rowSpan={2}>
              Shipping
            </TableHead>
            <TableHead className="bg-white" rowSpan={2}>
              Amount
            </TableHead>
            <TableHead className="bg-white" rowSpan={2}>
              Discount
            </TableHead>
            <TableHead className="bg-white" rowSpan={2}>
              Total
            </TableHead>
            <TableHead className="bg-white" rowSpan={2}>
              Payment Status
            </TableHead>
            <TableHead className="bg-white" rowSpan={2}>
              Dispatch Status
            </TableHead>
            <TableHead className="bg-white" rowSpan={2}>
              AWB No.
            </TableHead>
            <TableHead className="bg-white" rowSpan={2}>
              Remarks
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((order, index) => (
            <TableRow key={index}>
              {/* Fixed columns */}
              <TableCell
                className="sticky left-0 bg-blue-100 border-r z-30"
                style={{
                  position: "sticky",
                  left: 0,
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "100px", // Use min-width for Date column
                }}
              >
                {order.date}
              </TableCell>
              <TableCell
                className="sticky left-[100px] bg-blue-100 border-r z-30"
                style={{
                  position: "sticky",
                  left: "100px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "150px", // Use min-width for Patient Name column
                }}
              >
                {order.patient_name}
              </TableCell>
              <TableCell
                className="sticky left-[250px] bg-blue-100 border-r z-30"
                style={{
                  position: "sticky",
                  left: "250px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "120px", // Use min-width for Mobile No. column
                }}
              >
                {order.mobile_no}
              </TableCell>
              <TableCell
                className="sticky left-[370px] bg-blue-100 border-r z-30"
                style={{
                  position: "sticky",
                  left: "370px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "400px", // Use min-width for Address column
                }}
              >
                {order.address}
              </TableCell>
              <TableCell
                className="sticky left-[770px] bg-blue-100 border-r z-30"
                style={{
                  position: "sticky",
                  left: "770px",
                  boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  minWidth: "100px", // Use min-width for Pincode column
                }}
              >
                {order.pincode}
              </TableCell>

              {/* Scrollable columns */}
              <TableCell className="bg-white ml-60 p-0 border-r pl-4">
                <div className="flex gap-4">
                  {Array.from({ length: maxMedicines }).map((_, idx) => {
                    const medicine = order.medicines[idx] || {
                      name: "",
                      mrp: 0,
                      qty: 0,
                    };
                    return (
                      <div
                        key={`medicine-${idx}`}
                        className="min-w-[300px] flex border-l"
                      >
                        <div className="flex-1 p-4 text-center border-r">
                          {medicine.name}
                        </div>
                        <div className="flex-1 p-4 text-center border-r">
                          {medicine.mrp ? `₹${medicine.mrp}` : ""}
                        </div>
                        <div className="flex-1 p-4 text-center">
                          {medicine.qty || ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TableCell>

              {/* Regular cells */}
              <TableCell className="text-right">
                ₹{order.shipping_charges}
              </TableCell>
              <TableCell className="text-right">₹{order.amount}</TableCell>
              <TableCell className="text-right">₹{order.discount}</TableCell>
              <TableCell className="text-right">
                ₹{order.total_amount}
              </TableCell>
              <TableCell>{order.payment_reconciliation_status}</TableCell>
              <TableCell>{order.dispatch_status}</TableCell>
              <TableCell>{order.awb_docket_no}</TableCell>
              <TableCell>{order.remarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
