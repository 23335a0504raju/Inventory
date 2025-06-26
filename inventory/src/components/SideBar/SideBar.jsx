import ReceiptIcon from '@mui/icons-material/Receipt';
import Button from '@mui/material/Button';
import React, { useContext, useEffect } from 'react';
import { BsFileEarmarkBarGraph, BsGraphUpArrow } from "react-icons/bs";
import { FaAngleRight } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { MdAddChart, MdBorderColor, MdOutlineProductionQuantityLimits, MdSpaceDashboard } from "react-icons/md";
import { TbFileInvoice, TbListDetails } from "react-icons/tb";
import { TiMessages } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

const SideBar=()=>{
    const navigate=useNavigate();
    const context=useContext(MyContext);


    useEffect(() => {
        navigate("/dashboard");
    }, []);

    
    const DetailsClick=()=>{
        navigate("/details");
    }

    const InvoicesClick=()=>{
        navigate("/invoicecreate");
    }
    const ProductsClick=()=>{
        navigate("/productscreate");
    }
    const AddCustomer=()=>{
        navigate("/customeradd");
    }
    const ViewProducts=()=>{
        navigate("/productview");
    }
    const MessagesClick=()=>{
        navigate("/messages");
    }
    const BillsClick=()=>{
        navigate("/bills");
    }
    const ChartsClick=()=>{
        navigate("/charts");
    }
    const PredictionsClick=()=>{
        navigate("/predict");
    }
    
    

    const LogoutClick = () => {
        if (context) {
            context.setIsAuthenticated(false);
        }
    

    
        
        localStorage.removeItem("username");
        sessionStorage.removeItem("accessToken");
    
        
        setTimeout(() => {
            navigate("/login");
        }, 500);
    };
    

    return(
        <>
        <div className={`sidebar ${context.isToggleSidebar ? "toggle" : ""}`}>

            <ul>
                <li>
                   
                        <Button className='w-100'onClick={() => navigate("/dashboard")}>
                            <span className='icon'><MdSpaceDashboard/></span>
                            <h6>Dashboard</h6>
                            <span className='arrow'><FaAngleRight/></span>
                        </Button>
                    
                </li>
                <li>
                    <Button className='w-100'  onClick={ViewProducts}>
                        <span className='icon'><MdOutlineProductionQuantityLimits/></span>
                        <h6>Available Items</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
                <li>
                    <Button className='w-100' onClick={AddCustomer}>
                        <span className='icon'><MdBorderColor/></span>
                        <h6>Customers</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
               
                <li>
                    <Button className='w-100' onClick={InvoicesClick}>
                        <span className='icon'><TbFileInvoice/></span>
                        <h6> Invoices</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
                <li>
                    <Button className='w-100' onClick={BillsClick}>
                        <span className='icon'><ReceiptIcon /></span>
                        <h6>Bills</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
                <li>
                    <Button className='w-100' onClick={ProductsClick}>
                        <span className='icon'><MdAddChart/></span>
                        <h6> Products Add</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
                <li>
                    <Button className='w-100' onClick={DetailsClick}>
                        <span className='icon'><TbListDetails/></span>
                        <h6>Details</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
                <li>
                    <Button className='w-100' onClick={MessagesClick}>
                        <span className='icon'><TiMessages/></span>
                        <h6>Messages</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
                <li>
                    <Button className='w-100' onClick={ChartsClick}>
                        <span className='icon'><BsGraphUpArrow/></span>
                        <h6>Visualizations</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
                <li>
                    <Button className='w-100' onClick={PredictionsClick}>
                        <span className='icon'><BsFileEarmarkBarGraph/></span>
                        <h6>Predictions</h6>
                        <span className='arrow'><FaAngleRight/></span>
                    </Button>
                </li>
            </ul>
            <br/>
           <div className="logoutWrapper" style={{marginTop:"58%"}}>
           <center>
           <div className="logoutBox" style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <center><Button variant="contained" onClick={LogoutClick}><IoIosLogOut/>Logout</Button></center>
            </div>
            </center>
            </div>
        </div>
        </>
    )
}
export default SideBar;