import { User } from "../../types/index";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { load } from "../../lib/storage";
import { SERVER_URL } from "../../constants";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: SERVER_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const user = await load<User | null>("user", null);
          if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (error) {
          console.warn("Failed to load auth token:", error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        // Handle 401 Unauthorized responses
        if (error.response?.status === 401) {
          // Clear stored user data and redirect to login
          try {
            await load("user", null);
            // You might want to emit an event or use a navigation service here
            console.warn("Authentication failed, please login again");
          } catch (clearError) {
            console.log("Failed to clear user data:", clearError);
          }
        }

        // Handle network errors
        if (!error.response) {
          error.message = "Network error. Please check your connection.";
        }

        return Promise.reject(error);
      }
    );
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Upload files with FormData
  async upload<T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Get the axios instance directly if needed
  getClient(): AxiosInstance {
    return this.client;
  }

  // Update base URL if needed
  setBaseURL(url: string) {
    this.client.defaults.baseURL = url;
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export types for use in other files
export type { AxiosRequestConfig, AxiosResponse } from "axios";
