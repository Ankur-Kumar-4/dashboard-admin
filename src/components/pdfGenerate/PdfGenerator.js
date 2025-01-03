'use client';
import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles remain the same as your original code
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 15,
    alignItems: 'flex-start',
  },
  section: {
    width: '48%',
    marginBottom: 20,
  },
  toSection: {
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
  dispatchSection: {},
  dispatchId: {
    textAlign: 'center',
    fontSize: 9,
    marginTop: '4pt',
  },
  packingSlip: {},
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
  },
  totalRow: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: '4pt',
    paddingTop: '4pt',
  },
});

// SlipTemplate component remains the same
const SlipTemplate = ({ data }) => {
  const emptyRowsCount = Math.max(0, 10 - (data.medicines?.length || 0));
  
  return (
    <View style={styles.section}>
      <View style={{border: '1pt solid black'}}>
        <View style={styles.toSection}>
          <Text style={styles.toLabel}>To:</Text>
          <Text style={styles.address}>{data.patient_name}</Text>
          <Text style={styles.address}>{data.address}</Text>
          <Text style={styles.address}>Pincode - {data.pincode}</Text>
          <Text style={styles.mobileNumber}>Mobile No. {data.mobile_no}</Text>
        </View>
        
        <View style={styles.returnAddress}>
          <Text>If Undelivered Please Return To</Text>
          <Text>QHT Mediways</Text>
          <Text>QHT Clinic, Model Colony, Haridwar - 249407</Text>
        </View>
      </View>
      
      <Text style={styles.dispatchId}>DISPATCH ID. {data.awb_docket_no || '-'}</Text>
      
      <View style={{border: '1pt solid black'}}>
        <View style={styles.dispatchSection}>
          <Text style={{fontSize: 9, borderBottom: '1pt solid black', paddingLeft: '2pt', paddingTop: '2pt'}}>{data.patient_name}</Text>
          <Text style={{fontSize: 9, borderBottom: '1pt solid black', paddingVertical: '2pt', paddingLeft: '2pt'}}>{data.address} Pincode - {data.pincode}</Text>
        </View>
        
        <View style={styles.packingSlip}>
          <Text style={styles.packingSlipHeader}>PACKING SLIP</Text>
          
          {data.medicines?.map((medicine, index) => (
            <Text key={index} style={styles.itemRow}>
              {medicine.name} - {medicine.qty} Pc (MRP - Rs.{medicine.mrp})
            </Text>
          ))}
          
          {Array.from({ length: emptyRowsCount }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyRow} />
          ))}
          
          <Text style={styles.deliveryCharges}>
            Delivery Charges - Rs.{data.shipping_charges}
          </Text>
          
          <Text style={styles.totalRow}>
            Total - Rs.{data.total_amount}
          </Text>
        </View>
      </View>
    </View>
  );
};

// PDF Document component
const PDFDocument = ({ data }) => (
  <Document>
    {Array.from({ length: Math.ceil(data.length / 2) }).map((_, pageIndex) => (
      <Page key={pageIndex} size="A4" style={styles.page}>
        <SlipTemplate data={data[pageIndex * 2]} />
        {data[pageIndex * 2 + 1] && (
          <SlipTemplate data={data[pageIndex * 2 + 1]} />
        )}
      </Page>
    ))}
  </Document>
);

// Main component
const PDFGenerator = ({ data }) => {
  return (
    <div className="w-full p-4">
      <PDFDownloadLink
        document={<PDFDocument data={data} />}
        fileName="packing-slips.pdf"
      >
        {({ blob, url, loading, error }) => (
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PDFGenerator;