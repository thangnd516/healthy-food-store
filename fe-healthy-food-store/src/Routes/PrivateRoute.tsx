import { Navigate } from "react-router-dom";

const PrivateRoute = (props: any) => {
  const auth: any = localStorage.getItem("auth");
  if (!auth) return <Navigate to="/login" />;
  return <div>{props?.children}</div>;
};

export default PrivateRoute;
