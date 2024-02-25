// Authenticaion
import { defineStore } from 'pinia'

// Import the required store
import { useUser } from '@/store/useUser';

export const useAuth = defineStore('auth', {
  state: () => ({
    //
    isAuthenticated: !!localStorage.getItem("token"),
    email : "",
    password :"" ,
    message : null,
    showAlert : false,
    isError: false
  }),
  actions: {
    async logout() {
      // Check if the user is authenticated before logging out
      if (this.isAuthenticated) {
        // Clear authentication state and token
        localStorage.removeItem("token");
        this.isAuthenticated = false; // Update the state

        // Clear user data from the useUser store
        const userStore = useUser();
        userStore.clearUserData(); // Define a method to clear user data in useUser store

        // Show logout message
        this.isError = true;
        this.message = "User Logged Out!";
        this.showAlert = true;
      } else {
        // Handle the case when the user is not authenticated
        // You might want to handle this case differently based on your application's requirements
      }
    }
  }
})

