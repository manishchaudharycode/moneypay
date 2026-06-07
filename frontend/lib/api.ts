import axios from "axios";

type Request = {
  email: string;
  password: string;
  name?: string;
};

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const token =
  typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

const BACKEND_URI = process.env.BACKEND_URI || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: BACKEND_URI,
  headers: {
    Authorization: token,
  },
});

export const loginApi = async (payload: Request): Promise<LoginResponse> => {
  const response = await api.post("/user/signin", payload);
  return response.data;
};

export const signUpApi = async (payload: Request) => {
  const response = await api.post("/user/signup", payload);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
};
