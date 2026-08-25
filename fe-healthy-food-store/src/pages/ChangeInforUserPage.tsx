import { Button, Form, FormProps, Input } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IUser } from "../types/typeUser";
import { editProfileUser, getUser } from "../services/user";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { updatedProfile } from "../redux/slices/profileSlice";

type FieldType = {
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
};

type typeUserData = {
  role: string;
  userData: IUser;
};

const ChangeInforUserPage = () => {
  const [form] = Form.useForm();
  const [imageUser, setImageUser] = useState("");
  const [imageUserDisplay, setImageUserDisplay] = useState("");
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const dispatch = useAppDispatch();
  const isUpdated = useAppSelector((state) => state?.updated?.isUpdated);
  const handleChangeImage = (event: any) => {
    setImageUserDisplay(URL.createObjectURL(event.target.files[0]));
    setImageUser(event.target.files[0]);
  };
  const fetchDataUser = async () => {
    if (userAuth?.userData?._id) {
      const response: any = await getUser(userAuth?.userData?._id);
      if (response?.statusCode === 200) {
        setUser(response?.userData);
      }
    }
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, phoneNumber, address } = values;
    const response: any = await editProfileUser(
      imageUser,
      username,
      phoneNumber,
      address
    );
    if (response?.statusCode === 200) {
      dispatch(updatedProfile(!isUpdated));
      toast.success("Edit profile successfully!!!");
    }
  };
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  useEffect(() => {
    fetchDataUser();
  }, [userAuth]);
  useEffect(() => {
    if (userAuth) {
      form.setFieldsValue({
        email: user?.email,
        username: user?.username,
        phoneNumber: user?.phoneNumber,
        address: user?.address,
      });
      if (user?.avatar) {
        setImageUserDisplay(user?.avatar);
      }
    }
  }, [userAuth, user]);
  return (
    <div className="px-5 py-3 bg-white rounded-md shadow-xl">
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <div className="mb-5">
          <input
            id="imageProfile"
            type="file"
            onChange={(event) => handleChangeImage(event)}
            style={{
              display: "none",
            }}
          />
          <div className="border border-black relative w-[150px] h-[150px] mt-2 rounded-full mx-auto">
            <div className="absolute bottom-0 shadow-sm right-3">
              <Button>
                <label
                  htmlFor="imageProfile"
                  className="block mx-auto cursor-pointer"
                >
                  <CameraOutlined />
                </label>
              </Button>
            </div>
            {imageUserDisplay ? (
              <img
                src={imageUserDisplay}
                alt=""
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <span className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap top-1/2 left-1/2">
                Preview Image
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="flex gap-x-3">
            <div className="w-1/2">
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input ingredient of email!",
                  },
                ]}
              >
                <Input
                  placeholder="Please enter ingredient of email"
                  className="w-full"
                  disabled
                />
              </Form.Item>
            </div>
            <div className="w-1/2">
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input ingredient of username!",
                  },
                ]}
              >
                <Input
                  placeholder="Please enter ingredient of phone number"
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-x-3">
            <div className="w-1/2">
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Số điện thoại"
                name="phoneNumber"
              >
                <Input
                  placeholder="Please enter ingredient of phone number"
                  className="w-full"
                />
              </Form.Item>
            </div>
            <div className="w-1/2">
              <Form.Item<FieldType>
                style={{
                  marginBottom: "5px",
                }}
                label="Address"
                name="address"
              >
                <Input
                  placeholder="Please enter ingredient of address"
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-3 w-max" onClick={() => form.submit()}>
          <Button type="primary">Lưu thông tin</Button>
        </div>
      </Form>
    </div>
  );
};

export default ChangeInforUserPage;
