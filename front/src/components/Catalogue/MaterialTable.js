import React, { useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
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
    pageSize: 10,
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
      url.searchParams.set(
        "page",
        0
        //`${pagination.pageIndex * pagination.pageSize}`,
      );
      //   url.searchParams.set('size', `${pagination.pageSize}`);
      //   url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      //   url.searchParams.set('globalFilter', globalFilter ?? '');
      //   url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      console.log(url, "url");
      try {
        const response = await fetch(url.href);
        const json = await response.json();
        // const formatedData = json.data.map((fData) => {
        //     fData
        // })
        setData(json.data);
        //setRowCount(json.meta.totalRowCount);
        setRowCount(json.totalRows);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
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
console.log(data,'date');
  const columns1 = useMemo(
    () => [
      {
        accessorKey: "PARTNAME",
        header: "Κωδικός",
        Cell: ({ cell }) => (
          <button
            className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
            onClick={() => productPopup(cell.row.original)}
          >
            {data.map((column) => {
              console.log(column,'column');
          // <div key={column.id}>
          //     <input type="checkbox" {...column.getToggleHiddenProps()} />
          // </div>
      })}
          </button>
        ),
      },
    ],
    []
  );

  const columns2 = useMemo(
    () =>
      COLUMNS.filter(
        (col) =>
          col.Header === "Κωδικός" ||
          col.Header === "Περιγραφή" ||
          col.Header === "Απόθεμα" ||
          col.Header === "ΧΤ" ||
          col.Header === "ΛΤ"
      ),
    []
  );

  const columns3 = useMemo(
    () => [
      {
        accessorKey: "addToCart",
        header: "Add to cart",
        Cell: ({ cell }) => (
          <button
            className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
            onClick={() => {
              handleAddToCart(cell);
            }}
          >
            <FaCartArrowDown />
          </button>
        ),
      },
    ],
    []
  );

  const columns = [...columns1, ...columns2, ...columns3];

  //from DataTable/js
  const [showCart, setShowCart] = useState(false);
  const [popupModalData, setPopupModalData] = useState({});

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };
  //popup close
  const handleClose = () => setShow(false);

  const [show, setShow] = useState(false);

  const total = (price) => {
    const total = cartItems.reduce((acc, item) => acc + item.WSPLPRICE, price);
    return total;
  };

  const handleAddToCart = (product) => {
    console.log(cartItems, "cartItems before");
    const { PARTNAME, WSPLPRICE } = product.row.original;
    product.row.original.quantity = 1;
    const found = cartItems.find((element) => element.PARTNAME == PARTNAME);
    //if (found) {
      //alert("Product is already in the cart!");
    //} else {
      total(WSPLPRICE);

      setCartItems([...cartItems, product.row.original]);
      console.log(cartItems, "cartItems after");
      setShowCart(true);
    //}
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.name !== id);
    setCartItems(updatedCart);
  };

  const decrementQuantity = (item) => {
    if (item.quantity === 1) {
      removeItem(item);
    } else {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      const updatedCart = [
        ...cartItems.filter((i) => i.PARTNAME !== item.PARTNAME),
        updatedItem,
      ];
      setCartItems(updatedCart);
    }
  };

  const incrementQuantity = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    const updatedCart = [
      ...cartItems.filter((i) => i.PARTNAME !== item.PARTNAME),
      updatedItem,
    ];
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const productPopup = (id) => {
    const rowSearch = data.find((result) => result.PARTNAME == id.value);

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
        enableRowSelection
        getRowId={(row) => row.phoneNumber}
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
        //renderRowActions={renderRowActions}
      />
      {/* product pop info */}
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
                      onClick={() => removeItem(item.name)}
                    >
                      &times;
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="total-container">
              <p className="total-text">Total: {total}</p>
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
