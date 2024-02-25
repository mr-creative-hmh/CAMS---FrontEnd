import axios from 'axios';

// get token from localstorage
const token = localStorage.getItem("token");

export const HTTP = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});
