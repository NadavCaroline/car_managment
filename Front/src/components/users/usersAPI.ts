import axios from 'axios';
import { MY_SERVER } from '../../env';
import { UserModel } from '../../models/User';

export const getUsers = async (token: string) => {
  return await axios.get(MY_SERVER + 'allusers', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
export const getUsersOfDep = async (token: string) => {
  return await axios.get(MY_SERVER + 'usersOfDep', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
export const getUsersOfDepByShifts = async (token: string) => {
  return await axios.get(MY_SERVER + 'usersOfDepByShifts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}

export const updateUser = async (token: string, user: UserModel) => {
  console.log(token)
  return await axios.patch((MY_SERVER + 'allusers/' + user.id),user, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}

