import React, { useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import Cookies from "js-cookie";
import { Info } from "@mui/icons-material";
import PopupModal from "./Modal";
import CartPopupModal from "./CartPopupModal";
import DiscountModal from "./DiscountModal";
import { FaCartArrowDown, FaImage } from "react-icons/fa";
import { BiCartDownload } from "react-icons/bi";
import Viewer from "react-viewer";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { COLUMNS } from "./columns-material";
import { FetchPartsData } from "./partsApi";
import DATA from "./data.json";
import STOCK from "./stock.json";
import Cart from "./Cart-components/Cart";
import "./MaterialTable.css";

import { red } from "@mui/material/colors";
import { alpha, styled } from "@mui/material/styles";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: red[900],
    "&:hover": {
      backgroundColor: alpha(red[900], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: red[900],
  },
}));

const MaterialTable = ({ isVendorName }) => {
  //data and fetching state
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [cartItems, setCartItems] = useState([]);
  const [cartTemplate, setCartTemplate] = useState([]);

  const discountData = useMemo(() => DATA, []);
  const stockData = useMemo(() => STOCK, []);

  const [iconDisplay, setIconDisplay] = useState(["none"]);

  const [barcodeValue, setBarcodeValue] = useState("");
  const [discountedProducts, setDiscountedProducts] = useState("");
  const [supValue, setSupValue] = useState("");
  const [activeIngValue, setActiveIngValue] = useState("");
  const [quantityInputValue, setQuantityInputValue] = useState({});
  const [productQuantity, setProductQuantity] = useState({});

  const handleBarcodeChange = (event) => {
    setBarcodeValue(event.target.value);
  };

  const showDiscounted = (event) => {
    setDiscountedProducts(event.target.checked);
  };

  const handleSupplierChange = (event) => {
    setSupValue(event.target.value);
  };

  const handleActiveIngredientChange = (event) => {
    setActiveIngValue(event.target.value);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      FetchPartsData(
        sorting,
        globalFilter,
        columnFilters,
        pagination,
        discountData,
        stockData,
        setIconDisplay,
        setData,
        setRowCount,
        setIsError,
        barcodeValue,
        supValue,
        activeIngValue,
        discountedProducts,
        isVendorName
      );
    }, 1000);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    barcodeValue,
    supValue,
    activeIngValue,
    discountedProducts,
  ]);

  useEffect(() => {
    FetchPartsData(
      sorting,
      globalFilter,
      columnFilters,
      pagination,
      discountData,
      stockData,
      setIconDisplay,
      setData,
      setRowCount,
      setIsError,
      barcodeValue,
      supValue,
      activeIngValue,
      discountedProducts,
      isVendorName
    );
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const columns = useMemo(() => COLUMNS, []);

  const [showCart, setShowCart] = useState(false);

  const [total, setTotal] = useState(0);

  const handleAddToCart = (
    product,
    total,
    setQuantityInputValue,
    setProductQuantity,
    productQuantity
  ) => {
    let cartTotalPrice = total;
    const { PARTNAME, WSPLPRICE } = product.original;
    product.original.quantity = 1;
    const found = cartItems.find((element) => element.PARTNAME == PARTNAME);
    if (found) {
      alert("Product is already in the cart!");
    } else {
      cartTotalPrice += parseFloat(WSPLPRICE);
      setTotal(cartTotalPrice);
      setCartItems([...cartItems, product.original]);
      setShowCart(true);
      setQuantityInputValue({ ...quantityInputValue, [PARTNAME]: 1 });

      setProductQuantity({
        ...quantityInputValue,
        [PARTNAME]: 1,
      });
    }
  };

  const [show, setShow] = useState(false);
  const [discountShow, setDiscountShow] = useState(false);
  const [cartTemplateShow, setCartTemplateShow] = useState(false);
  const [popupModalData, setPopupModalData] = useState({});
  const [cartPopupModalData, setCartPopupModalData] = useState({});
  const [popupModalDiscount, setPopupModalDiscount] = useState({});
  const [visible, setVisible] = useState("false");
  const [activeIndex, setActiveIndex] = useState("0");
  const [discountLabel, setDiscountLabel] = useState({});
  const [freeQuantity, setFreeQuantity] = useState({});

  const handleClose = () => setShow(false);
  const handleDiscountClose = () => setDiscountShow(false);
  const handleCartTemplateClose = () => setCartTemplateShow(false);

  const productPopup = (data, id) => {
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
    });
  };

  const cartTemplatePopup = (cartTemplate) => {
    setCartTemplateShow(!cartTemplateShow);
    setCartPopupModalData(cartTemplate);
  };

  const discountPopup = (data, id) => {
    const rowSearch = data.find((result) => result.PARTNAME == id.PARTNAME);
    setDiscountShow(!discountShow);
    setPopupModalDiscount({ rowSearch });
  };

  const options = {
    filtering: true,
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };

  function caluclateFlatTotal(allCartItems) {
    let flatTotal = 0;
    allCartItems.forEach((singleCartItem) => {
      flatTotal +=
        parseInt(singleCartItem.quantity) *
        parseFloat(singleCartItem.WSPLPRICE);
    });
    return flatTotal;
  }

  function caluclateDiscount(productsInCart) {
    let totalDiscount = 0;
    let freeItems = [];
    let discountLabel = [];
    console.log(productsInCart, "productsInCart in discount");
    let applicableDiscount = null;
    productsInCart.forEach((singleCartItem) => {
      let applicableDiscount = null;
      //check if product has discount property
      if (singleCartItem.discounts) {
        singleCartItem.discounts.forEach((discount) => {
          //check if product quantity more than discount quantity
          if (
            parseInt(singleCartItem.quantity) >= parseInt(discount.OFFERQTY) &&
            (!applicableDiscount ||
              discount.OFFERQTY > applicableDiscount.OFFERQTY)
          ) {
            applicableDiscount = discount;
          }
        });
        //caluclating discount
        if (applicableDiscount !== null) {
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
        } else {
        }
      }
    });
    console.log(discountLabel, "discountLabel in table 1x");

    return {
      totalDiscount: totalDiscount,
      discountLabel: discountLabel,
      freeItems: freeItems,
    };
  }

  let images = [
    {
      src: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
      title: "image title 1",
    },
    {
      src: "https://images.unsplash.com/photo-1534628526458-a8de087b1123",
      title: "image title 2",
    },
  ];

  return (
    <>
      <div class="custom-filters">
        {/* <input
          type="text"
          id="filterInput"
          value={barcodeValue || ""}
          onChange={handleBarcodeChange}
          placeholder="Search for barcode..."
        /> */}
        {/* <div class="cart-template-row">
          <h4>
            Cart Templates
            <BiCartDownload
              style={{
                color: "#1f79d5",
                cursor: "pointer",
                fontSize: "40px",
                margin: "auto",
              }}
              onClick={() => {
                console.log(JSON.stringify(cartTemplate), " cartTemplate here");
                cartTemplatePopup(cartTemplate);
              }}
            ></BiCartDownload>
          </h4>
        </div> */}
        <FormControlLabel
          control={
            <MaterialUISwitch
              sx={{ m: 1 }}
              defaultUnchecked
              onChange={showDiscounted}
            />
          }
          label="Discounted products"
        />
        <input
          type="text"
          id="filterInput"
          value={supValue || ""}
          onChange={handleSupplierChange}
          placeholder="Search by supplier code..."
        />
        <input
          type="text"
          id="filterInput"
          value={activeIngValue || ""}
          onChange={handleActiveIngredientChange}
          placeholder="Search for Active Substance..."
        />
      </div>

      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 50,
          },
        }}
        columns={columns}
        data={data}
        initialState={{
          showColumnFilters: true,
          columnVisibility: {
            BARCODE: false,
            stock: false,
            SPEC19: true,
            SUPNAME: false,
            DEXT_IMPORTERNAME: false,
            DEXT_BRAND: true,
            SPEC1: false,
          },
        }}
        manualFiltering
        options={options}
        manualPagination
        manualSorting
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={rowCount}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          sorting,
        }}
        enableRowActions
        renderRowActions={({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {row.original.hasOwnProperty("discounts") && (
              <button
                className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                onClick={() => {
                  discountPopup(data, row.original);
                }}
                style={{
                  backgroundColor: "#db2d2d",
                  width: "30px",
                  fontSize: "15px",
                  height: "30px",
                }}
              >
                <FaCartArrowDown
                  style={{
                    right: "8px",
                    bottom: "8px",
                    position: "relative",
                  }}
                />
              </button>
            )}
            {/* else */}
            {!row.original.hasOwnProperty("discounts") && (
              <button
                className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                onClick={() => {
                  handleAddToCart(
                    row,
                    total,
                    setQuantityInputValue,
                    setProductQuantity,
                    productQuantity
                  );
                }}
                style={{
                  width: "30px",
                  fontSize: "15px",
                  height: "30px",
                }}
              >
                <FaCartArrowDown
                  style={{
                    right: "8px",
                    bottom: "8px",
                    position: "relative",
                  }}
                />
              </button>
            )}
            {/* {row.original.hasOwnProperty("discounts") && (
              <FcMoneyTransfer
                style={{
                  display: iconDisplay,
                  fontSize: "30px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  discountPopup(data, row.original);
                }}
              />
            )} */}
            <Info
              style={{
                color: "#1f79d5",
                cursor: "pointer",
                fontSize: "35px",
              }}
              onClick={() => {
                productPopup(data, row.original);
              }}
            ></Info>
            {row.original.IMGFILENAME !== null && (
              <FaImage
                style={{
                  color: "#1f79d5",
                  cursor: "pointer",
                  fontSize: "35px",
                }}
                onClick={() => {
                  console.log(row.original, "row.original.IMGFILENAM");

                  window.open(row.original.IMGFILENAME, "_blank");
                }}
                // onClick={() => {
                //   setVisible(true);
                //   console.log(row.original.IMGFILENAME, "image visible");
                // }}
              >
                <Viewer
                  visible={visible}
                  onClose={() => {
                    setVisible(false);
                  }}
                  images={images}
                />
              </FaImage>
            )}
          </div>
        )}
      />
      <CartPopupModal
        show={cartTemplateShow}
        handleClose={handleCartTemplateClose}
        cartPopupModalData={cartPopupModalData}
        cartItems={cartItems}
        setCartItems={setCartItems}
        setTotal={setTotal}
        setShowCart={setShowCart}
        quantityInputValue={quantityInputValue}
        setQuantityInputValue={setQuantityInputValue}
      ></CartPopupModal>
      <PopupModal
        show={show}
        handleClose={handleClose}
        popupModalData={popupModalData}
      />
      <DiscountModal
        show={discountShow}
        handleClose={handleDiscountClose}
        popupModalDiscount={popupModalDiscount}
        cartItems={cartItems}
        setCartItems={setCartItems}
        total={total}
        setTotal={setTotal}
        setShowCart={setShowCart}
        handleAddToCart={handleAddToCart}
        quantityInputValue={quantityInputValue}
        setQuantityInputValue={setQuantityInputValue}
        caluclateFlatTotal={caluclateFlatTotal}
        caluclateDiscount={caluclateDiscount}
        productQuantity={productQuantity}
        setProductQuantity={setProductQuantity}
        discountLabel={discountLabel}
        setDiscountLabel={setDiscountLabel}
        freeQuantity={freeQuantity}
        setFreeQuantity={setFreeQuantity}
      />
      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
        cartItems={cartItems}
        setCartItems={setCartItems}
        handleCartClose={handleCartClose}
        handleCartClick={handleCartClick}
        total={total}
        setTotal={setTotal}
        cartTemplate={cartTemplate}
        setCartTemplate={setCartTemplate}
        quantityInputValue={quantityInputValue}
        setQuantityInputValue={setQuantityInputValue}
        caluclateFlatTotal={caluclateFlatTotal}
        caluclateDiscount={caluclateDiscount}
        productQuantity={productQuantity}
        setProductQuantity={setProductQuantity}
        discountLabel={discountLabel}
        setDiscountLabel={setDiscountLabel}
        freeQuantity={freeQuantity}
        setFreeQuantity={setFreeQuantity}
        isVendorName={isVendorName}
      />
    </>
  );
};

export default MaterialTable;
