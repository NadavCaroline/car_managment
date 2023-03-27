import axios from 'axios';
import { Cred } from '../../models/Cred'
import { ProfileModel } from '../../models/Profile'
import { UserModel } from '../../models/User'
import { MY_SERVER } from '../../env'

// const SERVER ='http://127.0.0.1:8000/'
// const LOGIN_SERVER = 'http://127.0.0.1:8000/login'
// const REG_SERVER = 'http://127.0.0.1:8000/reg'
// const PROFILE_SERVER = 'http://127.0.0.1:8000/profile'

export const login = async (cred: Cred) => {
  try {
    const response = await axios.post(MY_SERVER + 'login', cred);
    return response.data;
  } catch (error) {
    return error;
  }
  // return await axios.post(MY_SERVER + 'login', cred).then((res) => res.data)
}


export const register = async (user: UserModel, profile: ProfileModel)  => {
  try {
    const response = await axios.post(MY_SERVER + 'reg',{"user":user,"profile":profile});
    return response;
  } catch (error) {
    return error;
  }
  // return await axios.post(MY_SERVER + 'reg',{"user":user,"profile":profile}).then((res) => res);
}
export const loginWithRefresh = async (refresh: string) => {
  return await axios.post(MY_SERVER+'token/refresh/', {refresh: refresh}).then((res) => res.data)
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
