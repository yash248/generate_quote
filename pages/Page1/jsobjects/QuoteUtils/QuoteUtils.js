export default {
  convert(amountInINR, targetCode) {
    const rates = appsmith.store.fx || [];
    if (!targetCode || targetCode === "INR") return Number(amountInINR || 0);
    const row = rates.find(r => r.code === targetCode);
    if (!row) return Number(amountInINR || 0);
    return Number(amountInINR) / Number(row.rate_to_inr);
  },
  computeLines(items) {
    return items.map(it => ({ ...it, line_total: Number(it.qty||0)*Number(it.unit_price||0) }));
  },
  computeTotals(lines, freight=0, insurance=0, discount=0) {
    const subtotal = lines.reduce((s,l)=> s + Number(l.line_total||0), 0);
    return {
      subtotal: +subtotal.toFixed(2),
      freight: +Number(freight||0).toFixed(2),
      insurance: +Number(insurance||0).toFixed(2),
      discount: +Number(discount||0).toFixed(2),
      grand_total: +(subtotal + Number(freight||0) + Number(insurance||0) - Number(discount||0)).toFixed(2)
    };
  }
}
