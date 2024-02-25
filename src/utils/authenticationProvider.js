export const authenticationProvider = () => {
  const token = localStorage.getItem("token");
  return !!token;
}
