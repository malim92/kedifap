import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

// import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCartArrowDown } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { FetchOffer } from "./fetchOffer";

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
  setHighlightStyle
) => {
  if (product.TBALANCE == 0) {
    alert("Sorry but the selected product dosn't have available stock!");
    return;
  }
  setShowCart(true);
  console.log(product, "product chcek  ");

  const found = cartItems.find(
    (element) => element.PARTNAME == product.PARTNAME
  );
  console.log(discountSelection, "discountSelection chcek  ");
  if (product.stock < discountSelection.OFFERQTY) {
    alert(
      `Sorry for inconvience but the selected product has only ${product.stock} in stock`
    );
  } else {
    if (found) {
      alert("Product is already in the cart!");
    } else {
      product.quantity = quantityInputValue[product.PARTNAME];
      console.log(discountSelection, "discountSelection  ");
      console.log(quantityInputValue, "quantityInputValue debug  ");
      setCartItems([...cartItems, product]);
      console.log(cartItems, "cartItems debug 1  ");

      cartItems.push(product);
      const updatedDataMix = cartItems.map((cartItem) => ({
        ...cartItem,
        quantity: quantityInputValue[cartItem.PARTNAME] || 1,
      }));

      const cartFlatTotalInDiscount = caluclateFlatTotal(cartItems);
      // price discount
      if (discountSelection.DEXT_OFFERCODE == "2") {
        const cartDiscountTotalInDiscount = caluclateDiscount(cartItems);

        console.log(
          cartDiscountTotalInDiscount,
          "cartDiscountTotalInDiscount in discount"
        );

        setDiscountAmount(cartDiscountTotalInDiscount.totalDiscount);

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

        console.log(
          discountLabel,
          "discountLabel in discount"
        );
        setDiscountLabel({
          ...discountLabel,
          [product.PARTNAME]:
            cartDiscountTotalInDiscount.discountLabel[product.PARTNAME],
        });
        //free quantity items
      } else if (discountSelection.DEXT_OFFERCODE == "1") {
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
      } else if (discountSelection.DEXT_OFFERCODE == "4") {
        
        setProductQuantity({
          ...productQuantity,
          [product.PARTNAME]: product.quantity,
        });

        highlightStyle.push(product.PARTNAME);
        setHighlightStyle(highlightStyle);

        const cartFlatTotalInDiscount = caluclateFlatTotal(updatedDataMix);
        // const cartDiscountTotalInDiscount = caluclateMixMatch(cartItems);

        //create an array that has the total amount of quantities for each offer

        // updatedDataMix.forEach(item => {
        //   if (item.MIX_MATCH_DISCOUNTED == true)
        //     console.log(item, 'item that is mixed');
        // });
        const mixMatchDiscount = caluclateMixMatch(updatedDataMix);

        console.log(mixMatchDiscount, "cal in mixmatch");
        console.log(
          cartFlatTotalInDiscount,
          "cartFlatTotalInDiscount in mixmatch"
        );

        setTotal(cartFlatTotalInDiscount - mixMatchDiscount);

        // setQuantityInputValue({
        //   ...quantityInputValue,
        //   [product.PARTNAME]: parseInt(product.quantity),
        // });

        // setProductQuantity({
        //   ...productQuantity,
        //   [product.PARTNAME]: product.quantity,
        // });

        // setTotal(
        //   cartFlatTotalInDiscount - cartDiscountTotalInDiscount.totalDiscount
        // );
      }
    }
  }
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
  } = props;

  const [open, setOpen] = useState(false);
  const [currentBody, setCurrentBody] = useState(1);
  const [mixMatch, setMixMatch] = useState([]);
  const [discountQuantityInputValue, setDiscountQuantityInputValue] = useState(
    {}
  );
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

    setProductQuantity({ ...productQuantity, [item.PARTNAME]: event });
    const productId = item.PARTNAME;

    setQuantityInputValue({
      ...quantityInputValue,
      [productId]: parseInt(event),
    });
    
    // console.log(productQuantity, "productQuantity quan");

    const updatedItems = [...cartItems];

    if (updatedItems.length == 0 ) return;
    const updatedItemsQuantity = updatedItems.map((item) => ({
      ...item,
      quantity: productQuantity[item.PARTNAME] || 1,
    }));
    
    updatedItems[index] = { ...updatedItemsQuantity[index], quantity: event };
    console.log(updatedItems, "debug updatedItems quan");
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
    console.log(discountLabel, "debug discountLabel quan");
    console.log(totalDiscountAmount, "debug totalDiscountAmount quan");

  };

  const { rowSearch } = popupModalDiscount;
  const productOriginal = { original: rowSearch };

  // const addToCart = (
  //   product,
  //   total,
  //   setQuantityInputValue,
  //   setProductQuantity,
  //   productQuantity
  // ) => {
  //   let cartTotalPrice = total;

  //   console.log(product, "product.original 2");

  //   const found = cartItems.find(
  //     (element) => element.PARTNAME == product.PARTNAME
  //   );
  //   if (found) {
  //     alert("Product is already in the cart!");
  //   } else {
  //     if (parseInt(product.DEXT_LOWSTOCKQTY) > 0) {
  //       product.quantity = product.DEXT_LOWSTOCKQTY;
  //       setQuantityInputValue({
  //         ...quantityInputValue,
  //         [product.PARTNAME]: product.DEXT_LOWSTOCKQTY,
  //       });
  //       setProductQuantity({
  //         ...quantityInputValue,
  //         [product.PARTNAME]: product.DEXT_LOWSTOCKQTY,
  //       });
  //     } else {
  //       product.quantity = 1;
  //       setQuantityInputValue({
  //         ...quantityInputValue,
  //         [product.PARTNAME]: productQuantity[product.PARTNAME],
  //       });
  //       // productQuantity.length ==   0 ? productQuantity[product.PARTNAME] = 1 : productQuantity
  //       if (productQuantity.length == 0) productQuantity[product.PARTNAME] = 1;
  //       setProductQuantity({
  //         ...quantityInputValue,
  //         [product.PARTNAME]: productQuantity[product.PARTNAME],
  //       });
  //     }
  //     setCartItems([...cartItems, product]);
  //     const cartFlatTotal = caluclateFlatTotal(cartItems);
  //     console.log(cartFlatTotal, "flat 1");

  //     // useEffect(() => {
  //     //   cartItems.forEach((singleCartItem) => {
  //     //     if (singleCartItem.DEXT_OFFERCODE == 4)
  //     //       console.log(singleCartItem, "singleCartItem is 4");
  //     //   });
  //     // }, [cartItems]);

  //     cartTotalPrice +=
  //       parseFloat(product.WSPLPRICE) * parseInt(product.quantity);
  //     setTotal(cartTotalPrice + cartFlatTotal);
  //     setShowCart(true);
  //   }
  // };

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
                                        setFreeQuantity
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
                            setQuantityInputValue,
                            setProductQuantity
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
                  Number of items for this discount :{" "}
                  {mixMatch[0].OFFERQTY}
                </p>
                <Table striped bordered hover>
                  {/* <thead>
                  
                </thead> */}
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
                            highlightStyle.includes(item.PARTNAME)
                              ? { color: "#0d6efd", fontWeight: "700" }
                              : null
                          }
                        >
                          {item.PARTNAME}
                        </td>
                        <td
                          style={
                            highlightStyle.includes(item.PARTNAME)
                              ? { color: "#0d6efd", fontWeight: "700" }
                              : null
                          }
                        >
                          {item.PARTDES}
                        </td>
                        <td
                          style={
                            highlightStyle.includes(item.PARTNAME)
                              ? { color: "#0d6efd", fontWeight: "700" }
                              : null
                          }
                        >
                          {item.WSPLPRICE}
                        </td>
                        <td
                          style={
                            highlightStyle.includes(item.PARTNAME)
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
                                  setHighlightStyle
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
      </Modal>
    );
  }
}

export default ProductDiscountModal;
