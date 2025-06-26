import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import userimg from '../../Assets/images/user.jpg';

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

const Profile = () => {
    const username=localStorage.getItem("username");
    const email=localStorage.getItem("email");
    console.log(email)
    const navigate = useNavigate();
    const context = useContext(MyContext);

const LogOut=()=>{
    context.setIsAuthenticated(false);
    localStorage.removeItem("username");
    sessionStorage.removeItem("accessToken");
    navigate("/login");
}
 
  return (
    <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        width: '100%'
    }}>
        <Card sx={{ 
            width: 350, 
            boxShadow: 3, 
            textAlign: 'center' 
        }}>
            <CardMedia
                sx={{ height: 250 }}
                image={userimg}
                title="User Profile"
            />
            <CardContent>
                <Typography gutterBottom variant="h5">
                    {username}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {email}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
                <Button size="small" color="error" onClick={LogOut}>
                    Logout
                </Button>
                <Button size="small">More</Button>
            </CardActions>
        </Card>
    </div>
  )
}

export default Profile