import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCartArrowDown } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./CartPopupModal.css";

const addTemplateToCart = async (
  product,
  discountSelection,
  cartItems,
  setCartItems,
  setTotal,
  setShowCart,
  quantityInputValue,
  setQuantityInputValue
) => {
  setShowCart(true);
  const found = cartItems.find(
    (element) => element.PARTNAME == product.PARTNAME
  );
  if (found) {
    alert("Product is already in the cart!!");
  } else {
    product.quantity = discountSelection.OFFERQTY;
    setTotal(
      cartItems.reduce(
        (acc, item) => acc + parseFloat(item.WSPLPRICE) * item.quantity,
        parseFloat(
          product.WSPLPRICE * product.quantity -
            (product.WSPLPRICE *
              product.quantity *
              discountSelection.DISCOUNT) /
              100
        )
      )
    );
    setCartItems([...cartItems, product]);
    console.log(quantityInputValue, "quantityInputValue xx xx");

  }
};

function CartPopupModal(props) {
  const {
    show,
    handleClose,
    cartPopupModalData,
    cartItems,
    setCartItems,
    setTotal,
    setShowCart,
    quantityInputValue,
    setQuantityInputValue,
  } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Saved Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul class="cart-list">
          {cartPopupModalData.length > 0 &&
            cartPopupModalData.map((productItem, index) => (
              <>
                <Container>
                  <Row>
                    <div class="px-padding" key={index}>
                      <li class="cart-item colored-bg" key={index}>
                        <Col>
                          <div class="cart-item-details">
                            <p class="cart-item-name">
                              <b>{productItem.PARTDES}</b>
                            </p>
                            <p class="cart-item-name">
                              Code: {productItem.PARTNAME}
                            </p>
                            <p class="cart-item-price">
                              Price: {parseFloat(productItem.WSPLPRICE)}
                            </p>
                            <p class="cart-item-quantity">
                              Quantity: {productItem.quantity}
                            </p>
                          </div>
                        </Col>
                        <Col>
                          <div class="cart-item-controls px-padding right-float">
                            <button
                              className="n bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                              onClick={() =>
                                addTemplateToCart(
                                  productItem,
                                  cartItems,
                                  setCartItems,
                                  setTotal,
                                  setShowCart,
                                  quantityInputValue,
                                  setQuantityInputValue
                                )
                              }
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
                        </Col>
                      </li>
                    </div>
                  </Row>
                </Container>
              </>
            ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" style={{ color: "red" }} onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CartPopupModal;
