import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import { FaCartArrowDown } from "react-icons/fa";
import { COLUMNS } from "./columns-material";
import "./Cart.css";

const MaterialTable = () => {
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
    pageSize: 10,
  });

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL("/parts/", "http://localhost:8000");
      url.searchParams.set(
        "page",
        0
        //`${pagination.pageIndex * pagination.pageSize}`,
      );
      //   url.searchParams.set('size', `${pagination.pageSize}`);
      //   url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      //   url.searchParams.set('globalFilter', globalFilter ?? '');
      //   url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      console.log(url, "url");
      try {
        const response = await fetch(url.href);
        const json = await response.json();
        // const formatedData = json.data.map((fData) => {
        //     fData
        // })
        setData(json.data);
        //setRowCount(json.meta.totalRowCount);
        setRowCount(json.totalRows);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const columns1 = useMemo(
    () =>
      COLUMNS.filter(
        (col) =>
          col.Header === "Κωδικός" ||
          col.Header === "Περιγραφή" ||
          col.Header === "Απόθεμα" ||
          col.Header === "ΧΤ" ||
          col.Header === "ΛΤ"
      ),
    []
  );

  const columns2 = useMemo(
    () => [
      {
        accessorKey: "addToCart",
        header: "Add to cart",

        Cell: ({ cell }) => (
          <button className="bg-kedifapgreen-200 hover:bg-kedifapred-700 text-white p-3 rounded-3xl shadow-lg"
          onClick={() => {
            handleDelete(cell
            );
          }}
          >
            <FaCartArrowDown />
          </button>
        ),
      },
    ],
    []
  );

  const columns = [...columns1, ...columns2];
  const handleRowClick = (rowData) => {
    console.log("Clicked cell:", rowData.email);
  };

  //from DataTable/js
  const [showCart, setShowCart] = useState(false);

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };

  const handleDelete = (row) => {
    console.log(row,'test row');
  }

  const renderRowActions = (row) => {
    console.log('renderRowActions');
    return (
      <button onClick={() => handleDelete(row)}>Delete</button>
    );
  }
  

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={data}
        enableRowSelection
        getRowId={(row) => row.phoneNumber}
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
        renderRowActions={renderRowActions}
      />
      {/* add to cart */}
      <div>
        <button class="basket" onClick={handleCartClick}>
          Cart
        </button>
        {showCart && (
          <div class="cart-container">
            <div class="row">
              <div class="col">
                <h2 class="cart-title">Cart</h2>
              </div>
              <div class="col">
                <button class="close-icon" onClick={handleCartClose}></button>
              </div>
            </div>
            <ul class="cart-list">
              {/* {cartItems.map((item, index) => (
                <li class="cart-item" key={index}>
                  <div class="cart-item-details">
                    <p class="cart-item-name">Code:{item.PARTNAME}</p>
                    <p class="cart-item-price">Price:{item.WSPLPRICE}</p>
                    <p class="cart-item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div class="cart-item-controls">
                    <button
                      class="cart-item-control-btn"
                      onClick={() => decrementQuantity(item)}
                    >
                      -
                    </button>
                    <button
                      class="cart-item-control-btn"
                      onClick={() => incrementQuantity(item)}
                    >
                      +
                    </button>
                    <button
                      class="cart-item-remove-btn"
                      onClick={() => removeItem(item.name)}
                    >
                      &times;
                    </button>
                  </div>
                </li>
              ))} */}
            </ul>

            <div className="total-container">
              {/* <p className="total-text">Total: {total}</p> */}
            </div>
            <button
              //   onClick={() => clearCart()}
              class="btn btn-danger cart-clear-btn"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MaterialTable;
