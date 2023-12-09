import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { BACKORDERS_COLUMNS } from "./columns-backorders";
import { FetchBackordersData } from "./Api/backorderApi";
import OrderProductsModal from "./ProductsModal";
import axios from "axios";

const BackordersTable = () => {
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

  //Modal state
  const [productShow, setProductShow] = useState(false);
  const [popupModalProduct, setPopupModalProduct] = useState({});

  const handleProductClose = () => setProductShow(false);

  useEffect(() => {
    FetchBackordersData(
      sorting,
      globalFilter,
      columnFilters,
      pagination,
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

  const columns = useMemo(() => BACKORDERS_COLUMNS, []);

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
      <OrderProductsModal
        show={productShow}
        popupModalProduct={popupModalProduct}
        handleClose={handleProductClose}
      />
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
                fetchOrderProducts(row);
              }}
              style={{
                fontSize: "15px",
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

export default BackordersTable;
