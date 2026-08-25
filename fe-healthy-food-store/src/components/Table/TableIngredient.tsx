import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IIngredient } from "../../types/typeIngredient";
import {
  deleteIngredient,
  getAllIngredient,
  getAllIngredientWithFilter,
} from "../../services/ingredient";
import { typeDataMeta } from "../../types/typeDataMeta";
import { toast } from "react-toastify";
import axios from "axios";

interface DataType {
  name: string;
  price: number;
  weight: number;
}

interface IProps {
  listIngredients: IIngredient[];
  filterIngredient: string;
  setDataMeta(dataMeta: typeDataMeta): void;
  setListIngredients(listIngredients: IIngredient[]): void;
  dataMeta: typeDataMeta;
  setIsModalOpenEdit(isModalOpenEdit: boolean): void;
  setDataEditIngredient(dataEditIngredient: IIngredient): void;
  fetchDataIngredient(): void;
}

const TableIngredient = (props: IProps) => {
  const {
    listIngredients,
    filterIngredient,
    setDataMeta,
    setListIngredients,
    dataMeta,
    setIsModalOpenEdit,
    setDataEditIngredient,
    fetchDataIngredient,
  } = props;
  const confirm = async (igredient: IIngredient) => {
    const response: any = await deleteIngredient(igredient?._id);
    if (response.statusCode === 200) {
      toast.success("Delete ingredient successfully!!!");
      await fetchDataIngredient();
      await axios.get("http://localhost:5000/fetching");
    } else toast.error("Delete ingredient fail!!!");
  };
  const cancel = () => {
    message.error("Click on No");
  };
  const handleOnChange = async (page: number, pageSize: number) => {
    if (filterIngredient) {
      const response: any = await getAllIngredientWithFilter(
        page,
        pageSize,
        filterIngredient
      );
      if (response.statusCode === 200) {
        setListIngredients(response.ingredientData);
        setDataMeta({
          currentPage: response?.data?.meta?.currentPage,
          pageSize: response?.data?.meta?.pageSize,
          pages: response?.data?.meta?.pages,
          total: response?.data?.meta?.total,
        });
      }
    } else {
      const response: any = await getAllIngredient(page, pageSize);
      if (response.statusCode === 200) {
        setListIngredients(response.ingredientData);
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, record: IIngredient | any) => {
        return (
          <div className="w-[40px] h-[50px]">
            {record?.image && (
              <img
                src={record?.image}
                alt=""
                className="object-cover w-full h-full"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price (VND)",
      dataIndex: "price",
      key: "price",
      render: (_, record: IIngredient | any) => {
        return <span>{record?.price.toLocaleString("it-IT")}</span>;
      },
    },
    {
      title: "Weight (g)",
      dataIndex: "weight",
      key: "weight",
      render: (_, record: IIngredient | any) => {
        return <span>{record?.weight.toLocaleString("it-IT")}</span>;
      },
    },
    {
      title: "Action",
      render: (_, record: IIngredient | any) => {
        return (
          <div className="flex gap-x-2">
            <Button
              type="primary"
              className="flex items-center justify-center"
              onClick={() => {
                setDataEditIngredient(record);
                setIsModalOpenEdit(true);
              }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Delete the user"
              description={`Are you sure to delete this ingredient with name is: ${record?.name}?`}
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
      dataSource={listIngredients}
      rowKey={"_id"}
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
  );
};

export default TableIngredient;
