
function caluclateMixMatch(productsInCart, setDiscountAmount) {
    let discountedAmount = 0;
    let discountLabel = [];
    console.log(productsInCart, "debug productsInCart ali");

    const offerIdQuantities = productsInCart.reduce((quantities, item) => {
      const offerId = item.OFFERID;
      const quantity = item.quantity;

      if (!quantities[offerId]) {
        quantities[offerId] = 0;
      }

      quantities[offerId] += parseInt(quantity);

      return quantities;
    }, {});

    //checl if the total quantities accumalted are bigger than the offer quantity
    productsInCart.forEach((item) => {
      const offerId = item.OFFERID;
      const offerQty = parseInt(item.OFFERQTY);

      if (item.DEXT_OFFERCODE == '4' && offerIdQuantities[offerId] >= offerQty) {
        
        console.log(offerIdQuantities, "debug offerIdQuantities ali");
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