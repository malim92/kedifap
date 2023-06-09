import React, { useState } from "react";
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
  productQuantity,
  setProductQuantity,
  discountLabel,
  setDiscountLabel,
  freeQuantity,
  setFreeQuantity
) => {
  setShowCart(true);
  const found = cartItems.find(
    (element) => element.PARTNAME == product.PARTNAME
  );
  if (found) {
    alert("Product is already in the cart!");
  } else {
    product.quantity = discountSelection.OFFERQTY;
    console.log(discountSelection, "discountSelection  ");
    setCartItems([...cartItems, product]);
    cartItems.push(product);
    const cartFlatTotalInDiscount = caluclateFlatTotal(cartItems);
    // price discount
    if (discountSelection.DEXT_OFFERCODE == "2") {
      const cartDiscountTotalInDiscount = caluclateDiscount(cartItems);
      console.log(
        cartDiscountTotalInDiscount,
        "cartDiscountTotalInDiscount in discount"
      );

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
    }
    if (discountSelection.DEXT_OFFERCODE == "4") {
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
    productQuantity,
    setProductQuantity,
    discountLabel,
    setDiscountLabel,
    freeQuantity,
    setFreeQuantity,
  } = props;

  const [open, setOpen] = useState(false);
  const [currentBody, setCurrentBody] = useState(1);
  const [mixMatch, setMixMatch] = useState([]);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentBody(1);
  };

  const handleSwipe = async (direction, discount) => {
    if (direction === "left") {
      setCurrentBody(currentBody + 1);
    } else if (direction === "right" && currentBody > 1) {
      setCurrentBody(currentBody - 1);
    }
    let offerResults = await FetchOffer(discount.OFFERID);

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
    console.log(updatedOfferResults, "offerResults in swiper 21");
    setMixMatch(updatedOfferResults);
  };

  const handleQuantityChange = (event, item, index, setQuantityInputValue) => {
    setProductQuantity({ ...productQuantity, [item.PARTNAME]: event });
    const productId = item.PARTNAME;

    setQuantityInputValue({
      ...quantityInputValue,
      [productId]: parseInt(event),
    });
    console.log(productQuantity, "productQuantity quan");
  };

  const { rowSearch } = popupModalDiscount;
  const productOriginal = { original: rowSearch };

  const addToCart = (
    product,
    total,
    setQuantityInputValue,
    setProductQuantity,
    productQuantity
  ) => {
    let cartTotalPrice = total;

    console.log(product, "product.original 2");
    console.log(productQuantity, "productQuantity in addti cart 2");

    const found = cartItems.find((element) => element.PARTNAME == product.PARTNAME);
    if (found) {
      alert("Product is already in the cart!");
    } else {
      if (parseInt(product.DEXT_LOWSTOCKQTY) > 0) {
        product.quantity = product.DEXT_LOWSTOCKQTY;
        setQuantityInputValue({
          ...quantityInputValue,
          [product.PARTNAME]: product.DEXT_LOWSTOCKQTY,
        });
        setProductQuantity({
          ...quantityInputValue,
          [product.PARTNAME]: product.DEXT_LOWSTOCKQTY,
        });
      } else {
        product.quantity = 1;
        setQuantityInputValue({ ...quantityInputValue, [product.PARTNAME]: productQuantity[product.PARTNAME] });
        setProductQuantity({
          ...quantityInputValue,
          [product.PARTNAME]: productQuantity[product.PARTNAME],
        });
      }

      cartTotalPrice +=
        parseFloat(product.WSPLPRICE) * parseInt(product.quantity);
      setTotal(cartTotalPrice);
      setCartItems([...cartItems, product]);
      setShowCart(true);
    }
  };

  if (rowSearch !== undefined) {
    return (
      <Modal show={show} onHide={handleClose} dialogClassName="modal-wide">
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
                                  onClick={() => handleSwipe("left", discount)}
                                >
                                  List of Mix&Match
                                  <ProductionQuantityLimitsIcon />
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

          {currentBody === 2 && mixMatch !== null && (
            <>
              <Table striped bordered hover>
                {/* <thead>
                  
                </thead> */}
                <thead>
                <tr >
                    <th style={{textAlign:"center"}} colspan="6">Mix & Match</th>
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
                      <td>{item.PARTNAME}</td>
                      <td>{item.OFFERDES}</td>
                      <td>{item.VATPRICE}</td>
                      <td>{item.TBALANCE}</td>
                      <td>
                        <div class="cart-item-controls">
                          <button
                            className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                            onClick={ () => addToCart(item,index, setQuantityInputValue,setProductQuantity, productQuantity)}
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
              <Button onClick={() => handleSwipe("right")}>Previous</Button>
            </>
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
          <Button
            variant="danger"
            style={{ color: "red" }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProductDiscountModal;
