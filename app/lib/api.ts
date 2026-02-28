import axios from "axios";

export const api = axios.create({
  baseURL: "https://forms-api.224668.xyz/v1",
  withCredentials: true,
});
