"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import{ Template }from "@/components/pdfGenerate/template";

export function GeneratePDFButton({ leftSlip, rightSlip }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);

      // Generate the PDF
      const blob = await pdf(
        <Template leftSlip={leftSlip} rightSlip={rightSlip} />
      ).toBlob();

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "packing-slip.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleGeneratePDF} disabled={isGenerating}>
      {isGenerating ? "Generating..." : "Generate PDF"}
    </Button>
  );
}
