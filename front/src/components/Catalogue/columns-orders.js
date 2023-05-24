export const ORDERS_COLUMNS = [
    {
        header: 'Order Num',
        accessorKey: 'ORDNAME',
        enableSorting: true,
        enableColumnFilter: true
    },
    
    {
        header: "Order Status",
        accessorKey: 'ORDSTATUSDES',
        enableColumnFilter: false,
        enableSorting: false,
    },
    {
        header: "Total Amount",
        accessorKey: 'TOTPRICE',
        enableColumnFilter: false,
        enableSorting: false,
    },
    {
        header: "Quantity",
        accessorKey: 'TOTQUANT',
        enableSorting: false,
        enableColumnFilter: false,

    },
    {
        header: "Submission Date",
        accessorKey: 'DEXT_SUBMISSIONDATE',
        enableColumnFilter: false,
        enableSorting: false,

    },
];