import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ProductSalesTrend = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analytics/product_sales_trend/", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem("token")}`,
      },
    })
      .then(response => response.json())
      .then(apiData => setData(apiData))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Product Sales Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis
            dataKey="month"
            tickFormatter={(tick) => new Date(tick).toLocaleString("default", { month: "short", year: "numeric" })}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => [
              `${value} units`, 
              `${props.payload.product_name} (${props.payload.month})`
            ]}
            labelFormatter={(label) => `Month: ${new Date(label).toLocaleString("default", { month: "long", year: "numeric" })}`}
          />
          <Legend />
          {Array.from(new Set(data.map(item => item.product_name))).map((product, index) => (
            <Line
              key={product}
              type="monotone"
              dataKey="total_quantity"
              data={data.filter(item => item.product_name === product)}
              name={product}  // Legend Name
              stroke={["#8884d8", "#82ca9d", "#FF5733"][index % 3]}  // Unique color
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductSalesTrend;
