import React, { useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Tooltip,
// } from "@mui/material";
import { Info } from "@mui/icons-material";
import ProductModal from "./Modal";
import { FaCartArrowDown } from "react-icons/fa";
import { COLUMNS } from "./columns-material";
import "./Cart.css";

const MaterialTable = () => {
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
    pageSize: 100,
  });

  const [cartItems, setCartItems] = useState([]);

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL("/parts/", "http://localhost:8000");
      //const url = new URL("/parts/", "https://kedifap-portal.com2go.co/");
      url.searchParams.set(
        "page",
        `${pagination.pageIndex}`,
      );
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      console.log(JSON.stringify(columnFilters), "columnFilters");
      console.log(url, "url");
      try {
        const response = await fetch(url.href);
        const json = await response.json();
        //https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_DISCOFFERS?$filter=DEXT_OFFERPARTNAME%20eq%20'AC2525'%20and%20ACTIVE%20eq%20'Y'%20and%20TODATE%20ge%202023-04-18T23:59:59%2B02:00
      
        
        setData(json.data);
        setRowCount(json.totalRows);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      //fetch discount
      const discountUrl = new URL("odata/Priority/tabula.ini/efk/B2B_DISCOFFERSB2B_DISCOFFERS?$filter=ACTIVE%20eq%20'Y'%20and%20TODATE%20ge%202023-04-18T23:59:59%2B02:00", "https://ked.priority-software.com.cy/");
      try {
        const discountResponse = await fetch(discountUrl.href);
        const discountJson = await discountResponse.json();
        console.log(data,'parts json');
        console.log(discountJson,'discountJson json');
      } catch (error) {
        
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const columns = useMemo(
    () =>
      COLUMNS.filter(
        (col) =>
          col.header === "Κωδικός" ||
          col.header === "Περιγραφή" ||
          col.header === "Απόθεμα" ||
          col.header === "ΧΤ" ||
          col.header === "ΛΤ"
      ),
    []
  );

  const [showCart, setShowCart] = useState(false);

  const [total, setTotal] = useState(0);

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };

  // const setTotal = (price) => {    
  //   const total = cartItems.reduce((acc, item) => acc + parseFloat(item.WSPLPRICE), parseFloat(price));
  //   return total;
  // };

  const handleAddToCart = (product) => {
    const { PARTNAME, WSPLPRICE } = product.original;
    product.original.quantity = 1;
    const found = cartItems.find((element) => element.PARTNAME == PARTNAME);
    if (found) {
      alert("Product is already in the cart!");
    } else {
      //const total = cartItems.reduce((acc, item) => acc + parseFloat(item.WSPLPRICE), parseFloat(price));
      console.log(cartItems,'cartItems');
      setTotal(cartItems.reduce((acc, item) => acc + parseFloat(item.WSPLPRICE)*item.quantity, parseFloat(WSPLPRICE)));

      setCartItems([...cartItems, product.original]);
      setShowCart(true);
    }
  };

  const removeItem = (product) => {
    console.log(product,'product');
    const updatedCart = cartItems.filter((item) => item.PARTNAME !== product.PARTNAME);
    setCartItems(updatedCart);

    setTotal(total - (parseFloat(product.WSPLPRICE)*parseFloat(product.quantity)));
  };

  const decrementQuantity = (item) => {
    
    if (item.quantity == 1) {
      removeItem(item);
    } else {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      const updatedCart = [
        ...cartItems.filter((i) => i.PARTNAME !== item.PARTNAME),
        updatedItem,
      ];
      setCartItems(updatedCart);
      setTotal(total - parseFloat(item.WSPLPRICE));
    }
  };

  const incrementQuantity = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    const updatedCart = [
      ...cartItems.filter((i) => i.PARTNAME !== item.PARTNAME),
      updatedItem,
    ];
    setCartItems(updatedCart);
    setTotal(total + parseFloat(item.WSPLPRICE));

  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
  };

  const [show, setShow] = useState(false);
  const [popupModalData, setPopupModalData] = useState({});
  const handleClose = () => setShow(false);

  const productPopup = (data, id) => {

    const rowSearch = data.find((result) => result.PARTNAME == id.PARTNAME);
    setShow(!show);
    setPopupModalData({
      code: rowSearch.PARTNAME,
      description: rowSearch.PARTDES,
      stock: rowSearch.availableQuantity,
      price: rowSearch.WSPLPRICE,
      vat: rowSearch.VATPRICE,
      distributer: rowSearch.SUPNAME,
      barcode: rowSearch.BARCODE,
      pharmaCode: rowSearch.SPEC14,
      supplier: rowSearch.SUPNAME,
    });
  };

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={data}
        initialState={{ showColumnFilters: true }}
        manualFiltering
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
          <div align="center">
            <button
              className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
              onClick={() => {
                handleAddToCart(row);
              }}
            >
              <FaCartArrowDown />
            </button>
            <Info
            style={{color: "#1f79d5",width: "50px", height: "50px"}}
              onClick={() => {
                productPopup(data , row.original);
              }}
            ></Info>
          </div>
        )}
      />
      <ProductModal
        show={show}
        handleClose={handleClose}
        popupModalData={popupModalData}
      />
      {/* add to cart */}
      <div>
        <button class="basket" onClick={handleCartClick}>
          Cart
        </button>
        {showCart && (
          <div class="cart-container">
            <div class="row">
              <div class="col">
                <h2 class="cart-title">Cart</h2>
              </div>
              <div class="col">
                <button class="close-icon" onClick={handleCartClose}></button>
              </div>
            </div>
            <ul class="cart-list">
              {cartItems.map((item, index) => (
                <li class="cart-item" key={index}>
                  <div class="cart-item-details">
                    <p class="cart-item-name">Code:{item.PARTNAME}</p>
                    <p class="cart-item-price">Price:{item.WSPLPRICE}</p>
                    <p class="cart-item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div class="cart-item-controls">
                    <button
                      class="cart-item-control-btn"
                      onClick={() => decrementQuantity(item)}
                    >
                      -
                    </button>
                    <button
                      class="cart-item-control-btn"
                      onClick={() => incrementQuantity(item)}
                    >
                      +
                    </button>
                    <button
                      class="cart-item-remove-btn"
                      onClick={() => removeItem(item)}
                    >
                      &times;
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="total-container">
              <p className="total-text">Total: {total.toFixed(2)}</p>
            </div>
            <button
              onClick={() => clearCart()}
              class="btn btn-danger cart-clear-btn"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MaterialTable;
