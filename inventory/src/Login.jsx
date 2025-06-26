import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/login.css'
const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setUsername('');
        setPassword('');

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        setTimeout(() => {
          setMessage('');
          navigate('/main');  // ✅ Redirect to Home after login
        }, 1500);
      } else {
        setMessage(data.message); 
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container login-page">
      <div className='box'>
        <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <label>Username:</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          <button type="submit">Login</button>
        </form>
        <p className={message === 'Login successful' ? 'success' : ''}>{message}</p>
    
        </div>
        <div>
        </div>
      </div>
    </div>
  );
};

export default Login;
