import { useEffect, useState } from "react";
import { getOrderByUser } from "../services/order";
import { IUser } from "../types/typeUser";
import TableHistoryOrder from "../components/Table/TableHistoryOrder";

type typeUserData = {
  role: string;
  userData: IUser;
};

const HistoryOrderUserPage = () => {
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const [historyOrders, setHistoryOrders] = useState<any>([]);
  const [dataMeta, setDataMeta] = useState({
    currentPage: 1,
    pageSize: 3,
    pages: 0,
    total: 0,
  });
  const fetchHistoryOrdersByUser = async () => {
    if (userAuth?.userData?._id) {
      const response: any = await getOrderByUser(
        userAuth?.userData?._id,
        dataMeta?.currentPage,
        dataMeta?.pageSize
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
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  useEffect(() => {
    fetchHistoryOrdersByUser();
  }, [userAuth]);
  return (
    <div>
      <TableHistoryOrder
        historyOrders={historyOrders}
        dataMeta={dataMeta}
        setDataMeta={setDataMeta}
        setHistoryOrders={setHistoryOrders}
        fetchHistoryOrdersByUser={fetchHistoryOrdersByUser}
      />
    </div>
  );
};

export default HistoryOrderUserPage;
