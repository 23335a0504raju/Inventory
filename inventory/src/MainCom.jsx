import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom" 


function MainCom(){
    const [message, setMessage] = useState("");
    const user = useState(localStorage.getItem('username'))
    const token = localStorage.getItem('token');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMainData = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/api/home/', {
              method: 'GET',
              headers: {
                'Authorization': `Token ${token}`, 
                'Content-Type': 'application/json',
              },
            });
    
            const data = await response.json();
    
            if (response.ok) {
              setMessage(data.message);
            } else {
              setMessage("Unauthorized! Please log in.");
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            setMessage("An error occurred.");
          }
        };
    
        fetchMainData();
      }, [token]);

    return (
       <div className="container">
    <h1>Main Page</h1>
    <p>{message}</p>
    
    {message === "Unauthorized! Please log in." ? (
        <div className="alert alert-danger" role="alert">
            Unauthorized! Please log in.
            <button 
                onClick={() => navigate("/login")} 
                className="btn btn-primary ms-3"
            >
                Login
            </button>
        </div>
    ) : (
        <div className="alert alert-success" role="alert">
            Login done successfully!!!
        </div>
    )}
</div>
    )
}
export default MainCom