import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  deleteUser,
  getAllUser,
  getAllUserWithFilter,
} from "../../services/user";
import { toast } from "react-toastify";
import { IUser } from "../../types/typeUser";
import { typeDataMeta } from "../../types/typeDataMeta";
interface DataType {
  username: string;
  email: string;
  role: string;
  address: string;
}

interface IProps {
  listUsers: IUser[];
  setIsModalOpenEdit(isModalOpenEdit: boolean): void;
  setDataEditUser(dataEditUser: IUser): void;
  fetchListUsers(): void;
  dataMeta: typeDataMeta;
  setListUsers(listUsers: IUser[]): void;
  setDataMeta(dataMeta: typeDataMeta): void;
  filterUser: string;
}

const TableUser = (props: IProps) => {
  const {
    listUsers,
    setIsModalOpenEdit,
    setDataEditUser,
    fetchListUsers,
    dataMeta,
    setListUsers,
    setDataMeta,
    filterUser,
  } = props;
  const confirm = async (user: IUser) => {
    const response: any = await deleteUser(user?._id);
    if (response.statusCode === 200) {
      toast.success("Delete user successfully!!!");
      await fetchListUsers();
    } else toast.error("Delete user fail!!!");
  };
  const cancel = () => {
    message.error("Click on No");
  };
  const handleOnChange = async (page: number, pageSize: number) => {
    if (filterUser) {
      const response: any = await getAllUserWithFilter(
        page,
        pageSize,
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
      const response: any = await getAllUser(page, pageSize);
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
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, record) => {
        return <span>{record.role === "1" ? "Admin" : "User"}</span>;
      },
    },
    {
      title: "Action",
      render: (_, record: IUser | any) => {
        return (
          <div className="flex gap-x-2">
            <Button
              type="primary"
              className="flex items-center justify-center"
              onClick={() => {
                setDataEditUser(record);
                setIsModalOpenEdit(true);
              }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Delete the user"
              description={`Are you sure to delete this user with email is: ${record?.email}?`}
              onConfirm={() => confirm(record)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                className="flex items-center justify-center"
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      style={{
        width: "800px",
        margin: "0 auto 0 auto",
      }}
      columns={columns}
      dataSource={listUsers}
      rowKey={"_id"}
      pagination={{
        current: dataMeta?.currentPage,
        pageSize: dataMeta?.pageSize,
        total: dataMeta?.total,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
        onChange: (page: number, pageSize: number) =>
          handleOnChange(page, pageSize),
        showSizeChanger: true,
      }}
    />
  );
};

export default TableUser;
