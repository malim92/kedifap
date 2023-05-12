import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = (isAuthenticated) => {
  return isAuthenticated.isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
