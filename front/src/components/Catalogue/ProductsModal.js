import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

function OrderProductsModal(props) {
  const { popupModalProduct, show, handleClose } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Code</th>
                <th>Descirption</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {popupModalProduct.hasOwnProperty("ordersList") &&
                popupModalProduct.ordersList.length > 0 &&
                popupModalProduct.ordersList.map((productItem, index) => (
                  <tr key={index}>
                    <td>{productItem.PARTNAME}</td>
                    <td>{productItem.PDES}</td>
                    <td>{productItem.PRICE}</td>
                    <td>{productItem.TQUANT}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
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
