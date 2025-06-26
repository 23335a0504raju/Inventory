import Button from '@mui/material/Button';
import { FaUserCog } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdMenuOpen, MdOutlineMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from '../../Assets/images/logo.png';
import userimg from '../../Assets/images/user.jpg';
import SearchBox from '../SearchBox/SearchBox';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MailIcon from '@mui/icons-material/Mail';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import axios from "axios";

import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Snackbar from '@mui/material/Snackbar';

import { MyContext } from '../../App';

const Header=()=>{
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const [username, setUsername] = useState("");
    const [userdata,setuserdata]=useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
 
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const [products, setProducts] = useState([]);
    
      useEffect(() => {
        fetchProducts();
      }, []);
    
      const fetchProducts = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/products-view/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${localStorage.getItem("token")}`,
            },
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
    
          const data = await response.json();
          setProducts(data.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
    
      const lowStockMessages = products
        .filter(product => product.qty < product.total_qty * 0.25)
        .map(product => `Low stock alert: ${product.productname} is below 25% of total stock. Please restock.`);
    




    const fetchData = useCallback(async (username) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/userprofile/${username}`, { withCredentials: true });
            setuserdata(response.data);
            localStorage.setItem("email", response.data.email);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, []);

    useEffect(() => {
        if (username) {
            fetchData(username);
        }
    }, [username, fetchData]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        
    };
    
    const MessagesClick=()=>{
        navigate("/messages");
    }


    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const [messageOpen, setMessageOpen] = useState(false);
    const Message=()=>{
        setMessageOpen(true); 
    };
    const messageClose = (event, reason) => {
        if (reason === "clickaway") return;
        setMessageOpen(false);
      };

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleProfile=()=>{
        navigate("/profile");
    }


    const LogoutClick = () => {
      setSnackbarOpen(true); 
      setAnchorEl(null);
      context.setIsAuthenticated(false);
      localStorage.removeItem("username");
      sessionStorage.removeItem("accessToken");
      navigate("/");
    };
  
    const handleSnackbarClose = (event, reason) => {
      if (reason === "clickaway") return;
      setSnackbarOpen(false);
    };
    const handleColor=()=>{
        setIsDarkMode(!isDarkMode);
    }

    const context = useContext(MyContext);

    const len = lowStockMessages.length
    
    return(
        <>
            <header className={`d-flex align-items-center ${isDarkMode ? 'dark-mode' : ''}`} style={{ backgroundColor: isDarkMode ? 'black' : 'white', color: isDarkMode ? 'white' : 'black' }}>
                <div className="container-fluid">
                    <div className="row d-flex align-items-center">
                        
                        <div className="col-sm-2 part1">
                            <Link to={'/'} className="d-flex align-items-center logo" style={{ color: isDarkMode ? 'white' : 'black' }} >
                                <img src={logo} alt="Smart Stock Logo" />
                                    {/* <span className="ml-0">Smart Stock</span> */}
                            </Link>
                        </div>
                        <div className="col-sm-3 d-flex align-items-center part2 pl-4">
                            <Button className="rounded-circle mr-3" onClick={()=>context.setIsToggleSidebar(!context.isToggleSidebar)}  >
                                {
                                    context.isToggleSidebar===false ?<MdMenuOpen/> :
                                    <MdOutlineMenu/>
                                }
                                </Button>
                            <SearchBox />
                        </div>
                        <div className="col-sm-7 d-flex align-items-center
                         justify-content-end part3">
                            <Button className="rounded-circle mr-3" onClick={handleProfile}>< FaUserCog/>
                            </Button>
                           
             
                            
                            <Button className="rounded-circle mr-3"><WbSunnyIcon onClick={handleColor}/></Button>
                            <Button className="rounded-circle mr-3"><IoIosInformationCircleOutline/></Button>
                            <Button className="rounded-circle mr-3" onClick={() => { Message(); MessagesClick(); }}>
                                <Stack spacing={2} direction="row">
                                <Badge badgeContent={lowStockMessages.length} color="success">
                                    <MailIcon color="action" />
                                </Badge>
                                </Stack></Button>
                            <Snackbar
                                open={messageOpen}
                                autoHideDuration={1000}
                                onClose={messageClose}
                                message= {`${len} messages`}
                            />
                        <div className="myaccwrapper">
                            <Button className="myAcc d-flex align-items-center"  onClick={handleClick}>
                                <div className="UserImg">
                                    <span className='rounded-circle'>
                                        <img src={userimg} alt='smart'/>
                                    </span>
                                </div>
                                <div className='userinfo'>
                                    <h4>{username ? username : "Guest"}</h4>
                                    <p className='mb-0'>{userdata?.email || "email Not submitted"}</p>
                                </div>
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose} 
                                slotProps={{
                                    paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: "visible",
                                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                        mt: 1.5,
                                        "& .MuiAvatar-root": {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                        },
                                        "&::before": {
                                        content: '""',
                                        display: "block",
                                        position: "absolute",
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: "background.paper",
                                        transform: "translateY(-50%) rotate(45deg)",
                                        zIndex: 0,
                                        },
                                    },
                                    },
                                }}
                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                >
                                
                                <MenuItem onClick={handleProfile}>
                                    <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                   Profile
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                    <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={LogoutClick}>
                                    <ListItemIcon>
                                    <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                                </Menu>
                        </div>
                        </div>
                    </div>
                </div>
            </header>
            <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={5000}
                    onClose={handleSnackbarClose}
                    message="Logged out of the device"
                />
        </>
    )
}
export default Header;