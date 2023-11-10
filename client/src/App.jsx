import { Routes, Route, Navigate } from "react-router-dom";
import SignInForm from "./components/SignIn/SignInForm";
import SignUpForm from "./components/SignUp/SignUpForm";
import About from "./components/About/About";
import Home from "./components/Home/Home";
import MainPage from "./components/MainPage";
import Menu from "./components/Menu/Menu";
import Contact from "./components/Contact/Contact";
import ClientDashboard from "./components/Dashboard/ClientDashboard";
import OrderCreation from "./components/OrderCreation/OrderCreation";
import GetOrders from "./components/OrderCreation/GetOrders/GetOrders";
import ManageUsers from "./Admin/ManageUsers/ManageUsers";
import DailyMenu from "./Admin/DailyMenu/DailyMenu";
import CreateTeam from "./Admin/ManageTeams/CreateTeam";
import ManageOrders from "./Admin/ManageOrders/ManageOrders";
import CustomerSupport from "./Admin/CustomerSupport/CustomerSupport";
import MainAdminHome from "./Admin/MainAdminHome";
import ResolvedQueries from "./components/Contact/ResolvedQueries/ResolvedQueries";
import Analytics from "./Admin/Analytics/Analytics";

function App() {
  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole");

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="order" element={<OrderCreation />} />
          <Route path="order/getOrder" element={<GetOrders />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="contact" element={<Contact userRole={userRole} />} />
          <Route path="contact/resolvequery" element={<ResolvedQueries />} />
        </Route>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />

        <Route path="/admin" element={<MainAdminHome />}>
          <Route
            path="/admin"
            element={
              userRole === "admin" ? <ManageUsers /> : <Navigate to="/" />
            }
          />
          <Route
            path="menu"
            element={userRole === "admin" ? <DailyMenu /> : <Navigate to="/" />}
          />
          <Route
            path="teams"
            element={
              userRole === "admin" ? <CreateTeam /> : <Navigate to="/" />
            }
          />
          <Route
            path="orders"
            element={
              userRole === "admin" ? <ManageOrders /> : <Navigate to="/" />
            }
          />
          <Route
            path="support"
            element={
              userRole === "admin" ? <CustomerSupport /> : <Navigate to="/" />
            }
          />
          <Route
            path="analytics"
            element={userRole === "admin" ? <Analytics /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
