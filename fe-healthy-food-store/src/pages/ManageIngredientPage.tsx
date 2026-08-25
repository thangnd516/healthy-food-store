import { Button } from "antd";
import HeadingDashboard from "../components/HeadingDashboard/HeadingDashboard";
import { MdOutlineSetMeal } from "react-icons/md";
import { useEffect, useState } from "react";
import ModalAddNewIngredient from "../components/Modal/ModalIngredient/ModalAddNewIngredient";
import {
  getAllIngredient,
  getAllIngredientWithFilter,
} from "../services/ingredient";
import { IIngredient } from "../types/typeIngredient";
import TableIngredient from "../components/Table/TableIngredient";
import ModalEditIngredient from "../components/Modal/ModalIngredient/ModalEditIngredient";

const ManageIngredientPage = () => {
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [listIngredients, setListIngredients] = useState<IIngredient[]>([]);
  const [dataMeta, setDataMeta] = useState({
    currentPage: 1,
    pageSize: 3,
    pages: 0,
    total: 0,
  });
  const [filterIngredient, setFilterIngredient] = useState("");
  const [dataEditIngredient, setDataEditIngredient] =
    useState<IIngredient | null>(null);
  const fetchDataIngredient = async () => {
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
  useEffect(() => {
    fetchDataIngredient();
  }, [filterIngredient]);
  return (
    <div className="pt-10">
      <HeadingDashboard heading="Quản lý thành phần ăn" />
      <div className="text-center mt-5 w-[800px] mx-auto">
        <div>
          <input
            type="text"
            className="w-full border-2 border-black p-2 outline-none rounded-md focus:border-[#80bd96] transition-all"
            placeholder="Tìm kiếm thành phần ăn..."
            onChange={(e) => setFilterIngredient(e.target.value)}
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
            <MdOutlineSetMeal size="18px" />
            <span className="text-2xl font-semibold -translate-y-[2px]">+</span>
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <TableIngredient
          listIngredients={listIngredients}
          filterIngredient={filterIngredient}
          setDataMeta={setDataMeta}
          setListIngredients={setListIngredients}
          dataMeta={dataMeta}
          setIsModalOpenEdit={setIsModalOpenEdit}
          setDataEditIngredient={setDataEditIngredient}
          fetchDataIngredient={fetchDataIngredient}
        />
      </div>
      <ModalAddNewIngredient
        isModalOpenAdd={isModalOpenAdd}
        setIsModalOpenAdd={setIsModalOpenAdd}
        fetchDataIngredient={fetchDataIngredient}
      />
      <ModalEditIngredient
        isModalOpenEdit={isModalOpenEdit}
        setIsModalOpenEdit={setIsModalOpenEdit}
        dataEditIngredient={dataEditIngredient}
        fetchDataIngredient={fetchDataIngredient}
        setDataEditIngredient={setDataEditIngredient}
      />
    </div>
  );
};

export default ManageIngredientPage;
