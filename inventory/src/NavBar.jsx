import { faBars, faRightToBracket, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from '../src/Assets/images/logo.png';
import "./css/nav.css";

function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [scroll, setScroll] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('.bars')) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    return (
        <>
            <nav className={`container-x ${location.pathname === '/' && !scroll ? 'transparent' : 'colored'}`}>
                <div className="logo">
                    <img src={logo} alt="Company Logo" width={150} height={40} />
                </div>
                <div className="nav-links">
                    <ul>
                        <li><NavLink className="nav-link" to="/">Home</NavLink></li>
                        <li><NavLink className="nav-link" to="/about">About</NavLink></li>
                        <li><NavLink className="nav-link" to="/contact">Contact us</NavLink></li>
                    </ul>
                </div>
                <div className="auth">
                    {isLoggedIn ? (
                        <button className="logout" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <NavLink className="login" to="/login">
                            Login <FontAwesomeIcon icon={faRightToBracket} />
                        </NavLink>
                    )}
                </div>
                <FontAwesomeIcon 
                    className="bars" 
                    onClick={() => setSidebarOpen(!sidebarOpen)} 
                    icon={faBars} 
                />
            </nav>

            {/* Mobile Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <FontAwesomeIcon 
                        className="close-btn" 
                        onClick={() => setSidebarOpen(false)} 
                        icon={faTimes} 
                    />
                </div>
                <ul>
                    <li>
                        <NavLink to="/" onClick={() => setSidebarOpen(false)}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" onClick={() => setSidebarOpen(false)}>About</NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact" onClick={() => setSidebarOpen(false)}>Contact us</NavLink>
                    </li>
                    <li>
                        {isLoggedIn ? (
                            <button onClick={handleLogout}>Logout</button>
                        ) : (
                            <NavLink to="/login" onClick={() => setSidebarOpen(false)}>
                                Login <FontAwesomeIcon icon={faRightToBracket} />
                            </NavLink>
                        )}
                    </li>
                </ul>
            </div>
            
            {/* Overlay when sidebar is open */}
            {sidebarOpen && <div className="sidebar-overlay"></div>}
        </>
    );
}

export default NavBar;