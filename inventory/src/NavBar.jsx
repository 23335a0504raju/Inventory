import { faBars, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
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
    const [bar, setBar] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    });

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

    return (
        <>
            <nav className={`container-x ${location.pathname === '/' && !scroll ? 'transparent' : 'colored'}`}>
                <div className="logo">
                    <img src={logo} alt="" width={150} height={100} />
                </div>
                <div className="nav-links">
                    <ul style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <NavLink className="nav-link" to="/"><li>Home</li></NavLink>
                        <NavLink className="nav-link" to="/about"><li>About</li></NavLink>
                        <NavLink className="nav-link" to="/contact"><li>Contact us</li></NavLink>
                    </ul>
                </div>
                <div className="auth">
                            <NavLink className="nav-link login" to="/login">
                                Login <FontAwesomeIcon icon={faRightToBracket} />
                            </NavLink>
                </div>
                <FontAwesomeIcon className="bars" onClick={() => setBar(true)} icon={faBars} />
            </nav>
        </>
    );
}

export default NavBar;
