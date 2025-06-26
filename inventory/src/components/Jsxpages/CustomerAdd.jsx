import React, { useState } from "react";

const CustomerAdd = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_address_1: "",
    customer_town: "",
    customer_postcode: "",
    customer_address_2: "",
    customer_county: "",
    customer_phone: "",
    customer_name_ship: "",
    customer_address_1_ship: "",
    customer_town_ship: "",
    customer_postcode_ship: "",
    customer_address_2_ship: "",
    customer_county_ship: "",
  });

  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username") || "";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to add this customer?")) return;

    setLoading(true);
    const endpoint = "http://127.0.0.1:8000/api/customeradd/";
    const payload = {
      username,
      ...formData,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const responseData = await response.json();
      if (response.ok) {
        alert("Customer created successfully!");
        setFormData({
          customer_name: "",
          customer_email: "",
          customer_address_1: "",
          customer_town: "",
          customer_postcode: "",
          customer_address_2: "",
          customer_county: "",
          customer_phone: "",
          customer_name_ship: "",
          customer_address_1_ship: "",
          customer_town_ship: "",
          customer_postcode_ship: "",
          customer_address_2_ship: "",
          customer_county_ship: "",
        });
      } else {
        alert(responseData.error || "Failed to create customer. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h1 style={{marginTop:"100px"}} className="text-center">Add Customer</h1>
      <hr />
      <form id="create_customer" onSubmit={handleSubmit}>
        <div className="row g-4 justify-content-center">
          {/* Customer Information */}
          <div className="col-lg-6 col-md-12">
            <div className="card p-4 shadow-sm">
              <div className="card-header text-center bg-light">
                <h4>Customer Information</h4>
              </div>
              <div className="card-body">
                {Object.entries(formData)
                  .filter(([key]) => !key.includes("_ship"))
                  .map(([key, value]) => (
                    <input
                      key={key}
                      type={key.includes("email") ? "email" : "text"}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="form-control mb-3"
                      placeholder={key.replace(/_/g, " ").replace("customer", "").trim()}
                      required={!key.includes("address_2")}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="col-lg-6 col-md-12">
            <div className="card p-4 shadow-sm">
              <div className="card-header text-center bg-light">
                <h4>Shipping Information</h4>
              </div>
              <div className="card-body">
                {Object.entries(formData)
                  .filter(([key]) => key.includes("_ship"))
                  .map(([key, value]) => (
                    <input
                      key={key}
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="form-control mb-3"
                      placeholder={key.replace(/_/g, " ").replace("customer", "").trim()}
                      required={!key.includes("address_2")}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerAdd;
