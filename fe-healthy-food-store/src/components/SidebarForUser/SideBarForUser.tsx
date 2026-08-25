import { FaUser, FaKey, FaShoppingCart } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { IUser } from "../../types/typeUser";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUser } from "../../services/user";
import { useAppSelector } from "../../redux/hook";
import userImg from "../../assets/user-img.jpeg";

type typeUserData = {
  role: string;
  userData: IUser;
};

const SidebarForUser = () => {
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const isUpdated = useAppSelector((state) => state?.updated?.isUpdated);
  const fetchDataUser = async () => {
    if (userAuth?.userData?._id) {
      const response: any = await getUser(userAuth?.userData?._id);
      if (response?.statusCode === 200) {
        setUser(response?.userData);
      }
    }
  };
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("auth");
    setUserAuth(null);
    toast.success("Đăng xuất thành công");
    navigate("/login");
  };
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  useEffect(() => {
    fetchDataUser();
  }, [userAuth, isUpdated]);
  return (
    <div className="px-3 py-4 bg-white rounded-md shadow-xl">
      <div className="mx-auto w-max">
        <div className="w-[80px] h-[80px]">
          {user?.avatar ? (
            <img
              src={user?.avatar}
              alt=""
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <img
              src={userImg}
              className="object-cover w-full h-full rounded-full"
              alt=""
            />
          )}
        </div>
        <span className="block mt-1 font-semibold text-center">
          {user?.username}
        </span>
      </div>
      <div className="flex flex-col mt-3 font-semibold gap-y-2">
        <NavLink
          to="/user/change-infor"
          className={({ isActive }) =>
            isActive
              ? "hover:text-[#80bd96] transition-all flex items-center gap-x-2 w-max text-[#80bd96]"
              : "hover:text-[#80bd96] transition-all flex items-center gap-x-2 w-max"
          }
        >
          <FaUser />
          Thông tin cá nhân
        </NavLink>
        <NavLink
          to="/user/change-password"
          className={({ isActive }) =>
            isActive
              ? "hover:text-[#80bd96] transition-all flex items-center gap-x-2 w-max text-[#80bd96]"
              : "hover:text-[#80bd96] transition-all flex items-center gap-x-2 w-max"
          }
        >
          <FaKey />
          Thay đổi mật khẩu
        </NavLink>
        <NavLink
          to="/user/history-order"
          className={({ isActive }) =>
            isActive
              ? "hover:text-[#80bd96] transition-all flex items-center gap-x-2 w-max text-[#80bd96]"
              : "hover:text-[#80bd96] transition-all flex items-center gap-x-2 w-max"
          }
        >
          <FaShoppingCart />
          Lịch sử mua hàng
        </NavLink>
        <span
          onClick={handleLogout}
          className="cursor-pointer hover:text-[#80bd96] transition-all flex items-center gap-x-2 w-max"
        >
          <IoLogOut />
          Đăng xuất
        </span>
      </div>
    </div>
  );
};

export default SidebarForUser;
