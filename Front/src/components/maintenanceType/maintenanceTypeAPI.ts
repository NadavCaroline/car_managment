import axios from 'axios';
import { MY_SERVER } from '../../env';

export const getmaintenanceType = async (token: string) => {
  return await axios.get(MY_SERVER+'maintenancetype', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
