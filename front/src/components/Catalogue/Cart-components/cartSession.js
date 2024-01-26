var cartSession = (function () {
  var init = function () {
    localStorage.setItem("kediCart", []);
    localStorage.setItem("kediCartTotal", []);
    localStorage.setItem("kediCartDiscount", 0);
    localStorage.setItem("kediCartQuantity", 0);
    localStorage.setItem("kediCartDiscountLabel", []);
    localStorage.setItem("kediCartFreeQuantity", []);
  };
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
    console.log(updatedCart, "updatedCart sess");

    localStorage.setItem("kediCart", JSON.stringify(updatedCart));
  };

  var setTotal = function () {
    let sessionCartTotal = getTotal();
    const updatedCartTotal = [...sessionCartTotal, 1];
    localStorage.setItem("kediCartTotal", JSON.stringify(updatedCartTotal));
  };

  var reduceTotal = function () {
    let sessionCartTotal = getTotal();
    sessionCartTotal.pop();
    localStorage.setItem("kediCartTotal", JSON.stringify(sessionCartTotal));
  };

  var addItem = function (item) {
    var allItems = getItems();
    allItems.push(item);
    setItems(allItems);
    return allItems;
  };

  var getSessionDiscount = function () {
    const existingDataRaw = localStorage.getItem("kediCartDiscount");
    const sessionCartDiscount = existingDataRaw
      ? JSON.parse(existingDataRaw)
      : 0;

    return sessionCartDiscount;
  };

  var setSessionDiscount = function (discount) {
    localStorage.setItem("kediCartDiscount", JSON.stringify(discount));
  };

  var getSessionQuantity = function () {
    const sessionCartQuantity = localStorage.getItem("kediCartQuantity")
      ? JSON.parse(localStorage.getItem("kediCartQuantity"))
      : [];

    return sessionCartQuantity;
  };

  var setSessionQuantity = function (productId, quantity) {
    const existingData =
      JSON.parse(localStorage.getItem("kediCartQuantity")) || {};

    const updatedData = {
      ...existingData,
      [productId]: quantity,
    };

    localStorage.setItem("kediCartQuantity", JSON.stringify(updatedData));
  };

  var removeSessionProductQuantity = function (productId) {
    const existingData =
      JSON.parse(localStorage.getItem("kediCartQuantity")) || {};
    delete existingData[productId];

    localStorage.setItem("kediCartQuantity", JSON.stringify(existingData));
  };

  var getSessionDiscountLabel = function () {
    const sessionCartDiscountLabel = localStorage.getItem(
      "kediCartDiscountLabel"
    )
      ? JSON.parse(localStorage.getItem("kediCartDiscountLabel"))
      : [];

    return sessionCartDiscountLabel;
  };

  var setSessionDiscountLabel = function (productId, discountData) {
    const existingData =
      JSON.parse(localStorage.getItem("kediCartDiscountLabel")) || {};

    const updatedData = {
      ...existingData,
      [productId]: discountData.discountLabel[productId],
    };

    localStorage.setItem("kediCartDiscountLabel", JSON.stringify(updatedData));
  };

  var getSessionFreeQuantity = function () {
    const sessionCartFreeQuantity = localStorage.getItem("kediCartFreeQuantity")
      ? JSON.parse(localStorage.getItem("kediCartFreeQuantity"))
      : [];

    return sessionCartFreeQuantity;
  };

  var setSessionFreeQuantity = function (productId, discountData) {
    const existingData = getSessionFreeQuantity();
    const updatedData = {
      ...existingData,
      [productId]: discountData,
    };
    console.log(existingData, "existing freeData in sessions");
    localStorage.setItem("kediCartFreeQuantity", JSON.stringify(updatedData));
  };

  var removeSessionFreeQuantity = function (productId) {
    const existingData = getSessionFreeQuantity();
    delete existingData[productId];

    console.log(existingData, "existing freeData in sessions");
    localStorage.setItem("kediCartFreeQuantity", JSON.stringify(existingData));
  };

  var getSessionHighlight = function () {
    const sessionCart = localStorage.getItem("kediCartHighlight")
      ? JSON.parse(localStorage.getItem("kediCartHighlight"))
      : [];
    return sessionCart;
  };
  var setSessionHighlight = function (highlightStyle) {
    localStorage.setItem("kediCartHighlight", JSON.stringify(highlightStyle));
  };

  return {
    init: init,
    getItems: getItems,
    getTotal: getTotal,
    setItems: setItems,
    setTotal: setTotal,
    reduceTotal: reduceTotal,
    addItem: addItem,
    getSessionDiscount: getSessionDiscount,
    setSessionDiscount: setSessionDiscount,
    getSessionQuantity: getSessionQuantity,
    setSessionQuantity: setSessionQuantity,
    removeSessionProductQuantity: removeSessionProductQuantity,
    getSessionDiscountLabel: getSessionDiscountLabel,
    setSessionDiscountLabel: setSessionDiscountLabel,
    getSessionFreeQuantity: getSessionFreeQuantity,
    setSessionFreeQuantity: setSessionFreeQuantity,
    removeSessionFreeQuantity: removeSessionFreeQuantity,
    getSessionHighlight: getSessionHighlight,
    setSessionHighlight: setSessionHighlight,
  };
})();

export default cartSession;
