export default {
  render() {
    const tpl = QuoteForm.text;
    const data = QuoteBuilder.payload();

    function rows(items){
      return items.map((it, i)=>`
        <tr>
          <td>${i+1}</td><td>${it.sku}</td><td>${it.name}</td><td>${it.hs_code}</td>
          <td>${it.unit}</td><td>${it.qty}</td>
          <td>${data.quote.currency} ${Number(it.unit_price).toFixed(2)}</td>
          <td>${data.quote.currency} ${Number(it.line_total).toFixed(2)}</td>
        </tr>`).join('');
    }

    let html = tpl
      .replace('{{quote.quote_no}}', data.quote.quote_no)
      .replace('{{quote.quote_date}}', data.quote.quote_date)
      .replace('{{quote.valid_until}}', data.quote.valid_until)
      .replace('{{customer.company}}', data.customer.company || '')
      .replace('{{customer.contact_name}}', data.customer.contact_name || '')
      .replace('{{customer.city}}', data.customer.city || '')
      .replace('{{customer.country}}', data.customer.country || '')
      .replace('{{customer.email}}', data.customer.email || '')
      .replace('{{customer.phone}}', data.customer.phone || '')
      .replace(/{{quote.incoterm}}/g, data.quote.incoterm || '')
      .replace(/{{quote.port}}/g, data.quote.port || '')
      .replace(/{{quote.currency}}/g, data.quote.currency || '')
      .replace('{{quote.payment_terms}}', data.quote.payment_terms || '')
      .replace('{{quote.lead_time}}', data.quote.lead_time || '')
      .replace('{{quote.packaging}}', data.quote.packaging || '');

    html = html.replace(
      /<tbody>\s*{{#each items}}[\s\S]*{{\/each}}\s*<\/tbody>/,
      `<tbody>${rows(data.items)}</tbody>`
    );

    html = html
      .replace('{{totals.subtotal}}', Number(data.totals.subtotal).toFixed(2))
      .replace('{{totals.freight}}', Number(data.totals.freight).toFixed(2))
      .replace('{{totals.insurance}}', Number(data.totals.insurance).toFixed(2))
      .replace('{{totals.discount}}', Number(data.totals.discount).toFixed(2))
      .replace('{{totals.grand_total}}', Number(data.totals.grand_total).toFixed(2));

    download({ data: html, name: `${data.quote.quote_no}.html`, type: "text/html" });
  }
}
