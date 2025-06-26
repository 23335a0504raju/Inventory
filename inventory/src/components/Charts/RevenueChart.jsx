import React, { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const ProfitMargin = () => {
  const [data, setData] = useState([]);

  // Function to determine color based on profit value
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
      .then((apiData) => {
        console.log("API Data:", apiData); // Debugging
        if (Array.isArray(apiData)) {
          // Ensure all profit values are valid numbers
          const processedData = apiData.map((item) => ({
            ...item,
            profit: item.profit !== null && item.profit !== undefined ? Number(item.profit) : 0, // Replace null/undefined with 0
            productname: item.productname || "Unknown", // Ensure product name is never null
          }));
          setData(processedData);
        } else {
          setData([]);
        }
      })
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
            label={({ productname, profit }) => {
              const validProfit = typeof profit === "number" ? profit : 0; // Ensure profit is a valid number
              return `${productname}: ₹${validProfit.toLocaleString()}`;
            }}
            outerRadius={120}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.profit)} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const validValue = typeof value === "number" ? value : 0; // Ensure value is a valid number
              return `₹${validValue.toLocaleString()}`;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitMargin;