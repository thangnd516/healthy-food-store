import { Button, Form, FormProps, Input, InputNumber, Modal } from "antd";
import { toast } from "react-toastify";
import { CameraOutlined } from "@ant-design/icons";
import { addNewIngredient } from "../../../services/ingredient";
import { useState } from "react";
import axios from "axios";

interface IProps {
  isModalOpenAdd: boolean;
  setIsModalOpenAdd(isModalOpenAdd: boolean): void;
  fetchDataIngredient(): void;
}

type FieldType = {
  name: string;
  weight: string;
  price: string;
  calo: string;
  protein: string;
  fat: string;
  satFat: string;
  transFat: string;
  carb: string;
  fiber: string;
  sugar: string;
  cholesterol: string;
  sodium: string;
  calcium: string;
  iron: string;
  zinc: string;
  desc: string;
  image: string;
};

const ModalAddNewIngredient = (props: IProps) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { isModalOpenAdd, setIsModalOpenAdd, fetchDataIngredient } = props;
  const [imageIngredient, setImageIngredient] = useState("");
  const [imageIngredientDisplay, setImageIngredientDisplay] = useState("");
  const handleCancel = () => {
    setIsModalOpenAdd(false);
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const {
      name,
      weight,
      price,
      calo,
      protein,
      fat,
      satFat,
      transFat,
      carb,
      fiber,
      sugar,
      cholesterol,
      sodium,
      calcium,
      iron,
      zinc,
      desc,
    } = values;
    const response: any = await addNewIngredient(
      name,
      weight,
      price,
      calo,
      protein,
      fat,
      satFat,
      transFat,
      carb,
      fiber,
      sugar,
      cholesterol,
      sodium,
      calcium,
      iron,
      zinc,
      desc,
      imageIngredient
    );
    if (response.statusCode === 200) {
      toast.success("Create new ingredient successfully!");
      form.resetFields();
      setIsModalOpenAdd(false);
      setImageIngredient("");
      setImageIngredientDisplay("");
      await fetchDataIngredient();
      await axios.get("http://localhost:5000/fetching");
    } else {
      toast.error(response.message);
    }
  };
  const handleChangeImage = (event: any) => {
    setImageIngredientDisplay(URL.createObjectURL(event.target.files[0]));
    setImageIngredient(event.target.files[0]);
  };
  return (
    <>
      <Modal
        title="Thêm thành phần ăn"
        open={isModalOpenAdd}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        width={950}
        maskClosable={false}
      >
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <div>
            <input
              id="imageIngredientAdd"
              type="file"
              onChange={(event) => handleChangeImage(event)}
              style={{
                display: "none",
              }}
            />
            <div className="border border-black relative w-[200px] h-[200px] mt-2 rounded-full mx-auto">
              <div className="absolute bottom-0 shadow-sm right-5">
                <Button>
                  <label
                    htmlFor="imageIngredientAdd"
                    className="block mx-auto cursor-pointer"
                  >
                    <CameraOutlined />
                  </label>
                </Button>
              </div>
              {imageIngredientDisplay ? (
                <img
                  src={imageIngredientDisplay}
                  alt=""
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <span className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  Preview Image
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-x-5">
            <div className="w-[33.33%]">
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input ingredient of name!",
                  },
                ]}
              >
                <Input
                  placeholder="Please enter ingredient of name"
                  className="w-full"
                />
              </Form.Item>
            </div>
            <div className="w-[33.33%]">
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Khối lượng (g)"
                name="weight"
                rules={[
                  {
                    required: true,
                    message: "Please input ingredient of weight!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Please enter ingredient of weight"
                  className="w-full"
                />
              </Form.Item>
            </div>
            <div className="w-[33.33%]">
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Giá (VND)"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input ingredient of price!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Please enter ingredient of price"
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <Form.Item<FieldType>
              style={{
                marginBottom: "5px",
              }}
              label="Mô tả"
              name="desc"
              rules={[
                {
                  required: true,
                  message: "Please input ingredient of desc!",
                },
              ]}
            >
              <TextArea
                placeholder="Please enter ingredient of description"
                autoSize={{ minRows: 5, maxRows: 7 }}
              />
            </Form.Item>
          </div>
          <div>
            <h2 className="pb-2 my-5 text-base font-semibold text-center border-b border-solid border-b-black">
              Thông tin dinh dưỡng
            </h2>
            <div className="flex gap-x-3">
              <div className="w-1/4">
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Calories (KCal)"
                  name="calo"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of calories!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Please input ingredient of calories"
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <div className="w-1/4">
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Protein (g)"
                  name="protein"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of protein!",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Please input ingredient of protein"
                  />
                </Form.Item>
              </div>
              <div className="w-1/4">
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Cholesterol (mg)"
                  name="cholesterol"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of cholesterol!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Please input ingredient of cholesterol"
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <div className="w-1/4">
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Sodium (mg)"
                  name="sodium"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of sodium!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Please input ingredient of sodium"
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="flex gap-x-3">
              <div className="w-[33.33%]">
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Total Fat (g)"
                  name="fat"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of total fat!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Please input ingredient of total fat"
                    className="w-full"
                  />
                </Form.Item>
                <div className="flex flex-col items-center justify-center">
                  <Form.Item<FieldType>
                    style={{
                      marginBottom: "5px",
                    }}
                    label="Sat Fat (g)"
                    name="satFat"
                    rules={[
                      {
                        required: true,
                        message: "Please input ingredient of sat fat!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Please input ingredient of sat fat"
                      className="w-full"
                    />
                  </Form.Item>
                  <Form.Item<FieldType>
                    style={{
                      marginBottom: "5px",
                    }}
                    label="Trans Fat (g)"
                    name="transFat"
                    rules={[
                      {
                        required: true,
                        message: "Please input ingredient of transfat!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Please input ingredient of transfat"
                      className="w-full"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="w-[33.33%]">
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Total Carb (g)"
                  name="carb"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of total carb!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Please input ingredient of total carb"
                    className="w-full"
                  />
                </Form.Item>
                <div className="flex flex-col items-center justify-center">
                  <Form.Item<FieldType>
                    style={{
                      marginBottom: "5px",
                    }}
                    label="Fiber (g)"
                    name="fiber"
                    rules={[
                      {
                        required: true,
                        message: "Please input ingredient of fiber!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Please input ingredient of fiber"
                      className="w-full"
                    />
                  </Form.Item>
                  <Form.Item<FieldType>
                    style={{
                      marginBottom: "5px",
                    }}
                    label="Sugar (g)"
                    name="sugar"
                    rules={[
                      {
                        required: true,
                        message: "Please input ingredient of sugar!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Please input ingredient of sugar"
                      className="w-full"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="w-[33.33%]">
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Calcium (mg)"
                  name="calcium"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of calcium!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Please input ingredient of calcium"
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Iron (mg)"
                  name="iron"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of iron!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Please input ingredient of iron"
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginBottom: "5px",
                  }}
                  label="Zinc (mg)"
                  name="zinc"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient of zinc!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Please input ingredient of zinc"
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default ModalAddNewIngredient;
