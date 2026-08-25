import { NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { MdOutlineSetMeal } from "react-icons/md";
import { BsJournalBookmark } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { FaChartPie } from "react-icons/fa";
import userImg from "../../assets/user-img.jpeg";
import { IUser } from "../../types/typeUser";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type typeUserData = {
  role: string;
  userData: IUser;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Đăng xuất thành công");
    navigate("/login");
  };
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  return (
    <div id="view" className="h-screen shadow-xl" x-data="{ sidenav: true }">
      <div id="sidebar" className="w-[300px]" x-show="sidenav" />
      <div className="mt-8 space-y-6 md:space-y-10">
        <h1
          className="hidden mx-auto text-sm italic font-bold text-teal-500 cursor-pointer md:block md:text-2xl w-max"
          onClick={() => navigate("/")}
        >
          Healthy Food Store.
        </h1>
        <div id="profile" className="space-y-3">
          <img
            src={
              userAuth?.userData?.avatar ? userAuth?.userData?.avatar : userImg
            }
            alt="Avatar user"
            className="w-10 mx-auto rounded-full md:w-16"
          />
          <div>
            <h2 className="text-xs font-medium text-center text-teal-500 md:text-sm">
              {userAuth?.userData?.username}
            </h2>
            <p className="text-xs text-center text-gray-500">Administrator</p>
          </div>
        </div>
        <div id="menu" className="flex flex-col px-3 space-y-2">
          <NavLink
            to="/dashboard/statistical"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2 bg-teal-500 text-white"
                : "text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2"
            }
          >
            <FaChartPie size="25px" />
            <span className="text-lg">Thống kê</span>
          </NavLink>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2 bg-teal-500 text-white"
                : "text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2"
            }
          >
            <BsJournalBookmark size="25px" />
            <span className="text-lg">Đơn hàng</span>
          </NavLink>
          <NavLink
            to="/dashboard/meals"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2 bg-teal-500 text-white"
                : "text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2"
            }
          >
            <GiMeal size="25px" />
            <span className="text-lg">Suất ăn</span>
          </NavLink>
          <NavLink
            to="/dashboard/ingredients"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2 bg-teal-500 text-white"
                : "text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2"
            }
          >
            <MdOutlineSetMeal size="25px" />
            <span className="text-lg">Thành phần ăn</span>
          </NavLink>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2 bg-teal-500 text-white"
                : "text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out flex items-center gap-x-2"
            }
          >
            <FaUser size="25px" />
            <span className="text-lg">Người dùng</span>
          </NavLink>
          <button
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:bg-teal-500 hover:text-white hover:scale-105 gap-x-2"
            onClick={handleLogout}
          >
            <IoIosLogOut size="20px" />
            <span className="text-lg">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
