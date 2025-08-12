
// JSObject: QuoteUtils
export default {
  // Convert INR base price into target currency
  convert(amountInINR, targetCode) {
    const rates = appsmith.store.fx || [];
    if (targetCode === "INR") return amountInINR;
    const row = rates.find(r => r.code === targetCode);
    if (!row) { return amountInINR; }
    // amount in INR -> target = amount / rate_to_inr when rate_to_inr = target per INR
    return (amountInINR / row.rate_to_inr);
  },

  // Compute line totals
  computeLines(items) {
    return items.map(it => ({
      ...it,
      line_total: (it.qty * it.unit_price)
    }));
  },

  // Compute totals
  computeTotals(lines, freight=0, insurance=0, discount=0) {
    const subtotal = lines.reduce((s, l) => s + l.line_total, 0);
    return {
      subtotal: +subtotal.toFixed(2),
      freight: +freight.toFixed(2),
      insurance: +insurance.toFixed(2),
      discount: +discount.toFixed(2),
      grand_total: +(subtotal + freight + insurance - discount).toFixed(2)
    };
  },

  // Build payload for PDF template
  buildPayload({quote, customer, items, totals}) {
    return { quote, customer, items, totals };
  }
}
