import axios from "axios";

const api = () => {
  // const history = useHistory();
  const defaultOptions = {
    baseURL: `http://localhost:3002`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Create instance
  let instance = axios.create(defaultOptions);

  //   Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    return config;
  });
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        window.location.href = "/error";
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

export default api();
