import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ProfitMargin = () => {
  const [data, setData] = useState([]);

  // Dynamic color mapping for profits/losses
  const getColor = (profit) => {
    if (profit > 0) return "#28a745"; // Green for profit
    if (profit < 0) return "#dc3545"; // Red for loss
    return "#6c757d"; // Grey for neutral
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analytics/profit_margin_analysis/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((apiData) => setData(apiData))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Profit Margin Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie 
            data={data} 
            dataKey="profit" 
            nameKey="productname" 
            label={({ productname, profit }) => `${productname}: ₹${profit.toLocaleString()}`} 
            outerRadius={120}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.profit)} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `₹${value.toLocaleString()}`} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitMargin;
