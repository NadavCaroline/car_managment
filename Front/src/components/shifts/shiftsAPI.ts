import axios from 'axios';
import { MY_SERVER } from '../../env';
import ShiftModel  from '../../models/Shift';

export const getShifts = async (token: string) => {
  return await axios.get(MY_SERVER+'shifts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
export const addShift = async (token: string, shift:ShiftModel) => {
  return axios.post(MY_SERVER + 'shifts', shift,
  {
    headers: {
      
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res);
    
}



