
function caluclateMixMatch(productsInCart, setDiscountAmount) {
    let discountedAmount = 0;
    let discountLabel = [];
    console.log(productsInCart, "debug productsInCart ");

    const offerIdQuantities = productsInCart.reduce((quantities, item) => {
      const offerId = item.OFFERID;
      const quantity = item.quantity;

      if (!quantities[offerId]) {
        quantities[offerId] = 0;
      }

      quantities[offerId] += parseInt(quantity);

      return quantities;
    }, {});

    //check if the total quantities accumalted are bigger than the offer quantity
    productsInCart.forEach((item) => {
      const offerId = item.OFFERID;
      const offerQty = parseInt(item.OFFERQTY);

      console.log(offerQty, "debug offerQty 1");
      console.log(offerIdQuantities, "debug offerIdQuantities 1");
      if (item.DEXT_OFFERCODE == '4' && offerIdQuantities[offerId] >= offerQty) {
        
        discountLabel = {
          ...discountLabel,
          [item.PARTNAME]: item.OFFERDES,
        };
        // item.MIX_MATCH_DISCOUNTED = true;
        // console.log(item, "item that is mixed");
        discountedAmount +=
          (parseFloat(item.DISCOUNT) / 100) *
          parseFloat(item.WSPLPRICE) *
          parseInt(item.quantity);
      }
    });

    setDiscountAmount(discountedAmount);
    // return discountedAmount;
    return {
      discountedAmount: discountedAmount,
      discountLabel: discountLabel,
    };
  }

  export default caluclateMixMatch;