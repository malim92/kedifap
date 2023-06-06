import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCartArrowDown } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

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
    // console.log(cartItems, "cartItems in disc ");
    setCartItems([...cartItems, product]);
    cartItems.push(product);
    const cartFlatTotalInDiscount = caluclateFlatTotal(cartItems);
    const cartDiscountTotalInDiscount = caluclateDiscount(cartItems);
    console.log(
      cartDiscountTotalInDiscount,
      "cartDiscountTotalInDiscount in discount"
    );

    cartDiscountTotalInDiscount.freeItems[product.PARTNAME] > 0
      ? setFreeQuantity({
        ...freeQuantity,
        [product.PARTNAME]:
        cartDiscountTotalInDiscount.freeItems[product.PARTNAME],
      }) : setFreeQuantity({
        ...freeQuantity,
        [product.PARTNAME]:
        0,
      });

    console.log(freeQuantity, "freeQuantity 2x");

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

  const { rowSearch } = popupModalDiscount;
  const productOriginal = { original: rowSearch };
  if (rowSearch !== undefined) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Discount Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <p>Part Code: {rowSearch.PARTNAME}</p> */}
          {rowSearch.hasOwnProperty("discounts") &&
            rowSearch.discounts.map((discount, index) => (
              <>
                <Container>
                  <Row>
                    <div
                      class="d-flex justify-content-between px-padding"
                      key={index}
                    >
                      <p>Buy: {discount.OFFERDES}</p>

                      <button
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
                      </button>
                    </div>
                  </Row>
                </Container>
              </>
            ))}
          <Container>
            <Row>
              <div class="d-flex justify-content-between px-padding">
                <p>Add single unit</p>
                <button
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
                </button>
              </div>
            </Row>
          </Container>
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
