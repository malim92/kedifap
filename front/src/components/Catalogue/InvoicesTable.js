import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import axios from "axios";
import MaterialReactTable from "material-react-table";
import { INVOICE_COLUMNS } from "./columns-invoice";
//import { FetchInvoiceData } from "./invoiceApi";
import INVOICEDATA from "./invoiceData.json";

const InvoicesTable = () => {
  //data and fetching state
  //const [data, setData] = useState([]);
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

  useEffect(() => {
    // FetchInvoiceData(
    //   sorting,
    //   globalFilter,
    //   columnFilters,
    //   pagination,
    //   setData,
    //   setRowCount,
    //   setIsError
    // );
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const columns = useMemo(() => INVOICE_COLUMNS, []);
  //const data = useMemo(() => INVOICEDATA, []);
  const data = useMemo(() => {
    return INVOICEDATA.map((item) => ({
      ...item,
      IVDATE: moment(item.IVDATE).format("DD-MM-YYYY"),
    }));
  }, []);

  const fetchInvoice = async (product) => {
    console.log(product.original, "product");
    const data = {
      IVNUM: product.original.IVNUM,
    };

    const username = "apiuser";
    const password = "1234";
    const url =
      "https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/DEXT_APINVOS";
    const auth = {
      username: username,
      password: password,
    };
    try {
      const response = await axios.post(url, data, { auth: auth });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <MaterialReactTable
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
