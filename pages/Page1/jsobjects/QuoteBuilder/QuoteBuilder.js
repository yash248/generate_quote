export default {
  ItemsState: [],
  setCustomerDefaults() {
    const cust = getCustomers.data.find(c => c.customer_id === CustomerSelect.selectedOptionValue);
    if (!cust) return;
    CurrencySelect.setSelectedOption(cust.currency || "USD");
    IncotermSelect.setSelectedOption(cust.incoterm || "CIF");
    PortInput.setValue(cust.port || "");
  },
  addProductToQuote(row) {
    const currency = CurrencySelect.selectedOptionValue || "USD";
    const unit_price = +(QuoteUtils.convert(row.base_price_inr, currency).toFixed(2));
    const next = [...this.ItemsState, {
      sku: row.sku, name: row.name, hs_code: row.hs_code, unit: row.unit,
      qty: 0, unit_price, currency
    }];
    this.ItemsState = next;
    QuoteItemsTable.setData(next);
  },
  recalc() {
    const data = QuoteItemsTable.tableData || [];
    // Recompute line totals, keep user-edited qty/prices
    const lines = data.map(d => ({...d, line_total: Number(d.qty||0)*Number(d.unit_price||0)}));
    QuoteItemsTable.setData(lines);
    return lines;
  },
  payload() {
    const cust = getCustomers.data.find(c => c.customer_id === CustomerSelect.selectedOptionValue) || {};
    const currency = CurrencySelect.selectedOptionValue || cust.currency || "USD";
    const lines = this.recalc();
    const totals = QuoteUtils.computeTotals(
      lines, Number(FreightInput.value||0), Number(InsuranceInput.value||0), Number(DiscountInput.value||0)
    );
    const quote = {
      quote_no: QuoteNoInput.text,
      quote_date: moment().format("YYYY-MM-DD"),
      valid_until: ValidUntil.selectedDate ? moment(ValidUntil.selectedDate).format("YYYY-MM-DD") : moment().add(7,'days').format("YYYY-MM-DD"),
      currency, incoterm: IncotermSelect.selectedOptionValue, port: PortInput.text,
      payment_terms: PayTermsInput.text, lead_time: LeadTimeInput.text, packaging: PackagingInput.text
    };
    const customer = {
      customer_id: CustomerSelect.selectedOptionValue,
      company: cust.company, contact_name: cust.contact_name, email: cust.email, phone: cust.phone,
      country: cust.country, city: cust.city
    };
    return { quote, customer, items: lines, totals };
  }
}
