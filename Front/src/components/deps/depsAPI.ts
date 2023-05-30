import axios from 'axios';
import { DepModel } from '../../models/Deps';
import { MY_SERVER } from '../../env';


export const getDeps = async (token: string) => {
  return await axios.get(MY_SERVER + 'departments', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}

export const addDep = async (token: string, dep: DepModel) => {
  return await axios.post(MY_SERVER + 'departments', dep, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res);
}

export const updateDep = async (token: string, dep: DepModel) => {
  return axios.patch(MY_SERVER + 'departments/' + dep.id, dep,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res);
}
