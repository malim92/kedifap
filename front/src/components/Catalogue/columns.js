import { format } from "date-fns";


export const COLUMNS = [
    {
        Header: 'Κωδικός',
        accessor: 'PARTNAME',
    },
    {
        Header: "Περιγραφή",
        accessor: 'PARTDES'
    },
    {
        Header: "Απόθεμα",
        accessor: 'availableQuantity',
        disableGlobalFilter: true
    },
    {
        Header: "Bar Code",
        accessor: 'BARCODE',
        disableGlobalFilter: true
    },
    // {
    //     Header: "Ημ.Λήξης",
    //     accessor: 'expiryDate',
    //     Cell: ({value}) => { return format(new Date(value), 'dd/MM/yyyy')},
    //     disableGlobalFilter: true
    // },
    {
        Header: "ΧΤ",
        accessor: 'WSPLPRICE',
        disableGlobalFilter: true
    },
    {
        Header: "ΛΤ",
        accessor: 'VATPRICE',
        disableGlobalFilter: true
    },
    {
        Header: "supplier",
        accessor: 'SUPNAME',
        disableGlobalFilter: true
    },
];