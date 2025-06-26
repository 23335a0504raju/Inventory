import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const StockChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://inventory-iplt.onrender.com/api/analytics/remaining_stock_per_product/",{
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem("token")}`,
      },
    })
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Remaining Stock Per Product</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="productname" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="remaining_stock" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
