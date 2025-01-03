'use client';
import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 15,
    alignItems: 'flex-start',
  },
  section: {
    width: '48%',  // Adjust to fit content
    // border: '1pt solid black',
    marginBottom: 20,
  },
  toSection: {
    // border: '1pt solid black',
    padding: '8pt',
  },
  toLabel: {
    marginBottom: '4pt',
    fontSize: 9,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  mobileNumber: {
    fontSize: 9,
    marginTop: '4pt',
  },
  returnAddress: {
    borderTop: '1pt solid black',
    padding: '8pt',
    fontSize: 9,
    lineHeight: 1.4,
  },
  dispatchSection: {
    
  },
  dispatchId: {
    textAlign: 'center',
    fontSize: 9,
    marginTop: '40pt',
  },
  packingSlip: {

  },
  packingSlipHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: '8pt',
    borderBottom: '1pt solid black',
    paddingBottom: '4pt',
    paddingTop: '4pt',
    textAlign: 'center',
  },
  itemRow: {
    fontSize: 9,
    borderBottom: '0.5pt solid black',
    minHeight: '16pt',
    padding: '3pt 0',
    paddingLeft: '1pt',
  },
  emptyRow: {
    height: '16pt',
    borderBottom: '0.5pt solid black',
  },
  deliveryCharges: {
    fontSize: 9,
    borderBottom: '0.5pt solid black',
    minHeight: '16pt',
    padding: '3pt 0',
    marginTop: '4pt',
    paddingLeft: '1pt',
  },
  totalRow: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingLeft: '1pt',
    paddingVertical: '4pt',
  },
});

// Sample data
const sampleData = [
  {
    "date": "2023-12-01",
    "patient_name": "John Doe",
    "mobile_no": "1234567890",
    "address": "123 Main St, Anytown, AT 12345",
    "pincode": "12345",
    "medicines": [
      {
        "name": "Medicine A",
        "mrp": 100,
        "qty": 2
      },
      {
        "name": "Medicine B",
        "mrp": 150,
        "qty": 1
      }
    ],
    "shipping_charges": 50,
    "amount": 350,
    "discount": 20,
    "total_amount": 380,
    "enquiry_made_on": "2023-11-30",
    "payment_made_on": "2023-12-01",
    "mode_of_payment": "card",
    "payment_reconciliation_status": "completed",
    "dispatch_status": "dispatched",
    "received_status": "pending",
    "through": "courier",
    "awb_docket_no": "AWB123456",
    "missing_product_during_dispatch": "",
    "remarks": "",
    "id": "order1"
  },
  {
    "date": "2023-12-02",
    "patient_name": "Jane Smith",
    "mobile_no": "9876543210",
    "address": "456 Elm St, Othertown, OT 67890",
    "pincode": "67890",
    "medicines": [
      {
        "name": "Medicine C",
        "mrp": 200,
        "qty": 1
      },
      {
        "name": "Medicine D",
        "mrp": 75,
        "qty": 3
      }
    ],
    "shipping_charges": 75,
    "amount": 425,
    "discount": 25,
    "total_amount": 475,
    "enquiry_made_on": "2023-12-01",
    "payment_made_on": "2023-12-02",
    "mode_of_payment": "cash",
    "payment_reconciliation_status": "completed",
    "dispatch_status": "dispatched",
    "received_status": "delivered",
    "through": "post",
    "awb_docket_no": "AWB789012",
    "missing_product_during_dispatch": "",
    "remarks": "Fragile items",
    "id": "order2"
  },
  {
    "date": "2023-12-03",
    "patient_name": "Alice Johnson",
    "mobile_no": "5551234567",
    "address": "789 Oak Rd, Thirdville, TV 13579",
    "pincode": "13579",
    "medicines": [
      {
        "name": "Medicine E",
        "mrp": 300,
        "qty": 1
      }
    ],
    "shipping_charges": 100,
    "amount": 300,
    "discount": 0,
    "total_amount": 400,
    "enquiry_made_on": "2023-12-02",
    "payment_made_on": "2023-12-03",
    "mode_of_payment": "online",
    "payment_reconciliation_status": "pending",
    "dispatch_status": "processing",
    "received_status": "pending",
    "through": "express",
    "awb_docket_no": "AWB345678",
    "missing_product_during_dispatch": "",
    "remarks": "Priority shipping",
    "id": "order3"
  }
];

// Template Component
const SlipTemplate = ({ data }) => {
  // Calculate number of empty rows needed (total 10 rows including items)
  const emptyRowsCount = Math.max(0, 10 - (data.medicines?.length || 0));
  
  return (
    <View style={styles.section}>
      {/* To Section */}
      <View style={{border: '1pt solid black'}}>
      <View style={styles.toSection}>
        <Text style={styles.toLabel}>To:</Text>
        <Text style={styles.address}>{data.patient_name}</Text>
        <Text style={styles.address}>{data.address}</Text>
        <Text style={styles.address}>Pincode - {data.pincode}</Text>
        <Text style={styles.mobileNumber}>Mobile No. {data.mobile_no}</Text>
      </View>
      
      {/* Return Address Section */}
      <View style={styles.returnAddress}>
        <Text>If Undelivered Please Return To</Text>
        <Text>QHT Mediways</Text>
        <Text>QHT Clinic, Model Colony, Haridwar - 249407</Text>
      </View>
      </View>
      {/* Dispatch Section */}
        <Text style={styles.dispatchId}>DISPATCH ID. {data.awb_docket_no || '-'}</Text>
        <View style={{border: '1pt solid black'}}>
      <View style={styles.dispatchSection}>
        
        <Text style={{fontSize: 9,borderBottom: '1pt solid black', paddingLeft: '2pt', paddingTop: '2pt'}}>{data.patient_name}</Text>
        <Text style={{fontSize: 9,borderBottom: '1pt solid black', paddingVertical: '2pt', paddingLeft: '2pt'}}>{data.address} Pincode - {data.pincode}</Text>
      </View>
      
      {/* Packing Slip Section */}
      <View style={styles.packingSlip}>
        <Text style={styles.packingSlipHeader}>PACKING SLIP</Text>
        
        {/* Items */}
        {data.medicines?.map((medicine, index) => (
          <Text key={index} style={styles.itemRow}>
            {medicine.name} - {medicine.qty} Pc (MRP - Rs.{medicine.mrp})
          </Text>
        ))}
        
        {/* Empty Rows */}
        {Array.from({ length: emptyRowsCount }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.emptyRow} />
        ))}
        
        {/* Delivery Charges */}
        <Text style={styles.deliveryCharges}>
          Delivery Charges - Rs.{data.shipping_charges}
        </Text>
        
        {/* Total */}
        <Text style={styles.totalRow}>
          Total - Rs.{data.total_amount}
        </Text>
        </View>
      </View>
    </View>
  );
};

export default function PDFViewerPage() {
  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <Document>
          {Array.from({ length: Math.ceil(sampleData.length / 2) }).map((_, pageIndex) => (
            <Page key={pageIndex} size="A4" style={styles.page}>
              <SlipTemplate data={sampleData[pageIndex * 2]} />
              {sampleData[pageIndex * 2 + 1] && (
                <SlipTemplate data={sampleData[pageIndex * 2 + 1]} />
              )}
            </Page>
          ))}
        </Document>
      </PDFViewer>
    </div>
  );
}

