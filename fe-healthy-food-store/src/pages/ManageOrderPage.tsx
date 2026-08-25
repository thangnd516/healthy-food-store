import { useEffect, useState } from "react";
import HeadingDashboard from "../components/HeadingDashboard/HeadingDashboard";
import TableOrder from "../components/Table/TableOrder";
import { getAllOrders, getAllOrdersWithFilter } from "../services/order";

const ManageOrderPage = () => {
  const [orders, setOrders] = useState<any>([]);
  const [filterOrder, setFilterOrder] = useState("");
  const [dataMeta, setDataMeta] = useState({
    currentPage: 1,
    pageSize: 2,
    pages: 0,
    total: 0,
  });
  const fetchDataOrders = async () => {
    if (filterOrder) {
      const response: any = await getAllOrdersWithFilter(
        dataMeta?.currentPage,
        dataMeta?.pageSize,
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
      const response: any = await getAllOrders(
        dataMeta?.currentPage,
        dataMeta?.pageSize
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
    }
  };
  useEffect(() => {
    fetchDataOrders();
  }, [filterOrder]);
  return (
    <div className="pt-[80px]">
      <HeadingDashboard heading="Quản lý orders" />
      <div className="text-center mt-5 w-[800px] mx-auto">
        <input
          type="text"
          className="w-full border-2 border-black p-2 outline-none rounded-md focus:border-[#80bd96] transition-all"
          placeholder="Tìm kiếm order theo tên khách hàng..."
          onChange={(e) => setFilterOrder(e.target.value)}
        />
      </div>
      <div className="mt-8">
        <TableOrder
          orders={orders}
          setOrders={setOrders}
          dataMeta={dataMeta}
          setDataMeta={setDataMeta}
          filterOrder={filterOrder}
          fetchDataOrders={fetchDataOrders}
        />
      </div>
    </div>
  );
};

export default ManageOrderPage;
