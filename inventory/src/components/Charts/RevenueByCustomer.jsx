import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const RevenueByCustomer = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://inventory-iplt.onrender.com/api/analytics/revenue_by_customer/",{
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
      <h2 className="text-xl font-semibold mb-4">Revenue by Customer</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="customer__customer_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_revenue" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueByCustomer;
