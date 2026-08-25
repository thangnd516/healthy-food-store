import { Form, FormProps, Input, Modal, Select } from "antd";
import { postAddNewUser } from "../../../services/user";
import { toast } from "react-toastify";

interface IProps {
  isModalOpenAdd: boolean;
  setIsModalOpenAdd(isModalOpenAdd: boolean): void;
  fetchListUsers(): void;
}

type FieldType = {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  address: string;
};

const ModalAddNewUser = (props: IProps) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { isModalOpenAdd, setIsModalOpenAdd, fetchListUsers } = props;
  const handleCancel = () => {
    setIsModalOpenAdd(false);
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, password, username, phoneNumber, address, role } = values;
    const response: any = await postAddNewUser(
      email,
      password,
      username,
      phoneNumber,
      address,
      role
    );
    if (response.statusCode === 200) {
      toast.success(response.message);
      form.resetFields();
      setIsModalOpenAdd(false);
      await fetchListUsers();
    } else {
      toast.error(response.message);
    }
  };
  return (
    <>
      <Modal
        title="Thêm User"
        open={isModalOpenAdd}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        width={600}
        maskClosable={false}
      >
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <Form.Item<FieldType>
            style={{
              marginBottom: "5px",
            }}
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
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
          <Form.Item<FieldType>
            style={{
              marginBottom: "5px",
            }}
            label="Số điện thoại"
            name="phoneNumber"
          >
            <Input placeholder="Please enter your phone number" />
          </Form.Item>
          <Form.Item<FieldType>
            style={{
              marginBottom: "5px",
            }}
            label="Địa chỉ"
            name="address"
          >
            <Input placeholder="Please enter your address" />
          </Form.Item>
          <Form.Item<FieldType>
            style={{
              marginBottom: "5px",
            }}
            name="role"
            label="Role"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="1">Admin</Option>
              <Option value="2">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalAddNewUser;
