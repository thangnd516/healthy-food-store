import { Button, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { typeDataMeta } from "../../types/typeDataMeta";
import { toast } from "react-toastify";
import { IMeal } from "../../types/typeMeal";
import {
  deleteMeal,
  getAllMeal,
  getAllMealWithFilter,
} from "../../services/meal";
import imgDefault from "../../assets/default-img.png";

interface DataType {
  name: string;
  price: number;
  weight: number;
}

interface IProps {
  listMeals: IMeal[];
  filterMeal: string;
  setDataMeta(dataMeta: typeDataMeta): void;
  setListMeals(listMeals: IMeal[]): void;
  dataMeta: typeDataMeta;
  setIsModalOpenEdit(isModalOpenEdit: boolean): void;
  setDataEditMeal(dataEditMeal: IMeal): void;
  fetchDataMeal(): void;
}

const TableMeal = (props: IProps) => {
  const {
    listMeals,
    filterMeal,
    setDataMeta,
    setListMeals,
    dataMeta,
    setIsModalOpenEdit,
    setDataEditMeal,
    fetchDataMeal,
  } = props;
  console.log("listMeals", listMeals);
  const confirm = async (meal: IMeal) => {
    const response: any = await deleteMeal(meal?._id);
    if (response.statusCode === 200) {
      toast.success("Delete meal successfully!!!");
      await fetchDataMeal();
    } else toast.error("Delete meal fail!!!");
  };
  const cancel = () => {
    message.error("Click on No");
  };
  const handleOnChange = async (page: number, pageSize: number) => {
    if (filterMeal) {
      const response: any = await getAllMealWithFilter(
        page,
        pageSize,
        filterMeal
      );
      if (response.statusCode === 200) {
        setListMeals(response.mealData);
        setDataMeta({
          currentPage: response?.data?.meta?.currentPage,
          pageSize: response?.data?.meta?.pageSize,
          pages: response?.data?.meta?.pages,
          total: response?.data?.meta?.total,
        });
      }
    } else {
      const response: any = await getAllMeal(page, pageSize);
      if (response.statusCode === 200) {
        setListMeals(response.mealData);
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
      render: (_, record: IMeal | any) => {
        return (
          <div className="w-[40px] h-[50px]">
            {record?.image ? (
              <img
                src={record?.image}
                alt=""
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={imgDefault}
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
      render: (_, record: IMeal | any) => {
        return <span>{record?.price?.toLocaleString("it-IT")}</span>;
      },
    },
    {
      title: "Weight (g)",
      dataIndex: "weight",
      key: "weight",
      render: (_, record: IMeal | any) => {
        return <span>{record?.weight?.toLocaleString("it-IT")}</span>;
      },
    },
    {
      title: "Loại suất ăn",
      dataIndex: "typeMeal",
      key: "typeMeal",
      render: (_, record: IMeal | any) => {
        return (
          <span>
            {record?.kind === "mealRecommend"
              ? "Suất ăn được gợi ý"
              : record?.kind === "meal"
              ? "Suất ăn không được gợi ý"
              : ""}
          </span>
        );
      },
    },
    {
      title: "Action",
      render: (_, record: IMeal | any) => {
        return (
          <div className="flex gap-x-2">
            <Button
              type="primary"
              className="flex items-center justify-center"
              onClick={() => {
                setDataEditMeal(record);
                setIsModalOpenEdit(true);
              }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Delete the user"
              description={`Are you sure to delete this meal with name is: ${record?.name}?`}
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
      dataSource={listMeals}
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

export default TableMeal;
