# Voucher Generator (React + Vite) - Client-only

This project is a demo client-side app that includes:
- A simple **Login** screen (hardcoded accounts).
- A **Voucher Generator** that:
  - Accepts a PDF template.
  - Generates QR codes (JSON with voucher_uid, value, expires_at).
  - Embeds QR codes into the top-right corner of the template PDF (80x80 px).
  - Produces multiple PDF files, creates an Excel file (vouchers.xlsx) with the list,
    and bundles everything into a ZIP for download.

## Quick start

1. Install:
   ```bash
   npm install
   ```

2. Run dev server:
   ```bash
   npm run dev
   ```

3. Open the page shown by Vite (usually http://localhost:5173)

## Notes
- This is a client-only implementation. All PDF/QR processing is done in the browser.
- For production use or multi-user security, use a proper authentication backend.
- Demo accounts in Login: `admin/123456` and `staff/voucher2025`.
