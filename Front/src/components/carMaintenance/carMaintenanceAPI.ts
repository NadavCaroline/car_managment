import axios from  'axios';
import { MY_SERVER } from '../../env';
import CarMaintenanceModel from '../../models/CarMaintenance';

// A mock function to mimic making an async request for data
export const getCarMaintenance = async (token: string,carid:string) => {
  return axios.get(MY_SERVER + 'carmaintenance/' + carid,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}

