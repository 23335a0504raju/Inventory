import React from 'react';
import { FaEye } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";

import './Forgotpassword.css';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

function ForgotPassword() {
  return (
    <div className='container' style={{marginTop:"90px", marginBottom:"120px"}}>
        <div className="header">
          <h2 className="text">Forget Password</h2>
            <div className="input">
                <div className='img'><MdDriveFileRenameOutline />
                </div>
                <input type="text" placeholder='UserName'/>
            </div>
            <div className="input">
                <div className='img'><FaEye />
                </div>
                <input type="password" placeholder='New Password' />
            </div>
            <div className="input">
                <div className='img'><FaEye />
                </div>
                <input type="password" placeholder='Confirm Password' />
            </div>
            <div className="submit">SignUp</div>
        </div>
    </div>
  )
}

export default ForgotPassword