import { toast } from "@/hooks/use-toast";
import axios from "axios";

const acessToken = "access_token";

const handleError = (error) => {
  const message =
    error.message || error.response?.data?.message || "An error occurred";

  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  });

  throw error;
};

const ApiService = {
  get: async (url, { params = {}, headers = {} } = {}) => {
    const storedToken = localStorage.getItem(acessToken);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          ...headers,
        },
        params, // Pass params directly to axiosP
      });
      return response;
    } catch (error) {
      console.error("Errrorrrrrr", error);
      return handleError(error);
    }
  },
  post: async (url, data, headers) => {
    const storedToken = localStorage.getItem(acessToken);

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          ...headers,
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },
  put: async (url, data, headers) => {
    const storedToken = localStorage.getItem(acessToken);

    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          ...headers,
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },
  delete: async (url) => {
    const storedToken = localStorage.getItem(acessToken);

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          // Adjust the headers based on your API requirements
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },
  // Add other HTTP methods as needed (delete, patch, etc.)
};

export default ApiService;
