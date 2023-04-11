import { format } from "date-fns";

export const COLUMNS = [
    {
        Header: 'Κωδικός',
        accessor: 'code',
    },
    {
        Header: "Περιγραφή",
        accessor: 'description'
    },
    {
        Header: "Απόθεμα",
        accessor: 'availableQuantity',
        disableGlobalFilter: true
    },
    {
        Header: "Ημ.Λήξης",
        accessor: 'expiryDate',
        Cell: ({value}) => { return format(new Date(value), 'dd/MM/yyyy')},
        disableGlobalFilter: true
    },
    {
        Header: "ΧΤ",
        accessor: 'wholeSalePrice',
        disableGlobalFilter: true
    },
    {
        Header: "ΛΤ",
        accessor: 'retailPrice',
        disableGlobalFilter: true
    },
];