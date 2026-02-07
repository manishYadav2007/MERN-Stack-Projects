import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<h1>User Register Route</h1>} />
        <Route path="/user/login" element={<h1>User Login Route</h1>} />
        <Route
          path="/food-partner/register"
          element={<h1>Food Partner register</h1>}
        />
        <Route
          path="/food-partner/login"
          element={<h1>Food Partner Login</h1>}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
