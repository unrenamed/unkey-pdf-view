import axios from "axios";

// Create an Axios instance
export const axiosInstance = axios.create();

// Interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      try {
        const errorMessage = await error.response.data;
        const blob = new Blob([errorMessage], { type: "application/json" });
        const jsonError = JSON.parse(await blob.text());
        return Promise.reject(
          new Error(jsonError.message || "An error occurred on API side")
        );
      } catch (jsonError) {
        return Promise.reject(new Error("Failed to retrieve error message"));
      }
    }
    return Promise.reject(new Error("No response received"));
  }
);
