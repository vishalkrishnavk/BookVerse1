import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../redux/userSlice";
import { authActions } from "../../redux/userSlice";
const Sidebar = ({ ProfileData }) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const { role } = useSelector((state) => state.user);
  return (
    <div className="h-auto flex flex-col p-3 items-center justify-between shadow-sm rounded-xl bg-primary">
      {role !== "admin" && (
        <div className="w-full flex-col items-center justify-center hidden lg:flex">
          <Link
            to="/profile/favourites"
            className="text-ascent-1 font-semibold w-full py-2 text-center hover:bg-secondary rounded transition-all duration-300"
          >
            Favourites
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-ascent-1 font-semibold w-full py-2 mt-4 text-center hover:bg-secondary rounded transition-all duration-300"
          >
            Order History
          </Link>
          <Link
            to="/profile/settings"
            className="text-ascent-1 font-semibold w-full py-2 mt-4 text-center hover:bg-secondary rounded transition-all duration-300"
          >
            Settings
          </Link>
        </div>
      )}
      {role === "admin" && (
        <div className="w-full flex-col items-center justify-center hidden lg:flex">
          <Link
            to="/profile/allorders"
            className="text-ascent-1 font-semibold w-full py-2 text-center hover:bg-secondary rounded transition-all duration-300"
          >
            All Orders
          </Link>
          <Link
            to="/profile/add-book"
            className="text-ascent-1 font-semibold w-full py-2 mt-4 text-center hover:bg-secondary rounded transition-all duration-300"
          >
            Add Book
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
