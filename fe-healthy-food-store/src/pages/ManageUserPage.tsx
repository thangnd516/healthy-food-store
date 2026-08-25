import { Button } from "antd";
import HeadingDashboard from "../components/HeadingDashboard/HeadingDashboard";
import { FaUser } from "react-icons/fa";
import ModalAddNewUser from "../components/Modal/ModalUser/ModalAddNewUser";
import { useEffect, useState } from "react";
import TableUser from "../components/Table/TableUser";
import { getAllUser, getAllUserWithFilter } from "../services/user";
import ModalEditUser from "../components/Modal/ModalUser/ModalEditUser";
import { IUser } from "../types/typeUser";

const ManageUserPage = () => {
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [listUsers, setListUsers] = useState<IUser[]>([]);
  const [dataEditUser, setDataEditUser] = useState<IUser | null>(null);
  const [dataMeta, setDataMeta] = useState({
    currentPage: 1,
    pageSize: 3,
    pages: 0,
    total: 0,
  });
  const [filterUser, setFilterUser] = useState("");
  const fetchListUsers = async () => {
    if (filterUser) {
      const response: any = await getAllUserWithFilter(
        dataMeta?.currentPage,
        dataMeta?.pageSize,
        filterUser
      );
      if (response.statusCode === 200) {
        setListUsers(response.userData);
        setDataMeta({
          currentPage: response?.data?.meta?.currentPage,
          pageSize: response?.data?.meta?.pageSize,
          pages: response?.data?.meta?.pages,
          total: response?.data?.meta?.total,
        });
      }
    } else {
      const response: any = await getAllUser(
        dataMeta?.currentPage,
        dataMeta?.pageSize
      );
      if (response.statusCode === 200) {
        setListUsers(response.userData);
        setDataMeta({
          currentPage: response?.data?.meta?.currentPage,
          pageSize: response?.data?.meta?.pageSize,
          pages: response?.data?.meta?.pages,
          total: response?.data?.meta?.total,
        });
      }
    }
  };
  useEffect(() => {
    fetchListUsers();
  }, [filterUser]);
  return (
    <div className="pt-10">
      <HeadingDashboard heading="Quản lý User" />
      <div className="text-center mt-5 w-[800px] mx-auto">
        <div>
          <input
            type="text"
            className="w-full border-2 border-black p-2 outline-none rounded-md focus:border-[#80bd96] transition-all"
            placeholder="Tìm kiếm user..."
            onChange={(e) => setFilterUser(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button
            style={{
              backgroundColor: "#488a5c",
              color: "white",
            }}
            className="flex items-center gap-x-[2px]"
            onClick={() => setIsModalOpenAdd(true)}
          >
            <FaUser size="18px" />
            <span className="text-2xl font-semibold -translate-y-[2px]">+</span>
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <TableUser
          listUsers={listUsers}
          setIsModalOpenEdit={setIsModalOpenEdit}
          setDataEditUser={setDataEditUser}
          fetchListUsers={fetchListUsers}
          dataMeta={dataMeta}
          setListUsers={setListUsers}
          setDataMeta={setDataMeta}
          filterUser={filterUser}
        />
      </div>
      <ModalAddNewUser
        isModalOpenAdd={isModalOpenAdd}
        setIsModalOpenAdd={setIsModalOpenAdd}
        fetchListUsers={fetchListUsers}
      />
      <ModalEditUser
        isModalOpenEdit={isModalOpenEdit}
        setIsModalOpenEdit={setIsModalOpenEdit}
        dataEditUser={dataEditUser}
        fetchListUsers={fetchListUsers}
      />
    </div>
  );
};

export default ManageUserPage;
