import CommentIcon from '@mui/icons-material/Comment';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React, { useState, useEffect } from 'react';

const Messages = () => {
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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 3 }}>
        <List>
          {lowStockMessages.length > 0 ? (
            lowStockMessages.map((msg, index) => (
              <ListItem key={index} disableGutters secondaryAction={
                <IconButton aria-label="comment">
                  <CommentIcon />
                </IconButton>
              }>
                <ListItemText primary={msg} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="All products are sufficiently stocked." />
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default Messages;
