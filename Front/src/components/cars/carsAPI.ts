import axios from  'axios';

export const CARS_SERVER = "http://127.0.0.1:8000/"

// A mock function to mimic making an async request for data
export const getCars = async (token: string) => {
  return axios.get(CARS_SERVER + 'cars', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}


export const getAllCars = async (token: string) => {
  return axios.get(CARS_SERVER + 'allCars', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}