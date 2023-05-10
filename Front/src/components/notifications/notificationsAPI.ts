import axios from 'axios';
import { MY_SERVER } from '../../env';
import NotificationModel  from '../../models/Notification';

export const getNotification = async (token: string) => {
  return await axios.get(MY_SERVER+'notifications', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
export const addNotification = async (token: string, notification:NotificationModel) => {
  return axios.post(MY_SERVER + 'notifications', notification,
  {
    headers: {
      
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => {
    console.log(res.data);
    return res});
    
}
export const NotificationIsRead = async (token: string, id: number) => {

  return axios.put(MY_SERVER + 'notifications/' + id,
  {is_read: true},
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}

export const deleteNotification = async (token: string, id: number) => {
  return axios.delete(MY_SERVER + 'notifications/' + id,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => { 
      console.log(res.data);
      return  res.data}
   
    );
}