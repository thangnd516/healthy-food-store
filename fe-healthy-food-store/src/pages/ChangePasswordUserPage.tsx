import { Button, Form, FormProps, Input } from "antd";
import { changePasswordUser } from "../services/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type FieldType = {
  oldPassword: string;
  newPassword: string;
  confirm: string;
};
const ChangePasswordUserPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { oldPassword, newPassword } = values;
    const response: any = await changePasswordUser(oldPassword, newPassword);
    if (response?.statusCode === 200) {
      toast.success("Đổi mật khẩu thành công");
      form.resetFields();
      navigate("/");
    }
  };
  return (
    <>
      <div className="w-[800px] bg-white shadow-xl rounded-md p-3">
        <h1 className="mb-3 text-2xl font-semibold text-center">
          Thay đổi mật khẩu
        </h1>
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <div className="flex gap-x-3">
            <Form.Item<FieldType>
              label="Mật khẩu cũ"
              name="oldPassword"
              rules={[
                { required: true, message: "Please input your old password!" },
                {
                  min: 3,
                  max: 10,
                  message: "Password length is from 3 to 6 characters",
                },
              ]}
              style={{
                width: "33.33%",
              }}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
                {
                  min: 3,
                  max: 10,
                  message: "Password length is from 3 to 6 characters",
                },
              ]}
              style={{
                width: "33.33%",
              }}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
              label="Xác nhận mật khẩu"
              name="confirm"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
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
              style={{
                width: "33.33%",
              }}
            >
              <Input.Password />
            </Form.Item>
          </div>
          <div className="mx-auto w-max">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChangePasswordUserPage;
