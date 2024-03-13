import axios from 'axios';

// get token from localstorage
const token = localStorage.getItem("token");

export const HTTP = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});
