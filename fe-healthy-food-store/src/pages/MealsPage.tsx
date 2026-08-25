import { useEffect, useState } from "react";
import { IMeal } from "../types/typeMeal";
import { getAllMeal, getAllMealWithFilter } from "../services/meal";
import CardList from "../components/Card/CardList";
import { Pagination } from "antd";

const MealsPage = () => {
  const [listMeals, setListMeals] = useState<IMeal[]>([]);
  const [dataMeta, setDataMeta] = useState({
    currentPage: 1,
    pageSize: 8,
    pages: 0,
    total: 0,
  });
  const [filterMeal, setFilterMeal] = useState("");
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
  useEffect(() => {
    fetchDataMeal();
  }, [filterMeal]);
  return (
    <div className="w-[1000px] mx-auto">
      <div className="mt-5">
        <input
          type="text"
          className="w-full border-2 border-black p-2 outline-none rounded-md focus:border-[#80bd96] transition-all"
          placeholder="Tìm kiếm suất ăn..."
          onChange={(e) => setFilterMeal(e.target.value)}
        />
      </div>
      <div className="mt-5">
        <CardList type="meal" listMeals={listMeals} />
      </div>
      <div className="mx-auto mt-8 w-max">
        <Pagination
          total={dataMeta?.total}
          pageSize={dataMeta?.pageSize}
          current={dataMeta?.currentPage}
          onChange={(page, pageSize) => handleOnChange(page, pageSize)}
        />
      </div>
    </div>
  );
};

export default MealsPage;
