import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = ({ isAuthenticated }) => {


  console.log(isAuthenticated,'isAuthenticatedInternal in private');
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
