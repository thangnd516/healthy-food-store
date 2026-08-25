import { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import logo from "../assets/Logo.png";
import userImage from "../assets/user-img.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { IUser } from "../types/typeUser";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { fetchDataUser } from "../redux/slices/cartSlice";
import InforUser from "../components/InforUser/InforUser";
import { getUser } from "../services/user";

type typeUserData = {
  role: string;
  userData: IUser;
};

const items: MenuProps["items"] = [
  {
    label: <Link to="/">Home</Link>,
    key: "home",
  },
  {
    label: "Menu",
    key: "SubMemenunu",
    children: [
      {
        type: "group",
        children: [
          {
            label: <Link to="/meals">Suất ăn</Link>,
            key: "setting:1",
          },
          {
            label: <Link to="/recommend-meals">Suất ăn gợi ý</Link>,
            key: "setting:2",
          },
          {
            label: <Link to="/ingredients">Thành phần ăn</Link>,
            key: "setting:3",
          },
        ],
      },
    ],
  },
  {
    label: <Link to="/tdee-calculator">TDEE Calculator</Link>,
    key: "tdee",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const [current, setCurrent] = useState("home");
  const [user, setUser] = useState<IUser | null>(null);
  const dispatch = useAppDispatch();
  const lengthListCart: [] = useAppSelector((state) => state?.cart?.listCarts);
  const isUpdated = useAppSelector((state) => state?.updated?.isUpdated);
  const [isShow, setIsShow] = useState<boolean>(false);
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  const fetchDataUserFromServices = async () => {
    if (userAuth?.userData?._id) {
      const response: any = await getUser(userAuth?.userData?._id);
      if (response?.statusCode === 200) {
        setUser(response?.userData);
      }
    }
  };
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  useEffect(() => {
    if (userAuth?.userData?._id)
      dispatch(fetchDataUser(userAuth?.userData?._id));
  }, [userAuth]);
  useEffect(() => {
    fetchDataUserFromServices();
  }, [userAuth, isUpdated]);
  return (
    <div className="flex items-center justify-between px-10 py-2 shadow-md gap-x-5">
      <div className="flex items-center">
        <div className="w-[80px] h-[80px]">
          <img src={logo} alt="" className="object-cover w-full h-full" />
        </div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          className="w-[270px]"
        />
      </div>
      <div className="relative flex items-center gap-x-3">
        <div className="flex gap-x-3">
          <div
            className="relative pt-2 cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCartOutlined
              style={{
                fontSize: 28,
                cursor: "pointer",
              }}
            />
            <span className="absolute w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center top-1 -right-1 text-white text-xs">
              {lengthListCart ? lengthListCart?.length : 0}
            </span>
          </div>
          {userAuth ? (
            <div
              className="flex items-center cursor-pointer gap-x-3"
              onClick={() => setIsShow(!isShow)}
            >
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt=""
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
              ) : (
                <img
                  src={userImage}
                  alt=""
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
              )}

              {isShow && <InforUser />}
            </div>
          ) : (
            <>
              <button
                className="bg-[#488a5c] font-semibold text-lg text-white py-1 px-3 rounded-md hover:bg-opacity-80 transition-all"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
              <button
                className="px-3 py-1 text-lg font-semibold border border-black rounded-md"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
