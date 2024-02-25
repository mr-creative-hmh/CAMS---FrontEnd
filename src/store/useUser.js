//User Store
import { defineStore } from 'pinia'

export const useUser = defineStore('user', {
  state: () => ({
    ID : localStorage.getItem("ID"),
    Name: localStorage.getItem("Name"),
    Email: localStorage.getItem("Email"),
    Phone: localStorage.getItem("Phone"),
    Mobile: localStorage.getItem("Mobile"),
    Address: localStorage.getItem("Address"),
    DateOfBirth: localStorage.getItem("DateOfBirth"),
    Gender: localStorage.getItem("Gender"),
    Role: localStorage.getItem("Role")
  }),
  actions: {
    clearUserData() {
    localStorage.removeItem("ID");
    localStorage.removeItem("Name");
    localStorage.removeItem("Email");
    localStorage.removeItem("Phone");
    localStorage.removeItem("Mobile");
    localStorage.removeItem("Address");
    localStorage.removeItem("DateOfBirth");
    localStorage.removeItem("Gender");
    localStorage.removeItem("Role");
    }
  }
})
