
import { Navigate } from "react-router-dom";

// Redirect from /index to the home page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
