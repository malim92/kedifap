import { format } from "date-fns";

export const COLUMNS = [
    {
        Header: 'Κωδικός',
<<<<<<< HEAD
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
=======
        accessor: 'PARTNAME',
    },
    {
        Header: "Περιγραφή",
        accessor: 'PARTDES'
    },
    {
        Header: "Ημ.Λήξης",
        accessor: 'DEXT_UDATE',
>>>>>>> kedifap/main
        Cell: ({value}) => { return format(new Date(value), 'dd/MM/yyyy')},
        disableGlobalFilter: true
    },
    {
<<<<<<< HEAD
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
=======
        Header: "ΧΤ",
        accessor: 'WSPLPRICE',
        disableGlobalFilter: true
    },
    {
        Header: "ΛΤ",
        accessor: 'VATPRICE',
>>>>>>> kedifap/main
        disableGlobalFilter: true
    },
];