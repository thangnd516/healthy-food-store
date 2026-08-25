import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import logo from "../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postLogin } from "../services/auth";
import Loading from "../components/Loading/Loading";
import { useState } from "react";

type FieldType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsLoading(true);
    const response: any = await postLogin(values.email, values.password);
    if (response.statusCode === 200 && response?.userData?.role === "1") {
      toast.success("Login Successfully!!!");
      navigate("/dashboard");
      setIsLoading(false);
      localStorage.setItem("access_token", response.accessToken);
      localStorage.setItem("auth", JSON.stringify(response.userData));
    } else if (
      response.statusCode === 200 &&
      response?.userData?.role === "2"
    ) {
      toast.success("Login Successfully!!!");
      navigate("/");
      setIsLoading(false);
      localStorage.setItem("access_token", response.accessToken);
      localStorage.setItem("auth", JSON.stringify(response.userData));
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
            Đăng nhập
          </h1>
          <h3 className="mb-5 text-base text-center">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-[#5a90d3] font-semibold">
              Đăng ký
            </Link>
          </h3>
          <div className="bg-white shadow-lg p-4 w-[450px] mx-auto rounded-lg">
            <Form name="basic" onFinish={onFinish} layout="vertical">
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
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    min: 3,
                    max: 10,
                    message: "Password length is from 3 to 6 characters",
                  },
                ]}
              >
                <Input.Password placeholder="Please enter your password" />
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
                  {isLoading ? <Loading kind="colorWhite" /> : "Đăng nhập"}
                </Button>
              </Form.Item>
            </Form>
            <p
              className="-translate-y-3 font-semibold text-[#5a90d3] cursor-pointer w-max"
              onClick={() => navigate("/fillemail")}
            >
              Quên mật khẩu?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
