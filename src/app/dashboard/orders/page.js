"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiService from "@/lib/ApiServiceFunction";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";
import PDFGenerator from "@/components/pdfGenerate/PdfGenerator";
import MedicineTable from "@/components/OrderTable";

const OrdersTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState("");
  const [noDataFound, setNoDataFound] = useState(false);
  const [permissions, setPermissions] = useState("");


  const getOrders = async (filterParams = {}) => {
    try {
      setIsLoading(true);
      setNoDataFound(false);
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

      if (data.length === 0) {
        setNoDataFound(true);
      }

      setData(data);
      setIsLoading(false);
    } catch (error) {
      setData([]);
      setNoDataFound(true);
      setIsLoading(false);
      console.log(error);
    }
  };
const getPermission = async () => {
  try {
      
    const response = await ApiService.get(`${ApiEndPoints?.getpermission}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const data = response.data;
    setPermissions(data.role);
    setUserName(data.name);
    console.log(data.role);
    return data;
  } catch (error) {
    console.log(error);
  } finally {

  }
};
  useEffect(() => {
    getPermission();
    getOrders(); 
  }, []);

  const handleFilter = () => {
    getOrders({ fromDate, toDate }); 
  };

  return (
    <>
    {!isLoading ? (
      <>
      {permissions === "Admin" || permissions === "Order Book" || permissions === "Delivery Agent" ? (
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

          {!isLoading ? (
            noDataFound ? (
              <div className="flex items-center justify-center mt-10">
                <p className="text-gray-500">No data found for the selected date range.</p>
              </div>
            ) : (
              <MedicineTable  permissions={permissions} data={data} getOrders={getOrders} />
            )
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center mt-10">
          <p className="text-gray-500">You are not permitted to view this page.</p>
        </div>
      ) }
      </>
    ) : (
      <div className="flex items-center justify-center mt-10">
        <svg
          className="animate-spin h-16 w-16 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    )}
    </>
  );
};

export default OrdersTable;
