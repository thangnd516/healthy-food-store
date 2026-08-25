import { Modal } from "antd";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen(isModalOpen: boolean): void;
  dataOrder?: any;
  setDataOrder?: any;
  dataHistoryOrder?: any;
  setDataHistoryOrder?: any;
  kind: string;
}
const ModalDetailOrder = (props: IProps) => {
  const {
    isModalOpen,
    setIsModalOpen,
    dataOrder,
    setDataOrder,
    dataHistoryOrder,
    setDataHistoryOrder,
    kind,
  } = props;
  const handleCancel = () => {
    setIsModalOpen(false);
    setDataOrder(null);
    setDataHistoryOrder(null);
  };
  const hours =
    kind === "admin"
      ? new Date(dataOrder?.dateOrder).getHours() <= 9
        ? `0${new Date(dataOrder?.dateOrder).getHours()}`
        : new Date(dataOrder?.dateOrder).getHours()
      : kind === "user"
      ? new Date(dataHistoryOrder?.dateOrder).getHours() <= 9
        ? `0${new Date(dataHistoryOrder?.dateOrder).getHours()}`
        : new Date(dataHistoryOrder?.dateOrder).getHours()
      : "";
  const minutes =
    kind === "admin"
      ? new Date(dataOrder?.dateOrder).getMinutes() <= 9
        ? `0${new Date(dataOrder?.dateOrder).getMinutes()}`
        : new Date(dataOrder?.dateOrder).getMinutes()
      : kind === "user"
      ? new Date(dataHistoryOrder?.dateOrder).getMinutes() <= 9
        ? `0${new Date(dataHistoryOrder?.dateOrder).getMinutes()}`
        : new Date(dataHistoryOrder?.dateOrder).getMinutes()
      : "";
  const seconds =
    kind === "admin"
      ? new Date(dataOrder?.dateOrder).getSeconds() <= 9
        ? `0${new Date(dataOrder?.dateOrder).getSeconds()}`
        : new Date(dataOrder?.dateOrder).getSeconds()
      : kind === "user"
      ? new Date(dataHistoryOrder?.dateOrder).getSeconds() <= 9
        ? `0${new Date(dataHistoryOrder?.dateOrder).getSeconds()}`
        : new Date(dataHistoryOrder?.dateOrder).getSeconds()
      : "";
  const dayOrder = `${hours}:${minutes}:${seconds} - ${
    kind === "admin"
      ? new Date(dataOrder?.dateOrder).getDate()
      : kind === "user"
      ? new Date(dataHistoryOrder?.dateOrder).getDate()
      : ""
  }/${
    kind === "admin"
      ? new Date(dataOrder?.dateOrder).getMonth() + 1
      : kind === "user"
      ? new Date(dataHistoryOrder?.dateOrder).getMonth() + 1
      : ""
  }/${
    kind === "admin"
      ? new Date(dataOrder?.dateOrder).getFullYear()
      : kind === "user"
      ? new Date(dataHistoryOrder?.dateOrder).getFullYear()
      : ""
  }`;
  return (
    <>
      <Modal
        title="Thông tin đơn hàng"
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        width={800}
        maskClosable={false}
      >
        <div className="px-5 mt-5">
          <div className="mb-6">
            <h2 className="font-semibold">Danh sách sản phẩm:</h2>
            <div className="flex mt-2 border-t border-b border-t-gray-500 border-b-gray-500">
              <div className="w-1/4 py-2 border-l border-r border-r-gray-500 border-l-gray-500">
                <span className="block pb-2 text-center border-b border-b-gray-500">
                  STT
                </span>
                <div>
                  {kind === "admin"
                    ? dataOrder?.product?.length > 0 &&
                      dataOrder?.product?.map((item: any, index: number) => (
                        <div
                          key={item?._id}
                          className="block py-1 text-center border-b border-b-gray-500 last:border-b-transparent"
                        >
                          {index + 1}
                        </div>
                      ))
                    : kind === "user"
                    ? dataHistoryOrder?.product?.length > 0 &&
                      dataHistoryOrder?.product?.map(
                        (item: any, index: number) => (
                          <div
                            key={item?._id}
                            className="block py-1 text-center border-b border-b-gray-500 last:border-b-transparent"
                          >
                            {index + 1}
                          </div>
                        )
                      )
                    : ""}
                </div>
              </div>
              <div className="w-1/4 py-2 border-r border-r-gray-500">
                <span className="block pb-2 text-center border-b border-b-gray-500">
                  Tên sản phẩm
                </span>
                <div>
                  {kind === "admin"
                    ? dataOrder?.product?.length > 0 &&
                      dataOrder?.product?.map((item: any) => (
                        <div
                          key={item?._id}
                          className="block py-1 text-center border-b border-b-gray-500 last:border-b-transparent"
                        >
                          {item?.meal?.name}
                        </div>
                      ))
                    : kind === "user"
                    ? dataHistoryOrder?.product?.length > 0 &&
                      dataHistoryOrder?.product?.map((item: any) => (
                        <div
                          key={item?._id}
                          className="block py-1 text-center border-b border-b-gray-500 last:border-b-transparent"
                        >
                          {item?.meal?.name}
                        </div>
                      ))
                    : ""}
                </div>
              </div>
              <div className="w-1/4 py-2 border-r border-r-gray-500 ">
                <span className="block pb-2 text-center border-b border-b-gray-500">
                  Số lượng
                </span>
                <div>
                  {kind === "admin"
                    ? dataOrder?.product?.length > 0 &&
                      dataOrder?.product?.map((item: any) => (
                        <div
                          key={item?._id}
                          className="block py-1 text-center border-b border-b-gray-500 last:border-b-transparent"
                        >{`x${item?.quantity}`}</div>
                      ))
                    : kind === "user"
                    ? dataHistoryOrder?.product?.length > 0 &&
                      dataHistoryOrder?.product?.map((item: any) => (
                        <div
                          key={item?._id}
                          className="block py-1 text-center border-b border-b-gray-500 last:border-b-transparent"
                        >{`x${item?.quantity}`}</div>
                      ))
                    : ""}
                </div>
              </div>
              <div className="w-1/4 py-2 border-r border-r-gray-500">
                <span className="block pb-2 text-center border-b border-b-gray-500">
                  Giá đơn vị (VND)
                </span>
                <div>
                  {kind === "admin"
                    ? dataOrder?.product?.length > 0 &&
                      dataOrder?.product?.map((item: any) => (
                        <div
                          key={item?._id}
                          className="block py-1 text-center border-b border-b-gray-500 last:border-b-transparent"
                        >
                          {(item?.quantity * item?.meal?.price)?.toLocaleString(
                            "it-IT"
                          )}
                        </div>
                      ))
                    : kind === "user"
                    ? dataHistoryOrder?.product?.length > 0 &&
                      dataHistoryOrder?.product?.map((item: any) => (
                        <div
                          key={item?._id}
                          className="block py-1 text-center border-b border-b-gray-500 last:border-b-transparent"
                        >
                          {(item?.quantity * item?.meal?.price)?.toLocaleString(
                            "it-IT"
                          )}
                        </div>
                      ))
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Thông tin chi tiết đơn hàng:</h2>
            <div className="flex mt-2 border border-gray-500 rounded">
              <div className="flex flex-col w-1/2 border-r border-r-gray-500">
                {kind === "admin" && (
                  <span className="block w-full py-2 text-center border-b border-b-gray-500">
                    Email tài khoản đặt hàng:
                  </span>
                )}
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  Tên khách hàng:
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  Địa chỉ:
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  Số điện thoại:
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  Ngày đặt hàng:
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  Tổng tiền (VND):
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  Hình thức thanh toán:
                </span>
                <span className="block w-full py-2 text-center">
                  Tình trạng đơn hàng:
                </span>
              </div>
              <div className="flex flex-col w-1/2">
                {kind === "admin" && (
                  <span className="block w-full py-2 text-center border-b border-b-gray-500">
                    {dataOrder?.userId?.email}
                  </span>
                )}
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  {kind === "admin"
                    ? dataOrder?.name
                    : kind === "user"
                    ? dataHistoryOrder?.name
                    : ""}
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  {kind === "admin"
                    ? dataOrder?.address
                    : kind === "user"
                    ? dataHistoryOrder?.address
                    : ""}
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  {kind === "admin"
                    ? dataOrder?.phone
                    : kind === "user"
                    ? dataHistoryOrder?.phone
                    : ""}
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  {dayOrder}
                </span>
                <span className="block w-full py-2 font-semibold text-center border-b border-b-gray-500">
                  {kind === "admin"
                    ? dataOrder?.price?.toLocaleString("it-IT")
                    : kind === "user"
                    ? dataHistoryOrder?.price?.toLocaleString("it-IT")
                    : ""}
                </span>
                <span className="block w-full py-2 text-center border-b border-b-gray-500">
                  {kind === "admin"
                    ? dataOrder?.typeOrder === "CASH"
                      ? "Thanh toán khi nhận hàng"
                      : dataOrder?.typeOrder === "VNPAY"
                      ? "Thanh toán online"
                      : ""
                    : kind === "user"
                    ? dataHistoryOrder?.typeOrder === "CASH"
                      ? "Thanh toán khi nhận hàng"
                      : dataHistoryOrder?.typeOrder === "VNPAY"
                      ? "Thanh toán online"
                      : ""
                    : ""}
                </span>
                <span className="block w-full py-2 text-center">
                  {kind === "admin"
                    ? dataOrder?.status === "Processing"
                      ? "Đơn hàng đang được chuẩn bị"
                      : dataOrder?.status === "Delivering"
                      ? "Đơn hàng đang được giao"
                      : dataOrder?.status === "Cancelled"
                      ? "Đơn hàng đã bị hủy"
                      : dataOrder?.status === "Success"
                      ? "Đơn hàng được giao thành công"
                      : ""
                    : kind === "user"
                    ? dataHistoryOrder?.status === "Processing"
                      ? "Đơn hàng đang được chuẩn bị"
                      : dataHistoryOrder?.status === "Delivering"
                      ? "Đơn hàng đang được giao"
                      : dataHistoryOrder?.status === "Cancelled"
                      ? "Đơn hàng đã bị hủy"
                      : dataHistoryOrder?.status === "Success"
                      ? "Đơn hàng được giao thành công"
                      : ""
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalDetailOrder;
