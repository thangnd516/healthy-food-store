import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { IUser } from "../types/typeUser";
import { getUser } from "../services/user";

type typeUserData = {
  role: string;
  userData: IUser;
};

const AdminPage = () => {
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
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  useEffect(() => {
    getUserById();
  }, [userAuth]);
  return (
    <>
      {userAuthRole === "1" && (
        <div className="flex bg-[#f1f2f3]">
          <Sidebar />
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;
