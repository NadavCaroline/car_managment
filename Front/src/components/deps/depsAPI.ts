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
  }).then((res) => res.data);
}
