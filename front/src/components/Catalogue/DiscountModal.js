import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import CustomizedProgressBars from "./Cart-components/ShippingProgress";
import CalculateMixTotal from "./Material-functions/calculateMixProgress";
import cartSession from "./Cart-components/cartSession";

// import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCartArrowDown } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { FetchOffer } from "./Api/fetchOffer";
import { Toaster } from "react-hot-toast";

import "./DiscountModal.css";

const getDiscount = async (
  product,
  discountSelection,
  cartItems,
  setCartItems,
  setTotal,
  setShowCart,
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
  caluclateMixMatch,
  highlightStyle,
  setHighlightStyle,
  mixProgress,
  setMixProgress,
  selectedOffer,
  setSelectedOffer
) => {
  setShowCart(true);
  console.log(product, "product chcek  ");

  const sessionItems = cartSession.getItems();

  const found = sessionItems.find(
    (element) => element.PARTNAME == product.PARTNAME
  );
  console.log(discountSelection, "discountSelection chcek  ");
  // if (product.stock < discountSelection.OFFERQTY) {
  //   alert(
  //     `Sorry for inconvience but the selected product has only ${product.stock} in stock`
  //   );
  // } else {
    if (found) {
      console.log(productQuantity, "productQuantity chcek  ");
      setQuantityInputValue({
        ...quantityInputValue,
        [product.PARTNAME]: parseInt(productQuantity[product.PARTNAME]),
      });

      setProductQuantity({
        ...productQuantity,
        [product.PARTNAME]: productQuantity[product.PARTNAME],
      });
      product.quantity = productQuantity[product.PARTNAME];
      CalculateMixTotal(mixProgress, setMixProgress, product);

      // toast.error("Product is already in the cart!");
    } else {
      // price discount
      if (discountSelection.DEXT_OFFERCODE == "2") {
        product.quantity = discountSelection.OFFERQTY;

        setCartItems([...cartItems, product]);

        cartItems.push(product);
        const sessionCartItems = cartSession.getItems();
        sessionCartItems.push(product);
        cartSession.setItems(sessionCartItems);
        cartSession.setTotal();

        const cartFlatTotalInDiscount = caluclateFlatTotal(cartItems);
        const cartDiscountTotalInDiscount = caluclateDiscount(cartItems);

        const updatedDataMix = cartItems.map((cartItem) => ({
          ...cartItem,
          quantity: product.quantity || 1,
        }));

        // const mixMatchDiscount = caluclateMixMatch(
        //   updatedDataMix,
        //   setDiscountAmount
        // );

        
        //let totalDiscount = cartDiscountTotalInDiscount.totalDiscount + mixMatchDiscount.discountedAmount;
        let totalDiscount = cartDiscountTotalInDiscount.totalDiscount;
        
        setDiscountAmount(totalDiscount);
        const sessionDiscount = cartSession.getSessionDiscount();

        console.log(
          sessionDiscount,
          "sessionDiscount in discount"
        );
        
        const allDiscount = totalDiscount + sessionDiscount;
        console.log(
          allDiscount,
          "allDiscount in discount"
        );
        cartSession.setSessionDiscount(allDiscount);

        

        setTotal(
          cartFlatTotalInDiscount - cartDiscountTotalInDiscount.totalDiscount
        );

        setQuantityInputValue({
          ...quantityInputValue,
          [product.PARTNAME]: parseInt(product.quantity),
        });

        setProductQuantity({
          ...productQuantity,
          [product.PARTNAME]: product.quantity,
        });
        
        cartSession.setSessionQuantity(product.PARTNAME, product.quantity);
        cartSession.setSessionDiscountLabel(product.PARTNAME, cartDiscountTotalInDiscount);

        setDiscountLabel({
          ...discountLabel,
          [product.PARTNAME]:
            cartDiscountTotalInDiscount.discountLabel[product.PARTNAME],
        });
        //free quantity items
      } else if (discountSelection.DEXT_OFFERCODE == "1") {
        product.quantity = discountSelection.OFFERQTY;

        setCartItems([...cartItems, product]);

        cartItems.push(product);
        
        const sessionCartItems = cartSession.getItems();
        sessionCartItems.push(product);
        cartSession.setItems(sessionCartItems);
        cartSession.setTotal();

        const cartFlatTotalInDiscount = caluclateFlatTotal(cartItems);

        setTotal(cartFlatTotalInDiscount);

        setQuantityInputValue({
          ...quantityInputValue,
          [product.PARTNAME]: parseInt(product.quantity),
        });

        setProductQuantity({
          ...productQuantity,
          [product.PARTNAME]: product.quantity,
        });

        setFreeQuantity({
          ...freeQuantity,
          [product.PARTNAME]: parseInt(discountSelection.FREEQTY),
        });

        setDiscountLabel({
          ...discountLabel,
          [product.PARTNAME]: discountSelection.OFFERDES,
        });

        cartSession.setSessionQuantity(product.PARTNAME, product.quantity);
        cartSession.setSessionFreeQuantity(product.PARTNAME, parseInt(discountSelection.FREEQTY));
        
      } else if (discountSelection.DEXT_OFFERCODE == "4") {
        //if offer exist dont duplicate it
        setSelectedOffer((prevSelectedOffer) => {
          if (!prevSelectedOffer.includes(discountSelection.OFFERID)) {
            return [...prevSelectedOffer, discountSelection.OFFERID];
          }
          return prevSelectedOffer;
        });

        product.quantity = quantityInputValue[product.PARTNAME];

        quantityInputValue
          ? (product.quantity = quantityInputValue[product.PARTNAME])
          : (product.quantity = 1);

        setCartItems([...cartItems, product]);

        cartItems.push(product);
        
        const sessionCartItems = cartSession.getItems();
        sessionCartItems.push(product);
        cartSession.setItems(sessionCartItems);
        cartSession.setTotal();

        const updatedDataMix = cartItems.map((cartItem) => ({
          ...cartItem,
          quantity: quantityInputValue[cartItem.PARTNAME] || 1,
        }));

        CalculateMixTotal(mixProgress, setMixProgress, product);

        setProductQuantity({
          ...productQuantity,
          [product.PARTNAME]: productQuantity[product.PARTNAME] || 1,
        });

        highlightStyle.push(product.PARTNAME);
        setHighlightStyle(highlightStyle);
        cartSession.setSessionHighlight(highlightStyle);
        const cartFlatTotalInDiscount = caluclateFlatTotal(updatedDataMix);

        const mixMatchDiscount = caluclateMixMatch(
          updatedDataMix,
          setDiscountAmount
        );
        console.log(
          mixMatchDiscount,
          "mixMatchDiscount in discount"
        );
        const sessionDiscount = cartSession.getSessionDiscount();
        cartSession.setSessionDiscount(mixMatchDiscount.discountedAmount + sessionDiscount);

        setTotal(cartFlatTotalInDiscount - mixMatchDiscount.discountedAmount);
        setDiscountLabel({
          ...discountLabel,
          [product.PARTNAME]: mixMatchDiscount.discountLabel[product.PARTNAME],
        });
        cartSession.setSessionQuantity(product.PARTNAME, product.quantity);
        cartSession.setSessionDiscountLabel(product.PARTNAME, mixMatchDiscount);
      }
    }
  // }
};

function ProductDiscountModal(props) {
  const {
    show,
    handleClose,
    popupModalDiscount,
    cartItems,
    setCartItems,
    total,
    setTotal,
    setShowCart,
    handleAddToCart,
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
    caluclateMixMatch,
    highlightStyle,
    setHighlightStyle,
    mixProgress,
    setMixProgress,
    selectedOffer,
    setSelectedOffer,
  } = props;

  const [currentBody, setCurrentBody] = useState(1);
  const [mixMatch, setMixMatch] = useState([]);
  const modalRef = useRef();

  const handleCloseModal = () => {
    handleClose();
    setCurrentBody(1);
  };

  const handleSwipe = async (direction, product, index) => {
    if (direction === "left") {
      setCurrentBody(currentBody + 1);
    } else if (direction === "right" && currentBody > 1) {
      setCurrentBody(currentBody - 1);
    }

    console.log(index, "product index in swipe");
    console.log(product, "product offer in swipe");
    console.log(product.discounts, "product.discount offer in swipe");
    let offerResults = await FetchOffer(index);

    //add the quantity balance for all same products
    const updatedOfferResults = Object.values(
      offerResults.data.reduce((result, item) => {
        const partname = item.PARTNAME;
        const tbalance = parseInt(item.TBALANCE);

        if (!result[partname]) {
          result[partname] = { ...item };
        } else {
          result[partname].TBALANCE =
            parseInt(result[partname].TBALANCE) + tbalance;
        }

        return result;
      }, {})
    );
    // console.log(updatedOfferResults, "offerResults in swiper 21");
    setMixMatch(updatedOfferResults);
  };

  const handleQuantityChange = (event, item, index, setQuantityInputValue) => {
    console.log(item.PARTNAME, "item.PARTNAME first");
    console.log(cartItems, "item.cartItems first");
    let productCode = item.PARTNAME;

    const isXInArray = cartItems.some((item) => item.PARTNAME === productCode);

    console.log(item, "item totalDiscountAmount quan");

    // if (item.DEXT_OFFERCODE == "4" && item.OFFERQTY) {
    //   item.quantity = parseInt(event);
    //   CalculateMixTotal(mixProgress, setMixProgress, item );
    // }

    setProductQuantity({ ...productQuantity, [item.PARTNAME]: event });
    const productId = item.PARTNAME;
    cartSession.setSessionQuantity(item.PARTNAME, event);
    setQuantityInputValue({
      ...quantityInputValue,
      [productId]: parseInt(event),
    });
    if (!isXInArray) return;

    console.log(productQuantity, "productQuantity quan");

    const updatedItems = [...cartItems];

    if (updatedItems.length == 0) return;
    const updatedItemsQuantity = updatedItems.map((item) => ({
      ...item,
      quantity: productQuantity[item.PARTNAME] || 1,
    }));

    updatedItems[index] = { ...updatedItemsQuantity[index], quantity: event };
    console.log(updatedItemsQuantity, "debug updatedItemsQuantity quan");
    updatedItemsQuantity[index] = {
      ...updatedItemsQuantity[index],
      quantity: event,
    };

    console.log(cartItems, "cartItems test1");

    setCartItems(updatedItemsQuantity);
    cartSession.setItems(updatedItemsQuantity);
    const mixMatchDiscount = caluclateMixMatch(
      updatedItemsQuantity,
      setDiscountAmount
    );
    const cartFlatTotal = caluclateFlatTotal(updatedItemsQuantity);
    const totalDiscountAmount = caluclateDiscount(updatedItemsQuantity);
    setDiscountAmount(totalDiscountAmount.totalDiscount);
    setDiscountAmount(mixMatchDiscount.discountedAmount);

    console.log(totalDiscountAmount, "totalDiscountAmount test1");
    console.log(mixMatchDiscount, "mixMatchDiscount test1");
    cartSession.setSessionDiscount(mixMatchDiscount.discountedAmount);
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
  };

  const { rowSearch } = popupModalDiscount;
  const productOriginal = { original: rowSearch };

  //handle user pressing escape button
  const handleEscape = (event) => {
    if (event.keyCode === 27) {
      handleCloseModal();
    }
  };

  // Clicked outside the modal
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (rowSearch !== undefined) {
    return (
      <Modal
        show={show}
        onClick={handleClickOutside}
        onHide={handleClose}
        dialogClassName="modal-wide"
      >
        <div ref={modalRef}>
          <Modal.Header closeButton>
            <Modal.Title>Product Discount Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <div className="modal-body"> */}
            {currentBody === 1 && (
              <>
                {rowSearch.hasOwnProperty("discounts") &&
                  rowSearch.discounts.map((discount, index) => (
                    <>
                      <Container>
                        <Row>
                          <div
                            class="d-flex justify-content-between px-padding"
                            key={index}
                          >
                            {discount.hasOwnProperty("DEXT_OFFERCODE") &&
                              discount.DEXT_OFFERCODE == "4" && (
                                <>
                                  {/* <div class="d-flex justify-content-between px-padding"> */}
                                  <p>Buy: {discount.OFFERDES}</p>
                                  <Button
                                    variant="primary"
                                    onClick={() =>
                                      handleSwipe(
                                        "left",
                                        rowSearch,
                                        discount.OFFERID
                                      )
                                    }
                                  >
                                    <p>
                                      List of Mix&Match
                                      <ProductionQuantityLimitsIcon />
                                    </p>
                                  </Button>
                                  {/* </div> */}
                                </>
                              )}
                            {discount.hasOwnProperty("DEXT_OFFERCODE") &&
                              discount.DEXT_OFFERCODE !== "4" && (
                                <>
                                  <p>Buy: {discount.OFFERDES}</p>
                                  <Button
                                    variant="primary"
                                    className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                                    onClick={() =>
                                      getDiscount(
                                        rowSearch,
                                        discount,
                                        cartItems,
                                        setCartItems,
                                        setTotal,
                                        setShowCart,
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
                                        caluclateMixMatch,
                                        mixProgress,
                                        setMixProgress
                                      )
                                    }
                                    style={{
                                      backgroundColor: "#db2d2d",
                                      backgroundColor: "#db2d2d",
                                      width: "30px",
                                      fontSize: "15px",
                                      height: "30px",
                                    }}
                                  >
                                    <FaCartArrowDown
                                      style={{
                                        right: "8px",
                                        bottom: "8px",
                                        position: "relative",
                                      }}
                                    />
                                  </Button>
                                </>
                              )}
                          </div>
                        </Row>
                      </Container>
                    </>
                  ))}
                <Container>
                  <Row>
                    <div class="d-flex justify-content-between px-padding">
                      <p>Add single unit</p>
                      <Button
                        className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                        onClick={() => {
                          handleAddToCart(
                            productOriginal,
                            total,
                            quantityInputValue,
                            setQuantityInputValue,
                            setProductQuantity,
                            cartItems,
                            setTotal,
                            setCartItems,
                            setShowCart
                          );
                        }}
                        style={{
                          width: "30px",
                          fontSize: "15px",
                          height: "30px",
                        }}
                      >
                        <FaCartArrowDown
                          style={{
                            right: "8px",
                            bottom: "8px",
                            position: "relative",
                          }}
                        />
                      </Button>
                    </div>
                  </Row>
                </Container>
              </>
            )}
            {currentBody === 2 && mixMatch.length !== 0 && (
              <>
                <p>
                  Number of items for this discount : {mixMatch[0].OFFERQTY}
                </p>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }} colspan="6">
                        Mix & Match
                      </th>
                    </tr>
                    <tr>
                      <th>Code</th>
                      <th>Descirption</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Add to cart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mixMatch.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={
                            cartSession.getSessionHighlight().includes(item.PARTNAME)
                              ? { color: "#0d6efd", fontWeight: "700" }
                              : null
                          }
                        >
                          {item.PARTNAME}
                        </td>
                        <td
                          style={
                            cartSession.getSessionHighlight().includes(item.PARTNAME)
                              ? { color: "#0d6efd", fontWeight: "700" }
                              : null
                          }
                        >
                          {item.PARTDES}
                        </td>
                        <td
                          style={
                            cartSession.getSessionHighlight().includes(item.PARTNAME)
                              ? { color: "#0d6efd", fontWeight: "700" }
                              : null
                          }
                        >
                          {item.WSPLPRICE}
                        </td>
                        <td
                          style={
                            cartSession.getSessionHighlight().includes(item.PARTNAME)
                              ? { color: "#0d6efd", fontWeight: "700" }
                              : null
                          }
                        >
                          {item.TBALANCE}
                        </td>

                        <td>
                          <div class="cart-item-controls">
                            <button
                              className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                              onClick={() =>
                                getDiscount(
                                  item,
                                  mixMatch[index],
                                  cartItems,
                                  setCartItems,
                                  setTotal,
                                  setShowCart,
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
                                  caluclateMixMatch,
                                  highlightStyle,
                                  setHighlightStyle,
                                  mixProgress,
                                  setMixProgress,
                                  selectedOffer,
                                  setSelectedOffer
                                )
                              }
                              style={{
                                backgroundColor: "#db2d2d",
                                backgroundColor: "#db2d2d",
                                width: "30px",
                                fontSize: "15px",
                                height: "30px",
                              }}
                            >
                              <FaCartArrowDown
                                style={{
                                  right: "8px",
                                  bottom: "8px",
                                  position: "relative",
                                }}
                              />
                            </button>

                            <input
                              type="number"
                              value={cartSession.getSessionQuantity()[item.PARTNAME] || 1}
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {Array.isArray(selectedOffer) &&
                  selectedOffer.length > 0 &&
                  selectedOffer.map((selectedOfferId) =>
                    mixMatch.some((item) => item.OFFERID == selectedOfferId) ? (
                      <CustomizedProgressBars
                        selectedOfferId={selectedOfferId}
                        mixProgress={mixProgress}
                        mixMatch={mixMatch}
                      />
                    ) : null
                  )}
              </>
            )}
            {currentBody === 2 && mixMatch.length == 0 && (
              <h2>No matching products available for this offer</h2>
            )}
            {/* <>
                {console.log(item, "test item")}
                
                  <tr key={index}>
                          <td>{item.PARTNAME}</td>
                          <td>{item.PDES}</td>
                          <td>{item.PRICE}</td>
                          <td>{item.TQUANT}</td>
                        </tr>
                  
              </>
            )) */}

            {/* </div> */}
          </Modal.Body>
          <Modal.Footer>
            {currentBody == 2 && (
              <Button
                variant="secondary"
                style={{ color: "black" }}
                onClick={() => handleSwipe("right")}
              >
                Back
              </Button>
            )}
            <Button
              variant="danger"
              style={{ color: "red" }}
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </Modal.Footer>
        </div>
        <Toaster />
      </Modal>
    );
  }
}

export default ProductDiscountModal;
