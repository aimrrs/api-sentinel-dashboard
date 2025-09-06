import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// This interceptor automatically adds the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle user login
export const loginUser = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);
  
  const response = await api.post("/auth/token", params);
  return response.data;
};

// --- THIS IS THE NEW FUNCTION ---
// Function to handle user signup
export const signupUser = async (email: string, password: string) => {
  // The signup endpoint expects a simple JSON body
  const response = await api.post("/auth/signup", { email, password });
  return response.data;
};

// Function to get user projects
export const getUserProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const createProject = async (name: string) => {
  const response = await api.post("/projects", { name });
  return response.data;
};

export const deleteProject = async (projectId: number) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

export const deleteUser = async () => {
  const response = await api.delete("/users/me");
  return response.data;
};

export const getProjectStats = async (projectId: number) => {
  const response = await api.get(`/v1/projects/${projectId}/stats`);
  return response.data;
};

export default api;