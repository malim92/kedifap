import React, { useState } from "react";
import './Cart.css'
import { FaCartArrowDown } from "react-icons/fa";

function Cart({ cartItems }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
        onClick={toggleCart}
      >
        <FaCartArrowDown />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-0 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.name} - ${item.price}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
