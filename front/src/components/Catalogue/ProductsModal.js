import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function OrderProductsModal(props) {
  const { popupModalProduct, show, handleClose } = props;

  console.log(popupModalProduct.ordersList, "popupModalProduct here ");
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {popupModalProduct.hasOwnProperty("ordersList") &&
          popupModalProduct.ordersList.length > 0 &&
          popupModalProduct.ordersList.map((productItem, index) => (
            <>
              <Container>
                <Row>
                  <div class="px-padding" key={index}>
                    <li class="cart-item colored-bg" key={index}>
                      <div class="cart-item-details">
                        <p class="cart-item-name">
                          Name: {productItem.PARTNAME}
                        </p>
                        <p class="cart-item-name">
                          Descirption: {productItem.PDES}
                        </p>
                        <p class="cart-item-name">Price: {productItem.PRICE}</p>
                        <p class="cart-item-name">
                          Quantity: {productItem.TQUANT}
                        </p>
                      </div>
                    </li>
                  </div>
                </Row>
              </Container>
            </>
          ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" style={{ color: "red" }} onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrderProductsModal;
