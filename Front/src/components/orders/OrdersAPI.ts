import axios from  'axios';
import { DatesCheck } from '../../models/DatesCheck';
import OrderModel from '../../models/Order';
export const MY_SERVER = "http://127.0.0.1:8000/"

// A mock function to mimic making an async request for data
export const getOrders = async (token: string) => {
  return axios.get(MY_SERVER + 'orders', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}


export const addOrder = async (token: string, order: OrderModel) => {
  return axios.post(MY_SERVER + 'orders', order,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}

export const checkOrderDates = async (token: string, dates: DatesCheck) => {
  return axios.post(MY_SERVER + 'CheckOrders', dates,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}
