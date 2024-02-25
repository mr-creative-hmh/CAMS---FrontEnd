export const API_AUTH = {
  LOGIN: "Auth/Login",
  REGISTER: "Auth/Register",
  RESET_USER: (ID) => `/user/${ID}/changepassword`,
  RESET_ADMIN: (ID) => `/user/${ID}/changepasswordadmin`,
  VERIFY: ""
};
