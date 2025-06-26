import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { CiViewTable } from "react-icons/ci";
import { FaDatabase, FaShoppingCart, FaUsers } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import CustomersLists from "./CustomersLists";
import ProductLists from "./ProductLists";
import DashboardBox from "./components/DashboardBox";



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const username = localStorage.getItem("username");
console.log("Hello :",username);

const totalProducts=localStorage.getItem("totalProducts");

const billstotal = localStorage.getItem("billstotal") || 0;
console.log("Total Bills:", billstotal);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
function createData(name, quantity, price, category, rating) {
  return { name, quantity, price, category, rating };
}

const rows = [
  createData("Laptop", 15, 1200, "Electronics", 4.5),
  createData("Smartphone", 25, 800, "Electronics", 4.7),
  createData("Running Shoes", 40, 120, "Footwear", 4.3),
  createData("Backpack", 30, 50, "Accessories", 4.2),
  createData("Jeans", 50, 40, "Clothing", 4.1),
];

const Dashboard = () => {
  const data = [
    [
      "Category",
      "Electronics",
      "Footwear",
      "Accessories",
      "Clothing",
      "Furniture",
      "Average",
    ],
    ["January", 150, 90, 60, 200, 45, 109],
    ["February", 170, 100, 75, 220, 55, 124],
    ["March", 190, 120, 85, 250, 65, 142],
    ["April", 180, 110, 80, 230, 60, 132],
    ["May", 200, 130, 95, 270, 75, 154],
  ];

  const options = {
    title: "Monthly Inventory Stock by Category",
    vAxis: { title: "Units in Stock" },
    hAxis: { title: "Month" },
    seriesType: "bars",
    series: { 5: { type: "line" } },
    backgroundColor: "transparent",
  };

  const [data1, setData] = useState([]);
  const [data2, setUserData] = useState([]);

 
  useEffect(() => {
    
      fetch("http://localhost:8000/api/analytics/total_revenue/", {
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
    useEffect(() => {
      fetch("http://localhost:8000/api/analytics/total_users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((apiData) => setUserData(apiData))
        .catch((error) => console.error("Error fetching data:", error));
    }, []);




  return (
    <div>
      <div className="right-content w-100">
      <div className='row recBox pl-4'>
         <h1>Dashboard</h1>
         <Button className="rounded-circle mr-3">< CiViewTable /></Button>
        </div>
        <div className="row dashboardBoxWrapperRow d-flex">
          <div className="col-md-8">
            <div className="dashboardBoxWrapper d-flex flex-wrap">
              <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUsers/>} grow={true} text = {'Total Revenue'} value={data1.total_revenue} />
              <DashboardBox color={["#c012e2", "#ed64fe"]} icon={<FaShoppingCart/>} text = {'Number of Users'} value={data2.total_users} />
              <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<IoBagCheckOutline/>}grow={true} text = {'Total Products'} value={totalProducts}/>
              <DashboardBox color={["#e1950e", "#f3c829"]} icon={<FaDatabase/>} text = {'Bills Generated'} value={billstotal}/>
            </div>
          </div>
          
          <div className="col-md-4" style={{ paddingLeft: 0 }}>
            <div className="box graphBox">
                    <h4 className='text-white mb-0'>Total Stock</h4>
                    <div className='ml-auto'>
                    <span className='icon'>
                    <QueryStatsIcon/> 
                    </span>
                </div>
                <div className="text-white font-weight-bold">$1234567</div>
                <Chart
                   chartType="ComboChart"
                   width="100%"
                   height="80%"
                   data={data}
                   options={options}
                    />
            </div>
           
          </div>
        </div>
        <div className='Table'>
          <br/>
          <ProductLists/>
          <CustomersLists/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
