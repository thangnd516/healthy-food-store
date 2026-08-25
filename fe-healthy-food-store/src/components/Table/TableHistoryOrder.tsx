import { Button, Select, Table } from "antd";
import type { TableProps } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { typeDataMeta } from "../../types/typeDataMeta";
import { useEffect, useState } from "react";
import { getOrderByUser, updateStatusOrder } from "../../services/order";
import { IUser } from "../../types/typeUser";
import { toast } from "react-toastify";
import ModalDetailOrder from "../Modal/ModalDetailOrder/ModalDetailOrder";
import { IOrder } from "../../types/typeOrder";

interface DataType {
  infor: string;
  typeOrder: string;
  price: number;
  status: string;
}

interface IProps {
  historyOrders: any;
  setHistoryOrders: any;
  dataMeta: typeDataMeta;
  setDataMeta(dataMeta: typeDataMeta): void;
  fetchHistoryOrdersByUser(): void;
}

type typeUserData = {
  role: string;
  userData: IUser;
};

const TableHistoryOrder = (props: IProps) => {
  const {
    historyOrders,
    setHistoryOrders,
    dataMeta,
    setDataMeta,
    fetchHistoryOrdersByUser,
  } = props;
  const [dataHistoryOrder, setDataHistoryOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const handleOnChange = async (page: number, pageSize: number) => {
    if (userAuth?.userData?._id) {
      const response: any = await getOrderByUser(
        userAuth?.userData?._id,
        page,
        pageSize
      );
      if (response?.statusCode === 200) {
        setHistoryOrders(response?.historyOrder);
        setDataMeta({
          currentPage: response?.data?.meta?.currentPage,
          pageSize: response?.data?.meta?.pageSize,
          pages: response?.data?.meta?.pages,
          total: response?.data?.meta?.total,
        });
      }
    }
  };
  const handleChange = async (oid: string, value: string) => {
    if (userAuth?.userData?._id) {
      const response: any = await updateStatusOrder(oid, value);
      if (response?.statusCode === 200) {
        toast.success("Update status sucessfully!!!");
        fetchHistoryOrdersByUser();
      }
    }
  };
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Thông tin khách hàng",
      dataIndex: "infor",
      key: "infor",
      render: (_, record: any) => {
        return (
          <div className="flex flex-col">
            <span>SĐT: {record?.phone}</span>
            <span>Địa chỉ: {record?.address}</span>
            <span>Tên khách hàng: {record?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "typeOrder",
      key: "typeOrder",
      render: (_, record: any) => {
        return (
          <span>{`${
            record?.typeOrder === "CASH"
              ? "Thanh toán khi nhận hàng"
              : record?.typeOrder === "VNPAY"
              ? "Thanh toán online"
              : ""
          }`}</span>
        );
      },
    },
    {
      title: "Tổng tiền (VND)",
      dataIndex: "price",
      key: "price",
      render: (_, record: any) => {
        return <span>{record?.price?.toLocaleString("it-IT")}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (_, record: any) => {
        return (
          <Select
            defaultValue={record?.status}
            style={{ width: 120 }}
            onChange={(value: string) => handleChange(record?._id, value)}
            options={
              record?.status === "Processing"
                ? [{ value: "Cancelled", label: "Cancelled" }]
                : []
            }
          />
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record: any) => {
        return (
          <div>
            <Button
              type="primary"
              className="flex items-center justify-center"
              onClick={() => {
                setDataHistoryOrder(record);
                setIsModalOpen(!isModalOpen);
              }}
            >
              <EyeOutlined />
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={historyOrders}
        rowKey={"_id"}
        className="rounded-md shadow-2xl"
        pagination={{
          current: dataMeta?.currentPage,
          pageSize: dataMeta?.pageSize,
          total: dataMeta?.total,
          onChange: (page: number, pageSize: number) =>
            handleOnChange(page, pageSize),
        }}
      />
      <ModalDetailOrder
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        dataHistoryOrder={dataHistoryOrder}
        setDataHistoryOrder={setDataHistoryOrder}
        kind="user"
      />
    </div>
  );
};

export default TableHistoryOrder;
