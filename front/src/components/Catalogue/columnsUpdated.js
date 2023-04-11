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
        accessor: 'expiry_date',
        Cell: ({value}) => { return format(new Date(value), 'dd/MM/yyyy')},
        disableGlobalFilter: true
    },
    {
        Header: "Brand",
        accessor: 'brand',
        disableGlobalFilter: true
    },
    {
        Header: "Κατηγορία",
        accessor: 'category',
        disableGlobalFilter: true
    },
    {
        Header: "Δραστ. Ουσία",
        accessor: 'active_substance',
        disableGlobalFilter: true
    },
    {
        Header: "Κωδ. Φ/Υ",
        accessor: 'pharmacy_service_code',
        disableGlobalFilter: true
    },
];