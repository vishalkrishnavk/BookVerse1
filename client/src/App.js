import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";
import BookHome from "./pages/BookStore/BookHome";
import AllBooks from "./pages/BookStore/AllBooks";
import SingleBook from "./pages/BookStore/SingleBook";
import Cart from "./pages/BookStore/Cart";
import Favourite from "./pages/BookStore/Favourite";
import AllOrders from "./pages/BookStore/AllOrders";
import AddBook from "./pages/BookStore/AddBook";
import UpdateBooks from "./pages/BookStore/UpdateBooks";
import OrderHistory from "./pages/BookStore/OrderHistory";
import { TopBar } from "./components";
import ChatHome from "./components/Messages/ChatHome";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  const { role } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <TopBar />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/bookstore" element={<BookHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/favourites" element={<Favourite />} />
          <Route path="/profile/orderHistory" element={<OrderHistory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/messages" element={<ChatHome />} />

          {/* Admin Routes */}
          <Route
            path="/profile/add-book"
            element={role === "admin" ? <AddBook /> : <Navigate to="/" />}
          />
          <Route
            path="/profile/allorders"
            element={role === "admin" ? <AllOrders /> : <Navigate to="/" />}
          />
          <Route
            path="/update-book/:id"
            element={role === "admin" ? <UpdateBooks /> : <Navigate to="/" />}
          />
        </Route>

        {/* Public Routes */}
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/get-book/:id" element={<SingleBook />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
