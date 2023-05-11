import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCartArrowDown } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function CartPopupModal(props) {
    const {
        cartTemplateShow,
      } = props;
      console.log(cartTemplateShow, "cartTemplateShow");

  return (
    <Modal show={cartTemplateShow}>
      <Modal.Header closeButton>
        <Modal.Title>Product Discount Info</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button variant="danger" style={{ color: "red" }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CartPopupModal;
