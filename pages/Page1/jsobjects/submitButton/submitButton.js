export default {
	Button1onClick () {
		{{
  appendQuote.run(
    () => { storeValue("quote_id", QuoteForm.payload().quote.quote_id); showAlert("Quote saved","success"); },
    (e) => showAlert("Save failed: " + (e?.message || ""), "error")
  )
}}

	}
}