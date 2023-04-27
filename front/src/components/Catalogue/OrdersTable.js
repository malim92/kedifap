import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { ORDERS_COLUMNS } from "./columns-orders";
//import { FetchInvoiceData } from "./invoiceApi";
import ORDERSDATA from "./ordersData.json";

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

  const columns = useMemo(() => ORDERS_COLUMNS, []);
  const data = useMemo(() => ORDERSDATA.value, []);
  return (
    <>
      <MaterialReactTable
        // displayColumnDefOptions={{
        //   "mrt-row-actions": {
        //     muiTableHeadCellProps: {
        //       align: "center",
        //     },
        //     size: 120,
        //   },
        // }}
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
        // enableRowActions
        // renderRowActions={({ row }) => (
        //   <div align="center">
        //     <Info
        //       style={{
        //         color: "#1f79d5",
        //         width: "50px",
        //         height: "50px",
        //         cursor: "pointer",
        //         float: "right",
        //       }}
        //     ></Info>
        //   </div>
        // )}
      />
    </>
  );
};

export default InvoicesTable;
