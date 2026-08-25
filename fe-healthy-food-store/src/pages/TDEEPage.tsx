import { Button, Form, FormProps, InputNumber, Radio, Select } from "antd";
import { useNavigate } from "react-router-dom";

type FieldType = {
  gender?: string;
  age?: number;
  weight?: number;
  height?: number;
  activity?: number;
};

const TDEEPage = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { gender, age, height, weight, activity } = values;
    navigate("/tdee-calculator/result", {
      state: {
        gender,
        age,
        height,
        weight,
        activity,
      },
    });
  };
  return (
    <div className="w-[1000px] mx-auto mt-10">
      <h1 className="text-center text-[#72a874] font-semibold text-3xl">
        Tìm hiểu xem bạn đốt cháy bao nhiêu calo mỗi ngày
      </h1>
      <div className="flex flex-col mt-3 text-center gap-y-2">
        <p>
          Sử dụng máy tính TDEE để tìm hiểu Tổng Chi tiêu Năng lượng Hàng ngày
          của bạn, thước đo lượng calo bạn đốt mỗi ngày.
        </p>
        <p>
          Máy tính calo này cũng sẽ hiển thị BMI, BMR, Macro và nhiều thống kê
          hữu ích khác của bạn!
        </p>
        <div className="w-[500px] mx-auto mt-3">
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 10 }}
            layout="horizontal"
            form={form}
          >
            <Form.Item
              label="Giới tính"
              name="gender"
              style={{
                marginBottom: "15px",
              }}
            >
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item<FieldType>
              style={{
                marginBottom: "15px",
              }}
              label="Tuổi"
              name="age"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item<FieldType>
              style={{
                marginBottom: "15px",
              }}
              label="Cân nặng"
              name="weight"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <InputNumber placeholder="kg" />
            </Form.Item>
            <Form.Item<FieldType>
              style={{
                marginBottom: "15px",
              }}
              label="Chiều cao"
              name="height"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <InputNumber placeholder="cm" />
            </Form.Item>
            <Form.Item<FieldType>
              label="Mức độ vận động trong ngày"
              name="activity"
              rules={[{ required: true }]}
              style={{
                marginBottom: "15px",
              }}
            >
              <Select
                placeholder="Select a option and change input text above"
                allowClear
              >
                <Option value={1.2}>Vận động ít</Option>
                <Option value={1.375}>Vận động nhẹ</Option>
                <Option value={1.55}>Vận động trung bình</Option>
                <Option value={1.725}>Vận động nặng</Option>
                <Option value={1.9}>Vận động viên</Option>
              </Select>
            </Form.Item>
            <Button type="primary" onClick={() => form.submit()}>
              Tính
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default TDEEPage;
