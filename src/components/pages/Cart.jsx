import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '@mui/material';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.error("Product removed successfully");
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const increaseQuantity = (id, currentQuantity) => {
    handleQuantityChange(id, currentQuantity + 1);
  };

  const decreaseQuantity = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(id, currentQuantity - 1);
    }
  };

  const columnDefs = [
    { headerName: "Product", field: "title" },
    { headerName: "Price", field: "price", valueFormatter: params => `$${params.value}` },
    {
      headerName: "Quantity",
      field: "quantity",
      cellRenderer: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => decreaseQuantity(params.data.id, params.value)}
          >
            -
          </Button>
          <span style={{ margin: '0 8px' }}>{params.value}</span>
          <Button
            variant="outlined"
            size="small"
            onClick={() => increaseQuantity(params.data.id, params.value)}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      headerName: "Total",
      valueGetter: params => (params.data.price * params.data.quantity).toFixed(2),
      valueFormatter: params => `$${params.value}`
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRemove(params.data.id)}
        >
          Remove
        </Button>
      )
    }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        rowData={cartItems}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
      />
      <div style={{ marginTop: '16px' }}>
        Total Price: ${totalPrice.toFixed(2)}
      </div>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '16px' }}
        onClick={() => navigate('/')}
      >
        Go Back to Home
      </Button>
    </div>
  );
};

export default Cart;

