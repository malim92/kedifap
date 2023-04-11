import { useMemo, useState  } from "react";
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
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ColumnFilter } from './columnFilters'
import './style/dataTable.css';

export const DataTable = () => {

  const columns = useMemo(
    () =>
      // Filter the columns array to only include the columns you want to display
      COLUMNS.filter(
        (col) => col.Header === "Κωδικός" || col.Header === "Περιγραφή" || col.Header === "Απόθεμα" || col.Header === "ΧΤ"  || col.Header === "ΛΤ" 
      ),
    []
  );
  const data = useMemo(() => DATA, []);
  const [show, setShow] = useState(false);
  const [popupModalData, setPopupModalData] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const productPopup = (id) => {
    const rowSearch = data.find(result => result.PARTNAME == id.value);
    setShow(!show)
    //console.log(rowSearch,'rowSearch');
    setPopupModalData({
      code: rowSearch.PARTNAME,
      description: rowSearch.PARTDES,
      stock:rowSearch.availableQuantity,
      price:rowSearch.WSPLPRICE,
      vat:rowSearch.VATPRICE,
      distributer:rowSearch.importerDescription,
      barcode:rowSearch.BARCODE,
      pharmaCode:rowSearch.SPEC14,
      supplier:rowSearch.SUPNAME,
      
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
console.log(popupModalData.code,'test');
  return (
    <>

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
        <Modal.Body>Distributer/Importer: {popupModalData.distributer} </Modal.Body>
        <Modal.Body>Package Barcode: {popupModalData.barcode} </Modal.Body>
        <Modal.Body>Pharma Service Code: {popupModalData.pharmaCode} </Modal.Body>
        <Modal.Body>Supplier: {popupModalData.supplier} </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" style={{color: 'red'}}  onClick={handleClose}>
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
                  //console.log('cell', cell.column.Header)
                  return (
                    cell.column.Header == 'Κωδικός' && (
                    <td {...cell.getCellProps()} className="p-3 border" onClick={() => productPopup(cell)}>
                      <div className="sm-containter click-box">{cell.render("Cell")} </div>
                    </td>) || (
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
