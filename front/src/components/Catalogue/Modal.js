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
        <p>Κωδικός: {popupModalData.code}</p>
        <p>Περιγραφή: {popupModalData.description}</p>
        <p>Απόθεμα: {popupModalData.stock}</p>
        <p>ΧΤ: {popupModalData.price}</p>
        <p>ΛΤ %: {popupModalData.vat}</p>
        <p>Αντιπρόσωπο: {popupModalData.distributer}</p>
        <p>Barcode: {popupModalData.barcode}</p>
        <p>Κωδικός ΓΕΣΥ: {popupModalData.pharmaCode}</p>
        <p>Διανομέα: {popupModalData.supplier}</p>
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
