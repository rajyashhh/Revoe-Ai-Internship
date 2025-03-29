import axios from "axios";

const API_URL = "http://localhost:5000/user"; // Change the port if needed

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await api.post(`/signup`, { name, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post(`/login`, { email, password });
  
  // Store the token if login was successful
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  
  return response.data;
};

// Add a logout function
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Function to check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};