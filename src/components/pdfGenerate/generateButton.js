'use client'
import { GeneratePDFButton } from '@/components/pdfGenerate/generate'

export default function PDFGeneratorPage() {
  const sampleData = {
    leftSlip: {
      to: {
        name: 'Mr. Suneel Kumar',
        address: 'Village - Daravanagar, Post - Kunwargaon,\nDistrict - Budaun (Uttar Pradesh) PinCode - 243601',
        mobile: '9627351868'
      },
      dispatchId: '2024/AUG/16/01',
      items: [
        { name: 'XTEND-PRO 5% - 1 Pc (MRP - Rs.700)', mrp: 700 },
        { name: 'HAIR Q MAX - 1 Pc (MRP - Rs.650)', mrp: 650 },
        { name: 'FINASIL 1 MG - 3 Strips (MRP - Rs.80)', mrp: 80 }
      ],
      deliveryCharges: 99,
      total: 1689
    },
    rightSlip: {
      to: {
        name: 'Mr. Karan Verma',
        address: 'Saath Bhai Ki Goth, Infront of Parshad Dandotiya House,\nBehind Madhav Ganj Thana, Lakkad Khana Puli,\nLashkar, Gwalior (Madhya Pradesh) Pincode - 474001',
        mobile: '7898592217'
      },
      dispatchId: '2024/AUG/16/02',
      items: [
        { name: 'XTEND-PRO 5% - 1 Pc (MRP - Rs.700)', mrp: 700 },
        { name: 'HAIR Q MAX - 1 Pc (MRP - Rs.650)', mrp: 650 },
        { name: 'MOISTHAIR SHAMPOO - 1 Pc (MRP - Rs.250)', mrp: 250 },
        { name: 'VENFOLL SERUM - 1 Pc (MRP - Rs.1200)', mrp: 1200 }
      ],
      deliveryCharges: 99,
      total: 2800
    }
  }

  return (
    <div>
      <GeneratePDFButton 
        leftSlip={sampleData.leftSlip} 
        rightSlip={sampleData.rightSlip} 
      />
    </div>
  )
}

