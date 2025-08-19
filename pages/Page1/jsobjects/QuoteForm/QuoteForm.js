export default {
  payload() {
    // Read from your form widgets – rename to your actual widget names
    const company = CompanyInput.text;
    const contact_name = ContactNameInput.text;
    const email = EmailInput.text;
    const phone = PhoneInput.text;
    const country = CountrySelect.model;
    const city = CityInput.text;

    const currency = CurrencySelect.selectedOptionValue || "USD";
    const incoterm = IncotermSelect.selectedOptionValue || "CIF";
    const port = PortInput.text;

    // Items come from your QuoteItemsTable
    const items = (QuoteItemsTable.tableData || []).map(r => ({
      sku: r.sku, name: r.name, hs_code: r.hs_code, unit: r.unit,
      qty: Number(r.qty || 0),
      unit_price: Number(r.unit_price || 0),
      line_total: Number(r.qty || 0) * Number(r.unit_price || 0)
    }));

    const subtotal = items.reduce((s, i) => s + i.line_total, 0);
    const freight = Number(FreightInput.value || 0);
    const insurance = Number(InsuranceInput.value || 0);
    const discount = Number(DiscountInput.value || 0);
    const totals = {
      subtotal: +subtotal.toFixed(2),
      freight: +freight.toFixed(2),
      insurance: +insurance.toFixed(2),
      discount: +discount.toFixed(2),
      grand_total: +(subtotal + freight + insurance - discount).toFixed(2)
    };

    const quote = {
      quote_id: appsmith.store.quote_id || _.uniqueId("qt_"),
      quote_no: QuoteNoInput.text || ("ITD-Q-" + moment().format("YYMMDD") + "-" + _.random(100,999)),
      date_iso: moment().toISOString(),
      valid_until_iso: ValidUntil.selectedDate ? moment(ValidUntil.selectedDate).toISOString() : moment().add(7,'days').toISOString(),
      currency, incoterm, port,
      payment_terms: PayTermsInput.text,
      lead_time: LeadTimeInput.text,
      packaging: PackagingInput.text
    };

    const customer = { company, contact_name, email, phone, country, city };

    return { quote, customer, totals, items };
  }
}
