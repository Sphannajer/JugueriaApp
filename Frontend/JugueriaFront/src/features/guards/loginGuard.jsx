import { isLogged } from "../../api/authService";
import { Navigate } from "react-router-dom";

const LoginGuard = ({ children }) => {
  if (isLogged()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default LoginGuard;
