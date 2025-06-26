import React, { useEffect, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DiscountImpactChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analytics/discount_vs_sales/", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Discount Impact on Sales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <XAxis type="number" dataKey="discount" name="Discount" unit="%" />
          <YAxis type="number" dataKey="total" name="Revenue" unit="$" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Discount vs Revenue" data={data} fill="#ff7300" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiscountImpactChart;
