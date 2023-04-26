export const COLUMNS = [
    {
        header: 'Κωδικός',
        accessorKey: 'PARTNAME',
        size: 5
    },
    {
        header: "Περιγραφή",
        accessorKey: 'PARTDES'
    },
    {
        header: "Απόθεμα",
        accessorKey: 'stock',
        enableColumnFilter: false
    },
    {
        header: "Bar Code",
        accessorKey: 'BARCODE',
    },
    {
        header: "ΧΤ",
        accessorKey: 'WSPLPRICE',
        enableColumnFilter:false,
        size: 20
    },
    {
        header: "ΛΤ",
        accessorKey: 'VATPRICE',
        enableColumnFilter:false,
        size: 20
    },
    {
        header: "Διανομέα",
        accessorKey: 'SUPNAME',
        show: false,
    },
    {
        header: "Αντιπρόσωπο",
        accessorKey: 'DEXT_IMPORTERNAME',
    },
    {
        header: "Brand",
        accessorKey: 'DEXT_BRAND',
    },
    {
        header: "Δραστική ουσία",
        accessorKey: 'SPEC1',
    },
    {
        header: "Κατηγορία",
        accessorKey: 'SPEC19',
    },
];