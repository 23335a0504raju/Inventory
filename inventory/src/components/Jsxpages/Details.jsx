import DraftsIcon from '@mui/icons-material/Drafts';
import InboxIcon from '@mui/icons-material/Inbox';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Details = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const navigate = useNavigate();

  // Memoized click handler to prevent unnecessary re-renders
  const handleListItemClick = useCallback((event, index, route) => {
    setSelectedIndex(index);
    if (route) navigate(route);
  }, [navigate]);

  return (
    <Box sx={{ 
     
      mt: 30, 
      width: '100%', 
      maxWidth: 800, 
      bgcolor: 'background.paper', 
      boxShadow: 6,
      borderRadius: 4,  
      p: 4, 
      mx: 'auto', // Center the box horizontally
      transition: 'transform 0.3s ease-in-out', // Smooth transition for hover effect
      '&:hover': {
        transform: 'scale(1.02)', // Slightly scale up on hover
      }
    }}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton 
          selected={selectedIndex === 0} 
          onClick={(event) => handleListItemClick(event, 0, "/customerlist")}
          sx={{
            borderRadius: 2, // Rounded corners for ListItemButton
            '&:hover': {
              bgcolor: 'action.hover', // Change background color on hover
            }
          }}
        >
          <ListItemIcon>
            <InboxIcon sx={{ fontSize: '1.5rem' }} /> {/* Increased icon size */}
          </ListItemIcon>
          <ListItemText primary="Customer Details" primaryTypographyProps={{ fontSize: '1.1rem' }} /> {/* Increased font size */}
        </ListItemButton>

        <ListItemButton 
          selected={selectedIndex === 1} 
          onClick={(event) => handleListItemClick(event, 1, "/invoicelist")}
          sx={{
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <ListItemIcon>
            <DraftsIcon sx={{ fontSize: '1.5rem' }} />
          </ListItemIcon>
          <ListItemText primary="Invoice Details" primaryTypographyProps={{ fontSize: '1.1rem' }} />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2 }} /> {/* Added margin to the divider for better spacing */}

      <List component="nav" aria-label="secondary mailbox folders">
        <ListItemButton 
          selected={selectedIndex === 2} 
          onClick={(event) => handleListItemClick(event, 2, "/productlist")}
          sx={{
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <ListItemIcon>
            <ShoppingCartIcon sx={{ fontSize: '1.5rem' }} />
          </ListItemIcon>
          <ListItemText primary="Product Details" primaryTypographyProps={{ fontSize: '1.1rem' }} />
        </ListItemButton>

        <ListItemButton 
          selected={selectedIndex === 3} 
          onClick={(event) => handleListItemClick(event, 3,"/bills")}
          sx={{
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <ListItemIcon>
            <ReceiptIcon sx={{ fontSize: '1.5rem' }} />
          </ListItemIcon>
          <ListItemText primary="Bills" primaryTypographyProps={{ fontSize: '1.1rem' }} />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Details;