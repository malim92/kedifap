import React, { useState } from "react";
import axios from "axios";

import "./Cart.css";
import { FaCartArrowDown } from "react-icons/fa";

const Cart = (props) => {
  const {
    showCart,
    setShowCart,
    cartItems,
    setCartItems,
    handleCartClose,
    handleCartClick,
    total,
    setTotal,
  } = props;

  const [productQuantity, setProductQuantity] = useState({});

  const handleQuantityChange = (event, item, index) => {
    //setProductQuantity(event);

    setProductQuantity((prevQuantities) => ({
      ...prevQuantities,
      [item.PARTNAME]: event,
    }));

    const updatedItems = [...cartItems];

    updatedItems[index] = { ...updatedItems[index], quantity: event };
    setCartItems(updatedItems);
    //calculateCartTotal();
    let sumPrice = 0;
    updatedItems.forEach((singleCartItem) => {
      let applicableDiscount = null;
      if (singleCartItem.discounts) {
        singleCartItem.discounts.forEach((discount) => {
          //check if product quantity more than discount quantity
          if (
            parseInt(singleCartItem.quantity) + 1 >= discount.OFFERQTY &&
            (!applicableDiscount ||
              discount.OFFERQTY > applicableDiscount.OFFERQTY)
          ) {
            applicableDiscount = discount;
          }
        });
        if (applicableDiscount) {
          //if there's applicable discount apply it
          let totalItemDiscount =
            (parseInt(singleCartItem.quantity) * applicableDiscount.DISCOUNT) /
            100;
          // setTotal(
          //   total + parseFloat(singleCartItem.WSPLPRICE) - totalItemDiscount
          // );
          sumPrice += totalItemDiscount;
        }
      } else {
        // let productPrice = parseFloat(singleCartItem.WSPLPRICE);
        // console.log(productPrice, "productPrice ");
        sumPrice +=
          parseInt(singleCartItem.quantity) *
          parseFloat(singleCartItem.WSPLPRICE);
        setTotal(sumPrice);
      }
      //cartTotalPrice += WSPLPRICE;
    });
  };

  const removeItem = (product) => {
    const updatedCart = cartItems.filter(
      (item) => item.PARTNAME !== product.PARTNAME
    );
    setCartItems(updatedCart);
    setProductQuantity(1);
    setTotal(
      total - parseFloat(product.WSPLPRICE) * parseInt(product.quantity)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    setProductQuantity(1);
  };

  const sendOrder = async (order, cartTotal) => {
    const productsinOrder = order.map((obj) => ({
      PARTNAME: obj.PARTNAME,
      PDES: obj.PARTDES,
      TQUANT: obj.quantity,
      DEXT_REQUESTEDQTY: obj.quantity,
      DEXT_FREEQTY: 0,
      PERCENT: 0,
    }));

    console.log(productsinOrder, "productsinOrder");

    const orderObject = {
      CUSTNAME: "C1001",
      CDES: "ERACLEOUS PHARMACY LTD",
      CURDATE: "2023-04-21T00:00:00+02:00",
      DEXT_SUPPNAME: "V1239",
      DEXT_SUPPDES: "4MORE LTD 2",
      DCODE: null,
      DETAILS: "Test from API",
      DEXT_SUBMISSIONDATE: "2023-04-26T14:30:00+02:00",
      PAYCODE: "20",
      DEXT_B2CONTACT: 9,
      B2B_ORDERITEMS_SUBFORM: productsinOrder,
    };
    console.log(JSON.stringify(orderObject), "str orderObject");

    setShowCart(false);

    //send order

    const url =
      "http://localhost:8000/order";
      //"https://kedifap-portal.com2go.co/order";

    try {
      const response = await axios.post(url, orderObject);
      console.log(response, "response");
      alert("Order Sent Successfully, Thank you!!");
    } catch (error) {
      console.error(error);
    }
    setCartItems([]);
    setTotal(0);
    setProductQuantity(1);
  };

  return (
    <div>
      <button class="basket" onClick={handleCartClick}>
        Cart
      </button>
      {showCart && (
        <div class="cart-container">
          <div class="row">
            <div class="col">
              <h2 class="cart-title">Cart</h2>
            </div>
            <div class="col">
              <button class="close-icon" onClick={handleCartClose}></button>
            </div>
          </div>
          <ul class="cart-list">
            {cartItems.map((item, index) => (
              <li class="cart-item" key={index}>
                <div class="cart-item-details">
                  <p class="cart-item-name">{item.PARTDES}</p>
                  <p class="cart-item-name">Code: {item.PARTNAME}</p>
                  <p class="cart-item-price">
                    Price: {parseFloat(item.WSPLPRICE)}
                  </p>
                  {/* <p class="cart-item-quantity">Quantity: {item.quantity}</p> */}
                </div>
                <div class="cart-item-controls">
                  {/* <button
                      class="cart-item-control-btn"
                      onClick={() => decrementQuantity(item)}
                    >
                      -
                    </button> */}
                  <input
                    type="number"
                    value={productQuantity[item.PARTNAME] || 1}
                    min={1}
                    max={item.stock}
                    onChange={(e) =>
                      handleQuantityChange(e.target.value, item, index)
                    }
                    style={{
                      width: "50px",
                      marginRight: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      padding: "5px",
                      fontSize: "1rem",
                      textAlign: "center",
                    }}
                  />

                  {/* <button
                      class="cart-item-control-btn"
                      onClick={() => incrementQuantity(item)}
                    >
                      +
                    </button> */}
                  <button
                    class="cart-item-remove-btn"
                    onClick={() => removeItem(item)}
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="total-container">
            <p className="total-text">Total: {total.toFixed(2)}</p>
          </div>

          <div class="d-flex justify-content-between">
            <button
              onClick={() => clearCart()}
              class="btn btn-danger cart-clear-btn"
            >
              Clear Cart
            </button>
            <button
              onClick={() => sendOrder(cartItems, total)}
              class="btn btn-primary"
            >
              Send order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
