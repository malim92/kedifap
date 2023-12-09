
const ProductPopup = (data, id, show, setShow, setPopupModalData) => {
    const rowSearch = data.find((result) => result.PARTNAME == id.PARTNAME);

    setShow(!show);
    setPopupModalData({
      code: rowSearch.PARTNAME,
      description: rowSearch.PARTDES,
      stock: rowSearch.stock,
      price: rowSearch.WSPLPRICE,
      priceVat: rowSearch.VATPRICE,
      vat: rowSearch.VATPRICE,
      distributer: rowSearch.SUPNAME,
      barcode: rowSearch.BARCODE,
      pharmaCode: rowSearch.SPEC14,
      supplier: rowSearch.DEXT_IMPORTERNAME,
      ghs: rowSearch.DEXT_GHS,
      fragile: rowSearch.DEXT_FRAGILE,
      liquid: rowSearch.DEXT_LIQUID,
      fridge: rowSearch.DEXT_FRAGILE,
      policy: rowSearch.DEXT_SUPPOLICYCODE,
      stock_object: rowSearch.stock_object,
    });
  };

  export default ProductPopup;
