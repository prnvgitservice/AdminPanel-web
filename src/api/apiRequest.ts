import axios from "axios";
import qs from "qs";
import endpoints from "./endpoints";
import { baseUrl } from "./baseUrl";

const apiRequest = (
  endpointKey,
  data = null,
  pathParams = null,  
  queryParams = null
) => {
  return new Promise((res, rej) => {
    const endpoint = endpoints[endpointKey];
    let url =
      typeof endpoint.url === "function"
        ? endpoint.url(pathParams)
        : endpoint.url;

    if (queryParams) {
      const queryString = qs.stringify(queryParams, { addQueryPrefix: true });
      url += queryString;
    }
    const jwt_token = localStorage.getItem("jwt_token");
    axios({
      method: endpoint.method,
      url: `${baseUrl}${url}`,
      data: data,
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    })
      .then((response) => {
        res(response?.data);
      })
      .catch((error) => {
        if (error.response?.status === 401 && jwt_token!=="demo-token") {
          localStorage.removeItem("jwt_token");
          localStorage.clear();
          window.location.href = "/login";
        }
        if (axios.isAxiosError(error)) {
          rej({
            status: error.response?.status,
            data: error.response?.data,
            message: error.response?.data?.message || error.message
          });
        } else {
          rej({
            message: error.message || "Something went wrong"
          });
        }
      });
  });
};

export default apiRequest;