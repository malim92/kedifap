import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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
    cartTemplate,
    setCartTemplate,
    quantityInputValue,
    setQuantityInputValue,
  } = props;

  const [productQuantity, setProductQuantity] = useState({});

  const handleQuantityChange = (event, item, index, setQuantityInputValue) => {
    setProductQuantity({ ...productQuantity, [item.PARTNAME]: event });

    const productId = item.PARTNAME;

    setQuantityInputValue({
      ...quantityInputValue,
      [productId]: parseInt(event),
    });

    const updatedItems = [...cartItems];

    updatedItems[index] = { ...updatedItems[index], quantity: event };
    setCartItems(updatedItems);
    let sumPrice = 0;
    updatedItems.forEach((singleCartItem) => {
      sumPrice +=
        parseInt(singleCartItem.quantity) *
        parseFloat(singleCartItem.WSPLPRICE);
    });

    const totalDiscountAmount = caluclateDiscount(updatedItems);
    console.log(totalDiscountAmount, "totalDiscountAmount 2");
    setTotal(sumPrice - totalDiscountAmount);
  };

  function caluclateDiscount(productsInCart) {
    let totalDiscount = 0;
    let applicableDiscount = null;
    console.log(productsInCart, "productsInCart in discount");

    let sumPrice = 0;
    productsInCart.forEach((singleCartItem) => {
      if (singleCartItem.discounts) {
        singleCartItem.discounts.forEach((discount) => {
          //check if product quantity more than discount quantity
          if (
            parseInt(singleCartItem.quantity) >= parseInt(discount.OFFERQTY) &&
            (!applicableDiscount ||
              discount.OFFERQTY > applicableDiscount.OFFERQTY)
          ) {
            applicableDiscount = discount;
          }
        });
        if (applicableDiscount) {
          let addedDiscountedUnit =
            singleCartItem.WSPLPRICE * applicableDiscount.DISCOUNT / 100 * parseInt(singleCartItem.quantity) ;
            console.log(addedDiscountedUnit, "addedDiscountedUnit test");
          //if there's applicable discount apply it
          console.log(applicableDiscount, "applicableDiscount 1x");
          totalDiscount += addedDiscountedUnit
          
        } else {
          
        }
      }
    });
    return totalDiscount;
  }

  const removeItem = (product) => {
    const updatedCart = cartItems.filter(
      (item) => item.PARTNAME !== product.PARTNAME
    );
    setCartItems(updatedCart);
    setProductQuantity(1);
    setTotal(
      total - parseFloat(product.WSPLPRICE) * parseInt(product.quantity)
    );
    const productId = product.PARTNAME;
    //setQuantityInputValue({ ...quantityInputValue, [productId]: parseInt(event) });
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    setProductQuantity(1);
    setQuantityInputValue({});
  };

  const sendOrder = async (order, cartTotal) => {
    const userId = Cookies.get("userId");
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
      CUSTNAME: userId,
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

    //const url = "http://localhost:8000/order";
    const url =
      "https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_ORDERS";
    //const url = "https://kedifap-portal.com2go.co/order";

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };
    try {
      const response = await axios.post(url, orderObject, {
        auth: {
          username: "apiuser",
          password: "1234",
        },
      });
      console.log(response, "response");
      alert("Order Sent Successfully, Thank you!!");
    } catch (error) {
      console.error(error);
    }
    setCartItems([]);
    setTotal(0);
    setProductQuantity(1);
  };
  const saveCart = async (cartItems) => {
    setCartTemplate(cartItems);
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
                    value={quantityInputValue[item.PARTNAME] || 1}
                    min={1}
                    max={item.stock}
                    onChange={(e) =>
                      handleQuantityChange(
                        e.target.value,
                        item,
                        index,
                        setQuantityInputValue
                      )
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
          <div class="cart-template">
            <button
              onClick={() => saveCart(cartItems)}
              class="btn btn-secondary"
            >
              Save Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
