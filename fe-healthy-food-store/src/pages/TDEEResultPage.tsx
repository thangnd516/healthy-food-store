import {
  Button,
  Form,
  FormProps,
  InputNumber,
  Radio,
  Select,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type FieldType = {
  gender?: string;
  age?: number;
  weight?: number;
  height?: number;
  activity?: number;
};

const TDEEResultPage = () => {
  const [isReCalculator, setIsReCalculator] = useState(false);
  const location = useLocation();
  const [form] = Form.useForm();
  const { Option } = Select;
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { gender, weight, height, age, activity } = values;
    location.state = {
      gender,
      weight,
      height,
      age,
      activity,
    };
    setIsReCalculator(!isReCalculator);
  };
  const calculatorTDEE = (
    gender = location?.state?.gender,
    weight = location?.state?.weight,
    height = location?.state?.height,
    age = location?.state?.age,
    activity = location?.state?.activity
  ) => {
    let resultTDEE = 0;
    if (gender === "male") {
      resultTDEE = Math.ceil(
        (10 * weight + 6.25 * height - 5 * age + 5) * activity
      );
    } else if (gender === "female") {
      resultTDEE = Math.ceil(
        (10 * weight + 6.25 * height - 5 * age - 161) * activity
      );
    }
    return resultTDEE;
  };
  const calculatorBMI = () => {
    const resultBMI =
      location?.state?.weight / Math.pow(location?.state?.height / 100, 2);
    return resultBMI.toFixed(2);
  };
  const statusFromBMI = () => {
    const resultBMI = Number(calculatorBMI());
    if (typeof resultBMI === "number") {
      if (resultBMI < 18.5) return "Thiếu cân";
      else if (resultBMI >= 18.5 && resultBMI <= 24.99)
        return "Cân nặng bình thường";
      else if (resultBMI >= 25 && resultBMI <= 29.99) return "Quá cân";
      else return "Béo phì";
    }
  };
  const calculatorTDEEByActivity = (activity: number) => {
    if (location?.state?.gender === "male") {
      if (
        activity === 1.2 ||
        activity === 1.375 ||
        activity === 1.55 ||
        activity === 1.725 ||
        activity === 1.9
      )
        return Math.ceil(
          (10 * location?.state?.weight +
            6.25 * location?.state?.height -
            5 * location?.state?.age +
            5) *
            activity
        );
    } else if (location?.state?.gender === "female") {
      if (
        activity === 1.2 ||
        activity === 1.375 ||
        activity === 1.55 ||
        activity === 1.725 ||
        activity === 1.9
      )
        return Math.ceil(
          (10 * location?.state?.weight +
            6.25 * location?.state?.height -
            5 * location?.state?.age -
            161) *
            activity
        );
    }
  };
  const calculateIdealWeight = (
    gender = location?.state?.gender,
    height = location?.state?.height
  ) => {
    let idealWeight = 0;
    if (gender === "male") {
      idealWeight = 48 + 2.7 * ((height - 152.4) / 2.54);
    } else if (gender === "female") {
      idealWeight = 45.5 + 2.2 * ((height - 152.4) / 2.54);
    }
    return Math.ceil(idealWeight);
  };
  const calculateCaloriesOneDay = () => {
    const resultBMI = Number(calculatorBMI());
    if (typeof resultBMI === "number") {
      if (resultBMI < 18.5) return calculatorTDEE() + 300;
      else if (resultBMI >= 18.5 && resultBMI <= 24.99) return calculatorTDEE();
      else if (resultBMI >= 25 && resultBMI <= 29.99)
        return calculatorTDEE() - 300;
      else return calculatorTDEE() - 500;
    }
  };
  useEffect(() => {
    if (location?.state) {
      form.setFieldsValue({
        gender: location?.state?.gender,
        age: location?.state?.age,
        weight: location?.state?.weight,
        height: location?.state?.height,
        activity: location?.state?.activity,
      });
    }
  }, [location?.state, isReCalculator]);
  return (
    <div className="w-[1200px] mx-auto mt-10">
      <div className="border-b-2 border-b-[#7e907e]">
        <h1 className="text-center text-[#72a874] font-semibold text-3xl">
          Thông tin TDEE
        </h1>
        <div className="w-[650px] mx-auto mt-10">
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="horizontal"
            form={form}
          >
            <div className="flex gap-x-3">
              <div className="flex w-1/4">
                <span className="pt-1 pr-2 whitespace-nowrap">Bạn là:</span>
                <Form.Item
                  name="gender"
                  style={{
                    marginBottom: "15px",
                  }}
                >
                  <Radio.Group>
                    <div className="flex">
                      <Radio value="male">Nam</Radio>
                      <Radio value="female">Nữ</Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className="flex w-1/4">
                <span className="pt-1 pr-2">,với:</span>
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "15px",
                  }}
                  name="age"
                >
                  <InputNumber />
                </Form.Item>
                <span className="inline-block pt-1 pl-2">tuổi,</span>
              </div>
              <div className="flex w-1/4 gap-x-2">
                <span className="pt-1 pr-2">nặng:</span>
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "15px",
                  }}
                  name="weight"
                >
                  <InputNumber placeholder="kg" />
                </Form.Item>
                <span className="pt-1">kg,</span>
              </div>
              <div className="flex w-1/4">
                <span className="pt-1 pr-2">cao:</span>
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "15px",
                  }}
                  name="height"
                >
                  <InputNumber placeholder="cm" />
                </Form.Item>
                <span className="pt-1 pl-2">cm,</span>
              </div>
            </div>
            <div className="flex gap-x-5">
              <div className="w-[400px]">
                <Form.Item<FieldType>
                  name="activity"
                  label="với mức độ vận động"
                  style={{
                    marginBottom: "15px",
                  }}
                >
                  <Select
                    placeholder="Select a option and change input text above"
                    allowClear
                    className="w-full"
                  >
                    <Option value={1.2}>Vận động ít</Option>
                    <Option value={1.375}>Vận động nhẹ</Option>
                    <Option value={1.55}>Vận động trung bình</Option>
                    <Option value={1.725}>Vận động nặng</Option>
                    <Option value={1.9}>Vận động viên</Option>
                  </Select>
                </Form.Item>
              </div>
              <Button type="primary" onClick={() => form.submit()}>
                Tính lại
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <div className="px-8 mt-8">
        <h1 className="text-center text-[#427f50] font-semibold text-3xl">
          Mức năng lượng (calories) duy trì của bạn là
        </h1>
        <div className="flex mt-5 gap-x-10">
          <div className="w-[30%]">
            <div className="bg-[#5ca874] py-5 rounded-md text-white font-semibold text-xl">
              <div className="flex flex-col items-center pb-3 border-b border-b-white">
                <span>{calculatorTDEE()}</span>
                <span>năng lượng trên một ngày</span>
              </div>
              <div className="flex flex-col items-center mt-5">
                <span>{calculatorTDEE() * 7}</span>
                <span>năng lượng trên một tuần</span>
              </div>
            </div>
            <div className="px-5 mt-5">
              <h2 className="text-[#5ca874] text-center font-semibold text-lg">
                Cân nặng lý tưởng:
              </h2>
              <span className="text-[#488a5c] text-center block font-semibold text-4xl">
                {`${calculateIdealWeight()} kg`}
              </span>
              <p className="text-sm font-semibold">
                {`Trọng lượng cơ thể lý tưởng của bạn được ước tính là ${calculateIdealWeight()} kg`}
              </p>
              <p className="text-xs font-thin text-center">
                G.J. Hamwi Formula (1964)
              </p>
            </div>
            <div
              className="mx-auto mt-5 w-max"
              onClick={() =>
                navigate("/diet-recommend", {
                  state: {
                    caloriesOneDay: calculateCaloriesOneDay(),
                  },
                })
              }
            >
              <Tooltip
                placement="top"
                title={`${calculateCaloriesOneDay()} calories trên 1 ngày`}
                color="#5ca874"
              >
                <Button type="primary">Chưa biết nên ăn gì?</Button>
              </Tooltip>
            </div>
            <span className="inline-block mt-3 text-base text-center">
              Dựa vào chỉ số hiện tại, bạn nên ăn{" "}
              <span className="text-[#5ca874] font-semibold">
                {calculateCaloriesOneDay()}{" "}
              </span>
              calories trên 1 ngày
            </span>
          </div>
          <div className="w-[70%]">
            <p className="text-sm font-semibold">
              Dựa trên số liệu thống kê của bạn, ước tính tốt nhất cho lượng
              calo duy trì của bạn là{" "}
              <span className="text-[#5ca874]">{calculatorTDEE()}</span> calo
              mỗi ngày dựa trên Công thức Mifflin-St. Jeor, được biết đến rộng
              rãi là khá chính xác khi cung cấp giới tính, độ tuổi, chiều cao,
              cân nặng.
            </p>
            <div className="mt-7">
              <p className="text-sm font-semibold">
                Bảng dưới đây cho thấy sự khác biệt nếu bạn đã chọn một cấp độ
                hoạt động khác:
              </p>
              <div className="w-[600px] mt-3 flex flex-col gap-y-[6px] text-sm font-semibold">
                <div
                  className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                    location?.state?.activity === 1.2 && "text-[#427f50]"
                  }`}
                >
                  <span>Vận động ít</span>
                  <div className="flex gap-x-3">
                    <span>{calculatorTDEEByActivity(1.2)}</span>
                    <span>năng lượng / ngày</span>
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                    location?.state?.activity === 1.375 && "text-[#427f50]"
                  }`}
                >
                  <span>Vận động nhẹ</span>
                  <div className="flex gap-x-3">
                    <span>{calculatorTDEEByActivity(1.375)}</span>
                    <span>năng lượng / ngày</span>
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                    location?.state?.activity === 1.55 && "text-[#427f50]"
                  }`}
                >
                  <span>Vận động trung bình</span>
                  <div className="flex gap-x-3">
                    <span>{calculatorTDEEByActivity(1.55)}</span>
                    <span>năng lượng / ngày</span>
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                    location?.state?.activity === 1.725 && "text-[#427f50]"
                  }`}
                >
                  <span>Vận động nặng</span>
                  <div className="flex gap-x-3">
                    <span>{calculatorTDEEByActivity(1.725)}</span>
                    <span>năng lượng / ngày</span>
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                    location?.state?.activity === 1.9 && "text-[#427f50]"
                  }`}
                >
                  <span>Vận động viên</span>
                  <div className="flex gap-x-3">
                    <span>{calculatorTDEEByActivity(1.9)}</span>
                    <span>năng lượng / ngày</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="block text-2xl font-semibold text-[#47826d] mt-10">
              BMI Score: {calculatorBMI()}
            </span>
            <span className="block mt-1 text-xl">
              BMI của bạn là {calculatorBMI()}, có nghĩa là bạn được phân loại
              là: <span className="font-semibold">{statusFromBMI()}</span>{" "}
            </span>
            <div className="w-[450px] mt-3 flex flex-col gap-y-[6px] font-semibold text-sm">
              <div
                className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                  Number(calculatorBMI()) < 18.5 && "text-[#427f50]"
                }`}
              >
                <span>18.5 hoặc thấp hơn</span>
                <span>Thiếu cân</span>
              </div>
              <div
                className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                  Number(calculatorBMI()) >= 18.5 &&
                  Number(calculatorBMI()) < 24.99 &&
                  "text-[#427f50]"
                }`}
              >
                <span>18.5 - 24.99</span>
                <span>Cân nặng bình thường</span>
              </div>
              <div
                className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                  Number(calculatorBMI()) >= 25 &&
                  Number(calculatorBMI()) < 29.99 &&
                  "text-[#427f50]"
                }`}
              >
                <span>25 - 29.99</span>
                <span>Quá cân</span>
              </div>
              <div
                className={`flex items-center justify-between pb-1 border-b border-b-gray-400 ${
                  Number(calculatorBMI()) >= 30 && "text-[#427f50]"
                }`}
              >
                <span>30+</span>
                <span>Béo phì</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TDEEResultPage;
