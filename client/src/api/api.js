import axios from "axios";

const api = axios.create({
    baseURL: "https://ai-code-review-assistant-7xl9.onrender.com",
});

export default api;
