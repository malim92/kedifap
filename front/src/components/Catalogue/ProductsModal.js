import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ProductsModal(props) {
  const { popupModalProduct, productShow } = props;
  console.log(popupModalProduct, "popupModalProduct here ");
  return (
    <Modal show={productShow} >
      <Modal.Header closeButton>
        <Modal.Title>Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" style={{ color: 'red' }} >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductsModal;
