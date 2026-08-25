import instance from "../utils/axiosCutomize";

const postLogin = (email: string, password: string) => {
  return instance.post("api/user/login", {
    email,
    password,
  });
};

const postRegister = (email: string, password: string, username: string) => {
  return instance.post("api/user/register", {
    email,
    password,
    username,
  });
};

export { postLogin, postRegister };
