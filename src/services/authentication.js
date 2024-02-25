import { API_AUTH, API_GUEST } from "@/api";
import { HTTP } from "@/config";


export const Login = async (email, password) => {
    const result = await HTTP.post(API_AUTH.LOGIN, { email, password});
    const token = result.data.Data.token;
    const ID = result.data.Data.user.ID;
    const Name = result.data.Data.user.Name;
    const Email = result.data.Data.user.Email;
    const Phone = result.data.Data.user.Phone;
    const Mobile = result.data.Data.user.Mobile;
    const Address = result.data.Data.user.Address;
    const DateOfBirth = result.data.Data.user.DateOfBirth;
    const Gender = result.data.Data.user.Gender;
    const Role = result.data.Data.role.RoleName;
    localStorage.setItem("token", token);
    localStorage.setItem("ID", ID);
    localStorage.setItem("Name", Name);
    localStorage.setItem("Email", Email);
    localStorage.setItem("Phone", Phone);
    localStorage.setItem("Mobile", Mobile);
    localStorage.setItem("Address", Address);
    localStorage.setItem("DateOfBirth", DateOfBirth);
    localStorage.setItem("Gender", Gender);
    localStorage.setItem("Role", Role);
    return result;
}

export const RegisterPatient = async (name,email,password,phone,mobile,address,date_of_birth,gender, weight,height,additional_info) => {
  const result = await HTTP.post(API_GUEST.PATIENT_REGISTER, { name,email,password,phone,mobile,address,date_of_birth,gender, weight,height,additional_info });
  return result;
}

export const ChangePassword = async (id, currentpass, newpass) => {
  const result = await HTTP.post(API_AUTH.RESET_USER, (id, currentpass, newpass));
  return result;
}
