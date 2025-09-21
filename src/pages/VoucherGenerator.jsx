import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function VoucherGenerator({ onLogout }){
  const [templateFile, setTemplateFile] = useState(null);
  const [content, setContent] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  const handleFileChange = (e) => {
    setTemplateFile(e.target.files[0]);
  };

  const handleGenerate = async () => {
    if(!templateFile) return alert("Vui lòng chọn file PDF template!");
    if(!content) return alert("Nhập nội dung voucher");
    if(!expiryDate) return alert("Chọn ngày hết hạn");
    if(quantity < 1) return alert("Số lượng phải >= 1");

    setBusy(true);
    try {
      const arrayBuffer = await templateFile.arrayBuffer();
      const zip = new JSZip();
      const excelRows = [];

      for(let i=0;i<quantity;i++){
        const uid = uuidv4().slice(0,8).toUpperCase();
        const qrPayload = { voucher_uid: uid, value: content, expires_at: expiryDate };

        const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));
        const pngBytes = await fetch(qrDataUrl).then(r=>r.arrayBuffer());

        // Load template each iteration so original stays unchanged
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const pngImage = await pdfDoc.embedPng(pngBytes);
        const qrSize = 80;

        firstPage.drawImage(pngImage, {
          x: firstPage.getWidth() - qrSize - 10,
          y: firstPage.getHeight() - qrSize - 10,
          width: qrSize,
          height: qrSize,
        });

        const pdfBytes = await pdfDoc.save();
        zip.file(`voucher_${uid}.pdf`, pdfBytes);

        excelRows.push({ "Voucher UID": uid, "Content": content, "Expires At": expiryDate });
      }

      // create excel via xlsx
      const ws = XLSX.utils.json_to_sheet(excelRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Vouchers");
      const excelArray = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      zip.file("vouchers.xlsx", excelArray);

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "vouchers_bundle.zip");
    } catch(err){
      console.error(err);
      alert("Có lỗi xảy ra: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <header className="topbar">
        <h1>Tạo Voucher</h1>
        <div>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <main className="card">
        <label>File voucher PDF</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />

        <label>Nội dung voucher</label>
        <input value={content} onChange={e=>setContent(e.target.value)} placeholder="VD: Giảm 10%" />

        <label>Ngày hết hạn</label>
        <input type="date" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} />

        <label>Số lượng</label>
        <input type="number" min="1" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} />

        <div style={{marginTop:12}}>
          <button className="btn-primary" onClick={handleGenerate} disabled={busy}>
            {busy ? "Đang tạo..." : "Tạo voucher"}
          </button>
        </div>
      </main>
    </div>
  );
}
