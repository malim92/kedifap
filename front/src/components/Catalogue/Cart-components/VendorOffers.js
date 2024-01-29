import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import sendOrder from "./sendOrder";

function VendorOffers(props) {
  const {
    showOfferPopup,
    setShowOfferPopup,
    handleOfferPopupClose,
    cartItems,
    isVendorName,
    freeQuantity,
    pharmacyValue,
    custNote,
    setShowCart,
    setCartItems,
    setTotal,
    setProductQuantity,
    setHighlightStyle,
    setCustNote,
  } = props;
  console.log(showOfferPopup, "showOfferPopup.()");

  return (
    <Modal show={showOfferPopup} onHide={handleOfferPopupClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Θέλετε να αποσταλεί η παραγγελία σας;</p>
        <Container>
          <Row></Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          style={{ color: "red" }}
          onClick={handleOfferPopupClose}
        >
          Close
        </Button>
        <Button
          onClick={() => {
            sendOrder(
              cartItems,
              isVendorName,
              freeQuantity,
              pharmacyValue,
              custNote,
              setShowCart,
              setCartItems,
              setTotal,
              setProductQuantity,
              setHighlightStyle,
              setCustNote
            );
          }}
        >
          Send order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VendorOffers;
