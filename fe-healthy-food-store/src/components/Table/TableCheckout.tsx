import { Table } from "antd";
import type { TableProps } from "antd";
import { ICart } from "../../types/typeCart";
import defaultImg from "../../assets/default-img.png";
import { useSearchParams } from "react-router-dom";
interface DataType {
  image: string;
  name: string;
  price: number;
  quantity: number;
}

interface IProps {
  listCarts: any;
}

const TableCheckout = (props: IProps) => {
  const [queryParameters] = useSearchParams();
  const isBuyNow: any = queryParameters.get("isBuyNow");
  const { listCarts } = props;
  const handleTotalPrice = () => {
    let totalPrice = 0;
    for (let i = 0; i < listCarts?.length; i++) {
      totalPrice += listCarts[i]?.quantity * listCarts[i]?.meal?.price;
    }
    return totalPrice;
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, record: ICart | any) => {
        return (
          <div className="w-[40px] h-[50px]">
            {record?.image ? (
              <img
                src={
                  isBuyNow != null && isBuyNow == "true"
                    ? record?.image
                    : record?.meal?.image
                    ? record?.meal?.image
                    : defaultImg
                }
                alt=""
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={defaultImg}
                alt=""
                className="object-cover w-full h-full"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record: ICart | any) => {
        return (
          <span>
            {isBuyNow != null && isBuyNow == "true"
              ? record?.nameSp
              : record?.meal?.name}
          </span>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record: ICart | any) => {
        return <span>{`x ${record?.quantity}`}</span>;
      },
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: (_, record: ICart | any) => {
        return (
          <span>
            {isBuyNow != null && isBuyNow == "true"
              ? record?.price?.toLocaleString("it-IT")
              : (record?.quantity * record?.meal?.price)?.toLocaleString(
                  "it-IT"
                )}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={listCarts}
        rowKey={"_id"}
        pagination={false}
      />
      <p className="flex justify-end py-3 pr-12">
        Tổng tiền:
        <span className="pl-1 font-semibold">
          {isBuyNow != null && isBuyNow == "true"
            ? (
                Number(listCarts[0]?.price) * Number(listCarts[0]?.quantity)
              ).toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })
            : handleTotalPrice().toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
        </span>
      </p>
    </div>
  );
};

export default TableCheckout;
