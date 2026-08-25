import { useEffect, useState } from "react";
import {
  getAllIngredient,
  getAllIngredientWithFilter,
} from "../services/ingredient";
import { IIngredient } from "../types/typeIngredient";
import CardList from "../components/Card/CardList";
import { Pagination } from "antd";

const IngredientsPage = () => {
  const [listIngredients, setListIngredients] = useState<IIngredient[]>([]);
  const [filterIngredient, setFilterIngredient] = useState("");
  const [dataMeta, setDataMeta] = useState({
    currentPage: 1,
    pageSize: 8,
    pages: 0,
    total: 0,
  });
  const fetchDataIngredients = async () => {
    if (filterIngredient) {
      const response: any = await getAllIngredientWithFilter(
        dataMeta?.currentPage,
        dataMeta?.pageSize,
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
      const response: any = await getAllIngredient(
        dataMeta?.currentPage,
        dataMeta?.pageSize
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
    }
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
  useEffect(() => {
    fetchDataIngredients();
  }, [filterIngredient]);
  return (
    <div className="w-[1000px] mx-auto">
      <div className="mt-5">
        <input
          type="text"
          className="w-full border-2 border-black p-2 outline-none rounded-md focus:border-[#80bd96] transition-all"
          placeholder="Tìm kiếm thành phần ăn..."
          onChange={(e) => setFilterIngredient(e.target.value)}
        />
      </div>
      <div className="mt-5">
        <CardList type="ingredient" listIngredients={listIngredients} />
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

export default IngredientsPage;
