import { Outlet } from "react-router-dom";
import SidebarForUser from "../components/SidebarForUser/SideBarForUser";

const InforUserPage = () => {
  return (
    <div className="w-[1100px] mx-auto mt-10 flex items-center gap-x-5">
      <SidebarForUser />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default InforUserPage;
