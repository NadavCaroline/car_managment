import axios from  'axios';
import { DatesCheck } from '../../models/DatesCheck';
import OrderModel from '../../models/Order';
import { MY_SERVER,NotificationDaysExpiration } from '../../env';


// Gets the order of the user from the server.
export const getOrders = async (token: string) => {
  return axios.get(MY_SERVER + 'orders', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}

// Create a new order object.
export const addOrder = async (token: string, order: OrderModel) => {
  return axios.post(MY_SERVER + 'orders', order,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}

// Check the available rental dates for the cars.
export const checkOrderDates = async (token: string, dates: DatesCheck) => {
  return axios.post(MY_SERVER + 'CheckOrders', dates,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'NotificationDaysExpiration': String(NotificationDaysExpiration)
      }
    }).then((res) => res.data);
}


// Check the available rental dates for the cars.
export const checkOrderUpdateDates = async (token: string, dates: DatesCheck,id: number) => {
  return axios.post(MY_SERVER + 'CheckOrdersUpdate', dates,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'NotificationDaysExpiration': String(NotificationDaysExpiration),
        'orderID': id
      }
    }).then((res) => res.data);
}

// After the Driver ended the drive that was connected to the order.
export const orderEnded = async (token: string, id: number) => {
  return axios.patch(MY_SERVER + 'orders/' + id,
  {ended: true},
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}

// After the Driver ended the drive that was connected to the order.
export const updateOrder = async (token: string, id: number, order: OrderModel) => {
  return axios.put(MY_SERVER + 'orders/' + id,order,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}