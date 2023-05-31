import MaterialTable from "../components/Catalogue/MaterialTable";
function ProductsTable({ isVendorName }) {
  return (
    <div>
      <h1 className="text-2xl py-4">Κατάλογος</h1>
      <MaterialTable isVendorName={isVendorName} />
    </div>
  );
}

export default ProductsTable;
