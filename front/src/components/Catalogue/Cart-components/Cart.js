import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CalculateMixTotal from "../Material-functions/calculateMixProgress";
import { toast } from "react-hot-toast";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CartItem from "./CartItems";
import cartSession from "./cartSession";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import handleCartSortBy from "./cartSort";
import { FetchPharmacies } from "../Api/pharmaciesApi";
import moment from "moment";
import "./Cart.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
    mixProgress,
    setMixProgress,
    setSelectedOffer,
  } = props;

  const handleQuantityChange = (event, item, index, setQuantityInputValue) => {
    setProductQuantity({ ...productQuantity, [item.PARTNAME]: event });
    const productId = item.PARTNAME;

    cartSession.setSessionQuantity(productId, event);

    setQuantityInputValue({
      ...quantityInputValue,
      [productId]: parseInt(event),
    });

    if (item.DEXT_OFFERCODE == "4" && item.OFFERQTY) {
      item.quantity = parseInt(event);
      CalculateMixTotal(mixProgress, setMixProgress, cartItems, item);
    }

    const updatedItems = [...cartItems];
    const sessionCart = cartSession.getItems();

    const updatedItemsQuantity = sessionCart.map((item) => ({
      ...item,
      quantity: productQuantity[item.PARTNAME] || 1,
    }));

    updatedItems[index] = { ...updatedItemsQuantity[index], quantity: event };
    sessionCart[index] = { ...updatedItemsQuantity[index], quantity: event };

    cartSession.setItems(sessionCart);
    updatedItemsQuantity[index] = {
      ...updatedItemsQuantity[index],
      quantity: event,
    };

    setCartItems(updatedItemsQuantity);

    const mixMatchDiscount = caluclateMixMatch(
      updatedItemsQuantity,
      setDiscountAmount
    );
    const cartFlatTotal = caluclateFlatTotal(updatedItemsQuantity);
    const totalDiscountAmount = caluclateDiscount(updatedItemsQuantity);
    cartSession.setSessionDiscount(totalDiscountAmount.totalDiscount);

    console.log(updatedItemsQuantity, "discount debubg in cart1");

    setDiscountAmount(totalDiscountAmount.totalDiscount);
    setDiscountAmount(mixMatchDiscount.discountedAmount);

    console.log(updatedItemsQuantity, "updatedItemsQuantity debubg in cart1");
    console.log(
      totalDiscountAmount,
      "totalDiscountAmount.totalDiscount debubg in cart1"
    );
    console.log(
      mixMatchDiscount.discountedAmount,
      "mixMatchDiscount.discountedAmount debubg in cart1"
    );

    setTotal(
      cartFlatTotal -
        totalDiscountAmount.totalDiscount -
        mixMatchDiscount.discountedAmount
    );

    setDiscountLabel({
      ...discountLabel,
      [item.PARTNAME]: totalDiscountAmount.discountLabel[item.PARTNAME],
    });

    setDiscountLabel({
      ...discountLabel,
      [item.PARTNAME]: mixMatchDiscount.discountLabel[item.PARTNAME],
    });

    console.log(discountLabel, "cal in discountLabel xx");
    console.log(totalDiscountAmount, "cal in totalDiscountAmount xx");
  };

  const removeItem = (product) => {
    const updatedCart = cartSession
      .getItems()
      .filter((item) => item.PARTNAME !== product.PARTNAME);

    setCartItems(updatedCart);

    cartSession.setItems(updatedCart);

    cartSession.reduceTotal();

    delete productQuantity[product.PARTNAME];

    console.log("updatedCart in remove 2", updatedCart);

    const cartFlatTotal = caluclateFlatTotal(updatedCart);
    const totalDiscountAmount = caluclateDiscount(updatedCart);
    const mixMatchDiscount = caluclateMixMatch(updatedCart, setDiscountAmount);
    cartSession.setSessionDiscount(totalDiscountAmount.totalDiscount);

    console.log(
      "totalDiscountAmount.totalDiscount in remove",
      totalDiscountAmount.totalDiscount
    );

    setDiscountAmount(
      totalDiscountAmount.totalDiscount + mixMatchDiscount.discountedAmount
    );

    setTotal(
      cartFlatTotal -
        totalDiscountAmount.totalDiscount -
        mixMatchDiscount.discountedAmount
    );

    console.log("freeQuantity in remove", freeQuantity);
    delete freeQuantity[product.PARTNAME];
    cartSession.removeSessionFreeQuantity(product.PARTNAME);

    const removedHighlight = highlightStyle.filter(
      (highlightedProduct) => highlightedProduct !== product.PARTNAME
    );

    setHighlightStyle(removedHighlight);
    cartSession.setSessionHighlight(removedHighlight);

    delete quantityInputValue[product.PARTNAME];
    setQuantityInputValue(quantityInputValue);
    cartSession.removeSessionProductQuantity(product.PARTNAME);
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    setProductQuantity({});
    setQuantityInputValue({});
    setFreeQuantity({});
    setDiscountAmount(0);
    setHighlightStyle([]);
    setDiscountLabel({});
    setCustNote("");
    setMixProgress([]);
    setSelectedOffer([]);
    localStorage.setItem("kediCart", []);
    localStorage.setItem("kediCartTotal", []);
    localStorage.setItem("kediCartDiscount", 0);
    localStorage.setItem("kediCartQuantity", 0);
    localStorage.setItem("kediCartFreeQuantity", []);
    localStorage.setItem("kediCartHighlight", []);
  };

  const sendOrder = async (
    order,
    isVendorName,
    freeQuantity,
    pharmacyValue,
    custNote
  ) => {
    const loadingToast = toast.loading("Sending order...");

    let userFullId = localStorage.getItem("userId");
    let [userId, dCode] = userFullId.split("-");
    let userDesc = localStorage.getItem("userDesc");
    console.log(isVendorName, "isVendorName in sendOrder.js");
    console.log(order, "order.()");
    if (order.length == 0) {
      toast.error("Cant send empty cart");
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

    console.log(pharmacyValue, "pharmacyValue");
    let today = moment().format();

    const orderObject = {
      CUSTNAME: isVendorName ? pharmacyValue.Code : userId,
      // CDES: userDesc,
      CURDATE: today,
      ...(isVendorName && { DEXT_SUPPNAME: isVendorName }),
      ...(isVendorName && { DEXT_SUPPDES: userDesc }),
      // DEXT_SUPPNAME: "V1239",
      // DEXT_SUPPDES: "4MORE LTD 2",
      DCODE: dCode,
      DEXT_CUSTOMERREMARKS: !isVendorName ? custNote : "",
      DEXT_VENTORREMARKS: isVendorName ? custNote : "",
      DEXT_SUBMISSIONDATE: today,
      PAYCODE: "20",
      DEXT_B2CONTACT: 9,
      B2B_ORDERITEMS_SUBFORM: productsinOrder,
    };

    setShowCart(false);

    //send order

    //const url = "http://localhost:8000/order";
    //const url = "https://kedifap-portal.com2go.co/order";
    const url = new URL(`${process.env.REACT_APP_API_URL}/order`);
    toast.dismiss(loadingToast);

    try {
      const response = await axios.post(url, orderObject);
      console.log(response, "response");
      toast.success("Order Sent Successfully, Thank you!!");
      setCartItems([]);
      setTotal(0);
      setProductQuantity({});
      setHighlightStyle([]);
      setCustNote("");
      localStorage.setItem("kediCart", []);
      localStorage.setItem("kediCartTotal", []);
      localStorage.setItem("kediCartDiscount", 0);
      localStorage.setItem("kediCartQuantity", 0);
      localStorage.setItem("kediCartFreeQuantity", []);
      localStorage.setItem("kediCartHighlight", []);
    } catch (error) {
      toast.error(
        "There was an issue making your order, please contact support."
      );
      console.error(error);
    }
  };

  const saveCart = async (cartItems) => {
    setCartTemplate(cartItems);
  };

  const sessionFreeQuantity = cartSession.getSessionFreeQuantity();
  let totalFreeQuantities = 0;
  for (const value of Object.values(sessionFreeQuantity)) {
    totalFreeQuantities += value;
  }

  const [orderButtonStatus, setOrderButtonStatus] = useState("enabled");
  const [pharmacyValue, setPharmacyValue] = useState("");
  const [custNote, setCustNote] = useState("");

  const handleNoteChange = (event) => {
    setCustNote(event.target.value);
  };

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

  const [sortBy, setSortBy] = useState("");

  const renderCartItem = (item, index) => (
    <CartItem
      discountLabel={cartSession.getSessionDiscountLabel()}
      quantityInputValue={cartSession.getSessionQuantity()}
      handleQuantityChange={handleQuantityChange}
      setQuantityInputValue={setQuantityInputValue}
      removeItem={removeItem}
      item={item}
      index={index}
      sortBy={sortBy}
      handleCartSortBy={handleCartSortBy}
    />
  );

  const calculateSessionCartTotal = () => {
    let sessionCartTotal = 0;
    const sessionCart = cartSession.getItems();
    const sessionCartDiscount = cartSession.getSessionDiscount();
    sessionCart.forEach((item) => {
      sessionCartTotal += parseInt(item.quantity) * parseFloat(item.WSPLPRICE);
    });

    return sessionCartTotal - sessionCartDiscount;
  };

  return (
    <div>
      <button class="basket" onClick={handleCartClick}>
        <span className="icon">
          <p>
            {localStorage.getItem("kediCartTotal")
              ? JSON.parse(localStorage.getItem("kediCartTotal")).length
              : 0}
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
          <ul className="cart-list">
            <Box sx={{ minWidth: 20, padding: "15px", width: "80%" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sortBy}
                  label="Age"
                  onChange={(event) => handleCartSortBy(event, setSortBy)}
                  >
                  <MenuItem value="byDesc">Part Description</MenuItem>
                  <MenuItem value="byRecent">Most Recent Part Added</MenuItem>
                  <MenuItem value="byValue">Total Value</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Divider component="li" />
            {localStorage.getItem("kediCart") &&
              JSON.parse(localStorage.getItem("kediCart")).length > 0 &&
              JSON.parse(localStorage.getItem("kediCart")).map((item, index) =>
                renderCartItem(item, index)
              )}
          </ul>
          <div class="cart-item-details">
            Number of items :{" "}
            {Object.values(cartSession.getSessionQuantity()).reduce(
              (total, value) => total + parseInt(value),
              0
            )}
            {totalFreeQuantities > 0 && (
              <span>+ {parseInt(totalFreeQuantities)} Free items</span>
            )}
          </div>
          <div className="total-container">
            <p className="total-text">
              Discount: {cartSession.getSessionDiscount().toFixed(2)}
            </p>{" "}
            <p className="total-text">
              Total:{" "}
              {total !== 0
                ? total.toFixed(2)
                : calculateSessionCartTotal().toFixed(2)}
            </p>
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
          <TextField
            className="cust-notes"
            label="Your notes"
            variant="outlined"
            multiline
            fullWidth="true"
            rows={4}
            value={custNote}
            onChange={handleNoteChange}
          />
          <div className="d-flex justify-content-between cart-end">
            <button
              onClick={() => clearCart()}
              className="btn btn-danger cart-clear-btn"
            >
              Clear Cart
            </button>
            <button
              onClick={() => {
                toast((t) => (
                  <span>
                    Θέλετε να αποσταλεί η παραγγελία σας;
                    <br></br>
                    <Box sx={{ flexGrow: 1, padding: "10px" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Item>
                            <button
                              onClick={() => {
                                sendOrder(
                                  cartItems,
                                  isVendorName,
                                  freeQuantity,
                                  pharmacyValue,
                                  custNote
                                );
                                toast.dismiss(t.id);
                              }}
                            >
                              Send order
                            </button>
                          </Item>
                        </Grid>
                        <Grid item xs={6}>
                          <Item>
                            {" "}
                            <button onClick={() => toast.dismiss(t.id)}>
                              Cancel
                            </button>
                          </Item>
                        </Grid>
                      </Grid>
                    </Box>
                  </span>
                ));
              }}
              className="btn btn-primary "
              disabled={
                orderButtonStatus === "disabled" || cartItems.length == 0
              }
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
