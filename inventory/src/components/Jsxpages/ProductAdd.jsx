import React, { useState, useEffect } from "react";

const ProductAdd = () => {
  const [product, setProduct] = useState({
    name: "",
    qty: 0,
    price: 0,
    discount: 0,
    total: 0,
  });
  const handleChange = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: field === 'qty' || field === 'price' || field === 'discount' ? Number(value) : value
    }));
  };
  useEffect(() => {
    const discountAmount = (product.qty * product.price * product.discount) / 100;
    setProduct((prev) => ({
      ...prev,
      total: product.qty * product.price - discountAmount,
    }));
  }, [product.qty, product.price, product.discount]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to add this product?")) {
      return;
    }

    const endpoint = "http://localhost:8000/api/products-view/";
    const payload = {
      productname: product.name,
      total_qty : product.qty,
      qty: product.qty,
      price: product.price,
      discount: product.discount,
      total: product.total,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert("Product added successfully!");
        setProduct({ name: "", qty: 0, price: 0, discount: 0, total: 0 });
      } else {
        console.error("Error adding product:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container-fluid mt-4 px-lg-5">
      <h2 style={{marginTop:"100px"}} className="text-center text-primary">Add New Product</h2>
      <hr />

      <form id="Add-Product" onSubmit={handleSubmit}>
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-dark">
              <tr>
                <th>Product Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount (%)</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={product.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Product Name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={product.qty}
                    onChange={(e) => handleChange("qty", e.target.value)}
                    placeholder="Qty"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={product.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="Price"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={product.discount}
                    onChange={(e) => handleChange("discount", e.target.value)}
                    placeholder="Discount %"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={product.total}
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn-success px-4">Add Product</button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
