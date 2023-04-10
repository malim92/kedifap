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
        Header: "Ημ.Λήξης",
        accessor: 'DEXT_UDATE',
        Cell: ({value}) => { return format(new Date(value), 'dd/MM/yyyy')},
        disableGlobalFilter: true
    },
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
];