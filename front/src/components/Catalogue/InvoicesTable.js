import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MaterialReactTable from "material-react-table";
import FormControlLabel from "@mui/material/FormControlLabel";
import { INVOICE_COLUMNS } from "./columns-invoice";
import { FetchInvoiceData } from "./Api/invoiceApi";
import { pink, red } from "@mui/material/colors";
import { alpha, styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: red[900],
    "&:hover": {
      backgroundColor: alpha(red[900], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: red[900],
  },
}));

const MaterialUISwitchQuota = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink["A200"],
    "&:hover": {
      backgroundColor: alpha(pink["A200"], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: red[900],
  },
}));

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

  const [currentMonth, setCurrentMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);
  const [last4Months, setLast4Months] = useState(false);
  const [monthFilter, setmonthFilter] = useState(false);

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;

    // Update the state of the selected switch and turn off the others
    if (name === "currentMonth") {
      setCurrentMonth(checked);
      setLastMonth(false);
      setLast4Months(false);
    } else if (name === "lastMonth") {
      setLastMonth(checked);
      setCurrentMonth(false);
      setLast4Months(false);
    } else if (name === "last4Months") {
      setLast4Months(checked);
      setCurrentMonth(false);
      setLastMonth(false);
    }
    console.log(name, "name test");
    setmonthFilter(name);
  };

  useEffect(() => {
    FetchInvoiceData(
      sorting,
      globalFilter,
      columnFilters,
      // pagination,
      setData,
      setRowCount,
      setIsError,
      monthFilter,
      setIsLoading
    );
  }, [
    columnFilters,
    globalFilter,
    // pagination.pageIndex,
    // pagination.pageSize,
    sorting,
    monthFilter
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
      <div class="custom-filters">
        <FormControlLabel
          control={
            <MaterialUISwitch
              sx={{ m: 1 }}
              name="currentMonth"
              defaultUnchecked
              checked={currentMonth}
              onChange={handleSwitchChange}
            />
          }
          label="Current Month"
        />
        <FormControlLabel
          control={
            <MaterialUISwitchQuota
              sx={{ m: 1 }}
              defaultUnchecked
              name="lastMonth"
              checked={lastMonth}
              onChange={handleSwitchChange}
            />
          }
          label="Last Month"
        />
        <FormControlLabel
          control={
            <MaterialUISwitchQuota
              sx={{ m: 1 }}
              name="last4Months"
              defaultUnchecked
              checked={last4Months}
              onChange={handleSwitchChange}
            />
          }
          label="Last 4 Months"
        />
      </div>
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
                border: 'none',
                backgroundColor: row.original.IVNUM.includes('IN') ? '#0d6efd' : row.original.IVNUM.includes('CR') ? 'red' : row.original.IVNUM.includes('IK') ? 'red' : row.original.IVNUM.includes('SI') ? 'green' : ''
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
