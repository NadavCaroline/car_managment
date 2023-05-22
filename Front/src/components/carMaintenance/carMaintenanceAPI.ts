import axios from  'axios';
import { MY_SERVER } from '../../env';
import CarMaintenanceModel from '../../models/CarMaintenance';

// A mock function to mimic making an async request for data
export const getCarMaintenanceByCar = async (token: string,carid:string) => {
  return axios.get(MY_SERVER + 'carmaintenance/' + carid,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}
// A mock function to mimic making an async request for data
export const getCarMaintenance = async (token: string) => {
  return axios.get(MY_SERVER + 'carmaintenance', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}

export const addCarMaintenance = async (token: string, carMaintenance: CarMaintenanceModel) => {
  return axios.post(MY_SERVER + 'carmaintenance', carMaintenance,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res);
}
export const updateCarMaintenance = async (token: string, carMaintenance: CarMaintenanceModel) => {
  return axios.patch(MY_SERVER + 'carmaintenance/' + carMaintenance.id, carMaintenance,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res);
}