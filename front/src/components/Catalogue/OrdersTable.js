import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { ORDERS_COLUMNS } from "./columns-orders";
import { FetchOrdersData } from "./Api/getOrderApi";
import axios from "axios";
import OrderProductsModal from './ProductsModal';
import { pink, red } from "@mui/material/colors";
import { alpha, styled } from "@mui/material/styles";

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

//https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_ORDERS?$filter=DEXT_SUBMISSIONDATE%20ge%202022-04-02T00:00:00%2B02:00%20and%20DEXT_SUBMISSIONDATE%20le%202022-04-27T23:59:59%2B02:00
const OrdersTable = () => {
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

  //filters states
  const [currentMonth, setCurrentMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);
  const [last4Months, setLast4Months] = useState(false);
  const [monthFilter, setmonthFilter] = useState(false);

  //Modal state
  const [productShow, setProductShow] = useState(false);
  const [popupModalProduct, setPopupModalProduct] = useState({});

  const handleProductClose = () => setProductShow(false);

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
    FetchOrdersData(
      sorting,
      globalFilter,
      columnFilters,
      pagination,
      setData,
      setRowCount,
      setIsError,
      monthFilter
    );
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    monthFilter
  ]);

  const columns = useMemo(() => ORDERS_COLUMNS, []);

  const fetchOrderProducts = async (order) => {
    const orderId = order.original.ORDNAME;
    
    const url = new URL(`${process.env.REACT_APP_API_URL}/backorder-products?order_id=${orderId}`);
    console.log(url, "url backorders");

    try {
      const response = await axios.get(url);
      console.log(response.data.value, "fetchOrderProducts 1");
      const ordersList = response.data.B2B_ORDERITEMS_SUBFORM.map((item) => ({
        ...item,
        PRICE: (parseFloat(item.PRICE) / 100).toFixed(2)
      }));
      setProductShow(!productShow);
      setPopupModalProduct({ ordersList });
      console.log(ordersList, "ordersList ");

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
    <OrderProductsModal
        show={productShow}
        popupModalProduct={popupModalProduct}
        handleClose={handleProductClose}
      />
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
        muiTableBodyProps={{
          sx: {
            '& tr:nth-of-type(odd)': {
              backgroundColor: '#f5f5f5',
            },
          },
        }}
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
          <div className="alix" style={{ display: "flex", alignItems: "center" }}>
            {console.log(row,'rowxx')}
            <button
              className="btn btn-primary"
              onClick={() => {
                fetchOrderProducts(row);
              }}
              style={{
                fontSize: "15px",
                border: 'none',
                backgroundColor: row.original.ORDSTATUSDES == 'Merged' ? '#000' : row.original.ORDSTATUSDES == 'Received' ? 'blue' : row.original.ORDSTATUSDES == 'Completed' ? 'green' : row.original.ORDSTATUSDES == 'Canceled' ? 'red' : row.original.ORDSTATUSDES == 'Pending' ? 'orange': ''
              }}
            >
              Products Details
            </button>
          </div>
        )}
      />
    </>
  );
};

export default OrdersTable;
