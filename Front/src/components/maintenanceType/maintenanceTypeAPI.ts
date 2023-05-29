import axios from 'axios';
import { MY_SERVER } from '../../env';
import { MaintenanceTypeModel } from '../../models/MaintenanceType';


export const getmaintenanceType = async (token: string) => {
  return await axios.get(MY_SERVER+'maintenancetype', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
export const addMaintenanceType = async (token: string, maintenanceType: MaintenanceTypeModel) => {
  return axios.post(MY_SERVER + 'maintenancetype', maintenanceType,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res);
}

export const updateMaintenanceType = async (token: string, maintenanceType: MaintenanceTypeModel) => {
  return axios.patch(MY_SERVER + 'maintenancetype/' + maintenanceType.id, maintenanceType,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res);
}

