import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

const ProductDetail
= () => {

  const initialProduct = {
    variations: []
  };

  const initialOrder = {
      status: "NEW",
      taxAmount: 0.0,
      totalAmount: 0.0,
      grandTotalAmount: 0.0,
      lineItems: []
  };

  const [product, setProduct] = useState(initialProduct);
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  });

  useEffect(() => {
    fetch(`/api/products/${id}`)
    .then(response => response.json())
    .then(data => {
       setProduct(data);
       let lineItems = [];
       data.variations.map(productVariation => {
         const lineItem = {
            productVariation: productVariation,
            price: productVariation.price,
            quantity: 0
         }
         lineItems.push(lineItem);
       });
       setOrder({ ...order, lineItems: lineItems });
    });
    setLoading(false);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target
    const index = order.lineItems.findIndex(x => x.productVariation.id === parseInt(name));
    order.lineItems[index].quantity = parseInt(value);

    let subTotal = 0.0;
    order.lineItems.map(lineItem => {
        const lineItemTotal = lineItem.quantity * lineItem.price;
        subTotal += lineItemTotal;
    });

    order.totalAmount = subTotal;
    order.taxAmount = subTotal * 0.07;
    order.grandTotalAmount = order.totalAmount + order.taxAmount;
    setOrder({ ...order });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch('/orders', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    setProduct(initialOrder);
    navigate('/order-confirmation');
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const productVariationList = product.variations.map(productVariation => {
      return <tr key={productVariation.id}>
        <td style={{whiteSpace: 'nowrap'}}>{productVariation.name}</td>
        <td>{productVariation.description}</td>
        <td>${productVariation.price}</td>
        <td>
            {
              productVariation.inventory.onHandCount > 0 &&
                <Input type="text"
                name={productVariation.id}
                id={productVariation.id}
                value={order.lineItems.find(x => x.productVariation.id === productVariation.id).quantity || '0'}
                onChange={handleChange} />
            }
            {
                productVariation.inventory.onHandCount <= 0 &&
                <span>Out of stock</span>
            }
        </td>
      </tr>
    });

  return (<div>
      <AppNavbar/>
      <div class="mb-5">&nbsp;</div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col text-center">
                <img src={"/images/" + product.name + "/image.png"} />
                <h2>{product.name}</h2>
            </div>
            <div className="col">
                <h4>{product.description}</h4>
                <table>
                    {productVariationList}
                    <tr>
                        <td colSpan={4}>
                            <hr/>
                            <FormGroup>
                                <h5>Sub total: {USDollar.format(order.totalAmount)}</h5>
                                <h5>Tax: {USDollar.format(order.taxAmount)}</h5>
                                <h5>Grand total: {USDollar.format(order.grandTotalAmount)}</h5>
                                <Button color="primary" type="submit">Buy</Button>{' '}
                                <Button color="secondary" tag={Link} to="/products">Cancel</Button>
                            </FormGroup>
                        </td>
                    </tr>
                </table>
            </div>
          </div>
        </Form>
      </Container>
    </div>
  )
};

export default ProductDetail;