import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TopSellingProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analytics/top_selling_products/",{
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem("token")}`,
      },
    })
      .then(response => response.json())
      .then(apiData => {
        const sortedData = apiData.sort((a, b) => b.total_quantity - a.total_quantity); // Sort by quantity
        setData(sortedData);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Top-Selling vs. Least-Selling Products</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={data}>
          <XAxis type="number" />
          <YAxis dataKey="product" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="total_quantity" fill="#4CAF50" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellingProducts;
