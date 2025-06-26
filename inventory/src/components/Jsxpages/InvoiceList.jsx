import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusOptions] = useState(["open", "paid"]);
  const [newStatus, setNewStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/invoices/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const result = await response.json();
      setData(result.reverse());
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (invoice) => {
    setSelectedInvoice(invoice);
    setNewStatus(invoice.invoice_status);
    setShowModal(true);
  };

  const confirmUpdateStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/invoice/${selectedInvoice.id}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ invoice_status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setShowModal(false);
      fetchInvoices();
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid mt-4 px-lg-5">
      <h1 className="mb-3 text-primary fw-bold text-center">Invoice List</h1>
      <hr />
      <div className="card shadow-lg rounded p-3">
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Manage Invoices</h4>
        </div>
        <div className="card-body">
          <h2 className="mb-3 text-center">Invoices</h2>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoice_number}</td>
                    <td>{invoice.customer?.customer_name || "N/A"}</td>
                    <td>
                      {invoice.invoice_date
                        ? invoice.invoice_date.split("T")[0]
                        : "N/A"}
                    </td>
                    <td>
                      {invoice.due_date
                        ? invoice.due_date.split("T")[0]
                        : "N/A"}
                    </td>
                    <td>{invoice.invoice_type}</td>
                    <td>
                      <span className="badge bg-success px-2 py-1">
                        {invoice.invoice_status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/invoice/${invoice.id}/view`)}
                        className="btn btn-warning btn-sm mx-1"
                      >
                        View
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdateStatus(invoice)}
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h4 className="modal-title">Update Invoice Status</h4>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <p>
                    Update status for invoice{" "}
                    <strong>{selectedInvoice.invoice_number}</strong>?
                  </p>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={confirmUpdateStatus}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceList;
