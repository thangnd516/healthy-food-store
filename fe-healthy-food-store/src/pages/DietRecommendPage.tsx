import {
  Button,
  Checkbox,
  Form,
  FormProps,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IIngredient } from "../types/typeIngredient";
import { getAllIngredientWithFilter } from "../services/ingredient";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { IIngredientRecommend } from "../types/typeIngredietRecommend";
import { FireOutlined } from "@ant-design/icons";
import "../styles/stylesDietRecommendPage.scss";
import { addNewMealRecommend } from "../services/meal";
import { toast } from "react-toastify";

type FieldType = {
  calories?: number;
  numberOfMeal?: number;
};

const DietRecommendPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;
  const location = useLocation();
  const [isReCalculator, setIsReCalculator] = useState(false);
  const [filterIngredient, setFilterIngredient] = useState("");
  const [listIngredients, setListIngredients] = useState<IIngredient[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [gramon, setGramon] = useState(false);
  const [unhealthyfat, setUnhealthyfat] = useState(true);
  const [cholesterol, setCholesterol] = useState(true);
  const [sugar, setSugar] = useState(true);
  const [sodium, setSodium] = useState(true);
  const [calcium, setCalcium] = useState(true);
  const [iron, setIron] = useState(true);
  const [zinc, setZinc] = useState(true);
  const [nameMeal, setNameMeal] = useState("");
  const [errNameMeal, setErrNameMeal] = useState("");
  const [ingredientsRecommend, setIngredientsRecommend] = useState<
    IIngredientRecommend[]
  >([]);
  const calculatorCaloriesByNumberOfMeal = (
    calo = location?.state?.caloriesOneDay,
    numberOfMeal = 3
  ) => {
    return Math.ceil(calo / numberOfMeal);
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { calories, numberOfMeal } = values;
    location.state = {
      caloriesOneDay: calories,
      numberOfMeal: numberOfMeal,
    };
    setIsReCalculator(!isReCalculator);
  };
  const fetchDataIngredientsWithFilter = async () => {
    const response: any = await getAllIngredientWithFilter(
      1,
      9999,
      filterIngredient
    );
    if (response?.statusCode === 200)
      setListIngredients(response?.ingredientData);
  };
  const handleAddIngredient = (item: IIngredient, id: string) => {
    setFilterIngredient("");
    setIngredients((): any => {
      return [
        ...ingredients.filter((item) => item?._id !== id),
        { ...item, quantity: item?.weight / 100 },
      ];
    });
  };
  const handleOnChangeGram = (iid: string, value: any) => {
    const ingredientsClone = [...ingredients];
    const listIngredientsChange = ingredientsClone?.map((item: IIngredient) => {
      if (item?._id === iid) {
        return { ...item, weight: +value, quantity: +value / 100 };
      }
      return item;
    });
    setIngredients(listIngredientsChange);
  };
  const confirm = async (igredient: IIngredient) => {
    setIngredients(() => {
      return ingredients.filter((item) => item?._id !== igredient?._id);
    });
  };
  const cancel = () => {
    message.error("Click on No");
  };
  const handleCreateMenu = async () => {
    const calories = calculatorCaloriesByNumberOfMeal(
      location?.state?.caloriesOneDay,
      location?.state?.numberOfMeal
    );
    const response: any = await axios.post("http://localhost:5000/diet-list", {
      calories,
      ingredient: ingredients,
      unhealthyfat,
      cholesterol,
      sugar,
      calcium,
      sodium,
      iron,
      zinc,
      gramon: gramon,
    });
    if (response?.status === 200) {
      setIngredientsRecommend(response?.data);
    }
  };
  const calculatorResultIngredientRecommend = (kind: string) => {
    if (kind === "calo") {
      let rsCalo = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsCalo +=
          ingredientsRecommend[i]?.OptimalValue * ingredientsRecommend[i]?.calo;
      }
      return Math.ceil(rsCalo);
    } else if (kind === "weight") {
      let rsWeight = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsWeight +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.weight;
      }
      return Math.ceil(rsWeight);
    } else if (kind === "protein") {
      let rsProtein = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsProtein +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.protein;
      }
      return rsProtein.toFixed(2);
    } else if (kind === "price") {
      let rsPrice = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsPrice +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.price;
      }
      return Math.ceil(rsPrice);
    } else if (kind === "carb") {
      let rsCarb = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsCarb +=
          ingredientsRecommend[i]?.OptimalValue * ingredientsRecommend[i]?.carb;
      }
      return rsCarb.toFixed(2);
    } else if (kind === "fat") {
      let rsFat = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsFat +=
          ingredientsRecommend[i]?.OptimalValue * ingredientsRecommend[i]?.fat;
      }
      return rsFat.toFixed(2);
    } else if (kind === "satFat") {
      let rsSatFat = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsSatFat +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.satFat;
      }
      return rsSatFat.toFixed(2);
    } else if (kind === "transFat") {
      let rsTransFat = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsTransFat +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.transFat;
      }
      return rsTransFat.toFixed(2);
    } else if (kind === "protein") {
      let rsProtein = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsProtein +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.protein;
      }
      return rsProtein.toFixed(2);
    } else if (kind === "fiber") {
      let rsFiber = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsFiber +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.fiber;
      }
      return rsFiber.toFixed(2);
    } else if (kind === "sugar") {
      let rsSugar = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsSugar +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.sugar;
      }
      return rsSugar.toFixed(2);
    } else if (kind === "cholesterol") {
      let rsCholesterol = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsCholesterol +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.cholesterol;
      }
      return rsCholesterol.toFixed(2);
    } else if (kind === "sodium") {
      let rsSodium = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsSodium +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.sodium;
      }
      return rsSodium.toFixed(2);
    } else if (kind === "calcium") {
      let rsCalcium = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsCalcium +=
          ingredientsRecommend[i]?.OptimalValue *
          ingredientsRecommend[i]?.calcium;
      }
      return rsCalcium.toFixed(2);
    } else if (kind === "iron") {
      let rsIron = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsIron +=
          ingredientsRecommend[i]?.OptimalValue * ingredientsRecommend[i]?.iron;
      }
      return rsIron.toFixed(2);
    } else if (kind === "zinc") {
      let rsZinc = 0;
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsZinc +=
          ingredientsRecommend[i]?.OptimalValue * ingredientsRecommend[i]?.zinc;
      }
      return rsZinc.toFixed(2);
    } else if (kind === "desc") {
      let rsDesc = "";
      for (let i = 0; i < ingredientsRecommend?.length; i++) {
        rsDesc += ingredientsRecommend[i]?.desc;
      }
      return rsDesc;
    }
  };
  const handleAddMealRecommend = async () => {
    if (!nameMeal) {
      setErrNameMeal("Vui lòng đặt tên cho suất ăn này");
      return;
    }
    const ingredients = ingredientsRecommend?.map((i: IIngredient) => {
      return { ingredient: i?._id };
    });
    const data = {
      name: nameMeal,
      price: calculatorResultIngredientRecommend("price"),
      calo: calculatorResultIngredientRecommend("calo"),
      weight: calculatorResultIngredientRecommend("weight"),
      fat: calculatorResultIngredientRecommend("fat"),
      satFat: calculatorResultIngredientRecommend("satFat"),
      transFat: calculatorResultIngredientRecommend("transFat"),
      protein: calculatorResultIngredientRecommend("protein"),
      carb: calculatorResultIngredientRecommend("carb"),
      fiber: calculatorResultIngredientRecommend("fiber"),
      sugar: calculatorResultIngredientRecommend("sugar"),
      cholesterol: calculatorResultIngredientRecommend("cholesterol"),
      sodium: calculatorResultIngredientRecommend("sodium"),
      calcium: calculatorResultIngredientRecommend("calcium"),
      iron: calculatorResultIngredientRecommend("iron"),
      zinc: calculatorResultIngredientRecommend("zinc"),
      desc: calculatorResultIngredientRecommend("desc"),
      quantity: 10,
      kind: "mealRecommend",
      ingredients,
    };
    const response: any = await addNewMealRecommend(data, "");
    if (response?.statusCode === 200) {
      toast.success("Bạn đã tạo thành công suất ăn theo yêu cầu của bạn");
      setNameMeal("");
      navigate("/recommend-meals");
    }
  };
  useEffect(() => {
    if (location?.state) {
      form.setFieldValue("calories", location?.state?.caloriesOneDay);
    }
  }, [location?.state, isReCalculator]);
  useEffect(() => {
    fetchDataIngredientsWithFilter();
  }, [filterIngredient]);
  useEffect(() => {
    if (nameMeal) setErrNameMeal("");
  }, [nameMeal]);
  return (
    <div className="w-[1000px] mx-auto mt-10">
      <h1 className="text-center text-[#72a874] font-semibold text-3xl">
        Tạo kế hoạch bữa ăn của bạn ngay tại đây trong vài giây.
      </h1>
      <div className="bg-white shadow-2xl w-[700px] mx-auto mt-5 text-center py-5 px-6 rounded-md">
        <h3 className="text-[#ffa507] font-semibold text-2xl">
          Máy tính theo yêu cầu:
        </h3>
        <div className="w-[250px] mx-auto mt-3 -translate-x-5">
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="horizontal"
            form={form}
            labelCol={{ span: 15 }}
          >
            <Form.Item<FieldType>
              label="Tôi muốn ăn (Kcal)"
              style={{
                marginBottom: "15px",
              }}
              name="calories"
            >
              <InputNumber />
            </Form.Item>
            <Form.Item<FieldType>
              name="numberOfMeal"
              label="Trong 1 ngày tôi ăn:"
              style={{
                marginBottom: "15px",
              }}
            >
              <Select allowClear className="w-full" defaultValue={3}>
                <Option value={1}>1 bữa</Option>
                <Option value={2}>2 bữa</Option>
                <Option value={3}>3 bữa</Option>
                <Option value={4}>4 bữa</Option>
              </Select>
            </Form.Item>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className="translate-x-4"
            >
              Tính
            </Button>
          </Form>
        </div>
        <div className="mt-3">
          <h4 className="text-xl font-semibold">
            Thành phần ăn mà tôi muốn có:
          </h4>
          <div className="relative mt-1">
            <div className="relative">
              <input
                type="text"
                className="w-full border-2 border-black p-2 outline-none rounded-md focus:border-[#80bd96] transition-all"
                placeholder="Tìm kiếm thành phần ăn..."
                value={filterIngredient}
                onChange={(e) => setFilterIngredient(e.target.value)}
              />
              {filterIngredient && (
                <span
                  className="absolute -translate-y-1/2 bg-gray-300 rounded-full top-1/2 right-3 w-[15px] h-[15px] flex items-center justify-center cursor-pointer"
                  onClick={() => setFilterIngredient("")}
                >
                  <CloseOutlined className="w-[8px]" />
                </span>
              )}
            </div>
            {filterIngredient && (
              <div className="bg-white shadow-2xl h-[300px] rounded-md p-5 absolute w-full z-10 overflow-hidden overflow-y-auto">
                {listIngredients?.length > 0 &&
                  listIngredients?.map((item: IIngredient) => (
                    <div
                      key={item?._id}
                      className="flex items-center justify-between pb-1 mt-[10px] border-b border-b-gray-400"
                    >
                      <span>{item?.name}</span>
                      <Button
                        type="primary"
                        onClick={() => handleAddIngredient(item, item?._id)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="px-2 mt-2">
            {ingredients?.length > 0 && (
              <div className="flex items-center mb-3 gap-x-2">
                <Checkbox onChange={() => setGramon(!gramon)}></Checkbox>
                <span>Điều chỉnh lượng gram</span>
              </div>
            )}
            <div>
              {ingredients?.length > 0 &&
                ingredients?.map((item) => (
                  <div
                    key={item?._id}
                    className="flex items-center justify-between py-2 border-b border-b-gray-400"
                  >
                    <span>{item?.name}</span>
                    <div className="flex items-center gap-x-3">
                      {gramon && (
                        <>
                          <Input
                            type="number"
                            defaultValue={item?.weight}
                            min={0}
                            className="w-[80px]"
                            onChange={(e: any) =>
                              handleOnChangeGram(item?._id, e?.target?.value)
                            }
                          />
                          <span>gram</span>
                        </>
                      )}
                      <Popconfirm
                        title="Delete the ingredient"
                        description={`Are you sure to delete this ingredient with name is: ${item?.name}?`}
                        onConfirm={() => confirm(item)}
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
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="p-5 mt-5 border border-gray-500 rounded-sm">
          <h4 className="text-sm">
            Các răng buộc tối ưu về thành phần dinh dưỡng vi lượng:
          </h4>
          <div className="mt-3">
            <div className="pt-2 mt-3 border-t border-t-gray-500">
              <Checkbox
                checked={unhealthyfat}
                onChange={(e) => setUnhealthyfat(e?.target?.checked)}
              >
                Unhealthy fat
              </Checkbox>
              <Checkbox
                checked={cholesterol}
                onChange={(e) => setCholesterol(e?.target?.checked)}
              >
                Cholesterol
              </Checkbox>
              <Checkbox
                checked={sugar}
                onChange={(e) => setSugar(e?.target?.checked)}
              >
                Sugar
              </Checkbox>
              <Checkbox
                checked={sodium}
                onChange={(e) => setSodium(e?.target?.checked)}
              >
                Sodium
              </Checkbox>
              <Checkbox
                checked={calcium}
                onChange={(e) => setCalcium(e?.target?.checked)}
              >
                Calcium
              </Checkbox>
              <Checkbox
                checked={iron}
                onChange={(e) => setIron(e?.target?.checked)}
              >
                Iron
              </Checkbox>
              <Checkbox
                checked={zinc}
                onChange={(e) => setZinc(e?.target?.checked)}
              >
                Zinc
              </Checkbox>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-xl font-semibold text-[#008000]">
            Một bữa ăn của bạn sẽ có:{" "}
            {calculatorCaloriesByNumberOfMeal(
              location?.state?.caloriesOneDay,
              location?.state?.numberOfMeal
            )}{" "}
            Calories
          </p>
          <Button
            type="primary"
            className="mt-3"
            onClick={() => handleCreateMenu()}
          >
            Tạo thực đơn
          </Button>
        </div>
      </div>
      {ingredientsRecommend?.length > 0 && (
        <div className="mt-5">
          <h1 className="font-semibold text-l">Today's Meal Plan</h1>
          <div className="px-2 py-4 mt-2 border border-gray-500 rounded">
            <span className="flex items-center font-semibold gap-x-1">
              <FireOutlined
                style={{
                  fontSize: "20px",
                }}
              />
              Kết quả: {calculatorResultIngredientRecommend("calo")} KCal
            </span>
          </div>
          <div className="py-10 mt-5 bg-white rounded shadow-2xl">
            <div className="pb-6 border-b border-b-gray-500">
              <div className="relative flex mx-auto w-max gap-x-2">
                <div className="h-[25px] flex flex-col gap-y-1">
                  <Input
                    value={nameMeal}
                    onChange={(e: any) => setNameMeal(e?.target?.value)}
                    placeholder="Vui lòng đặt tên cho suất ăn..."
                    className="w-[250px]"
                  />
                  <p className="text-[13px] text-red-500">
                    {errNameMeal && errNameMeal}
                  </p>
                </div>
                <Button type="primary" onClick={handleAddMealRecommend}>
                  Lưu
                </Button>
                <Tooltip
                  title={`Giá: ${calculatorResultIngredientRecommend(
                    "price"
                  )?.toLocaleString("it-IT")} VND`}
                >
                  <Button type="primary" className="detail-meal-button">
                    Chi tiết bữa ăn
                  </Button>
                </Tooltip>
                <div className="w-[280px] bg-black rounded absolute top-10 -right-12 text-white py-3 px-2 detail-meal z-10">
                  <h2 className="pb-2 mb-2 text-center border-b border-b-white">
                    Thông tin dinh dưỡng
                  </h2>
                  <div className="flex flex-col gap-y-[6px]">
                    <div className="flex items-center justify-between">
                      <span>Serving Size:</span>
                      <span>
                        {calculatorResultIngredientRecommend("weight")} gram
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Calories:</span>
                      <span>
                        {calculatorResultIngredientRecommend("calo")} KCal
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Protein:</span>
                      <span>
                        {calculatorResultIngredientRecommend("protein")} g
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Carb:</span>
                      <span>
                        {calculatorResultIngredientRecommend("carb")} g
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Fat:</span>
                      <span>
                        {calculatorResultIngredientRecommend("fat")} g
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sat Fat:</span>
                      <span>
                        {calculatorResultIngredientRecommend("satFat")} g
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trans Fat:</span>
                      <span>
                        {calculatorResultIngredientRecommend("transFat")} g
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fiber:</span>
                      <span>
                        {calculatorResultIngredientRecommend("fiber")} g
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sugar:</span>
                      <span>
                        {calculatorResultIngredientRecommend("sugar")} g
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cholesterol:</span>
                      <span>
                        {calculatorResultIngredientRecommend("cholesterol")} mg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sodium:</span>
                      <span>
                        {calculatorResultIngredientRecommend("sodium")} mg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Iron:</span>
                      <span>
                        {calculatorResultIngredientRecommend("iron")} mg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Calcium:</span>
                      <span>
                        {calculatorResultIngredientRecommend("calcium")} mg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Zinc:</span>
                      <span>
                        {calculatorResultIngredientRecommend("zinc")} mg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-16">
              <div className="flex flex-wrap pl-10 mt-7 gap-x-5 gap-y-5">
                {ingredientsRecommend?.length > 0 &&
                  ingredientsRecommend?.map((i: IIngredientRecommend) => (
                    <div
                      key={i?._id}
                      className="flex items-center gap-x-3 w-[46%]"
                    >
                      <div className="w-[100px] h-[100px]">
                        <img
                          src={i?.image}
                          alt=""
                          className="object-cover w-full h-full rounded-md"
                        />
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <span className="font-semibold">{i?.name}</span>
                        <span>{Math.ceil(i?.weight * i?.OptimalValue)} g</span>
                      </div>
                      <div className="relative ml-auto">
                        <Tooltip
                          title={`Giá: ${(
                            i?.price * i?.OptimalValue
                          )?.toLocaleString("it-IT")} VND`}
                        >
                          <Button type="primary" className="infor-button">
                            Chi tiết
                          </Button>
                        </Tooltip>
                        <div className="w-[280px] bg-black rounded absolute top-10 -right-12 text-white py-3 px-2 infor-nutire z-10">
                          <h2 className="pb-2 mb-2 text-center border-b border-b-white">
                            Thông tin dinh dưỡng
                          </h2>
                          <div className="flex flex-col gap-y-[6px]">
                            <div className="flex items-center justify-between">
                              <span>Serving Size:</span>
                              <span>
                                {Math.ceil(i?.weight * i?.OptimalValue)} gram
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Calories:</span>
                              <span>
                                {(i?.calo * i?.OptimalValue).toFixed(2)} KCal
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Protein:</span>
                              <span>
                                {(i?.protein * i?.OptimalValue).toFixed(2)} g
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Total Carb:</span>
                              <span>
                                {(i?.carb * i?.OptimalValue).toFixed(2)} g
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Total Fat:</span>
                              <span>
                                {(i?.fat * i?.OptimalValue).toFixed(2)} g
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Sat Fat:</span>
                              <span>
                                {(i?.satFat * i?.OptimalValue).toFixed(2)} g
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Trans Fat:</span>
                              <span>
                                {(i?.transFat * i?.OptimalValue).toFixed(2)} g
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Fiber:</span>
                              <span>
                                {(i?.fiber * i?.OptimalValue).toFixed(2)} g
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Sugar:</span>
                              <span>
                                {(i?.sugar * i?.OptimalValue).toFixed(2)} g
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Cholesterol:</span>
                              <span>
                                {(i?.cholesterol * i?.OptimalValue).toFixed(2)}{" "}
                                mg
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Sodium:</span>
                              <span>
                                {(i?.sodium * i?.OptimalValue).toFixed(2)} mg
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Iron:</span>
                              <span>
                                {(i?.iron * i?.OptimalValue).toFixed(2)} mg
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Calcium:</span>
                              <span>
                                {(i?.calcium * i?.OptimalValue).toFixed(2)} mg
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Zinc:</span>
                              <span>
                                {(i?.zinc * i?.OptimalValue).toFixed(2)} mg
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietRecommendPage;
