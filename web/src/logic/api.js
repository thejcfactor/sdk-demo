import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  //baseURL: "http://localhost:8001",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  handleResponse(response) {
    if (response.status === 200) {
      return response.data;
    } else {
      const error = response.data || response.statusText;
      return Promise.reject(error);
    }
  },
  handleErrorResponse(error) {
    let response = error.response;
    console.log(response);
    if (response.status === 401) {
      console.log("unauthorized user.");
    }
    const errorOutput = response.data || response.statusText;
    return Promise.reject(errorOutput);
  },
  connectToBucket(url, payload) {
    return apiClient
      .post(url, payload)
      .then(this.handleResponse)
      .catch(this.handleErrorResponse);
  },
  runCommand(url, payload) {
    console.log("service - runCommand()");
    console.log("url: ", url);
    console.log("payload: ", payload);
    return apiClient
      .post(url, payload)
      .then(this.handleResponse)
      .catch(this.handleErrorResponse);
  }
};
