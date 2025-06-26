import React, { useState, useEffect } from "react";

const ProductTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [newStcok, setNewStock] = useState("");
  const [showStockModal, setShowStockModal] = useState(false);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products-view/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDeleteClick = (productId) => {
    setSelectedProduct(productId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products-view/?product_id=${selectedProduct}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter(product => product.id !== selectedProduct));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product.id);
    setNewPrice(product.price);
    setShowUpdateModal(true);
  };

  const handleUpdateStock = (product)=>{
    setSelectedProduct(product.id);
    setNewStock(product.qty);
    setShowStockModal(true)
  }

  const confirmUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products-view/?id=${selectedProduct}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: selectedProduct, price: newPrice })
      });
      if (!response.ok) throw new Error("Failed to update price");
      setProducts(products.map(product => product.id === selectedProduct ? { ...product, price: newPrice } : product));
      setShowUpdateModal(false);
      alert(`${selectedProduct} price updated successfully`)
    } catch (error) {
      console.error("Error updating price:", error);
      alert("Failed to update price", error);
    }
  };

  const confirmUpdateStock = async ()=>{
    try {
      const response = await fetch(`http://localhost:8000/api/products-view/?id=${selectedProduct}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: selectedProduct, total_qty:newStcok, qty : newStcok })
      });
      if (!response.ok) throw new Error("Failed to update price");
      setProducts(products.map(product => product.id === selectedProduct ? { ...product, qty : newStcok, total_qty:newStcok } : product));
      setShowStockModal(false);
      alert(`${selectedProduct} Stock updated successfully`)
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update Stock", error);
    }
  }

  return (
    <div className="container-fluid mt-4 px-lg-5">
      <h1 style={{marginTop:"100px"}} className="mb-3 text-primary fw-bold text-center">Product List</h1>
      <hr />
      <div className="card shadow-lg rounded p-3">
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Manage Products</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Total Stock</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.productname}</td>
                    <td>{product.price}</td>
                    <td>{product.total_qty}</td>
                    <td>{product.qty}</td>
                    <td>
                      <span className={`badge ${product.qty > (product.total_qty * 0.25) ? "bg-success" : "bg-warning"} px-2 py-1`}>
                        {product.qty < (product.total_qty * 0.25) ? "Low Stock" : "Available"}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleUpdateClick(product)} className="btn btn-warning btn-sm mx-1">
                        <i className="fas fa-edit"></i> Update Price
                      </button>
                      <button onClick={() => handleDeleteClick(product.id)} className="btn btn-danger btn-sm mx-1">
                        <i className="fas fa-trash"></i> Delete
                      </button>
                      <button onClick={()=> handleUpdateStock(product)} className="btn btn-success btn-sm mx-1">Add stock</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showUpdateModal && (
      <div className="modal-backdrop show bg-dark opacity-75"></div>
      )}
      {showUpdateModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-light">
              <div className="modal-header bg-primary text-white">
                <h4 className="modal-title">Update Price</h4>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowUpdateModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <input
                  type="number"
                  className="form-control bg-secondary text-white border-light"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={confirmUpdate}>
                  Update
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStockModal && (
      <div className="modal-backdrop show bg-dark opacity-75"></div>
      )}
      {showStockModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-light">
              <div className="modal-header bg-primary text-white">
                <h4 className="modal-title">Update Stock</h4>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowStockModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <input
                  type="number"
                  className="form-control bg-secondary text-white border-light"
                  value={newStcok}
                  onChange={(e) => setNewStock(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={confirmUpdateStock}>
                  Update
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowStockModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



        {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h4 className="modal-title">Delete Product</h4>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <p>Are you sure you want to delete product <strong>{selectedProduct}</strong>?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-danger" onClick={confirmDelete}>
                    Delete
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
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

export default ProductTable;
