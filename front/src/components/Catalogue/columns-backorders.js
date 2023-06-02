export const BACKORDERS_COLUMNS = [
    {
        header: 'Order Num',
        accessorKey: 'ORDNAME',
        enableSorting: true,
    },
    {
        header: "Submission Date",
        accessorKey: 'DEXT_SUBMISSIONDATE',
        enableColumnFilter: false
    },
    {
        header: "Total Amount",
        accessorKey: 'TOTPRICE',
        enableColumnFilter: false
    },
    {
        header: "Quantity",
        accessorKey: 'TOTQUANT',
        enableColumnFilter: false

    },
];