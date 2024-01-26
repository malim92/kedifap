import React from "react";

const CartItems = ({
  discountLabel,
  quantityInputValue,
  handleQuantityChange,
  setQuantityInputValue,
  removeItem,
  item,
  index,
}) => (
  <li class="cart-item" key={index}>
    <div class="cart-item-details">
      <p class="cart-item-name">{item.PARTDES}</p>
      <p class="cart-item-name">Code: {item.PARTNAME}</p>
      <p class="cart-item-price">Price: {parseFloat(item.WSPLPRICE)}</p>
      {discountLabel[item.PARTNAME] !== undefined && (
        <p class="cart-item-discount">
          Discount: {discountLabel[item.PARTNAME]}
        </p>
      )}
    </div>
    <div class="cart-item-controls">
      <input
        type="number"
        value={quantityInputValue[item.PARTNAME] || 1}
        min={parseInt(item.DEXT_LOWSTOCKQTY) > 0 ? item.DEXT_LOWSTOCKQTY : 1}
        // max={item.stock}
        onChange={(e) =>
          handleQuantityChange(
            e.target.value,
            item,
            index,
            setQuantityInputValue
          )
        }
        style={{
          width: "50px",
          marginRight: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          padding: "5px",
          fontSize: "1rem",
          textAlign: "center",
        }}
      />
      <button class="cart-item-remove-btn" onClick={() => removeItem(item)}>
        &times;
      </button>
    </div>
  </li>
);

export default CartItems;
