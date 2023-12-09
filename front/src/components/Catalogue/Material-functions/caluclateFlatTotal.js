function caluclateFlatTotal(allCartItems) {
  let flatTotal = 0;
  allCartItems.forEach((singleCartItem) => {
    flatTotal +=
      parseInt(singleCartItem.quantity) * parseFloat(singleCartItem.WSPLPRICE);
  });
  
  return flatTotal;
}

export default caluclateFlatTotal;