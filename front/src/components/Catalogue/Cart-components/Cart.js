import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import TextField from '@mui/material/TextField';
import Autocomplete from "@mui/material/Autocomplete";
import { FetchPharmacies } from "./pharmaciesApi";
import "./Cart.css";

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
    caluclateFlatTotal,
    caluclateDiscount,
    productQuantity,
    setProductQuantity,
    discountLabel,
    setDiscountLabel,
    freeQuantity,
    setFreeQuantity,
    isVendorName,
  } = props;

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
    // let sumPrice = 0;
    // updatedItems.forEach((singleCartItem) => {
    //   sumPrice +=
    //     parseInt(singleCartItem.quantity) *
    //     parseFloat(singleCartItem.WSPLPRICE);
    // });

    const cartFlatTotal = caluclateFlatTotal(updatedItems);
    const totalDiscountAmount = caluclateDiscount(updatedItems);

    setTotal(cartFlatTotal - totalDiscountAmount.totalDiscount);

    setDiscountLabel({
      ...discountLabel,
      [item.PARTNAME]: totalDiscountAmount.discountLabel[item.PARTNAME],
    });
  };

  const removeItem = (product) => {
    const updatedCart = cartItems.filter(
      (item) => item.PARTNAME !== product.PARTNAME
    );
    setCartItems(updatedCart);
    //setProductQuantity(1);

    // setProductQuantity({ ...productQuantity, [product.PARTNAME]: 1 });

    // productQuantity.splice(product.PARTNAME, 1);
    delete productQuantity[product.PARTNAME];

    const cartFlatTotal = caluclateFlatTotal(updatedCart);
    const totalDiscountAmount = caluclateDiscount(updatedCart);
    setTotal(cartFlatTotal - totalDiscountAmount.totalDiscount);

    delete freeQuantity[product.PARTNAME];
    setFreeQuantity(freeQuantity);
    //setQuantityInputValue({ ...quantityInputValue, [productId]: parseInt(event) });
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    setProductQuantity(0);
    setQuantityInputValue({});
    setFreeQuantity({});
  };

  const sendOrder = async (order, cartTotal) => {
    const userId = Cookies.get("userId");
    const userDesc = Cookies.get("userDesc");
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
      CDES: userDesc,
      CURDATE: "2023-05-22T00:00:00+02:00",
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
    //const url = "https://kedifap-portal.com2go.co/order";
    const url = new URL(`${process.env.REACT_APP_API_URL}/order`);

    try {
      const response = await axios.post(url, orderObject);
      console.log(response, "response");
      alert("Order Sent Successfully, Thank you!!");
    } catch (error) {
      console.error(error);
    }
    setCartItems([]);
    setTotal(0);
    setProductQuantity(0);
  };
  const saveCart = async (cartItems) => {
    setCartTemplate(cartItems);
  };

  let totalFreeQuantities = 0;
  for (const value of Object.values(freeQuantity)) {
    totalFreeQuantities += value;
  }

  const [orderButtonStatus, setOrderButtonStatus] = useState("");

  const handleOrderButton = (event) => {
    console.log(event.target.value, "handleOrderButton");
    if (event.target.value == "") setOrderButtonStatus("disabled");
  };
  console.log(orderButtonStatus, "orderButtonStatus");

  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await FetchPharmacies();
        setPharmacies(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log(pharmacies, "pharmacies 3");
  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 }
  ]
  return (
    <div>
      <button class="basket" onClick={handleCartClick}>
        <span className="icon">
          <p>
            {Object.values(productQuantity).reduce(
              (total, value) => total + parseInt(value),
              0
            )}
          </p>
        </span>
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
                  {discountLabel[item.PARTNAME] !== undefined && (
                    <p class="cart-item-discount">
                      Discount: {discountLabel[item.PARTNAME]}
                    </p>
                  )}
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

          <div class="cart-item-details">
            Number of items :{" "}
            {Object.values(productQuantity).reduce(
              (total, value) => total + parseInt(value),
              0
            )}
            {totalFreeQuantities > 0 && (
              <span>+ {totalFreeQuantities} Free items</span>
            )}
          </div>

          <div className="total-container">
            <p className="total-text">Total: {total.toFixed(2)}</p>
          </div>

          {isVendorName !== "" && (
            <Autocomplete
            className="pharmacy-box"
              disablePortal
              id="combo-box-demo"
              options={pharmacies}
              getOptionLabel={(option) => option.Code}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Pharmacy" />}
            />
          )}

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
          {/* <div class="cart-template">
            <button
              onClick={() => saveCart(cartItems)}
              class="btn btn-secondary"
            >
              Save Cart
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Cart;
