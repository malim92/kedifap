export const COLUMNS = [
    
    {
        Header: "Περιγραφή",
        accessorKey: 'PARTDES'
    },
    {
        Header: "Απόθεμα",
        accessorKey: 'availableQuantity',
    },
    {
        Header: "Bar Code",
        accessorKey: 'BARCODE',
    },
    // {
    //     Header: "Ημ.Λήξης",
    //     accessorKey: 'expiryDate',
    //     Cell: ({value}) => { return format(new Date(value), 'dd/MM/yyyy')},
    // },
    {
        Header: "ΧΤ",
        accessorKey: 'WSPLPRICE',
    },
    {
        Header: "ΛΤ",
        accessorKey: 'VATPRICE',
        getCellProps: (row, columnName) => {
            console.log(columnName,'columnName');
            if (columnName === 'VATPRICE') {
              return {
                onClick: () => console.log('Clicked cell:', row[columnName]),
              };
            }
          },
    },
    {
        Header: "supplier",
        accessorKey: 'SUPNAME',
        
    },
];