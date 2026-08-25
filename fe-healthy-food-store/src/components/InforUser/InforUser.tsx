import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IUser } from "../../types/typeUser";
import { getUser } from "../../services/user";

type typeUserData = {
  role: string;
  userData: IUser;
};

const InforUser = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const [userAuthRole, setUserAuthRole] = useState<string>("");
  const getUserById = async () => {
    if (userAuth?.userData?._id) {
      const response: any = await getUser(userAuth?.userData?._id);
      if (response?.statusCode === 200) {
        setUserAuthRole(response?.userData?.role);
      }
    }
  };
  useEffect(() => {
    getUserById();
  }, [userAuth]);
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
    <div className="absolute bottom-[-130px] -right-5 z-20 shadow-xl flex flex-col bg-[#f1f2f3] w-[200px] px-5 py-2 rounded">
      <div className="flex flex-col font-semibold cursor-pointer gap-y-2">
        {userAuthRole === "1" && (
          <div
            className="w-max hover:text-[#80bd96] transition-all"
            onClick={() => navigate("/dashboard")}
          >
            Quản lý
          </div>
        )}
        <div
          className="w-max hover:text-[#80bd96] transition-all"
          onClick={() => navigate("/user/change-infor")}
        >
          Thông tin cá nhân
        </div>
        <div
          className="w-max hover:text-[#80bd96] transition-all"
          onClick={() => navigate("/user/change-password")}
        >
          Đổi mật khẩu
        </div>
        <div
          className="w-max hover:text-[#80bd96] transition-all"
          onClick={() => navigate("/user/history-order")}
        >
          Lịch sử mua hàng
        </div>
        <div
          className="w-max hover:text-[#80bd96] transition-all"
          onClick={handleLogout}
        >
          Đăng xuất
        </div>
      </div>
    </div>
  );
};

export default InforUser;
