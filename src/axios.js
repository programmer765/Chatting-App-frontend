import axios from "axios";

const instance = axios.create({
  baseURL: "https://kind-erin-mite-hem.cyclic.app",
});

export default instance;
