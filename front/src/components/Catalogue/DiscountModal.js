import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCartArrowDown } from "react-icons/fa";

const getDiscount = async (
  product,
  discountSelection,
  cartItems,
  setCartItems,
  setTotal,
  setShowCart
) => {
  
  setShowCart(true);
  const found = cartItems.find(
    (element) => element.PARTNAME == product.PARTNAME
  );
  if (found) {
    alert("Product is already in the cart!");
  } else {
    product.quantity = discountSelection.OFFERQTY;
    setTotal(
      cartItems.reduce(
        (acc, item) => acc + parseFloat(item.WSPLPRICE) * item.quantity,
        parseFloat(
          product.WSPLPRICE * product.quantity -
            (product.WSPLPRICE *
              product.quantity *
              discountSelection.DISCOUNT) /
              100
        )
      )
    );
    setCartItems([...cartItems, product]);
    
  }
};

function ProductDiscountModal(props) {
  const {
    show,
    handleClose,
    popupModalDiscount,
    cartItems,
    setCartItems,
    setTotal,
    setShowCart
  } = props;
  const { rowSearch } = popupModalDiscount;
  if (rowSearch !== undefined ) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Discount Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <p>Part Code: {rowSearch.PARTNAME}</p> */}
          {rowSearch.hasOwnProperty("discounts") &&
            rowSearch.discounts.map((discount, index) => (
              <div class="d-flex justify-content-between" key={index}>
                <p>Buy: {discount.OFFERDES}</p>

                <button
                  className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                  onClick={() =>
                    getDiscount(
                      rowSearch,
                      discount,
                      cartItems,
                      setCartItems,
                      setTotal,
                      setShowCart
                    )
                  }
                  style={{
                    backgroundColor: "#db2d2d",
                    backgroundColor: "#db2d2d",
                    width: "30px",
                    fontSize: "15px",
                    height: "30px",
                  }}
                >
                  <FaCartArrowDown
                    style={{
                      right: "8px",
                      bottom: "8px",
                      position: "relative",
                    }}
                  />
                </button>
              </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            style={{ color: "red" }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProductDiscountModal;
