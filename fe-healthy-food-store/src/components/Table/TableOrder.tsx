import { Button, Select, Table } from "antd";
import type { TableProps } from "antd";
import { typeDataMeta } from "../../types/typeDataMeta";
import {
  getAllOrders,
  getAllOrdersWithFilter,
  updateStatusOrder,
} from "../../services/order";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import ModalDetailOrder from "../Modal/ModalDetailOrder/ModalDetailOrder";
import { IOrder } from "../../types/typeOrder";

interface DataType {
  infor: string;
  typeOrder: string;
  price: number;
  status: string;
}

interface IProps {
  orders: any;
  setOrders: any;
  dataMeta: typeDataMeta;
  setDataMeta(dataMeta: typeDataMeta): void;
  filterOrder: string;
  fetchDataOrders(): void;
}

const TableOrder = (props: IProps) => {
  const {
    orders,
    setOrders,
    dataMeta,
    setDataMeta,
    filterOrder,
    fetchDataOrders,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataOrder, setDataOrder] = useState<IOrder | null>(null);
  const handleChange = async (oid: string, value: string) => {
    const response: any = await updateStatusOrder(oid, value);
    if (response?.statusCode === 200) {
      toast.success("Update status sucessfully!!!");
      fetchDataOrders();
    }
  };
  const handleOnChange = async (page: number, pageSize: number) => {
    if (filterOrder) {
      const response: any = await getAllOrdersWithFilter(
        page,
        pageSize,
        filterOrder
      );
      if (response.statusCode === 200) {
        setOrders(response?.orderData);
        setDataMeta({
          currentPage: response?.data?.meta?.currentPage,
          pageSize: response?.data?.meta?.pageSize,
          pages: response?.data?.meta?.pages,
          total: response?.data?.meta?.total,
        });
      }
    } else {
      const response: any = await getAllOrders(page, pageSize);
      if (response.statusCode === 200) {
        setOrders(response?.orderData);
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
      title: "Thông tin khách hàng",
      dataIndex: "infor",
      key: "infor",
      width: 220,
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
                ? [
                    { value: "Processing", label: "Processing" },
                    { value: "Delivering", label: "Delivering" },
                    { value: "Success", label: "Success" },
                    { value: "Cancelled", label: "Cancelled" },
                  ]
                : record?.status === "Delivering"
                ? [
                    { value: "Delivering", label: "Delivering" },
                    { value: "Success", label: "Success" },
                    { value: "Cancelled", label: "Cancelled" },
                  ]
                : record?.status === "Success"
                ? [{ value: "Success", label: "Success" }]
                : record?.status === "Cancelled"
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
      width: 120,
      render: (_, record: any) => {
        return (
          <div>
            <Button
              type="primary"
              className="flex items-center justify-center"
              onClick={() => {
                setDataOrder(record);
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
        dataSource={orders}
        rowKey={"_id"}
        style={{
          width: "850px",
          margin: "0 auto 0 auto",
        }}
        pagination={{
          current: dataMeta?.currentPage,
          pageSize: dataMeta?.pageSize,
          total: dataMeta?.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page: number, pageSize: number) =>
            handleOnChange(page, pageSize),
        }}
      />
      <ModalDetailOrder
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        dataOrder={dataOrder}
        setDataOrder={setDataOrder}
        kind="admin"
      />
    </div>
  );
};

export default TableOrder;
