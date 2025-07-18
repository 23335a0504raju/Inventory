import { useEffect, useState } from "react";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, [customers]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("https://inventory-iplt.onrender.com/api/customer/");
      const data = await response.json();
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const deleteCustomer = async (customerName) => {
  
    try {
      const response = await fetch("https://inventory-iplt.onrender.com/api/customer/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_name: customerName }),
      });
  
      if (response.ok) {
        alert("Customer deleted successfully!");
        setCustomers(customers.filter((c) => c.customer_name !== customerName));
      } else {
        alert("Failed to delete customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h1 style={{marginTop:"100px"}}>Customer List</h1>
      <hr />
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>Manage Customers</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.id || index}>
                    <td>{customer.customer_name}</td>
                    <td>{customer.customer_email}</td>
                    <td>{customer.customer_phone}</td>
                    <td>{customer.customer_address_1}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCustomer(customer.customer_name)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
