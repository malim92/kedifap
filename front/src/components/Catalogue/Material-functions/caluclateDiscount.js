function caluclateDiscount(productsInCart) {
  let totalDiscount = 0;
  let freeItems = [];
  let discountLabel = [];
  productsInCart.forEach((singleCartItem) => {
    let applicableDiscount = { OFFERQTY: -1 };
    //check if product has discount property
    console.log("ran disc discount 1", singleCartItem);

    if (singleCartItem.discounts) {
      singleCartItem.discounts.forEach((discount) => {
        //check if product quantity more than discount quantity
        console.log(discount, "discount dev 3");
        console.log(applicableDiscount, "applicableDiscount.quantity dev 3");
        if (
          parseInt(singleCartItem.quantity) >= parseInt(discount.OFFERQTY) &&
          parseInt(applicableDiscount.OFFERQTY) < parseInt(discount.OFFERQTY)
        ) {
          applicableDiscount = discount;
        }
      });
      //caluclating discount
      if (applicableDiscount !== null && applicableDiscount.OFFERQTY !== -1) {
        if (applicableDiscount.FREEQTY > 0) {
          freeItems = {
            ...freeItems,
            [singleCartItem.PARTNAME]: applicableDiscount.FREEQTY,
          };
        } else {
          let addedDiscountedUnit =
            ((singleCartItem.WSPLPRICE * applicableDiscount.DISCOUNT) / 100) *
            parseInt(singleCartItem.quantity);
          //if there's applicable discount apply it
          console.log(applicableDiscount, "applicableDiscount 1x");
          totalDiscount += addedDiscountedUnit;
        }
        discountLabel = {
          ...discountLabel,
          [singleCartItem.PARTNAME]: applicableDiscount.OFFERDES,
        };
        console.log(applicableDiscount, "applicableDiscount 2x");
      }
    }
  });
  console.log(totalDiscount, "totalDiscount xx 1x");

  return {
    totalDiscount: totalDiscount,
    discountLabel: discountLabel,
    freeItems: freeItems,
  };
}

export default caluclateDiscount;
