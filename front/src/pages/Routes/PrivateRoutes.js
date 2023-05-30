import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = ({ isAuthenticated }) => {


  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
