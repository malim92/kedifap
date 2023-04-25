export const INVOICE_COLUMNS = [
    {
        header: 'Invoice Num',
        accessorKey: 'IVNUM',
        enableSorting: true,
    },
    {
        header: "Date",
        accessorKey: 'REQDATE',
    },
    {
        header: "PDF",
        accessorKey: 'APIPATH',
        enableColumnFilter: false,
        enableSorting: false,
        enableGlobalFilter: false,
        Cell: (props) => {
            return <a href={props.renderedCellValue} target="_blank">PDF Link</a>;
          }
    }
];