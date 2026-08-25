import { Button, Form, FormProps, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/user";
import { toast } from "react-toastify";

type FieldType = {
  email: string;
};

const FillEmail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email } = values;
    const response: any = await forgotPassword(email);
    if (response?.statusCode === 200) {
      toast.success("Please check your email!!!");
      navigate("/login");
    }
  };
  return (
    <div className="w-[500px] mx-auto mt-10 bg-white shadow-2xl py-3 px-5 rounded-md">
      <Form name="basic" layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item<FieldType>
          style={{
            marginBottom: "5px",
          }}
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please enter your email",
            },
          ]}
        >
          <Input placeholder="Please enter your email" className="w-full" />
        </Form.Item>
        <div
          className="mx-auto mt-3 w-max"
          onClick={() => {
            form.submit();
          }}
        >
          <Button type="primary">Xác nhận</Button>
        </div>
      </Form>
    </div>
  );
};

export default FillEmail;
