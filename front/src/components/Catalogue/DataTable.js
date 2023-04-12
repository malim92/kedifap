import { useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useFilters,
} from "react-table";
import DATA from "./data.json";
import { COLUMNS } from "./columns";
import { GoArrowSmallDown, GoArrowSmallUp, GoQuestion } from "react-icons/go";
import { FaCartArrowDown } from "react-icons/fa";
import { GlobalFilter } from "./GlobalFilter";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ColumnFilter } from "./columnFilters";
import "./Cart.css";
import Cart from "./Cart";

export const DataTable = () => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    console.log(product.name, "name");
    console.log(product.name.WSPLPRICE, "price");
    const found = cartItems.find((element) => element.PARTNAME == product.name.PARTNAME);
    if (found) {
      alert("Product is already in the cart!");
    } else {
      total(product.name.WSPLPRICE);
      setCartItems([...cartItems, product.name]);
      setShowCart(true);
    }
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleCartOpen = () => {
    setShowCart(true);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };

  const columns = useMemo(
    () =>
      // Filter the columns array to only include the columns you want to display
      COLUMNS.filter(
        (col) =>
          col.Header === "Κωδικός" ||
          col.Header === "Περιγραφή" ||
          col.Header === "Απόθεμα" ||
          col.Header === "ΧΤ" ||
          col.Header === "ΛΤ" ||
          col.Header === "Add to cart"
      ),
    []
  );
  const data = useMemo(() => DATA, []);
  const [show, setShow] = useState(false);
  const [popupModalData, setPopupModalData] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.name !== id);
    setCartItems(updatedCart);
  };

  const total = (price) => {
    console.log(price, "price");
    const total = cartItems.reduce((acc, item) => acc + item.WSPLPRICE, price);
    console.log(total, "total");
    return total;
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
      // stockAnalysis:rowSearch.availableQuantity,
      // discount:rowSearch.availableQuantity,
    });
  };

  const defaultColumn = useMemo(
    () => ({
      Filter: ColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    prepareRow,
    state,
    setGlobalFilter,
    allColumns,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      //initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  let start = Math.max(0, pageIndex - 5);
  let end = Math.min(pageCount, start + 6);
  let pageNumbers = Array.from(
    { length: end - start },
    (_, i) => i + start + 1
  );

  return (
    <>
      {/* add to cart */}
      <div>
        <button className="basket" onClick={handleCartClick}>
          Cart
        </button>

        {showCart && (
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "300px",
              height: "100%",
              background: "#fff",
              zIndex: 999,
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              overflowY: "scroll",
            }}
          >
            <div className="row">
              <div className="col">
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Cart</h2>
              </div>
              <div
                className="col"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  className="close-icon"
                  onClick={handleCartClose}
                ></button>
              </div>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    {/* <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    /> */}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      {item.PARTNAME}
                    </p>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      {item.WSPLPRICE}
                    </p>
                    <p style={{ fontSize: "1rem", margin: 0 }}>{item.price}</p>
                  </div>
                  <div>
                    <button
                      onClick={
                        () => removeItem(item.name)
                        //console.log(item.name,'item')
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                        fontSize: "1.5rem",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                </li>
              )
              )}
            </ul>
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: "20px",
                textAlign: "right",
              }}
            >
              Total: {total}
            </p>
            <button
              onClick={() => clearCart()}
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
                fontSize: "1rem",
                marginTop: "20px",
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
      <div className="pt-2 pb-6">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      </div>
      <div className="flex pb-4 gap-x-4 items-center">
        <span>Προβολή Στηλών: </span>
        {allColumns.map((column) => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />
              {column.Header}
            </label>
          </div>
        ))}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>Part Code: {popupModalData.code} </Modal.Body>
        <Modal.Body>Part Description: {popupModalData.description} </Modal.Body>
        <Modal.Body>Current Stock: {popupModalData.stock} </Modal.Body>
        <Modal.Body>Retail Price: {popupModalData.price} </Modal.Body>
        <Modal.Body>VAT Percentage: {popupModalData.vat} </Modal.Body>
        <Modal.Body>
          Distributer/Importer: {popupModalData.distributer}
        </Modal.Body>
        <Modal.Body>Package Barcode: {popupModalData.barcode} </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            style={{ color: "red" }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <table {...getTableProps()} className="table-auto w-full shadow-xl">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="shadow-lg">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="cursor-pointer hover:bg-grey-100"
                >
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                  <div className="flex items-center justify-between px-2">
                    {column.render("Header")}

                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <GoArrowSmallDown />
                      ) : (
                        <GoArrowSmallUp />
                      )
                    ) : (
                      <div>
                        <GoArrowSmallUp />
                        <GoArrowSmallDown />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    (cell.column.Header == "Κωδικός" && (
                      <td
                        {...cell.getCellProps()}
                        className="p-3 border"
                        onClick={() => productPopup(cell)}
                      >
                        {cell.render("Cell")}
                      </td>
                    )) ||
                    (cell.column.Header == "Add to cart" && (
                      <td {...cell.getCellProps()} className="p-3 border">
                        <button
                          className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
                          onClick={() => {
                            handleAddToCart({ name: row.values }
                              //{ price: row.values.WSPLPRICE }
                              );
                          }}
                        >
                          <FaCartArrowDown />
                        </button>
                      </td>
                    )) || (
                      <td {...cell.getCellProps()} className="p-3 border">
                        {cell.render("Cell")}
                      </td>
                    )
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="my-10 flex items-center justify-between">
        <div className="flex space-x-3 bg-kedifapgreen-100 rounded-2xl px-4 py-1">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          <ul className="flex space-x-2">
            {pageNumbers.map((number) => (
              <li key={number}>
                <button
                  onClick={() => gotoPage(number - 1)}
                  className={`${
                    number - 1 === pageIndex
                      ? "bg-kedifapgreen-200 rounded text-white px-2"
                      : ""
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
            <li>
              ...
              <button onClick={() => gotoPage(pageOptions.length - 1)}>
                {pageOptions.length}
              </button>
            </li>
          </ul>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
        </div>
        <div className="relative flex items-center">
          <span className="absolute p-4 bg-gray-200 rounded-full left-[-30px]">
            <GoQuestion className="text-gray-500" />
          </span>
          <button className="bg-gray-200 px-5 py-1 rounded-2xl shadow-lg">
            Βοήθεια...
          </button>
        </div>
      </div>
    </>
  );
};
