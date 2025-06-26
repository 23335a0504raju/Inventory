import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdPerson } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import image from '../../Assets/pexels-eduschadesoares-5498224.jpg';
import './LoginSignup.css';
const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async () => {
    const endpoint = action === "Login" 
      ? "https://inventory-iplt.onrender.com/api/login/" 
      : "https://inventory-iplt.onrender.com/api/register/";
    
    const payload = action === "Login"
      ? { email: formData.email, password: formData.password }
      : { 
          first_name: formData.firstName, 
          last_name: formData.lastName, 
          email: formData.email,
          password: formData.password 
        };
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
  
      const data = await response.json();
  
      if (response.ok) {
      if (action === "Login") {
        context.setIsAuthenticated(true);
        if (data.username) localStorage.setItem("username", data.username);
        if (data.token) localStorage.setItem("token", data.token);
        if (data.access) sessionStorage.setItem("accessToken", data.access);
        navigate('/main'); // <-- Add this to redirect
      } else {
        alert("Registration successful! Please log in.");
        setAction("Login");  
      }
    }
 else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <div className='container box-login-nav' style={{ marginTop: "70px", marginBottom: "50px" }}>
      <div className="left">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {action === "Sign Up" && (
            <>
              <div className="input">
                <div className='img'><MdPerson /></div>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="input">
                <div className='img'><MdPerson /></div>
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
              </div>
            </>
          )}
          <div className="input">
            <div className='img'><MdEmail /></div>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="input">
            <div className='img' onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>
        </div>
        {action === "Sign Up" ? null : (
          <div className="forgot-password" onClick={() => navigate("/forgot-password")}>forgot password? <span>click here</span></div>
        )}
        <div className="submit-container">
          <div className="main-submit" onClick={handleSubmit}>{action}</div>
          <div className="toggle-action">
            {action === "Login" ? (
              <p>Don't have an account? <span onClick={() => setAction("Sign Up")}>Sign Up</span></p>
            ) : (
              <p>Already have an account? <span onClick={() => setAction("Login")}>Login</span></p>
            )}
          </div>
        </div>
      </div>
      <div className='right'>
        <img src={
          image
        } alt="inventory image" />
      </div>
    </div>
  );
}

export default LoginSignup;