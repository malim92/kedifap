import moment from "moment";

const now = moment();

export const COLUMNS = [
  {
    header: "Κωδικός",
    accessorKey: "PARTNAME",
    size: 5,
  },
  {
    header: "Περιγραφή",
    accessorKey: "PARTDES",
  },
  {
    header: "Απόθεμα",
    accessorKey: "stock",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    header: "Expected Stock",
    accessorKey: "expectedStock",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    header: "Bar Code",
    accessorKey: "BARCODE",
  },
  {
    header: "ΧΤ",
    accessorKey: "WSPLPRICE",
    enableColumnFilter: false,
    size: 20,
  },
  {
    header: "ΛΤ",
    accessorKey: "VATPRICE",
    enableColumnFilter: false,
    size: 20,
  },
  {
    header: "Διανομέας",
    accessorKey: "SUPNAME",
    show: false,
  },
  {
    header: "Αντιπρόσωπος",
    accessorKey: "DEXT_IMPORTERNAME",
  },
  {
    header: "Brand",
    accessorKey: "DEXT_BRAND",
  },
  {
    header: "Δραστική ουσία",
    accessorKey: "SPEC1",
  },
  {
    header: "Κατηγορία",
    accessorKey: "SPEC19",
  },
  {
    header: "Expiration Date*",
    accessorKey: "expiry",
    enableColumnFilter: false,
    enableSorting: false,
    Cell: ({ cell }) =>
      {
        const expiryDate = moment(cell.row.original.expiry, "DD-MM-YYYY");
        const monthsDifference = now.diff(expiryDate, "months");
        if (monthsDifference > -6) {
            return <p style={{color:"red", fontWeight:"700"}}>{cell.row.original.expiry}</p>
        } else {
            return <p style={{color:"green", fontWeight:"700"}}>{cell.row.original.expiry}</p>
        }
      },
  },
  {
    header: "Quota",
    accessorKey: "DEXT_LOWSTOCKQTY",
    enableColumnFilter: false,
    enableSorting: false,
  },
];
