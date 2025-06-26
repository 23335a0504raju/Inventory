import React, { useEffect, useState, useMemo } from "react";

const InvoiceCreate = () => {
  const [invoiceType, setInvoiceType] = useState("invoice");
  const [invoiceStatus, setInvoiceStatus] = useState("open");
  const [invoiceDate, setInvoiceDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)


 const filteredProducts = useMemo(() => {
    return products.filter((product) => product.qty > product.total_qty * 0.25);
  }, [products]);

 
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/customer/");
        const data = await response.json();

        if (Array.isArray(data)) {
          setCustomers(data); 
        } else if (Array.isArray(data.data)) {
          setCustomers(data.data);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products-view/",{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data); 
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchProducts();
  }, []);




  const handleCustomerChange = (event) => {
    const customerId = event.target.value;
    console.log("Selected Customer ID:", customerId);
    const customer = customers.find((c) => c.id == customerId);

      if (customer) {
        setSelectedCustomer(customer);
        console.log(selectedCustomer)
      } else {
        console.warn("Selected customer not found.");
      }
  };

  const handleProductChange = (event) =>{
    const productId = event.target.value;
    console.log("Selected Product ID:", productId);
    const product = products.find((p) => p.id == productId);
    console.log(product)
    if (product) {
      setSelectedProduct(product);
    } else {
      console.warn("Selected product not found.");
    }
  }


  useEffect(() => {
      if (selectedProduct) {
          const discountAmount = (selectedProduct.price * count * selectedProduct.discount) / 100;
          setTotal((selectedProduct.price * count) - discountAmount);
      }
  }, [selectedProduct, count]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedCustomer || !selectedProduct || count <= 0) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const payload = {
      customer: selectedCustomer.id,
      invoice_date: invoiceDate,
      due_date: dueDate,
      invoice_type: invoiceType,
      invoice_status: invoiceStatus,
      items: [
        {
          product: selectedProduct.id,
          quantity: count,
          price: selectedProduct.price,
          discount: selectedProduct.discount,
          total: total,
        },
      ],
    };
  
    try {
      const response = await fetch("http://localhost:8000/api/create-invoice/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log(data)
  
      if (response.ok) {
        alert("Invoice created successfully!");
        setInvoiceDate("");
        setDueDate("");
        setInvoiceType("invoice");
        setInvoiceStatus("open");
        setSelectedCustomer(null);
        setSelectedProduct(null);
        setCount(0);
        setTotal(0);
      } else {
        console.error("Failed to create invoice:");
        alert(response.message || "Failed to create invoice. Please try again. Stock is not available");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert(`Cant create invoice: ${error.message}`);
    }
  };
  

  return (
    <div className="container-fluid mt-4 px-lg-5">
      <h2 style={{marginTop:"100px"}} className="text-center text-primary">
        Create New <span className="invoice_type">Invoice</span>
      </h2>
      <hr />

      <div id="response" className="alert alert-success d-none">
        <button className="btn-close" data-bs-dismiss="alert"></button>
        <div className="message"></div>
      </div>

      <form id="create_invoice" onSubmit={handleSubmit}>
        <input type="hidden" name="action" value="create_invoice" />

        {/* Invoice Type & Status */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Select Type:</label>
            <select className="form-select" value={invoiceType}  onChange={(e) => setInvoiceType(e.target.value)}>
              <option value="invoice">Invoice</option>
              <option value="receipt">Receipt</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Invoice Status:</label>
            <select className="form-select" value={invoiceStatus} required onChange={(e) => setInvoiceStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Invoice Dates & Number */}
        <div className="row g-3 mt-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Invoice Date:</label>
            <input type="date" className="form-control" name="invoice_date" value={invoiceDate} required onChange={(e)=> setInvoiceDate(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Due Date:</label>
            <input type="date" className="form-control" name="invoice_due_date" value={dueDate} required onChange={(e)=>setDueDate(e.target.value)} />
          </div>
        </div>

        {/* Customer Information */}
        <div className="row mt-4">
          {/* Customer Information */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5>Customer Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Select Customer:</label>
                  <select className="form-select" onChange={handleCustomerChange} defaultValue="" required>
                    <option value="" disabled>
                      -- Select Customer --
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.customer_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Customer Name" value={selectedCustomer?.customer_name || ""} readOnly />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Email" value={selectedCustomer?.customer_email || ""} readOnly />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Address" value={selectedCustomer?.customer_address_1 || ""} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-secondary text-white">
                <h5>Shipping Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Shipping Name" value={selectedCustomer?.customer_name_ship || ""} readOnly />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Shipping Address" value={selectedCustomer?.customer_address_1_ship || ""} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select className="form-select" onChange={handleProductChange} defaultValue="" required>
                    <option value="" disabled>
                      -- Select Product --
                    </option>
                    {filteredProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        { product.productname}
                      </option>
                    ))}
                  </select>
                </td>
                <td><input type="number" className="form-control" name="invoice_product_qty[]" value={count} placeholder="Quantity" onChange={(e)=> setCount(e.target.value)} required /></td>
                <td><input type="number" className="form-control" name="invoice_product_price[]" placeholder="0.00" value={selectedProduct?.price || ""}/></td>
                <td><input type="text" className="form-control" name="invoice_product_discount[]" placeholder="Enter % or value" value={selectedProduct?.discount} /></td>
                <td><input type="text" className="form-control" name="invoice_product_sub[]" value={total} disabled /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-success px-4">Create Invoice</button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceCreate;
