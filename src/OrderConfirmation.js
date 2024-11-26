import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

const OrderConfirmation
= () => {

  return (
    <div>
      <AppNavbar/>
      <div class="mb-5">&nbsp;</div>
      <Container fluid>
        <h3>Thank you for your order!</h3>
        <Button color="primary" tag={Link} to="/products">Home</Button>
      </Container>
    </div>
  );
};

export default OrderConfirmation;