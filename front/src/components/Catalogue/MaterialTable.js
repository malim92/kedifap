import React, { useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Info } from "@mui/icons-material";
import ProductModal from "./Modal";
import { FaCartArrowDown } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import { COLUMNS } from "./columns-material";
import { FetchPartsData } from "./partsApi";
import DATA from "./data.json";
import STOCK from "./stock.json";
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

  const discountData = useMemo(() => DATA, []);
  const stockData = useMemo(() => STOCK, []);

  const [iconDisplay, setIconDisplay] = useState(["none"]);

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
      setIsError
    );
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

  const handleAddToCart = (product) => {
    const { PARTNAME, WSPLPRICE } = product.original;
    product.original.quantity = 1;
    const found = cartItems.find((element) => element.PARTNAME == PARTNAME);
    if (found) {
      alert("Product is already in the cart!");
    } else {
      //const total = cartItems.reduce((acc, item) => acc + parseFloat(item.WSPLPRICE), parseFloat(price));
      setTotal(
        cartItems.reduce(
          (acc, item) => acc + parseFloat(item.WSPLPRICE) * item.quantity,
          parseFloat(WSPLPRICE)
        )
      );

      setCartItems([...cartItems, product.original]);
      setShowCart(true);
    }
  };

  const removeItem = (product) => {
    const updatedCart = cartItems.filter(
      (item) => item.PARTNAME !== product.PARTNAME
    );
    setCartItems(updatedCart);
    setProductQuantity(1);
    setTotal(
      total - parseFloat(product.WSPLPRICE) * parseInt(product.quantity)
    );
  };

  //const [productQuantity, setProductQuantity] = useState(1);
  const [productQuantity, setProductQuantity] = useState({});

  const handleQuantityChange = (event, item, index) => {
    //setProductQuantity(event);
    setProductQuantity((prevQuantities) => ({
      ...prevQuantities,
      [item.PARTNAME]: event,
    }));
    //const updatedItem = { ...item, quantity: event };
    //{PARTNAME: 'LP01059', PARTDES: 'NUROFEN 200MG 24TAB', SPEC19: 'ANXIOLYTIC', DEXT_NARCOTIC: '1', DEXT_ACTIVE: '1', …}BARCODE: "5000158103375"CUSTNAME: "For Labeling"DEXT_ACTIVE: "1"DEXT_BRAND: "RECKITT BENCKISER"DEXT_CMVO: "6"DEXT_CSPOLICYCODE: "NONE"DEXT_FRAGILE: nullDEXT_GHS: "1"DEXT_IMPORTERNAME: "V1059"DEXT_LIQUID: nullDEXT_NARCOTIC: "1"DEXT_PARTBARCODE: "KDLP01059"DEXT_SUPPOLICYCODE: "EXP"PARTDES: "NUROFEN 200MG 24TAB"PARTNAME: "LP01059"SPEC1: "IBUPROFEN"SPEC14: "8400598/2"SPEC19: "ANXIOLYTIC"SUPNAME: "V1057"UDATE: "2023-04-01"VATPRICE: "5.32"WSPLPRICE: "3.7"discounts: (5) [{…}, {…}, {…}, {…}, {…}]quantity: "19"stock: 4288[[Prototype]]: Object 'updatedItem 1 '
    const updatedItems = [...cartItems];
    console.log(updatedItems, "updatedItem 2 ");
    updatedItems[index] = { ...updatedItems[index], quantity: event };
    setCartItems(updatedItems);
    // const updatedCart = [
    //   ...cartItems.filter((i) => i.PARTNAME !== item.PARTNAME),
    //   updatedItems,
    // ];
    //setCartItems(updatedCart);
    //setProductQuantity(parseInt(event.target.value));
    let applicableDiscount = null;

    if (updatedItems.discounts) {
      updatedItems.discounts.forEach((discount) => {
        if (
          parseInt(updatedItems.quantity) + 1 >= discount.OFFERQTY &&
          (!applicableDiscount ||
            discount.OFFERQTY > applicableDiscount.OFFERQTY)
        ) {
          applicableDiscount = discount;
        }
      });
    }
    if (applicableDiscount) {
      let totalItemDiscount =
        (parseInt(updatedItems.quantity) * applicableDiscount.DISCOUNT) / 100;
      setTotal(total + parseFloat(updatedItems.WSPLPRICE) - totalItemDiscount);
    } else {
      let productPrice = parseFloat(updatedItems.WSPLPRICE);
      let totalCartItemPrice = 0;
      updatedItems.forEach((carItem) => {
        console.log(carItem, "carItem ");
        totalCartItemPrice +=
          parseFloat(carItem.WSPLPRICE) * parseInt(carItem.quantity);
      });
      //console.log(updatedCart, "updatedCart ");
      setTotal(totalCartItemPrice);
    }
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
    //const hasDiscount = item.discounts.some(discount => item.quantity >= discount.OFFERQTY);
    let applicableDiscount = null;

    if (item.discounts) {
      item.discounts.forEach((discount) => {
        if (
          item.quantity + 1 >= discount.OFFERQTY &&
          (!applicableDiscount ||
            discount.OFFERQTY > applicableDiscount.OFFERQTY)
        ) {
          applicableDiscount = discount;
        }
      });
    }
    if (applicableDiscount) {
      let totalItemDiscount =
        (item.quantity * applicableDiscount.DISCOUNT) / 100;
      setTotal(total + parseFloat(item.WSPLPRICE) - totalItemDiscount);
    } else setTotal(total + parseFloat(item.WSPLPRICE));
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    setProductQuantity(1);
  };

  const sendOrder = (order, cartTotal) => {
    console.log(order, 'order');
    console.log(cartTotal, 'cartTotal');
    setCartItems([]);
    setTotal(0);
    setProductQuantity(1);
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
            {row.original.hasOwnProperty("discounts") && (
              <button
                className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                onClick={() => {
                  handleAddToCart(row);
                }}
                style={{
                  backgroundColor: "#db2d2d",
                }}
              >
                <FaCartArrowDown />
              </button>
            )}
            {/* else */}
            {!row.original.hasOwnProperty("discounts") && (
              <button
                className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                onClick={() => {
                  handleAddToCart(row);
                }}
              >
                <FaCartArrowDown />
              </button>
            )}
            {row.original.hasOwnProperty("discounts") && (
              <FcMoneyTransfer
                style={{
                  display: iconDisplay,
                  fontSize: "30px",
                  transform: "translate(-75%, -10%)",
                }}
              />
            )}
            <Info
              style={{
                color: "#1f79d5",
                width: "50px",
                height: "50px",
                cursor: "pointer",
                float: "right",
              }}
              onClick={() => {
                productPopup(data, row.original);
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
                    {/* <p class="cart-item-quantity">Quantity: {item.quantity}</p> */}
                  </div>
                  <div class="cart-item-controls">
                    {/* <button
                      class="cart-item-control-btn"
                      onClick={() => decrementQuantity(item)}
                    >
                      -
                    </button> */}
                    <input
                      type="number"
                      value={productQuantity[item.PARTNAME] || 1}
                      min={1}
                      max={item.stock}
                      onChange={(e) =>
                        handleQuantityChange(e.target.value, item, index)
                      }
                      style={{
                        width: "50px",
                        marginRight: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        padding: "5px",
                        fontSize: "1rem",
                        textAlign: "center",
                      }}
                    />

                    {/* <button
                      class="cart-item-control-btn"
                      onClick={() => incrementQuantity(item)}
                    >
                      +
                    </button> */}
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
            
            <div class="d-flex justify-content-between">
            <button
              onClick={() => clearCart()}
              class="btn btn-danger cart-clear-btn"
            >
              Clear Cart
            </button>
              <button onClick={() => sendOrder(cartItems, total)} class="btn btn-primary">Send order</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MaterialTable;
