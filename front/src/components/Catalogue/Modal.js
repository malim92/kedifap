import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import gesy from "../../assets/GESY_FINAL_LOGO_NCR_L.png";
import { BsExclamationTriangle } from "react-icons/bs";
import { MdWaterDrop } from "react-icons/md";
import { TbFridge } from "react-icons/tb";
import moment from "moment";

function ProductModal(props) {
  const { show, handleClose, popupModalData } = props;
  console.log(popupModalData, "test1");
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
        {/* <p>Φ.Π.Α %: {popupModalData.vat}</p> */}
        <p>Διανομέας: {popupModalData.distributer}</p>
        <p>Barcode Συσκευασίας: {popupModalData.barcode}</p>
        {popupModalData.pharmaCode && (
          <p>Κωδικός Φ.Υ: {popupModalData.pharmaCode}</p>
        )}
        <p>Αντιπρόσωπος: {popupModalData.supplier}</p>
        {popupModalData.policy && <p>Return Policy: {popupModalData.policy}</p>}
        {popupModalData.stock_object &&
          popupModalData.stock_object.length > 0 && (
            <>
              <p>Διαθέσιμες ημερομήνιες λήξεις:</p>

              {popupModalData.stock_object.map((productItem, index) => (
                <p>{moment(productItem.EXPIRYDATE).format("DD-MM-YYYY")}</p>
              ))}
            </>
          )}

        {/* <p>Stock Details: {popupModalData.stock_object[0].TBALANCE}</p> */}

        <Container>
          <Row>
            <div class="d-flex">
              {popupModalData.ghs == 1 ? (
                <img src={gesy} alt="gesy" style={{ width: "30px" }} />
              ) : null}

              {popupModalData.fragile == 1 ? (
                <BsExclamationTriangle
                  style={{ color: "#93812b", width: "30px", fontSize: "25px" }}
                />
              ) : null}

              {popupModalData.liquid == 1 ? (
                <MdWaterDrop
                  style={{ color: "#2f4fa7", width: "30px", fontSize: "25px" }}
                />
              ) : null}

              {popupModalData.fridge == 1 ? (
                <TbFridge
                  style={{ color: "#2134bd", width: "30px", fontSize: "25px" }}
                />
              ) : null}
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
