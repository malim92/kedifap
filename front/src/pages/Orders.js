import OrdersTable from "../components/Catalogue/OrdersTable";

function Orders() {
    return (
        <div>
            <h1 className="text-2xl py-4">Παραγγελίες</h1>
            <OrdersTable />
        </div>
    );
}

export default Orders;