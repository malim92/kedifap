import { toast } from "react-hot-toast";
import cartSession from "../Cart-components/cartSession";

const HandleAddToCart = (
  product,
  total,
  quantityInputValue,
  setQuantityInputValue,
  setProductQuantity,
  cartItems,
  setTotal,
  setCartItems,
  setShowCart
) => {
  let cartTotalPrice = total;
  const { PARTNAME, WSPLPRICE } = product.original;
  console.log(cartItems, "product.cartItems 2");
  // if (product.original.stock == 0) {
  //   alert("Sorry but the selected product dosn't have available stock!");
  //   return;
  // }

  const found = cartItems.find((element) => element.PARTNAME == PARTNAME);
  if (found) {
    toast.error("Product is already in the cart!");
  } else {
    if (parseInt(product.original.DEXT_LOWSTOCKQTY) > 0) {
      product.original.quantity = product.original.DEXT_LOWSTOCKQTY;
      setQuantityInputValue({
        ...quantityInputValue,
        [PARTNAME]: product.original.DEXT_LOWSTOCKQTY,
      });
      setProductQuantity({
        ...quantityInputValue,
        [PARTNAME]: product.original.DEXT_LOWSTOCKQTY,
      });
    } else {
      product.original.quantity = 1;
      setQuantityInputValue({ ...quantityInputValue, [PARTNAME]: 1 });
      setProductQuantity({
        ...quantityInputValue,
        [PARTNAME]: 1,
      });
    }

    cartTotalPrice +=
      parseFloat(WSPLPRICE) * parseInt(product.original.quantity);
    setTotal(cartTotalPrice);
    setCartItems([...cartItems, product.original]);
    setShowCart(true);

    const sessionCart = cartSession.getItems();

    console.log(sessionCart, "sessionCart sessions xxx");

    const updatedCart = [...sessionCart, product.original];

    cartSession.setItems(updatedCart);

    cartSession.setTotal(product);
    cartSession.setSessionQuantity(PARTNAME, product.original.quantity);

  }
};

export default HandleAddToCart;
