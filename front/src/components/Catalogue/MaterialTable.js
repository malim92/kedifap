import React, { useEffect, useMemo, useState, useCallback } from "react";
import MaterialReactTable from "material-react-table";
import { Info } from "@mui/icons-material";
import PopupModal from "./Modal";
import CartPopupModal from "./CartPopupModal";
import DiscountModal from "./DiscountModal";
import { FaCartArrowDown } from "react-icons/fa";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import ImageViewer from "react-simple-image-viewer";
import { Toaster } from "react-hot-toast";

import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { COLUMNS } from "./columns-material";
import { FetchPartsData } from "./Api/partsApi";
import Cart from "./Cart-components/Cart";
import "./MaterialTable.css";
import HandleAddToCart from "./Material-items/HandleAddToCart";
import ProductPopup from "./Material-items/ProductPopup";
import caluclateFlatTotal from "./Material-functions/caluclateFlatTotal";
import caluclateDiscount from "./Material-functions/caluclateDiscount";
import caluclateMixMatch from "./Material-functions/caluclateMixMatch";

import { pink, red } from "@mui/material/colors";
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
const MaterialUISwitchQuota = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink["A200"],
    "&:hover": {
      backgroundColor: alpha(pink["A200"], theme.palette.action.hoverOpacity),
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

  const [iconDisplay, setIconDisplay] = useState(["none"]);

  const [barcodeValue, setBarcodeValue] = useState("");
  const [discountedProducts, setDiscountedProducts] = useState(false);
  const [quotaProducts, setQuotaProducts] = useState(false);
  const [supValue, setSupValue] = useState("");
  const [activeIngValue, setActiveIngValue] = useState("");
  const [quantityInputValue, setQuantityInputValue] = useState({});
  const [productQuantity, setProductQuantity] = useState({});

  //image viewr
  const [currentImage, setCurrentImage] = useState("");
  const [tagetImage, setTargetImage] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [highlightStyle, setHighlightStyle] = useState([]);

  const openImageViewer = useCallback((index, imgSrc) => {
    setTargetImage(imgSrc);
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  const handleBarcodeChange = (event) => {
    setBarcodeValue(event.target.value);
  };

  const showDiscounted = (event) => {
    setDiscountedProducts(event.target.checked);
  };

  const showQuota = (event) => {
    console.log(event.target.checked, "test showQuota1");

    setQuotaProducts(event.target.checked);
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
        setIconDisplay,
        setData,
        setRowCount,
        setIsError,
        barcodeValue,
        supValue,
        activeIngValue,
        discountedProducts,
        quotaProducts,
        isVendorName,
        setIsLoading
      );
    }, 1000);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [columnFilters, globalFilter]);

  useEffect(() => {
    FetchPartsData(
      sorting,
      globalFilter,
      columnFilters,
      pagination,
      setIconDisplay,
      setData,
      setRowCount,
      setIsError,
      barcodeValue,
      supValue,
      activeIngValue,
      discountedProducts,
      quotaProducts,
      isVendorName,
      setIsLoading
    );
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    discountedProducts,
    quotaProducts,
  ]);

  const columns = useMemo(() => COLUMNS, []);

  const [showCart, setShowCart] = useState(false);

  const [total, setTotal] = useState(0);

  //custom state
  const [show, setShow] = useState(false);
  const [discountShow, setDiscountShow] = useState(false);
  const [cartTemplateShow, setCartTemplateShow] = useState(false);
  const [popupModalData, setPopupModalData] = useState({});
  const [cartPopupModalData, setCartPopupModalData] = useState({});
  const [popupModalDiscount, setPopupModalDiscount] = useState({});
  const [discountLabel, setDiscountLabel] = useState({});
  const [freeQuantity, setFreeQuantity] = useState({});
  const [discountAmount, setDiscountAmount] = useState(0);
  const [mixProgress, setMixProgress] = useState({
    0: { progress: 0, quantity: 0 },
  });
  const [selectedOffer, setSelectedOffer] = useState([]);

  const handleClose = () => setShow(false);
  const handleDiscountClose = () => setDiscountShow(false);
  const handleCartTemplateClose = () => setCartTemplateShow(false);

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

  return (
    <>
      <div class="custom-filters">
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
        <FormControlLabel
          control={
            <MaterialUISwitchQuota
              sx={{ m: 1 }}
              defaultUnchecked
              onChange={showQuota}
            />
          }
          label="Products with quota"
        />
        {/* <input
          type="text"
          id="filterInput"
          value={supValue || ""}
          onChange={handleSupplierChange}
          placeholder="Search by importer name..."
        />
        <input
          type="text"
          id="filterInput"
          value={activeIngValue || ""}
          onChange={handleActiveIngredientChange}
          placeholder="Search for Active Substance..."
        /> */}
        <p>
          Η ημερομηνία λήξης είναι πάντα η πιο κοντινή. Επιλέξτε{" "}
          <Info
            style={{
              color: "#1f79d5",
              cursor: "pointer",
              fontSize: "15px",
            }}
          />{" "}
          για να δείτε όλες τις ημερομηνίες λήξεις.
        </p>
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={[tagetImage]}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
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
            BARCODE: true,
            stock: true,
            SPEC19: true,
            SUPNAME: false,
            DEXT_IMPORTERNAME: false,
            DEXT_BRAND: false,
            SPEC1: false,
            expectedStock: isVendorName ? true : false,
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
            {row.original.hasOwnProperty("discounts") &&
              row.original.discounts.length > 0 && (
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
            {/* if no discount exist */}
            {(!row.original.hasOwnProperty("discounts") ||
              row.original.discounts.length === 0) && (
              <button
                className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                onClick={() => {
                  HandleAddToCart(
                    row,
                    total,
                    quantityInputValue,
                    setQuantityInputValue,
                    setProductQuantity,
                    cartItems,
                    setTotal,
                    setCartItems,
                    setShowCart
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
                ProductPopup(
                  data,
                  row.original,
                  show,
                  setShow,
                  setPopupModalData
                );
              }}
            ></Info>
            {row.original.IMGFILENAME !== null && (
              <>
                <div class={"thumbnail"}>
                  <ImageSearchIcon
                    onClick={() =>
                      openImageViewer(
                        row.original.PARTNAME,
                        row.original.IMGFILENAME
                      )
                    }
                    className="w-full rounded"
                    key={row.original.PARTNAME}
                    style={{
                      color: "#1f79d5",
                      cursor: "pointer",
                      fontSize: "35px",
                    }}
                  />
                </div>
              </>
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
        handleAddToCart={HandleAddToCart}
        quantityInputValue={quantityInputValue}
        setQuantityInputValue={setQuantityInputValue}
        caluclateFlatTotal={caluclateFlatTotal}
        caluclateDiscount={caluclateDiscount}
        setDiscountAmount={setDiscountAmount}
        productQuantity={productQuantity}
        setProductQuantity={setProductQuantity}
        discountLabel={discountLabel}
        setDiscountLabel={setDiscountLabel}
        freeQuantity={freeQuantity}
        setFreeQuantity={setFreeQuantity}
        caluclateMixMatch={caluclateMixMatch}
        highlightStyle={highlightStyle}
        setHighlightStyle={setHighlightStyle}
        mixProgress={mixProgress}
        setMixProgress={setMixProgress}
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
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
        setDiscountAmount={setDiscountAmount}
        productQuantity={productQuantity}
        setProductQuantity={setProductQuantity}
        discountLabel={discountLabel}
        setDiscountLabel={setDiscountLabel}
        freeQuantity={freeQuantity}
        setFreeQuantity={setFreeQuantity}
        isVendorName={isVendorName}
        caluclateMixMatch={caluclateMixMatch}
        discountAmount={discountAmount}
        highlightStyle={highlightStyle}
        setHighlightStyle={setHighlightStyle}
        mixProgress={mixProgress}
        setMixProgress={setMixProgress}
        setSelectedOffer={setSelectedOffer}
      />
      <Toaster />
    </>
  );
};

export default MaterialTable;
