import { Form, FormProps, Input, Modal, Select } from "antd";
import { editUser } from "../../../services/user";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { IUser } from "../../../types/typeUser";

interface IProps {
  isModalOpenEdit: boolean;
  setIsModalOpenEdit(isModalOpenEdit: boolean): void;
  dataEditUser: IUser | null;
  fetchListUsers(): void;
}

type FieldType = {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role: string;
};

const ModalEditUser = (props: IProps) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { isModalOpenEdit, setIsModalOpenEdit, dataEditUser, fetchListUsers } =
    props;
  const handleCancel = () => {
    setIsModalOpenEdit(false);
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, password, username, phoneNumber, address, role } = values;
    if (dataEditUser) {
      const response: any = await editUser(
        dataEditUser?._id,
        email,
        password,
        username,
        phoneNumber,
        address,
        role
      );
      if (response.statusCode === 200) {
        toast.success("Edit user successfully!!!");
        setIsModalOpenEdit(false);
        await fetchListUsers();
      } else {
        toast.error("Edit user fail!!!");
      }
    }
  };
  useEffect(() => {
    if (dataEditUser) {
      form.setFieldsValue({
        username: dataEditUser.username,
        email: dataEditUser.email,
        role: dataEditUser.role,
        phoneNumber: dataEditUser.phoneNumber,
        address: dataEditUser.address,
      });
    }
  }, [dataEditUser]);
  return (
    <>
      <Modal
        title="Edit User"
        open={isModalOpenEdit}
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
            <Input placeholder="Please enter your email" disabled />
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
export default ModalEditUser;
