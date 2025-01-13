import React from 'react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

function ExcelGenerate({ data }) {
  const handleGenerateExcel = () => {
    // Map data to create rows for the Excel sheet
    const formattedData = data.map((item) => ({
    //   Date: item.date,
      PatientName: item.patient_name,
      MobileNo: item.mobile_no,
      Address: item.address,

      TotalAmount: item.total_amount,

    }));

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'OrdersData.xlsx');
  };

  return (
    <section>
      <Button onClick={handleGenerateExcel}>Generate Excel</Button>
    </section>
  );
}

export default ExcelGenerate;
