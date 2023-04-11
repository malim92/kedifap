<<<<<<< HEAD
import { useMemo } from "react";
=======
import { useMemo, useState  } from "react";
>>>>>>> kedifap/main
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
<<<<<<< HEAD
} from "react-table";
import DATA from "./dataUpdated.json";
// import getProducts from '../../apis/products';
import { COLUMNS } from "./columnsUpdated";
import { GoArrowSmallDown, GoArrowSmallUp, GoQuestion } from "react-icons/go";
import { FaCartArrowDown } from "react-icons/fa";
import { GlobalFilter } from "./GlobalFilter";

export const DataTable = () => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA, []);
=======
  useFilters,
} from "react-table";
import DATA from "./data.json";
import { COLUMNS } from "./columns";
import { GoArrowSmallDown, GoArrowSmallUp, GoQuestion } from "react-icons/go";
import { FaCartArrowDown } from "react-icons/fa";
import { GlobalFilter } from "./GlobalFilter";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ColumnFilter } from './columnFilters'

export const DataTable = () => {

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA, []);
  const [show, setShow] = useState(false);
  const [popupModalData, setPopupModalData] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const popup = (id) => {
    const rowSearch = data.find(result => result.code == id.value);
    setShow(!show)

    setPopupModalData({
      code: rowSearch.code,
      stock:rowSearch.availableQuantity,
      price:rowSearch.wholeSalePrice,
      vat:rowSearch.vatPercent,
      distributer:rowSearch.importerDescription,
      barcode:rowSearch.barcode,
      // pharmaCode:rowSearch.availableQuantity,
      // stockAnalysis:rowSearch.availableQuantity,
      // discount:rowSearch.availableQuantity,
    })
  }

  const defaultColumn = useMemo(
    () => ({
      Filter: ColumnFilter
    }),
    []
  )
>>>>>>> kedifap/main

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "addToCart",
        Header: "",
        disableGlobalFilter: true,
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
            onClick={() => console.log(row.values)}
          >
            <FaCartArrowDown />
          </button>
        ),
      },
    ]);
  };

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
<<<<<<< HEAD
    visibleColumns,
=======
    allColumns,
>>>>>>> kedifap/main
  } = useTable(
    {
      columns,
      data,
<<<<<<< HEAD
      initialState: { pageIndex: 0, pageSize: 100, hiddenColumns: ['brand', 'category', 'active_substance'] },
    },
=======
      defaultColumn,
      //initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
>>>>>>> kedifap/main
    useGlobalFilter,
    useSortBy,
    usePagination,
    tableHooks
  );

  const { globalFilter, pageIndex } = state;

  let start = Math.max(0, pageIndex - 5);
  let end = Math.min(pageCount, start + 6);
  let pageNumbers = Array.from(
    { length: end - start },
    (_, i) => i + start + 1
  );
<<<<<<< HEAD

  return (
    <>
=======
console.log(popupModalData.code,'test');
  return (
    <>

>>>>>>> kedifap/main
      <div className="pt-2 pb-6">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      </div>
      <div className="flex pb-4 gap-x-4 items-center">
        <span>Προβολή Στηλών: </span>
<<<<<<< HEAD
        {visibleColumns.map((column) => (
=======
        {allColumns.map((column) => (
>>>>>>> kedifap/main
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />
              {column.Header}
            </label>
          </div>
        ))}
      </div>
<<<<<<< HEAD
=======
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>Part Code: {popupModalData.code} </Modal.Body>
        <Modal.Body>Current Stock: {popupModalData.stock} </Modal.Body>
        <Modal.Body>Retail Price: {popupModalData.price} </Modal.Body>
        <Modal.Body>VAT Percentage: {popupModalData.vat} </Modal.Body>
        <Modal.Body>Distributer/Importer: {popupModalData.distributer} </Modal.Body>
        <Modal.Body>Package Barcode: {popupModalData.barcode} </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" style={{color: 'red'}}  onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
>>>>>>> kedifap/main
      <table {...getTableProps()} className="table-auto w-full shadow-xl">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="shadow-lg">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="cursor-pointer hover:bg-grey-100"
                >
<<<<<<< HEAD
                  <div className="flex items-center justify-between px-2">
                    {column.render("Header")}
                    {column.canSort ? (
                      column.isSorted ? (
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
                      )
                    ) : (
                      ""
=======
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
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
>>>>>>> kedifap/main
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
<<<<<<< HEAD
                  return (
                    <td {...cell.getCellProps()} className="p-3 border">
                      {cell.render("Cell")}
                    </td>
=======
                  //console.log('cell', cell.column.Header)
                  return (
                    cell.column.Header == 'Κωδικός' && (
                    <td {...cell.getCellProps()} className="p-3 border" onClick={() => popup(cell)}>
                      {cell.render("Cell")}
                    </td>) || (
                    <td {...cell.getCellProps()} className="p-3 border">
                      {cell.render("Cell")}
                    </td>
                    )

>>>>>>> kedifap/main
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
