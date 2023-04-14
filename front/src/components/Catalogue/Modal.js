import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ProductModal(props) {
  const { show, handleClose, popupModalData } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Product Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Part Code: {popupModalData.code}</p>
        <p>Part Description: {popupModalData.description}</p>
        <p>Current Stock: {popupModalData.stock}</p>
        <p>Retail Price: {popupModalData.price}</p>
        <p>VAT Percentage: {popupModalData.vat}</p>
        <p>Distributer/Importer: {popupModalData.distributer}</p>
        <p>Package Barcode: {popupModalData.barcode}</p>
        <p>Pharma Service Code: {popupModalData.pharmaCode}</p>
        <p>Supplier: {popupModalData.supplier}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" style={{ color: 'red' }} onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductModal;
