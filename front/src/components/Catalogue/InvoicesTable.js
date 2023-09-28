import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MaterialReactTable from "material-react-table";
import { INVOICE_COLUMNS } from "./columns-invoice";
import { FetchInvoiceData } from "./invoiceApi";

const InvoicesTable = () => {
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
  // const [pagination, setPagination] = useState({
  //   pageIndex: 0,
  //   pageSize: 100,
  // });

  useEffect(() => {
    FetchInvoiceData(
      sorting,
      globalFilter,
      columnFilters,
      // pagination,
      setData,
      setRowCount,
      setIsError
    );
  }, [
    columnFilters,
    globalFilter,
    // pagination.pageIndex,
    // pagination.pageSize,
    sorting,
  ]);

  const columns = useMemo(() => INVOICE_COLUMNS, []);

  const fetchInvoice = async (product) => {
    console.log(product.original, "product");
    const pdfData = product.original.IVNUM;

    const url = new URL(
      `${process.env.REACT_APP_API_URL}/invoice-pdf?invoice_id=${pdfData}`
      //`http://localhost:8000/invoice-pdf?invoice_id=${pdfData}`
    );
    console.log(url, "url invoices");

    try {
      const response = await axios.get(url);
      console.log(response, "response invoices");
      const pdflink = response.data.APIPATH;
      window.open(pdflink, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        enablePagination={false}
        initialState={{ showColumnFilters: true }}
        manualFiltering
        // manualPagination
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
        // onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={rowCount}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          // pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          sorting,
        }}
        enableRowActions
        renderRowActions={({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                fetchInvoice(row);
              }}
              style={{
                fontSize: "15px",
              }}
            >
              Request Invoice
            </button>
          </div>
        )}
      />
    </>
  );
};

export default InvoicesTable;
