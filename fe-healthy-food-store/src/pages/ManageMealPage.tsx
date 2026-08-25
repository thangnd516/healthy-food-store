import { Button } from "antd";
import HeadingDashboard from "../components/HeadingDashboard/HeadingDashboard";
import { GiMeal } from "react-icons/gi";
import { useEffect, useState } from "react";
import ModalAddNewMeal from "../components/Modal/ModalMeal/ModalAddNewMeal";
import TableMeal from "../components/Table/TableMeal";
import { IMeal } from "../types/typeMeal";
import { getAllMeal, getAllMealWithFilter } from "../services/meal";
import ModalAddEditMeal from "../components/Modal/ModalMeal/ModalEditMeal";

const ManageMealPage = () => {
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [listMeals, setListMeals] = useState<IMeal[]>([]);
  const [dataMeta, setDataMeta] = useState({
    currentPage: 1,
    pageSize: 3,
    pages: 0,
    total: 0,
  });
  const [filterMeal, setFilterMeal] = useState("");
  const [dataEditMeal, setDataEditMeal] = useState<IMeal | null>(null);
  const fetchDataMeal = async () => {
    if (filterMeal) {
      const response: any = await getAllMealWithFilter(
        dataMeta?.currentPage,
        dataMeta?.pageSize,
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
      const response: any = await getAllMeal(
        dataMeta?.currentPage,
        dataMeta?.pageSize
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
    }
  };
  useEffect(() => {
    fetchDataMeal();
  }, [filterMeal]);
  return (
    <div className="pt-10">
      <HeadingDashboard heading="Quản lý suất ăn" />
      <div className="text-center mt-5 w-[800px] mx-auto">
        <div>
          <input
            type="text"
            className="w-full border-2 border-black p-2 outline-none rounded-md focus:border-[#80bd96] transition-all"
            placeholder="Tìm kiếm suất ăn..."
            onChange={(e) => setFilterMeal(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button
            style={{
              backgroundColor: "#488a5c",
              color: "white",
            }}
            className="flex items-center justify-center gap-x-[2px]"
            onClick={() => setIsModalOpenAdd(true)}
          >
            <GiMeal size="18px" />
            <span className="text-2xl font-semibold -translate-y-[2px]">+</span>
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <TableMeal
          listMeals={listMeals}
          filterMeal={filterMeal}
          setDataMeta={setDataMeta}
          setListMeals={setListMeals}
          dataMeta={dataMeta}
          setIsModalOpenEdit={setIsModalOpenEdit}
          setDataEditMeal={setDataEditMeal}
          fetchDataMeal={fetchDataMeal}
        />
      </div>
      <ModalAddNewMeal
        isModalOpenAdd={isModalOpenAdd}
        setIsModalOpenAdd={setIsModalOpenAdd}
        fetchDataMeal={fetchDataMeal}
      />
      <ModalAddEditMeal
        isModalOpenEdit={isModalOpenEdit}
        setIsModalOpenEdit={setIsModalOpenEdit}
        dataEditMeal={dataEditMeal}
        fetchDataMeal={fetchDataMeal}
      />
    </div>
  );
};

export default ManageMealPage;
