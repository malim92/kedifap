var cartSession = (function () {
  var getItems = function () {
    const sessionCart = localStorage.getItem("kediCart")
      ? JSON.parse(localStorage.getItem("kediCart"))
      : [];
    return sessionCart;
  };

  var getTotal = function () {
    const sessionCartTotal = localStorage.getItem("kediCartTotal")
      ? JSON.parse(localStorage.getItem("kediCartTotal"))
      : [];
    return sessionCartTotal;
  };

  var setItems = function (updatedCart) {
    localStorage.setItem("kediCart", JSON.stringify(updatedCart));
  };

  var setTotal = function () {
    console.log("setTotal Y in discount");

    let sessionCartTotal = getTotal();
    const updatedCartTotal = [...sessionCartTotal, 1];
    localStorage.setItem("kediCartTotal", JSON.stringify(updatedCartTotal));
  };

  var addItem = function (item) {
    var allItems = getItems();
    allItems.push(item);
    setItems(allItems);
    return allItems;
  };

  var getSessionDiscount = function () {
    const sessionCartDiscount = localStorage.getItem("kediCartDiscount")
      ? JSON.parse(localStorage.getItem("kediCartDiscount"))
      : [];
    return sessionCartDiscount;
  };

  var setSessionDiscount = function (discount) {
    localStorage.setItem("kediCartDiscount", JSON.stringify(discount));
  };

  var setSessionQuantity = function (quantity) {
    console.log(quantity, "quantity in sessions");

    const existingData =
      JSON.parse(localStorage.getItem("kediCartQuantity")) || {};

    const updatedData = {
      ...existingData,
      quantity,
    };

    localStorage.setItem("kediCartQuantity", JSON.stringify(updatedData));
  };

  return {
    getItems: getItems,
    getTotal: getTotal,
    setItems: setItems,
    setTotal: setTotal,
    addItem: addItem,
    getSessionDiscount: getSessionDiscount,
    setSessionDiscount: setSessionDiscount,
    setSessionQuantity: setSessionQuantity,
  };
})();

export default cartSession;
