import React from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom"; // Add useLocation
import { useState } from "react";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { fetchPosts } from "../utils";
import { FaBook } from "react-icons/fa";
import logo from "../assets/logo1.png";
const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user, role, isLoggedIn } = useSelector((state) => state.user);
  const [Nav, setNav] = useState("hidden");
  const dispatch = useDispatch();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  let links = [
    {
      title: "Book Store",
      link: "/bookstore",
    },
    {
      title: "All Books",
      link: "/all-books",
    },
  ];

  if (isLoggedIn) {
    if (role === "admin") {
      links.push({
        title: "Admin Profile",
        link: "/profile",
      });
    } else {
      links.push(
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    await fetchPosts(user.token, dispatch, "", data);
  };

  return (
    <>
      <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
        <Link to="/" className="flex gap-2 items-center">
          <div className="p-1 md:p-2">
            <img
              src={logo} // Display custom logo
              alt="BookVerse Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
            BookVerse
          </span>
        </Link>

        {/* Only show search form on Home page */}
        {isHomePage && (
          <form
            className="hidden md:flex items-center justify-center"
            onSubmit={handleSubmit(handleSearch)}
          >
            <TextInput
              placeholder="Search..."
              styles="w-[18rem] lg:w-[38rem]  rounded-l-full py-3"
              register={register("search")}
            />
            <CustomButton
              title="Search"
              type="submit"
              containerStyles="bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full"
            />
          </form>
        )}

        {/* ICONS */}
        <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
          <button onClick={() => handleTheme()}>
            {theme ? <BsMoon /> : <BsSunFill />}
          </button>
          <div className="hidden lg:flex">
            <IoMdNotificationsOutline />
          </div>

          {isLoggedIn && (
            <div>
              <CustomButton
                onClick={() => dispatch(Logout())}
                title="Log Out"
                containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
              />
            </div>
          )}

          <div className=" w-1/6 block ">
            <button
              className="block border-0 bg-transparent px-2  hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0"
              type="button"
              onClick={() => setNav(Nav === "hidden" ? "block" : "hidden")}
            >
              <span className="[&>svg]:w-7 [&>svg]:stroke-white ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className={`5/6 ${Nav} bg-primary text-ascent-1 px-12`}>
        <div className="flex flex-col items-center">
          {links.map((items, i) => (
            <>
              {items.title === "Profile" || items.title === "Admin Profile" ? (
                <div
                  className="rounded hover:cursor-pointer border border-blue px-3 py-1 my-3 hover:bg-secondary hover:text-ascent-1 transition-all duration-300"
                  key={i}
                >
                  <Link
                    to={`${items.link}`}
                    className="text-normal"
                    onClick={() => setNav("hidden")}
                  >
                    {items.title}
                  </Link>
                </div>
              ) : (
                <div
                  className="mx-3 hover:text-blue rounded transition-all duration-300 hover:cursor-pointer my-3"
                  key={i}
                >
                  <Link
                    to={`${items.link}`}
                    className="text-normal"
                    onClick={() => setNav("hidden")}
                  >
                    {items.title}{" "}
                  </Link>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default TopBar;
