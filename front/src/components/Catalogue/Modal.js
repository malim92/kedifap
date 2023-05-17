import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import gesy from "../../assets/GESY_FINAL_LOGO_NCR_L.png";
import { BsExclamationTriangle } from "react-icons/bs";
import { MdWaterDrop } from "react-icons/md";
import { TbFridge } from "react-icons/tb";


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
        <p>Διανομέα: {popupModalData.distributer}</p>
        <p>Barcode Συσκευασίας: {popupModalData.barcode}</p>
        <p>Κωδικός Φ.Υ: {popupModalData.pharmaCode}</p>
        <p>Αντιπρόσωπο: {popupModalData.supplier}</p>
        <p>return policy: {popupModalData.policy}</p>
        
        <Container>
          <Row>
            <div class="d-flex">
            {popupModalData.ghs === 1 ? <img src={gesy} alt="gesy" style={{width: "30px"}}/> : null}
            
            {popupModalData.fragile === 1 ? <BsExclamationTriangle style={{color: "#93812b", width: "30px", fontSize:"25px"}}/> : null}
            
            {popupModalData.liquid === 1 ? <MdWaterDrop style={{color: "#2f4fa7", width: "30px", fontSize:"25px"}}/> : null}
            
            {popupModalData.fridge === 1 ? <TbFridge style={{color: "#2134bd", width: "30px", fontSize:"25px",}}/> : null}
            </div>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" style={{ color: "red" }} onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductModal;
