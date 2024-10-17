import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import Cart from './components/pages/Cart';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
