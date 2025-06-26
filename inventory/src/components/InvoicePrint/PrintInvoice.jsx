import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../InvoicePrint/PrintInvoice.css";

const PrintInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/invoice/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch invoice data");
      }

      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  const downloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save(`Invoice_${invoice?.invoice_number}.pdf`);
    });
  };

  if (!invoice) {
    return <div>Loading Invoice...</div>;
  }

  return (
    <div style={{marginTop:"100px"}} className="invoice-container">
      <div ref={invoiceRef} className="invoice">
        <h2  className="text-center">Invoice</h2>
        <hr />
        <div className="invoice-header">
          <div>
            <h4>Invoice Number: {invoice.invoice_number}</h4>
            <h4>Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()}</h4>
            <h4>Due Date: {new Date(invoice.due_date).toLocaleDateString()}</h4>
            <h4>Status: {invoice.invoice_status}</h4>
          </div>
        </div>

        <hr />
        <div className="invoice-section">
          <h3>Billing To:</h3>
          <p><strong>Name:</strong> {invoice.customer.customer_name}</p>
          <p><strong>Email:</strong> {invoice.customer.customer_email}</p>
          <p><strong>Phone:</strong> {invoice.customer.customer_phone}</p>
          <p><strong>Address:</strong> {invoice.customer.customer_address_1}, {invoice.customer.customer_address_2}, {invoice.customer.customer_town}, {invoice.customer.customer_postcode}</p>
        </div>

        <hr />
        <div className="invoice-section">
          <h3>Shipping To:</h3>
          <p><strong>Name:</strong> {invoice.customer.customer_name_ship}</p>
          <p><strong>Address:</strong> {invoice.customer.customer_address_1_ship}, {invoice.customer.customer_address_2_ship}, {invoice.customer.customer_town_ship}, {invoice.customer.customer_postcode_ship}</p>
        </div>

        <hr />
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
              <th>Discount (₹)</th>
              <th>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.product.productname}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{item.discount.toFixed(2)}</td>
                <td>{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />
        <div className="invoice-total">
          <h3>
            Total Amount: ₹{" "}
            {invoice.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Buttons */}
      <div className="invoice-buttons">
        <button className="btn btn-primary" onClick={() => window.print()}>Print</button>
        <button className="btn btn-success" onClick={downloadPDF}>Download PDF</button>
      </div>
    </div>
  );
};

export default PrintInvoice;
