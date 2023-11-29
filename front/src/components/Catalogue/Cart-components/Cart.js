import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FetchPharmacies } from "./pharmaciesApi";
import moment from "moment";
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
    setDiscountAmount,
    productQuantity,
    setProductQuantity,
    discountLabel,
    setDiscountLabel,
    freeQuantity,
    setFreeQuantity,
    isVendorName,
    caluclateMixMatch,
    discountAmount,
    highlightStyle,
    setHighlightStyle,
  } = props;

  const handleQuantityChange = (event, item, index, setQuantityInputValue) => {
    setProductQuantity({ ...productQuantity, [item.PARTNAME]: event });
    const productId = item.PARTNAME;

    setQuantityInputValue({
      ...quantityInputValue,
      [productId]: parseInt(event),
    });

    const updatedItems = [...cartItems];

    const updatedItemsQuantity = updatedItems.map((item) => ({
      ...item,
      quantity: productQuantity[item.PARTNAME] || 1,
    }));

    updatedItems[index] = { ...updatedItemsQuantity[index], quantity: event };
    updatedItemsQuantity[index] = {
      ...updatedItemsQuantity[index],
      quantity: event,
    };

    setCartItems(updatedItemsQuantity);

    const mixMatchDiscount = caluclateMixMatch(updatedItemsQuantity);
    const cartFlatTotal = caluclateFlatTotal(updatedItemsQuantity);
    const totalDiscountAmount = caluclateDiscount(updatedItemsQuantity);
    setDiscountAmount(totalDiscountAmount.totalDiscount);

    setTotal(
      cartFlatTotal - totalDiscountAmount.totalDiscount - mixMatchDiscount
    );

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

    delete productQuantity[product.PARTNAME];

    console.log("updatedCart in remove 2", updatedCart);

    const cartFlatTotal = caluclateFlatTotal(updatedCart);
    const totalDiscountAmount = caluclateDiscount(updatedCart);
    const mixMatchDiscount = caluclateMixMatch(updatedCart);

    setDiscountAmount(totalDiscountAmount.totalDiscount);

    setTotal(
      cartFlatTotal - totalDiscountAmount.totalDiscount - mixMatchDiscount
    );

    delete freeQuantity[product.PARTNAME];
    setFreeQuantity(freeQuantity);
    //setQuantityInputValue({ ...quantityInputValue, [productId]: parseInt(event) });

    const removedHighlight = highlightStyle.filter(
      (highlightedProduct) => highlightedProduct !== product.PARTNAME
    );

    setHighlightStyle(removedHighlight);
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    setProductQuantity({});
    setQuantityInputValue({});
    setFreeQuantity({});
    setDiscountAmount(0);
    setHighlightStyle([]);
  };

  const sendOrder = async (order, isVendorName, freeQuantity) => {
    let userFullId = localStorage.getItem("userId");
    let [userId, dCode] = userFullId.split('-');
    let userDesc = localStorage.getItem("userDesc");
    console.log(isVendorName, "isVendorName in sendOrder.js");
    console.log(order, "order.()");
    console.log(order.length, "order.length()");
    if (order.length == 0) {
      throw Error("Cant send empty cart");
    }
    const productsinOrder = order.map((obj, index) => ({
      PARTNAME: obj.PARTNAME,
      // PDES: obj.PARTDES,
      TQUANT: parseInt(obj.quantity),
      DEXT_REQUESTEDQTY: parseInt(obj.quantity),
      DEXT_FREEQTY:
        freeQuantity[obj.PARTNAME] > 0 ? freeQuantity[obj.PARTNAME] : 0,
      PERCENT: 0,
      DEXT_CONFIRMORDER: index == order.length - 1 ? "Y" : "",
    }));

    console.log(productsinOrder, "productsinOrder");
    let today = moment().format();

    const orderObject = {
      CUSTNAME: userId,
      // CDES: userDesc,
      CURDATE: today,
      ...(isVendorName && { DEXT_SUPPNAME: isVendorName }),
      ...(isVendorName && { DEXT_SUPPDES: userId }),
      // DEXT_SUPPNAME: "V1239",
      // DEXT_SUPPDES: "4MORE LTD 2",
      DCODE: dCode,
      DETAILS: `order from B2B for customer ${userId}`,
      DEXT_SUBMISSIONDATE: today,
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
      setCartItems([]);
      setTotal(0);
      setProductQuantity({});
    } catch (error) {
      alert("There was an issue making your order, please contact support.");
      console.error(error);
    }
  };

  const saveCart = async (cartItems) => {
    setCartTemplate(cartItems);
  };

  let totalFreeQuantities = 0;
  for (const value of Object.values(freeQuantity)) {
    console.log(freeQuantity, "freeQuantity 1");
    console.log(value, "value tee");
    totalFreeQuantities += value;
  }

  const [orderButtonStatus, setOrderButtonStatus] = useState("enabled");
  const [pharmacyValue, setPharmacyValue] = useState("");

  const handleOrderButton = (event) => {
    console.log(event.target.value, "handleOrderButton");
  };

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

  return (
    <div>
      <button class="basket" onClick={handleCartClick}>
        <span className="icon">
          <p>
            {Object.keys(productQuantity).length}
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
                  {console.log(discountLabel, "discountLabel xxx")}
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
                    min={
                      parseInt(item.DEXT_LOWSTOCKQTY) > 0
                        ? item.DEXT_LOWSTOCKQTY
                        : 1
                    }
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
              <span>+ {parseInt(totalFreeQuantities)} Free items</span>
            )}
          </div>

          <div className="total-container">
            <p className="total-text">Discount: {discountAmount.toFixed(2)}</p>
            <p className="total-text">Total: {total.toFixed(2)}</p>
          </div>

          {isVendorName !== "" && (
            <Autocomplete
              className="pharmacy-box"
              disablePortal
              id="combo-box-demo"
              options={pharmacies}
              // getOptionLabel={(option) => option.Code}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Pharmacy" />
              )}
              onChange={(event, newValue) => {
                setPharmacyValue(newValue);
                console.log(newValue, "newValue 1");
                if (!newValue) setOrderButtonStatus("disabled");
                else setOrderButtonStatus("enabled");
              }}
            />
          )}

          <div className="d-flex justify-content-between">
            <button
              onClick={() => clearCart()}
              className="btn btn-danger cart-clear-btn"
            >
              Clear Cart
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm("Θέλετε να αποσταλεί η παραγγελία σας;")
                ) {
                  sendOrder(cartItems, isVendorName, freeQuantity);
                }
              }}
              className="btn btn-primary "
              disabled={orderButtonStatus === "disabled" || cartItems.length == 0}
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
