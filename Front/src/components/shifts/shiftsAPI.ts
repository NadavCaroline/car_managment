import axios from 'axios';
import { MY_SERVER } from '../../env';

export const getShifts = async (token: string) => {
  return await axios.get(MY_SERVER+'shifts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}