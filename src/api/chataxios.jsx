import axios from "axios";

const chatapi = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

export default chatapi;
