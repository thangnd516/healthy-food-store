import { Button, Input, message, Popconfirm, Table } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ICart } from "../../types/typeCart";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { toast } from "react-toastify";
import { createMealToCart, removeMeal } from "../../redux/slices/cartSlice";
import { useEffect } from "react";
import { getMealById } from "../../services/meal";
import defaultImg from "../../assets/default-img.png";

interface DataType {
  image: string;
  name: string;
  unitprice: number;
  totalprice: number;
  quantity: number;
}

interface IProps {
  listDataCarts: any;
  setListDataCarts: any;
  fetchDataUser(): void;
  setIsLimitQuantity(isLimitQuantity: boolean): void;
  isRerender: boolean;
  setIsRerender(isRerender: boolean): void;
}

const TableCart = (props: IProps) => {
  const {
    listDataCarts,
    setListDataCarts,
    fetchDataUser,
    setIsLimitQuantity,
    isRerender,
    setIsRerender,
  } = props;

  const dispatch = useAppDispatch();
  const isRemoved = useAppSelector((state) => state?.cart?.isRemoved);
  const cancel = () => {
    message.error("Click on No");
  };
  const handleOnChange = async (_id: string, value: any, mid: string) => {
    const rs: any = await getMealById(mid);
    if (+value === 0 || !value) {
      setIsLimitQuantity(true);
      return;
    } else if (Number(value) > Number(rs?.mealData?.quantity)) {
      toast.warning("Số lượng sản phầm không đủ");
      setIsLimitQuantity(true);
      return;
    } else {
      const listDataCartsClone = [...listDataCarts];
      const listDataCartsChange = listDataCartsClone?.map((item: ICart) => {
        if (item?._id === _id) {
          dispatch(
            createMealToCart({
              mid: item?.meal?._id,
              quantity: +value,
              actions: "update",
            })
          );
          return { ...item, quantity: +value };
        }
        return item;
      });
      setListDataCarts(listDataCartsChange);
      setIsLimitQuantity(false);
    }
  };
  const confirm = async (mid: string) => {
    dispatch(removeMeal(mid));
    if (isRemoved) {
      toast.success("Đã xóa ra khỏi giỏ hàng thành công");
      setIsRerender(!isRerender);
    }
  };
  useEffect(() => {
    fetchDataUser();
  }, [isRerender]);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, record: ICart | any) => {
        return (
          <div className="w-[40px] h-[50px]">
            <img
              src={record?.meal?.image ? record?.meal?.image : defaultImg}
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record: ICart | any) => {
        return <span>{record?.meal?.name}</span>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record: ICart | any) => {
        return (
          <div className="w-[80px]">
            <Input
              type="number"
              defaultValue={record?.quantity}
              onChange={(event: any) =>
                handleOnChange(
                  record?._id,
                  event?.target?.value,
                  record?.meal?._id
                )
              }
            />
          </div>
        );
      },
    },
    {
      title: "Giá đơn vị (VND)",
      dataIndex: "price",
      key: "price",
      render: (_, record: ICart | any) => {
        return <span>{record?.meal?.price?.toLocaleString("it-IT")}</span>;
      },
    },
    {
      title: "Giá tổng (VND)",
      dataIndex: "totalprice",
      key: "totalprice",
      render: (_, record: ICart | any) => {
        return (
          <span>
            {(record?.quantity * record?.meal?.price)?.toLocaleString("it-IT")}
          </span>
        );
      },
    },
    {
      title: "Action",
      render: (_, record: ICart | any) => {
        return (
          <Popconfirm
            title="Delete the product from cart"
            description={`Are you sure to delete this meal with name is: ${record?.meal?.name}?`}
            onConfirm={() => confirm(record?.meal?._id)}
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
        );
      },
    },
  ];
  const handleTotalPrice = () => {
    let totalPrice = 0;
    for (let i = 0; i < listDataCarts?.length; i++) {
      totalPrice += listDataCarts[i]?.quantity * listDataCarts[i]?.meal?.price;
    }
    return totalPrice;
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={listDataCarts}
        rowKey={"_id"}
        pagination={false}
      />
      <p className="flex justify-end py-3 pr-12">
        Tổng tiền:
        <span className="pl-1 font-semibold">
          {handleTotalPrice().toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      </p>
    </div>
  );
};

export default TableCart;
