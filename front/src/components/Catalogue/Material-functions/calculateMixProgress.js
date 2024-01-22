function CalculateMixTotal(mixProgress, setMixProgress, cartItem, product) {
  console.log(cartItem, "cartItem in CalculateMixTotal");
  console.log(product, "product in CalculateMixTotal");

  if (product.DEXT_OFFERCODE !== "4") return;

  if (mixProgress > 100) {
    console.log(mixProgress, "mixProgress > 100 ");
    setMixProgress(100);
  } else {
    console.log(mixProgress, "mixProgress in else ");
    product.quantity
      ? setMixProgress((parseInt(product.quantity) * 100) / product.OFFERQTY)
      : setMixProgress(100 / product.OFFERQTY);
  }
}

export default CalculateMixTotal;