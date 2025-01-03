'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 30,
    gap: 20,
    fontFamily: 'Helvetica',
  },
  section: {
    flex: 1,
    border: '1pt solid black',
  },
  toSection: {
    borderBottom: '1pt solid black',
    padding: '10pt',
  },
  toLabel: {
    marginBottom: '5pt',
  },
  address: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  mobileNumber: {
    marginTop: '5pt',
    fontSize: 10,
  },
  returnAddress: {
    borderBottom: '1pt solid black',
    padding: '10pt',
    fontSize: 10,
    lineHeight: 1.4,
  },
  dispatchSection: {
    borderBottom: '1pt solid black',
    padding: '10pt',
  },
  dispatchId: {
    fontSize: 10,
    marginBottom: '5pt',
  },
  packingSlip: {
    padding: '10pt',
  },
  packingSlipHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: '10pt',
    borderBottom: '1pt solid black',
    paddingBottom: '5pt',
  },
  itemRow: {
    flexDirection: 'row',
    fontSize: 10,
    borderBottom: '0.5pt solid black',
    minHeight: '20pt',
    alignItems: 'center',
  },
  emptyRow: {
    height: '20pt',
    borderBottom: '0.5pt solid black',
  },
  itemName: {
    flex: 1,
    paddingRight: '10pt',
  },
  deliveryCharges: {
    flexDirection: 'row',
    fontSize: 10,
    borderBottom: '0.5pt solid black',
    minHeight: '20pt',
    alignItems: 'center',
    marginTop: '5pt',
  },
  totalRow: {
    flexDirection: 'row',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: '5pt',
    paddingTop: '5pt',
  },
})



export function Template({ leftSlip, rightSlip }) {
  const renderSlip = (data) => {
    // Calculate number of empty rows needed (total 10 rows including items)
    const emptyRowsCount = Math.max(0, 10 - data.items.length)
    
    return (
      <View style={styles.section}>
        {/* To Section */}
        <View style={styles.toSection}>
          <Text style={styles.toLabel}>To:</Text>
          <Text style={styles.address}>{data.to.name}</Text>
          <Text style={styles.address}>{data.to.address}</Text>
          <Text style={styles.mobileNumber}>Mobile No. {data.to.mobile}</Text>
        </View>
        
        {/* Return Address Section */}
        <View style={styles.returnAddress}>
          <Text>If Undelivered Please Return To</Text>
          <Text>QHT Mediways</Text>
          <Text>QHT Clinic, Model Colony, Haridwar - 249407</Text>
        </View>
        
        {/* Dispatch Section */}
        <View style={styles.dispatchSection}>
          <Text style={styles.dispatchId}>DISPATCH ID. {data.dispatchId}</Text>
          <Text style={styles.address}>{data.to.name}</Text>
          <Text style={styles.address}>{data.to.address}</Text>
        </View>
        
        {/* Packing Slip Section */}
        <View style={styles.packingSlip}>
          <Text style={styles.packingSlipHeader}>PACKING SLIP</Text>
          
          {/* Items */}
          {data.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
          
          {/* Empty Rows */}
          {Array.from({ length: emptyRowsCount }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyRow} />
          ))}
          
          {/* Delivery Charges */}
          <View style={styles.deliveryCharges}>
            <Text style={styles.itemName}>Delivery Charges - Rs.{data.deliveryCharges}</Text>
          </View>
          
          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.itemName}>Total - Rs.{data.total}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderSlip(leftSlip)}
        {renderSlip(rightSlip)}
      </Page>
    </Document>
  )
}

