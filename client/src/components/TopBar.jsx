import React, { useState, useEffect } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { logout } from "../redux/userSlice";
import { fetchPosts } from "../utils";
import logo from "../assets/logo1.png";
import { RiMenu3Fill, RiCloseFill } from "react-icons/ri";

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user, role, isLoggedIn } = useSelector((state) => state.user);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const baseLinks = [
    {
      title: "Book Store",
      link: "/bookstore",
    },
    {
      title: "All Books",
      link: "/all-books",
    },
  ];

  const getLinks = () => {
    let currentLinks = [...baseLinks];

    if (isLoggedIn) {
      if (role === "admin") {
        currentLinks.push({
          title: "Admin Profile",
          link: "/profile",
        });
      } else {
        currentLinks.push(
          {
            title: "Cart",
            link: "/cart",
          },
          {
            title: "Profile",
            link: "/profile",
          }
        );
      }
    }
    return currentLinks;
  };

  const [links, setLinks] = useState(getLinks());

  useEffect(() => {
    setLinks(getLinks());
  }, [isLoggedIn, role]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      dispatch(logout());
    }
  }, [location.pathname]);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenu(false);
    navigate("/");
  };

  return (
    <div className="relative">
      <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
        {/* Logo */}
        <Link to="/" className="flex gap-2 items-center">
          <div className="p-1 md:p-2">
            <img
              src={logo}
              alt="BookVerse Logo"
              className="w-8 h-8 md:w-12 md:h-12 object-contain"
            />
          </div>
          <span className="text-lg md:text-2xl text-[#065ad8] font-semibold">
            BookVerse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 text-ascent-1">
          {links.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className={`${
                item.title === "Profile" || item.title === "Admin Profile"
                  ? "border border-blue px-3 py-1 rounded hover:bg-secondary"
                  : "hover:text-blue"
              } transition-all duration-300`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4 text-ascent-1">
          <button onClick={handleTheme} className="text-xl">
            {theme === "light" ? <BsMoon /> : <BsSunFill />}
          </button>

          <Link to="/messages" className="text-xl">
            <IoMdNotificationsOutline />
          </Link>

          {isLoggedIn && (
            <CustomButton
              onClick={handleLogout}
              title="Log Out"
              containerStyles="text-sm text-ascent-1 px-4 py-1 border border-[#666] rounded-full"
            />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-ascent-1"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <RiCloseFill /> : <RiMenu3Fill />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          mobileMenu ? "flex" : "hidden"
        } md:hidden flex-col absolute top-full left-0 w-full bg-primary py-4 px-4 gap-4 shadow-lg z-50`}
      >
        {links.map((item, i) => (
          <Link
            key={i}
            to={item.link}
            onClick={() => setMobileMenu(false)}
            className={`${
              item.title === "Profile" || item.title === "Admin Profile"
                ? "border border-blue px-3 py-2 rounded text-center hover:bg-secondary"
                : "hover:text-blue"
            } text-ascent-1 transition-all duration-300`}
          >
            {item.title}
          </Link>
        ))}

        <div className="flex items-center justify-between pt-4 border-t border-ascent-2/20">
          <button onClick={handleTheme} className="text-xl text-ascent-1">
            {theme === "light" ? <BsMoon /> : <BsSunFill />}
          </button>

          <Link to="/messages" className="text-xl text-ascent-1">
            <IoMdNotificationsOutline />
          </Link>

          {isLoggedIn && (
            <CustomButton
              onClick={handleLogout}
              title="Log Out"
              containerStyles="text-sm text-ascent-1 px-4 py-1 border border-[#666] rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
