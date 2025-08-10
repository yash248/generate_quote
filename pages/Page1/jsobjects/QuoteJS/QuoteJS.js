export default {
  subtotal: () => {
    return Table1.tableData.reduce((sum, row) => sum + (Number(row.qty) * Number(row.price)), 0);
  },
  tax: () => {
    return this.subtotal() * (Number(TaxInput.text) / 100);
  },
  total: () => {
    return this.subtotal() + this.tax();
  },
  generateQuoteId: () => {
    return "Q-" + Date.now();
  },
  generatePdf: async () => {
    const doc = new jspdf.jsPDF();
    doc.text(`Quotation for ${CustomerNameInput.text}`, 10, 10);
    Table1.tableData.forEach((item, idx) => {
      doc.text(`${item.product} x ${item.qty} = ${item.price}`, 10, 20 + (idx*10));
    });
    doc.text(`Total: ${this.total()}`, 10, 80);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    storeValue("generatedPdfUrl", pdfUrl);
  }
};
