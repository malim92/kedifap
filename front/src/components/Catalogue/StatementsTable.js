import React, { useEffect, useMemo, useState } from "react";
import moment from 'moment';
import MaterialReactTable from "material-react-table";
import { STATEMENTS_COLUMNS } from "./columns-statements";
//import { FetchInvoiceData } from "./invoiceApi";
import STATEMENTSDATA from "./statementsData.json";

const StatementsTable = () => {
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

  const columns = useMemo(() => STATEMENTS_COLUMNS, []);
  const data = useMemo(() => {
    return STATEMENTSDATA.map(item => ({
      ...item,
      TIMESTAMP: moment(item.TIMESTAMP).format('DD-MM-YYYY')
    }));
  }, []);
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
      />
    </>
  );
};

export default StatementsTable;
