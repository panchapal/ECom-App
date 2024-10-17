import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { Grid, Card, CardContent, Typography, Button, CircularProgress, Box, CardMedia, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import './Home.css';

const fetchProducts = async () => {
  const { data } = await axios.get('https://fakestoreapi.com/products');
  return data;
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const [sort, setSort] = useState('none'); 

  const handleAddToCart = (product) => {
    dispatch(addToCart({ id: product.id, title: product.title, price: product.price }));
    toast.success("Product added successfully");
    navigate("/cart");
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price') {
      return a.price - b.price; 
    }
    if (sort === 'name') {
      return a.title.localeCompare(b.title); 
    }
    return 0; 
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <Box className='Home'>
        <Box sx={{ padding: '20px' }} >
        <Box className="box">
          <Typography variant="h4" align="center" gutterBottom>
          Ecommerce App
          </Typography>
</Box>
          <Select
            value={sort}
            onChange={handleSortChange}
            displayEmpty
            sx={{ marginBottom: '20px', width: '200px' }}
          >
            <MenuItem value="none">Sort by</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>

          <Grid container spacing={3}>
            {sortedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card className='card'
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      height: 200,
                      width: 'auto',
                      margin: '0 auto',
                      objectFit: 'contain',
                      borderBottom: '2px solid #ddd',
                      marginTop: 3
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontSize: 16 }}>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontSize: 13 }}>
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontSize: 13 }}>
                      Rating: {product.rating.rate} ({product.rating.count} reviews)
                    </Typography>
                  </CardContent>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                      marginBottom: '16px',
                      padding: '10px 20px',
                      borderRadius: '20px',
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Home;
