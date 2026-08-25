import { Button, Form, FormProps, Input } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/user";
import { toast } from "react-toastify";

type FieldType = {
  password: string;
};

const FillNewPassword = () => {
  const navigate = useNavigate();
  const { tokenpassword } = useParams();
  const [form] = Form.useForm();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { password } = values;
    if (tokenpassword) {
      const response: any = await resetPassword(tokenpassword, password);
      if (response?.statusCode === 200) {
        toast.success("Reset password successfully!!!");
        navigate("/login");
      }
    }
  };
  return (
    <div className="w-[500px] mx-auto mt-10 bg-white shadow-2xl py-3 px-5 rounded-md">
      <Form name="basic" layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item<FieldType>
          style={{
            marginBottom: "7px",
          }}
          label="New password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
            {
              min: 3,
              max: 10,
              message: "Password length is from 3 to 6 characters",
            },
          ]}
        >
          <Input.Password
            placeholder="Please enter your password"
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Please enter your confirm password" />
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

export default FillNewPassword;
