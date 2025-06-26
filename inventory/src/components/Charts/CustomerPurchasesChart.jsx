import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

const CustomerPurchasesChart = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analytics/customer_purchases_distribution/",{
      method: "GET",
      headers: {
        'Authorization': `Token ${token}`, 
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Customer Purchases Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="invoice_count" nameKey="customer__customer_name" fill="#8884d8" label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerPurchasesChart;
