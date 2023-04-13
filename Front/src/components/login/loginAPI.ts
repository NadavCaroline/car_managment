import axios from 'axios';
import { Cred } from '../../models/Cred'
import { ProfileModel } from '../../models/Profile'
import { UserModel } from '../../models/User'
import { MY_SERVER } from '../../env'
import { AxiosError } from 'axios';

export const login = async (cred: Cred) => {
  // return await axios.post(MY_SERVER + 'login', cred).then((res) => res.data)
  try {
    const response = await axios.post(MY_SERVER + 'login', cred);
    return response;
     // console.log(response.data);
    // return response.data;
  } catch (error: any) {
    return error.response;
    // return error.response?.status;
    // console.error(`API request failed with status code: ${error.response?.status}`);
  }
}
export const register = async (user: UserModel, profile: ProfileModel) => {
  // try {
  //   const response = await axios.post(MY_SERVER + 'reg', { "user": user, "profile": profile });
  //   return response;
  // } catch (error: any) {
  //   return error.response;
  // }
  return await axios.post(MY_SERVER + 'reg',{"user":user,"profile":profile}).then((res) => res.data);
}
export const forgot = async (email:string) => {
  // try {
  //   const response = await axios.post(MY_SERVER + 'forgot', { "email": email }).then((res) => res.data);
  //   return response;

  // } catch (error: any) {
  //   return error.response;
  return await axios.post(MY_SERVER + 'forgot',{"email":email}).then((res) => res.data);
}
export const loginWithRefresh = async (refresh: string) => {
  return await axios.post(MY_SERVER + 'token/refresh/', { refresh: refresh }).then((res) => res.data)
}

export const getProfile = async (token: string) => {
  return await axios.get(MY_SERVER + 'profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}

export const getDepartments = async () => {
  return axios.get(MY_SERVER + 'departments',
  ).then((res) => res.data);
}
export const getRoles = async () => {
  return axios.get(MY_SERVER + 'rolesLevel',
  ).then((res) => res.data);
}
