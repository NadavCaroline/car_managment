import axios from  'axios';
import { MY_SERVER } from '../../env';
import CarModel from '../../models/Car';

// A mock function to mimic making an async request for data
export const getCars = async (token: string) => {
  return axios.get(MY_SERVER + 'cars', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}


export const getAllCars = async (token: string) => {
  return axios.get(MY_SERVER + 'allCars', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}

export const addCar = async (token: string, car: CarModel) => {
  return axios.post(MY_SERVER + 'allCars', car,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res);
}

export const updateCar = async (token: string, car: CarModel) => {
  return axios.patch(MY_SERVER + 'allCars/' + car.id, car,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res);
}