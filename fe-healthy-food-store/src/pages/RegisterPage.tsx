import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import logo from "../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { postRegister } from "../services/auth";
import { toast } from "react-toastify";
import { useState } from "react";
import Loading from "../components/Loading/Loading";

type FieldType = {
  email: string;
  password: string;
  username: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsLoading(true);
    const response: any = await postRegister(
      values.email,
      values.password,
      values.username
    );
    if (response.statusCode === 200) {
      toast.success(response?.message);
      setIsLoading(false);
      navigate("/login");
    } else {
      toast.error(response?.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-screen">
      <div className="w-[50%] flex flex-col items-center justify-center bg-white">
        <img src={logo} alt="" className="w-[200px] h-[200px] object-cover" />
        <h3 className="text-2xl italic font-semibold">
          Welcome to{" "}
          <Link to="/" className="text-[#488a5c]">
            Healthy Food Store
          </Link>
        </h3>
      </div>
      <div className="w-[50%] bg-[#edf2f7] flex items-center justify-center">
        <div className="p-5">
          <h1 className="text-[#488a5c] text-center font-semibold text-3xl mb-[3px]">
            Đăng ký tài khoản
          </h1>
          <h3 className="mb-5 text-base text-center">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-[#5a90d3] font-semibold">
              Đăng nhập
            </Link>
          </h3>
          <div className="bg-white shadow-lg p-4 w-[450px] mx-auto rounded-lg">
            <Form name="basic" onFinish={onFinish} layout="vertical">
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="Please enter your username" />
              </Form.Item>
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
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Please enter your email" />
              </Form.Item>
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 3,
                    max: 10,
                    message: "Password length is from 3 to 6 characters",
                  },
                ]}
              >
                <Input.Password placeholder="Please enter your password" />
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
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Please enter your confirm password" />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{
                    backgroundColor: "#488a5c",
                    color: "white",
                    width: "100%",
                    height: "40px",
                  }}
                  className={`text-lg font-semibold ${
                    isLoading && "opacity-50"
                  }`}
                  htmlType="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loading kind="colorWhite" /> : "Đăng ký"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
