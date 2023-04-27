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
        <p>Κωδικός Προϊόντος: {popupModalData.code}</p>
        <p>Περιγραφή: {popupModalData.description}</p>
        <p>Διαθέσιμο Απόθεμα: {popupModalData.stock}</p>
        <p>Χονδρική τιμή: {popupModalData.price}</p>
        <p>Λιανική Τιμή: {popupModalData.priceVat}</p>
        <p>Φ.Π.Α %: {popupModalData.vat}</p>
        <p>Αντιπρόσωπο: {popupModalData.distributer}</p>
        <p>Barcode Συσκευασίας: {popupModalData.barcode}</p>
        <p>Κωδικός Φ.Υ: {popupModalData.pharmaCode}</p>
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
