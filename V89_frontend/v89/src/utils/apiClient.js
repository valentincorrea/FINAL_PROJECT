import axios from "axios";

const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor (Already in place for adding the token) ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor (NEW: Handles 401 Unauthorized errors) ---
apiClient.interceptors.response.use(
  (response) => {
    // If the response is good, just pass it through
    return response;
  },
  (error) => {
    // 1. Check if the error response exists and has a 401 status code
    if (error.response && error.response.status === 401) {
      console.log("Session expired or token invalid. Redirecting to login.");

      // 2. Clear the expired/invalid token from local storage
      localStorage.removeItem("userToken");

      // 3. Force the user to the login page
      // window.location.href forces a full page reload, which is necessary
      // to ensure the React app re-initializes and the Navbar updates correctly.
      window.location.href = "/login";

      // 4. Reject the promise so the component's catch block doesn't try to process the error
      return Promise.reject(error);
    }

    // For all other errors (404, 500, network issues, etc.), pass them along
    return Promise.reject(error);
  }
);

export default apiClient;
