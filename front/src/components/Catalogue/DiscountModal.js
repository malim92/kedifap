import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ProductDiscountModal(props) {
  const { show, handleClose, popupModalDiscount } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Product Discount Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Part Code: {popupModalDiscount.code}</p>
        {popupModalDiscount.hasOwnProperty("discounts") &&
          popupModalDiscount.discounts.map((discount, index) => (
            <div class="d-flex justify-content-between" key={index}>
              <p>Buy: {discount.OFFERDES}</p>
              <button
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                //onClick={() => sendOrder(cartItems, total)}
                class="btn btn-primary"
              >
                Get the discount
              </button>
            </div>
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

export default ProductDiscountModal;
