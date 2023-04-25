export const STATEMENTS_COLUMNS = [
    {
        header: 'Statement Num',
        accessorKey: 'ID',
    },
    {
        header: 'Customer Num',
        accessorKey: 'CUSTNAME2',
    },
    {
        header: 'Statement Name',
        accessorKey: 'CUSTDES',
    },
    {
        header: "Date",
        accessorKey: 'TIMESTAMP',
    },
    {
        header: "PDF",
        accessorKey: 'STMT_EXTFILENAME',
        enableColumnFilter: false,
        enableSorting: false,
        enableGlobalFilter: false,
        Cell: (props) => {
            return <a href={props.renderedCellValue} target="_blank">PDF Link</a>;
          }
    }
];