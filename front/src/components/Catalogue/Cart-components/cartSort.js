import cartSession from "./cartSession";

const handleCartSortBy = (event, setSortBy) => {
  console.log(event, "event sort by");
  setSortBy(event.target.value);
  const allCartItems = cartSession.getItems();
  console.log(allCartItems, "item sort by");
  switch (event.target.value) {
    case "byDesc":
      const sortedData = [...allCartItems].sort((a, b) =>
        a.PARTDES.localeCompare(b.PARTDES)
      );
      cartSession.setItems(sortedData);
      console.log(sortedData, "sortedData sort by");

      break;
    case "byRecent":
      console.log("item sort byRecent");

      break;
    case "byValue":
      const sortedCartData = [...allCartItems].sort((a, b) => {
        const productA = a.quantity * parseFloat(a.WSPLPRICE);
        const productB = b.quantity * parseFloat(b.WSPLPRICE);
        return productA - productB;
      });
      cartSession.setItems(sortedCartData);
      break;

    default:
      break;
  }
};

export default handleCartSortBy;
