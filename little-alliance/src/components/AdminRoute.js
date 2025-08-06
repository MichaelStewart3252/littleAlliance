import { Navigate } from "react-router-dom";

function AdminRoute({ user, children }) {
  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (!user.isAdmin) {
    // Not an admin
    return <div style={{ textAlign: "center", marginTop: "2rem", color: "#d32f2f" }}>
      Access denied. Admins only.
    </div>;
  }
  return children;
}

export default AdminRoute;
